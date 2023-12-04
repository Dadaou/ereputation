import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@Views/LoginView.vue'
import { useUserStore } from "@Stores/user.js";

const CheckAuthentication = (to, from, next) => {
    if(to.name == 'Login' && localStorage.getItem("access") == null){
      next()
    } else next('/home')
}


const removeAccess = (to, from, next) => {
  localStorage.removeItem("user_authenticated");
  localStorage.removeItem("access");
  localStorage.removeItem("user");
  localStorage.removeItem("user_role");
  next();
}

const CheckAccess = (to, from, next) => {
  const userStore = useUserStore();
  if(localStorage.getItem("access") == null){
    next('/')
  }
  else {
    if(userStore.user == null){
       next('/');
       userStore.signOut();
    }else next();
  }
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Login',
      component: LoginView,
      beforeEnter: [CheckAuthentication, removeAccess],
    },
    {
      path: '/home/establishments',
      name: 'Home',
      beforeEnter: [CheckAccess],
      component: ()=>import('@Views/HomePageView.vue'),
    },
    {
      path: '/home',
      name: 'ErepHome',
      beforeEnter: [CheckAccess],
      component: ()=>import('@Views/HomePageView.vue'),
    },
    {
      path: '/customer/:tag/establishment/:id',
      name: 'Establishment',
      beforeEnter: [CheckAccess],
      component: ()=>import('@Views/EstablishmentPageView.vue'),
    },
    {
      path: '/customer/:tag/establishment/:id/staffsranking', 
      name: 'StaffRanking',  
      component: () => import('@Views/StaffRankingPageView.vue'), 
    },
    {
      path: '/customer/:tag/establishment/:id/reviews',
      name: 'Review',
      beforeEnter: [CheckAccess],
      component: ()=>import('@Views/ReviewPageView.vue'),
    },
    {
      path: '/customer/:tag/establishment/:id/events',
      name: 'Event',
      beforeEnter: [CheckAccess],
      component: ()=>import('@Views/EventPageView.vue'),
    },
     {
      path: '/customer/:tag/establishment/:id/socials',
      name: 'Social',
      beforeEnter: [CheckAccess],
      component: ()=>import('@Views/SocialPageView.vue'),
    },
     {
      path: '/customer/:tag/establishment/:id/weathers',
      name: 'Weather',
      beforeEnter: [CheckAccess],
      component: ()=>import('@Views/WeatherPageView.vue'),
    },
     {
      path: '/customer/:tag/establishment/:id/staffs',
      name: 'Staff',
      beforeEnter: [CheckAccess],
      component: ()=>import('@Views/StaffPageView.vue'),
       children: [
        {
          path: '',
          name: 'StaffComparison',
          component: ()=> import('@Views/StaffComparisonView.vue'),
        },
        {
          path: 'list/:staff_tag/reviews',
          name: 'StaffReview',
          component: ()=> import('@Views/StaffReviewsView.vue'),
        },
      ]
    },
    {
      path:'/customer/:tag/establishment/:id/feedback',
      name: 'FeedBack',
      component: ()=> import('@Views/FeedbackPageView.vue'),
    },
     {
      path:'/customer/:tag/establishment/:etab/staffs/:id/feedback',
      name: 'StaffFeedBack',
      component: ()=> import('@Views/StaffFeedBackPageView.vue'),
    },
    {
      path:'/customer/:tag/establishment/:etab/feedback-success',
      name: 'SuccessFeedback',
      component: ()=> import('@Views/SuccessMessageFeedback.vue'),
    },
    {
      path: '/customer/:tag/account',
      name: 'UserProfile',
      component: ()=> import('@Views/ProfilePageView.vue'),
      beforeEnter: [CheckAccess],
      children: [
        {
          path: '',
          name: 'Personal_details',
          component: ()=> import('@Components/users/UserDetailComponent.vue'),
        },
        {
          path: 'contact',
          name: 'Contact',
          component: ()=> import('@Components/users/ContactComponent.vue'),
        },
        {
          path: 'subscription',
          name: 'Subscription',
          component: ()=> import('@Views/SubscriptionView.vue'),
        },
        {
          path: 'security',
          name: 'Account_security',
          component: ()=> import('@Components/users/SecurityComponent.vue'),
        },
        {
          path: 'parameters',
          name: 'Parameters',
          component: ()=> import('@Views/ParameterView.vue'),
        },
      ]
    },
    {
      path:'/:catchAll(.*)',
      name: 'NotFound',
      component: ()=> import('@Views/NotFoundPageView.vue'),
    },
    {
      path:'/customer/:tag/establishment/notFound',
      name: 'EstablishmentNotFound',
      component: ()=> import('@Views/EstablishmentNotFound.vue'),
    },
  ]
})

export default router
