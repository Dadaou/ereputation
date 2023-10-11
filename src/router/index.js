import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@Views/LoginView.vue'
import { useCompanyStore } from "@Stores/company.js"; 
import { useUserStore } from "@Stores/user.js";
import { useAppStore } from "@Stores/app.js";
import services from '@Services/services.js';

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
      path: '/establishment/:id',
      name: 'Establishment',
      beforeEnter: [CheckAccess],
      component: ()=>import('@Views/EstablishmentPageView.vue'),
    },
    {
      path: '/establishment/:id/reviews',
      name: 'Review',
      beforeEnter: [CheckAccess],
      component: ()=>import('@Views/ReviewPageView.vue'),
    },
    {
      path: '/establishment/:id/events',
      name: 'Event',
      beforeEnter: [CheckAccess],
      component: ()=>import('@Views/EventPageView.vue'),
    },
     {
      path: '/establishment/:id/socials',
      name: 'Social',
      beforeEnter: [CheckAccess],
      component: ()=>import('@Views/SocialPageView.vue'),
    },
     {
      path: '/establishment/:id/weathers',
      name: 'Weather',
      beforeEnter: [CheckAccess],
      component: ()=>import('@Views/WeatherPageView.vue'),
    },
     {
      path: '/establishment/:id/staffs',
      name: 'Staff',
      beforeEnter: [CheckAccess],
      component: ()=>import('@Views/StaffPageView.vue'),
    },
    {
      path:'/establishment/:id/feedback',
      name: 'FeedBack',
      component: ()=> import('@Views/FeedBackPageView.vue'),
    },
     {
      path:'/establishment/:etab/staffs/:id/feedback',
      name: 'StaffFeedBack',
      component: ()=> import('@Views/StaffFeedbackPageView.vue'),
    },
    {
      path: '/users/:id/profile',
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
  ]
})

export default router
