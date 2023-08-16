import { createRouter, createWebHistory} from 'vue-router';
import LoginView from '@Views/LoginView.vue';
import CompaniesView from '@Views/CompaniesView.vue';
import CompanyView from '@Views/CompanyView.vue';
import NotFoundView from '@Views/NotFoundView.vue';
import ProfileView from '@Views/ProfileView.vue';
import SecurityComponent from '@Components/User/SecurityComponent.vue';
import UserDetailsComponent from '@Components/User/UserDetailsComponent.vue';
import ReviewPageView from '@Views/ReviewPageView.vue';
import { useCompanyStore } from "@Stores/company.js"; 
import { useCompetitorStore } from "@Stores/competitors.js";
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
    // const id = parseInt(value.substring(20));
    ids.push(value.id);
  }
  return ids;
}

const CheckAccess = (to, from, next) => {
  console.log(localStorage.getItem("access"))
  if(localStorage.getItem("access") == null) next('/');
  else next()
}

const CheckAuthentication = (to, from, next) => {
    if(to.name == 'Login' && localStorage.getItem("access") == null){
      next()
    } else next('/home')
}

const fetchCompetitors = async (to, from, next) => {
//  const companyId = to.params.id;
//  const companiesStore = useCompanyStore();
//  const competitorsStore = useCompetitorStore();
 const appStore = useAppStore();
 
//  await companiesStore.fetchOne(companyId, async (company) => {
//     appStore.isLoading = true;
//     const competitorTag = `competitor_tag=${company.competitor_tag}`;
//     await competitorsStore.getAllCompetitors(competitorTag, (competitors) => {
//       appStore.isLoading = false;
//     })
//  });
 appStore.isLoading = true;
 setTimeout(() => {
  appStore.isLoading = false
 }
 , 2000);
 next();
}

const fetchEstablishments = async (to, from, next) => {
  const companiesStore = useCompanyStore();
  const userStore = useUserStore();
  const appStore = useAppStore();
  // appStore.isLoading = true;
  if(userStore.user.customer !== null){
    companiesStore.establishments = userStore.user.customer.establishments;
    companiesStore.nb = companiesStore.establishments.length;
    // const establishmentIds = getIds(userStore.user.customer.establishments);  
    // appStore.isLoading = true;
   
    // await companiesStore.fetchByUser(establishmentIds, (response)=>{
    //   console.log(response)
    //   appStore.isLoading = false;
    // })
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
    component: CompaniesView,
    beforeEnter: [CheckAccess, fetchEstablishments],
  },
  {
    path:'/companies/:id',
    name: 'Company',
    component: CompanyView,
    beforeEnter: [CheckAccess, CheckCompany, fetchCompetitors],
    props: true,
  },
  {
    path:'/companies/:companyId/reviews',
    name: 'reviews',
    component: ReviewPageView,
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
    beforeEnter: [CheckAccess],
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
