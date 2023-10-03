/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
   "./src/views/*.vue",
   "./src/components/utils/*.vue",
   "./node_modules/flowbite/**/*.js",
   "./node_modules/flowbite-vue/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {},
  },
  plugins: [
  require('flowbite/plugin')
  ],
}

