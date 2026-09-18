#!/usr/bin/env node
/**
 * Verifies that every native library in a built APK can actually load.
 *
 * Trimming the APK means deleting .so files, and a library deleted by name
 * looks harmless right up until the linker needs it. libagora-ffmpeg.so reads
 * like a media-player dependency and is in fact a DT_NEEDED entry of
 * libagora-rtc-sdk.so: without it the core RTC library never loads, every
 * engine call quietly no-ops, and voice and video sit on "Connecting..."
 * forever with no error raised, because nothing native is running to raise
 * one. It built, installed and launched perfectly.
 *
 * Usage: node scripts/check-native-deps.mjs <path-to.apk>
 * Exits non-zero if any dependency is unresolved.
 */
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, readdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

/** Provided by Android itself, so absent from the APK by design. */
const SYSTEM = new Set([
  'libc.so', 'libdl.so', 'libm.so', 'liblog.so', 'libz.so', 'libandroid.so',
  'libEGL.so', 'libGLESv1_CM.so', 'libGLESv2.so', 'libGLESv3.so', 'libvulkan.so',
  'libOpenSLES.so', 'libOpenMAXAL.so', 'libaaudio.so', 'libmediandk.so',
  'libjnigraphics.so', 'libnativewindow.so', 'libcamera2ndk.so', 'libc++_shared.so',
]);

function dtNeeded(file) {
  const d = readFileSync(file);
  if (d.readUInt32BE(0) !== 0x7f454c46) return [];

  const phoff = Number(d.readBigUInt64LE(0x20));
  const phentsize = d.readUInt16LE(0x36);
  const phnum = d.readUInt16LE(0x38);

  let dynOff = null, dynSize = 0;
  const loads = [];
  for (let i = 0; i < phnum; i++) {
    const o = phoff + i * phentsize;
    const type = d.readUInt32LE(o);
    if (type === 2) {
      dynOff = Number(d.readBigUInt64LE(o + 0x08));
      dynSize = Number(d.readBigUInt64LE(o + 0x20));
    } else if (type === 1) {
      loads.push({
        off: Number(d.readBigUInt64LE(o + 0x08)),
        va: Number(d.readBigUInt64LE(o + 0x10)),
        size: Number(d.readBigUInt64LE(o + 0x20)),
      });
    }
  }
  if (dynOff === null) return [];

  const offsets = [];
  let strtabVa = null;
  for (let o = dynOff; o < dynOff + dynSize; o += 16) {
    const tag = Number(d.readBigUInt64LE(o));
    const val = Number(d.readBigUInt64LE(o + 8));
    if (tag === 0) break;
    if (tag === 1) offsets.push(val);
    if (tag === 5) strtabVa = val;
  }
  if (strtabVa === null) return [];

  const seg = loads.find((l) => strtabVa >= l.va && strtabVa < l.va + l.size);
  if (!seg) return [];
  const strtab = seg.off + (strtabVa - seg.va);

  return offsets.map((rel) => {
    const start = strtab + rel;
    return d.subarray(start, d.indexOf(0, start)).toString();
  });
}

const apk = process.argv[2];
if (!apk) {
  console.error('usage: node scripts/check-native-deps.mjs <path-to.apk>');
  process.exit(2);
}

const dir = mkdtempSync(join(tmpdir(), 'lx-apk-'));
execFileSync('unzip', ['-qo', apk, 'lib/*', '-d', dir]);

let failed = false;
for (const abi of readdirSync(join(dir, 'lib'))) {
  const abiDir = join(dir, 'lib', abi);
  const libs = readdirSync(abiDir).filter((f) => f.endsWith('.so'));
  const present = new Set(libs);

  for (const lib of libs.sort()) {
    for (const dep of dtNeeded(join(abiDir, lib))) {
      if (!present.has(dep) && !SYSTEM.has(dep)) {
        console.error(`${abi}: ${lib} needs ${dep}, which is not in the APK`);
        failed = true;
      }
    }
  }
  console.log(`${abi}: ${libs.length} libraries checked`);
}

if (failed) {
  console.error('\nA trimmed library is still required. Restore it in plugins/withAbiFilters.js.');
  process.exit(1);
}
console.log('every native dependency resolves');
