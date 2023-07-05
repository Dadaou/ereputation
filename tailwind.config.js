/** @type {import('tailwindcss').Config} */
export default {
  content: [
    // "./index.html",
    // "./src/**/*.{vue,js,ts,jsx,tsx}",
    "./src/views/ComparisonView.{vue,js,ts,jsx,tsx}",
    "./src/components/utils/BreadcrumbComponent.vue.{vue,js,ts,jsx,tsx}",
    "./src/components/utils/SpinnerComponent.vue.{vue,js,ts,jsx,tsx}",
    "./src/components/utils/RatingComponent.vue.{vue,js,ts,jsx,tsx}",
    "./src/views/CompanyView.{vue,js,ts,jsx,tsx}",
    "./src/components/utils/AlertComponent.{vue,js,ts,jsx,tsx}",
    "./src/components/utils/NavbarAvatarComponent.{vue,js,ts,jsx,tsx}",
    "./src/components/utils/NotificationComponent.{vue,js,ts,jsx,tsx}",
    "./node_modules/flowbite/**/*.js",
    "node_modules/flowbite-vue/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('flowbite/plugin')
  ],
}

