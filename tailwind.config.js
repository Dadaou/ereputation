/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/views/ReviewPageView.{vue,js,ts,jsx,tsx}",
    "./src/views/EstablishmentReviewPage.{vue,js,ts,jsx,tsx}",
    "./src/views/HomePageView.{vue,js,ts,jsx,tsx}",
    "./src/views/EstablishmentView.{vue,js,ts,jsx,tsx}",
    "./src/views/EstablishmentView2.{vue,js,ts,jsx,tsx}",
    "./src/views/EstablishmentDashboard.{vue,js,ts,jsx,tsx}",
    "./src/views/NotFoundView.vue",
    "./src/views/FeedbackPageView.vue",
    "./src/views/ParametersView.vue",
    "./src/views/StaffView.vue",
    "./src/views/EventView.vue",
    "./src/components/Staff/*.{vue,js,ts,jsx,tsx}",
    "./src/components/Event/*.{vue,js,ts,jsx,tsx}",
    "./src/components/utils/RatingFeedbackComponent.{vue,js,ts,jsx,tsx}",
    "./src/components/utils/FeelingFeedbackComponent.{vue,js,ts,jsx,tsx}",
    "./src/components/utils/DropdownComponent.vue.{vue,js,ts,jsx,tsx}",
    "./src/components/utils/BreadcrumbComponent.vue.{vue,js,ts,jsx,tsx}",
    "./src/components/utils/CommentComponent.vue.{vue,js,ts,jsx,tsx}",
    "./src/components/utils/ComparisonChartComponent.vue.{vue,js,ts,jsx,tsx}",
    "./src/components/utils/CommunityFeedbackComponent.vue.{vue,js,ts,jsx,tsx}",
    "./src/components/utils/SpinnerComponent.vue.{vue,js,ts,jsx,tsx}",
    "./src/components/utils/PaginationV2Component.vue.{vue,js,ts,jsx,tsx}",
    "./src/components/utils/RatingComponent.vue.{vue,js,ts,jsx,tsx}",
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

