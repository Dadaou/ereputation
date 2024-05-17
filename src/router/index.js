import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@Views/LoginView.vue'
import SubscriptionPageView from '@Views/SubscriptionPageView.vue'
import ForgotPwdPageView from '@Views/ForgotPwdPageView.vue'
import ResetPwdPageView from '@Views/ResetPwdPageView.vue'
import ExpiredTokenPageView from '@Views/ExpiredTokenPageView.vue'
import DefaultLayout from '@Layouts/DefaultLayout.vue'
import EstablishmentLayout from '@Layouts/EstablishmentLayout.vue'
import ProfileLayout from '@Layouts/ProfileLayout.vue'
import PublicLayout from '../layouts/PublicLayout.vue'

import { useUserStore } from '@Stores/user.js'

const CheckAuthentication = (to, from, next) => {
  const user = useUserStore().user
  if (to.name == 'Login') {
    if (localStorage.getItem('access')) {
      const roles = user ? user.roles : []
      let defaultRoute = { name: 'HomeViewForUserConnected' }
      if (roles.includes('ROLE_PARTNER') && (user.partner !== null || user.customer !== null)) {
        next({ name: 'CustomersList' })
      } else if (roles.includes('ROLE_CUSTOMER') && user.customer !== null) {
        next({ name: 'EstablishmentList', params: { tag: user.customer.tag } })
      } else {
        next(defaultRoute)
      }
    } else next()
  }
}

const checkUser = (to, from, next) => {
  const user = useUserStore().user
  const roles = user.roles
  if (to.name == 'EstablishmentList') {
    if (roles.includes('ROLE_PARTNER') && (user.partner !== null || user.customer !== null)) {
      next()
    } else if (roles.includes('ROLE_CUSTOMER') && user.customer !== null) {
      next()
    } else {
      next({ name: 'HomeViewForUserConnected' })
    }
  }
}

const checkNavigation = (to, from, next) => {
  const user = useUserStore().user
  const roles = user.roles
  let defaultRoute = { name: 'HomeViewForUserConnected' }
  if (to.name == 'HomeViewForUserConnected') {
    if (roles.includes('ROLE_EREP')) {
      if (roles.includes('ROLE_PARTNER') && user.partner !== null) {
        next({ name: 'CustomersList' })
      } else if (roles.includes('ROLE_CUSTOMER') && user.customer !== null) {
        next({ name: 'EstablishmentList', params: { tag: user.customer.tag } })
      } else {
        next()
      }
    } else {
      next()
    }
  }
}

const removeAccess = (to, from, next) => {
  localStorage.removeItem('user_authenticated')
  localStorage.removeItem('access')
  localStorage.removeItem('user')
  localStorage.removeItem('user_role')
  next()
}

const CheckAccess = (to, from, next) => {
  const userStore = useUserStore()
  if (localStorage.getItem('access') == null) {
    next('/sign-in')
  } else {
    if (userStore.user == null) {
      next('/sign-in')
      userStore.signOut()
    } else next()
  }
}

