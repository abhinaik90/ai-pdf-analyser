// postcss.config.js
// WHY THIS FILE EXISTS:
// Tailwind works as a PostCSS plugin. This file tells PostCSS to run
// Tailwind (to generate utility classes) and Autoprefixer (to add
// browser-specific CSS prefixes automatically) during the build.

export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
