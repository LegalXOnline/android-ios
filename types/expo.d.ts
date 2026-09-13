// expo-env.d.ts holds this same reference but is gitignored and only written
// when the dev server runs, so a clean checkout — CI — has no declarations for
// the .css imports in the Expo template files. Keeping a tracked copy makes the
// typecheck independent of anything generated.
/// <reference types="expo/types" />
