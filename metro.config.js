// macOS writes an AppleDouble sidecar next to every file on a non-HFS+ volume:
// _layout.tsx gets a binary .__layout.tsx beside it. Expo Router reads those as
// routes and the bundle dies on the first byte, so they are blocked here rather
// than deleted over and over.
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver.blockList = [/(^|[/\\])\._[^/\\]*$/];

module.exports = config;
