/** @type {import('prettier').Config} */
module.exports = {
  // Single quotes throughout — consistent with Expo starter
  singleQuote: true,
  // Trailing commas in all multi-line contexts (ES5+)
  trailingComma: 'all',
  // 100 char line width — comfortable for wide screens without extreme length
  printWidth: 100,
  // 2-space indentation — standard for RN/Expo projects
  tabWidth: 2,
  semi: true,
  // Bracket spacing: { foo } not {foo}
  bracketSpacing: true,
  // JSX: put > on its own line for multi-line JSX elements
  jsxSingleQuote: false,
  bracketSameLine: false,
};
