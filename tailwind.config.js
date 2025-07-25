/** @type {import('tailwindcss').Config} */
export default {
  // This line tells Tailwind to look at all these files for class names.
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", 
  ],
  theme: {
    extend: {},
  },
  // I've also pre-emptively added a plugin we'll need later for styling your blog posts.
  plugins: [
    require('@tailwindcss/typography'),
  ],
}