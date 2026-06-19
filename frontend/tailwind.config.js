/** @type {import('tailwindcss').Config} */
// WHY THIS FILE EXISTS:
// Tailwind scans the files listed in `content` to figure out which CSS
// classes you've actually used, so it only generates CSS for those
// (keeping the final CSS bundle small).

export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
};
