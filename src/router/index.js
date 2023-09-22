import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '@Views/LoginView.vue';
import HomePageView from '@Views/HomePageView.vue';
import EstablishmentView from '@Views/EstablishmentView.vue';
import EstablishmentView2 from '@Views/EstablishmentView2.vue';
import NotFoundView from '@Views/NotFoundView.vue';
import ProfileView from '@Views/ProfileView.vue';
import SecurityComponent from '@Components/User/SecurityComponent.vue';
import ParametersView from '@Views/ParametersView.vue';
import UserDetailsComponent from '@Components/User/UserDetailsComponent.vue';
import ReviewPageView from '@Views/ReviewPageView.vue';
import feedbackPageView from '@Views/FeedbackPageView.vue';
import EstablishmentDashboard from '@Views/EstablishmentDashboard.vue';
import EstablishmentReviewPage from '@Views/EstablishmentReviewPage.vue';
import WeatherView from '@Views/WeatherView.vue';
import StaffView from '@Views/StaffView.vue';
import EventView from '@Views/EventView.vue';
import SocialPageView from '@Views/SocialPage.vue';
import { useCompanyStore } from "@Stores/company.js"; 
import { useUserStore } from "@Stores/user.js";
import { useAppStore } from "@Stores/index.js";


const removeAccess = (to, from, next) => {
  localStorage.removeItem("user_authenticated");
  localStorage.removeItem("access");
  localStorage.removeItem("user");
  localStorage.removeItem("user_role");
  next();
}

const getIds = (establishments) => {
  let ids = [];
  for (const value of establishments) {
    ids.push(value.id);
  }
  return ids;
}
function isEmptyObject(obj) {
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      return false; 
    }
  }
  return true;
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

const CheckAuthentication = (to, from, next) => {
    if(to.name == 'Login' && localStorage.getItem("access") == null){
      next()
    } else next('/home')
}

const fetchCompetitors = async (to, from, next) => { 
 next();
}

const fetchEstablishments = async (to, from, next) => {
  const companiesStore = useCompanyStore();
  const userStore = useUserStore();
  const appStore = useAppStore();
  appStore.isLoading = true;
  if(userStore.user.customer !== null){
    if(companiesStore.establishments.length==0){
      companiesStore.establishments = userStore.user.customer.establishments;
      companiesStore.nb = companiesStore.establishments.length;
    }
    setTimeout(() =>  appStore.isLoading = false, 500);
  }
  next();
}


const CheckCompany = async (to, from, next) => {
  const companyId = parseInt(to.params.id);
  const userStore = useUserStore();
  const establishmentIds = getIds(userStore.user.customer.establishments); 
  let isClient = establishmentIds.some(item => item === companyId);
  if(isClient){
    next();
  }else next('/home');
}

const routes = [
  {
    path: '/',
    name: 'Login',
    component: LoginView, 
    beforeEnter:[CheckAuthentication, removeAccess],
  },
  {
    path: '/home',
    name: 'Home',
    component: HomePageView,
    beforeEnter: [CheckAccess, fetchEstablishments],
  },
  {
    path:'/companies/:id',
    name: 'Company',
    component: EstablishmentView,
    beforeEnter: [CheckAccess, CheckCompany]
  },
  {
    path:'/companies/:id/staffs',
    name: 'Staff',
    component: StaffView,
    beforeEnter: [CheckAccess, CheckCompany],
  },
  {
    path:'/companies/:id/events',
    name: 'Event',
    component: EventView,
    beforeEnter: [CheckAccess, CheckCompany],
  },
  {
    path:'/companies/:id/weathers',
    name: 'Weather',
    component: WeatherView,
    beforeEnter: [CheckAccess, CheckCompany],
  },
  {
    path:'/companies/:id/social',
    name: 'Social',
    component: SocialPageView,
    beforeEnter: [CheckAccess, CheckCompany],
  },
  {
    path:'/companies-2/:id',
    name: 'Establishment',
    component: EstablishmentView2,
    beforeEnter: [CheckAccess, CheckCompany, fetchCompetitors],
    children:[
      {
        path: '',
        name: 'EstablishmentDashboard',
        component: EstablishmentDashboard,
      },
      {
        path: 'reviews',
        name: 'EstablishmentReviews',
        component: ReviewPageView,
      }
    ]
  },
  {
    path:'/companies/:id/reviews',
    name: 'reviews',
    component: EstablishmentReviewPage,
    beforeEnter: [CheckAccess],
  },
  {
    path:'/companies/:id/reviews-2',
    name: 'reviews-2',
    component: EstablishmentReviewPage,
    beforeEnter: [CheckAccess],
  },
  {
    path:'/companies/:id/:tag/feedback',
    name: 'feedback',
    component: feedbackPageView,
  },
  {
    path:'/:catchAll(.*)',
    name: 'NotFound',
    component: NotFoundView,
  },
  {
    path: '/users/:id/profile',
    name: 'UserProfile',
    component: ProfileView,
    beforeEnter: [CheckAccess, fetchEstablishments],
    children: [
      {
        path: '',
        name: 'Personal_details',
        component: UserDetailsComponent,
      },
      {
        path: 'security',
        name: 'Account_security',
        component: SecurityComponent,
      },
      {
        path: 'parameters',
        name: 'Parameters',
        component: ParametersView,
      },
    ]
  }
]

const router = createRouter({
  // history: createWebHistory(import.meta.env.BASE_URL),
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // always scroll to top
    return { top: 0 }
  },
})

export default router
