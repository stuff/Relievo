// Replaced by the consumer's bundler, so dev-only warnings are stripped from production apps.
// Not import.meta.env.DEV: Vite would inline it when building the library.
declare const process: { env: { NODE_ENV?: string } };
