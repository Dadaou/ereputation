import { createRouter, createWebHistory} from 'vue-router';
import LoginView from '@Views/LoginView.vue';
import CompaniesView from '@Views/CompaniesView.vue';
import CompanyView from '@Views/CompanyView.vue';
import ComparisonView from '@Views/ComparisonView.vue';
import NotFoundView from '@Views/NotFoundView.vue';
import ProfileView from '@Views/ProfileView.vue';
import SecurityComponent from '@Components/User/SecurityComponent.vue';
import UserDetailsComponent from '@Components/User/UserDetailsComponent.vue';
import { useCompanyStore } from "@Stores/company.js"; 
import { useCompetitorStore } from "@Stores/competitors.js";

const removeAccess = (to, from, next) => {
  localStorage.removeItem("user_authenticated");
  localStorage.removeItem("access");
  localStorage.removeItem("user");
  localStorage.removeItem("user_role");
  next();
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
 const companyId = to.params.id;
 const companiesStore = useCompanyStore();
 const competitorsStore = useCompetitorStore();
 await companiesStore.fetchOne(companyId, async (company) => {

    const competitors = company.competitors;
    await competitorsStore.getAllCompetitors(competitors, (response) => {
      console.log(response);
    })

 });

 next()
}

const fetchEstablishments = async (to, from, next) => {
  const companiesStore = useCompanyStore();
  await companiesStore.fetchAll((response)=>{
    console.log(response.data['hydra:member'])
    next();
  });
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
    beforeEnter: [CheckAccess, fetchCompetitors],
  },
  {
    path:'/companies/:competitorId/:companyId/comparison',
    name: 'company',
    component: ComparisonView,
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
  routes
})

// router.beforeEnter(async (to, from, next) => {
//   if(localStorage.getItem('access') == null && to.name !== 'Login'){
//     console.log(localStorage.getItem('access'))
//     next('/login')
//   }else next()

//   if(to.name == 'Login' && localStorage.getItem ('access') !== null){
//     console.log(to.name, from,  localStorage.getItem ('access') !== null)
//     console.log(localStorage.getItem('access'))
//     next('/home'); 
//   } 
// })

export default router
