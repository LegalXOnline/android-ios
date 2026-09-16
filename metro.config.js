// macOS writes an AppleDouble sidecar next to every file on a non-HFS+ volume:
// _layout.tsx gets a binary .__layout.tsx beside it. Expo Router reads those as
// routes and the bundle dies on the first byte, so they are blocked here rather
// than deleted over and over.
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver.blockList = [/(^|[/\\])\._[^/\\]*$/];

// react-native-agora is native-only: it imports codegenNativeComponent, which
// does not exist on web. The call screen already guards on Platform at runtime,
// but Metro resolves a require statically and fails the web bundle before any
// of that runs — so on web it resolves to an empty module instead.
const nativeOnlyOnWeb = ['react-native-agora'];

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (platform === 'web' && nativeOnlyOnWeb.some((m) => moduleName.startsWith(m))) {
    return { type: 'empty' };
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