const generateRandomString = (length) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length))
  }
  return result
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'default',
      component: DefaultLayout,
      redirect: { name: 'Login' },
      children: [
        {
          path: '/sign-up',
          name: 'Signup',
          component: SubscriptionPageView
        },
        {
          path: '/404',
          name: 'NotFound',
          component: () => import('@Views/NotFoundPageView.vue')
        },
        {
          path: '/:catchAll(.*)',
          redirect:'/404'
        },
        {
          path: '/customer/:tag/establishment/notFound',
          name: 'EstablishmentNotFound',
          component: () => import('@Views/EstablishmentNotFound.vue')
        },
        {
          path: '/contact',
          name: 'ContactForm',
          component: () => import('@Views/ContactFormPageView.vue')
        }
      ]
    },
    {
      path: '/',
      name: 'establishmentLayout',
      component: EstablishmentLayout,
      redirect: '/',
      children: [
        {
          path: '/customer/:tag/establishment/:id/analysis',
          name: 'Analysis',
          beforeEnter: [CheckAccess],
          component: () => import('@Views/AnalysisPageView.vue')
        },
        {
          path: '/customer/:tag/establishment/:id',
          name: 'Establishment',
          beforeEnter: [CheckAccess],
          component: () => import('@Views/EstablishmentPageView.vue')
        },
        {
          path: '/customer/:tag/establishment/:id/staffsranking',
          name: 'StaffRanking',
          component: () => import('@Views/StaffRankingPageView.vue')
        },
        {
          path: '/customer/:tag/establishment/:id/events',
          name: 'Event',
          beforeEnter: [CheckAccess],
          component: () => import('@Views/EventPageView.vue')
        },
        {
          path: '/customer/:tag/establishment/:id/social',
          name: 'Social',
          beforeEnter: [CheckAccess],
          component: () => import('@Views/SocialPageView.vue')
        },
        {
          path: '/customer/:tag/establishment/:id/weather',
          name: 'Weather',
          beforeEnter: [CheckAccess],
          component: () => import('@Views/WeatherPageView.vue')
        },
        {
          path: '/customer/:tag/establishment/:id/reviews',
          name: 'Review',
          beforeEnter: [CheckAccess],
          component: () => import('@Views/ReviewPageView.vue')
        },
        {
          path: '/customer/:tag/establishment/:id/sales',
          name: 'Sales',
          beforeEnter: [CheckAccess],
          component: () => import('@Views/SalesPageView.vue')
        },
        {
          path: '/customer/:tag/establishment/:id/trends',
          name: 'Trends',
          beforeEnter: [CheckAccess],
          component: () => import('@Views/TrendsView.vue')
        },
        {
          path: '/customer/:tag/establishment/:id/qr_code_document_preview',
          name: 'QRCodeDocumentPreview',
          beforeEnter: [CheckAccess],
          component: () => import('@Views/QRCodeDocumentPreview.vue')
        },
        {
          path: '/customer/:tag/establishment/:id/services',
          name: 'EstablishmentServices',
          beforeEnter: [CheckAccess],
          component: () => import('@Views/StaffPageView.vue'),
          children: [
            {
              path: '',
              name: 'Services',
              component: () => import('@Views/ServicesPageView.vue')
            },
            {
              path: 'staff/:staff_tag/reviews',
              name: 'StaffReview',
              component: () => import('@Views/StaffReviewsView.vue')
            },
            {
              path: 'units/:unit/reviews',
              name: 'UnitReview',
              component: () => import('@Components/units/UnitReviewComponent.vue')
            }
          ]
        }
      ]
    },
    {
      path: '/',
      name: 'publicLayout',
      component: PublicLayout,
      redirect: '/',
      children: [
        {
          path: '/',
          name: 'DiscountValidation',
          redirect: { name: 'DiscountAuthentication' },
          children: [
            {
              path: '/public/discount/auth',
              name: 'DiscountAuthentication',
              component: () => import('@Views/DiscountValidationAuthPageView.vue')
            },
            {
              path: '/public/discount/validation/:discountTag',
              name: 'DiscountQRCodeValidation',
              component: () => import('@Views/EnableAdvantagePageView.vue'),
              meta: {
                requiresAuth: true
              }
            },
            {
              path: 'public/discount/code/validation',
              name: 'DiscountCodeValidation',
              component: () => import('@Views/DiscountValidationCodePageView.vue')
            }
          ]
        },
        {
          path: '/public/:tag/establishment/:id/gates',
          name: 'Gate',
          component: () => import('@Views/GatePageView.vue')
        },
        {
          path: '/public/:tag/establishment/:id/feedback/',
          name: 'FeedBack',
          component: () => import('@Views/FeedbackPageView.vue')
        },

        {
          path: '/public/:tag/establishment/:etab/staffs/:id/feedback',
          name: 'StaffFeedBack',
          component: () => import('@Views/StaffFeedBackPageView.vue')
        },
        {
          path: '/public/:tag/establishment/:etab/units/:id/feedback/:rfuid?',
          name: 'UnitFeedBack',
          component: () => import('@Components/units/UnitFeedbackComponent.vue'),
          beforeEnter: (to, from, next) => {
            console.log('beforeEnter hook called')
            if (!to.params.rfuid) {
              const rfuid = generateRandomString(16)
              next({ name: 'UnitFeedBack', params: { ...to.params, rfuid } })
            } else {
              next()
            }
          }
        },
        {
          path: '/public/:tag/establishment/:etab/:share/feedback-success',
          name: 'SuccessFeedback',
          component: () => import('@Views/SuccessMessageFeedback.vue')
        },
        {
          path: '/public/:tag/establishment/:etab/advantagecontact/:discountTag/enable',
          name: 'EnableAdvContact',
          component: () => import('@Views/EnableAdvantagePageView.vue')
        },
        {
          //path: /public/advantagecontact/:discountTag',
          path: '/public/:discountTag/advantagecontact',
          name: 'QRCodeAdvContact',
          component: () => import('@Views/QRCodeAdvantagePageView.vue')
        },
        {
          //path: /public/advantagecontact/:discountTag',
          path: '/public/:discountTag/advantagecontact',
          name: 'QRCodeAdvContactExpired',
          component: () => import('@Views/QRCodeAdvantagePageViewExpired.vue')
        }
      ]
    },
    {
      path: '/',
      name: 'profileLayout',
      component: ProfileLayout,
      redirect: '/',
      children: [
        /*{
          //path: '/',
          //name: 'DiscountValidation',
          //redirect: { name: 'DiscountAuthentication' },
          //children: [
            {
             path: /public/discount/auth,
              name: DiscountAuthentication,
              component: () => import(@Views/DiscountValidationAuthPageView.vue)
            },
            {
              path: '/public/discount/validation/:discountTag',
              name: 'DiscountQRCodeValidation',
              component: () => import('@Views/EnableAdvantagePageView.vue'),
              meta: {
                requiresAuth: true
              }
            },
            {
              path: 'public/discount/code/validation',
              name: 'DiscountCodeValidation',
              component: () => import('@Views/DiscountValidationCodePageView.vue')
            }
          ]
        },*/
        {
          path: '/user-confirmation/password/reset',
          name: 'ForgotPwd',
          component: ForgotPwdPageView
        },
        {
          path: '/password/reset/:token',
          name: 'ResetPwd',
          component: ResetPwdPageView
        },
        {
          path: '/expired/email',
          name: 'LinkExpired',
          component: ExpiredTokenPageView
        },
        {
          path: '/sign-in',
          name: 'Login',
          component: LoginView,
          beforeEnter: [CheckAuthentication, removeAccess]
        },
        {
          path: '/partner/theme',
          name: 'Theme',
          component: () => import('@Views/AppsCustomisationView.vue')
        },
        {
          path: '/home',
          name: 'Home',
          beforeEnter: [CheckAccess],
          component: () => import('@Views/HomePageView.vue'),
          redirect: { name: 'HomeViewForUserConnected' },
          children: [
            {
              path: 'customer/:tag',
              name: 'EstablishmentList',
              component: () => import('@Views/EstablishmentsListView.vue')
            },
            {
              path: 'customer/:tag/establishment/rank',
              name: 'EstablishmentRanking',
              component: () => import('@Views/EstablishmentRankingView.vue')
            },
            {
              path: 'customer/:tag/establishment/trends',
              name: 'EstablishmentListByTrend',
              component: () => import('@Views/EstablishmentListByTrendView.vue')
            },
            {
              path: 'customers',
              name: 'CustomersList',
              component: () => import('@Views/CustomerListView.vue')
            },
            {
              path: 'user',
              name: 'HomeViewForUserConnected',
              beforeEnter: [checkNavigation],
              component: () => import('@Views/HomeViewForUserConnected.vue')
            }
          ]
        },
        {
          path: '/customer/:tag/account',
          name: 'UserProfile',
          component: () => import('@Views/ProfilePageView.vue'),
          beforeEnter: [CheckAccess],
          children: [
            {
              path: '',
              name: 'Personal_details',
              component: () => import('@Components/users/UserDetailComponent.vue')
            },
            {
              path: 'contact',
              name: 'Contact',
              component: () => import('@Components/users/ContactComponent.vue')
            },
            {
              path: 'subscriptions',
              name: 'Subscription',
              redirect: { name: 'Subscription_list' },
              children: [
                {
                  path: 'list',
                  name: 'Subscription_list',
                  component: () => import('@Views/SubscriptionsListPageView.vue')
                },
                {
                  path: 'new',
                  name: 'new_subscription',
                  component: () => import('@Views/NewSubscriptionPageView.vue')
                }
              ]
            },
            {
              path: 'discount_coupons',
              name: 'Discount_coupons',
              component: () => import('@Views/DiscountCouponsPageView.vue')
            },
            {
              path: 'my_qrcodes',
              name: 'QRCodes',
              component: () => import('@Views/MyQRCodesPageView.vue')
            },
            {
              path: 'parameters',
              name: 'Parameters',
              component: () => import('@Views/ParameterView.vue')
            },
            {
              path: 'advantage',
              name: 'Advantage',
              component: () => import('@Components/advantage/AdvantageView.vue')
            },
            {
              path: 'partnership',
              name: 'Partnership',
              component: () => import('@Components/partnership/PartnershipView.vue')
            }
          ]
        }
      ]
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    const isAuthenticated = checkAuthentication() // Votre logique d'authentification
    if (!isAuthenticated) {
      next({
        name: 'DiscountAuthentication',
        query: { redirect: to.fullPath }
      })
    } else {
      next()
    }
  } else {
    next()
  }
})

function checkAuthentication() {
  const isAuthenticated = localStorage.getItem('isSellerAuthenticated')
  return isAuthenticated === 'true'
}

export default router
