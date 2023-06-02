import { createRouter, createWebHistory} from 'vue-router'
import HomeView from '@Views/HomeView.vue'
import LoginView from '@Views/LoginView.vue'
import AdminView from '@Views/AdminView.vue'
import DashboardComponent from '@Components/Admin/DashboardComponent.vue'
import CompaniesComponent from '@Components/Admin/CompaniesComponent.vue'
import PartnersComponent from '@Components/Admin/PartnersComponent.vue'
import UsersComponent from '@Components/Admin/UsersComponent.vue'
import SettingsComponent from '@Components/Admin/SettingsComponent.vue'
import CompaniesView from '@Views/CompaniesView.vue'
import ComparisonView from '@Views/ComparisonView.vue'
import NotFoundView from '@Views/NotFoundView.vue'
import ProfileView from '@Views/ProfileView.vue'

const routes = [
  {
    path: '/home',
    name: 'Home',
    component: HomeView
  },
  {
    path: '/admin',
    name: 'Admin',
    component: AdminView,
    children: [
      {
        path: '',
        name: 'Admin_dashboard',
        component: DashboardComponent
      },
      {
        path: 'companies',
        name: 'Admin_companies',
        component: CompaniesComponent
      },
      {
        path: 'users',
        name: 'Admin_users',
        component: UsersComponent
      },
      {
        path: 'partners',
        name: 'Admin_partners',
        component: PartnersComponent
      },
      {
        path: 'settings',
        name: 'Admin_settings',
        component: SettingsComponent
      },
    ]
  },
  {
    path: '/',
    name: 'Login',
    component: LoginView 
  },
  {
    path:'/companies',
    name: 'Companies',
    component: CompaniesView,
  },
  {
    path:'/companies/:competitorId/:companyId/comparison',
    name: 'company',
    component: ComparisonView,
  },
  {
    path:'/:catchAll(.*)',
    name: 'NotFound',
    component: NotFoundView
  },
  {
    path: '/users/:id/profile',
    name: 'UserProfile',
    component: ProfileView
  }
]

const router = createRouter({
  // history: createWebHistory(import.meta.env.BASE_URL),
  history: createWebHistory(),
  routes
})

export default router
