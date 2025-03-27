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
import { useAppStore } from '@Stores/app.js'
import session from '@Services/session.js'

const CheckAuthentication = (to, from, next) => {
  const user = useUserStore().user
  if (to.name == 'Login') {
    if (localStorage.getItem('token')) {
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

// const checkUser = (to, from, next) => {
//   const user = useUserStore().user
//   const roles = user.roles
//   if (to.name == 'EstablishmentList') {
//     if (roles.includes('ROLE_PARTNER') && (user.partner !== null || user.customer !== null)) {
//       next()
//     } else if (roles.includes('ROLE_CUSTOMER') && user.customer !== null) {
//       next()
//     } else {
//       next({ name: 'HomeViewForUserConnected' })
//     }
//   }
// }

const checkNavigation = (to, from, next) => {
  const user = useUserStore().user
  const roles = user.roles
  // let defaultRoute = { name: 'HomeViewForUserConnected' }
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
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  localStorage.removeItem('user_role')
  next()
}

const CheckAccess = (to, from, next) => {
  const userStore = useUserStore()
  if (localStorage.getItem('token') == null) {
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
          path: '/privacy-policy',
          name: 'PrivacyPolicyPage',
          component: () => import('@Views/PrivacyPolicyPageView.vue')
        },
        {
          path: '/404',
          name: 'NotFound',
          component: () => import('@Views/NotFoundPageView.vue')
        },
        {
          path: '/:catchAll(.*)',
          redirect: '/404'
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
        },
        {
          path: '/customer/:tag/establishment/:id/boost',
          name: 'BoostAdvantage',
          component: () => import('@Views/BoostAdvantagePageView.vue')
        },
        {
          path: '/public/:tag/screens/:screen',
          name: 'ScreenPage',
          component: () => import('@Views/ScreenPageView.vue')
        },
        {
          path: '/public/:tag/establishment/:id/external',
          name: 'externalUrl',
          component: () => import('@Views/ExternalUrlPageView.vue')
        },
        {
          path: '/payment/checkout',
          name: 'PaymentPage',
          component: () => import('@Views/PaymentPageView.vue')
        },
        {
          path: '/payment/process',
          name: 'paymentProcess',
          component: () => import('@Views/PaymentProcessPageView.vue')
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
          path: 'customer/:tag/categorization/:id/review',
          name: 'CategorizationReview',
          beforeEnter: [CheckAccess],
          component: () => import('@Views/CategorizationReviewPageView.vue')
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
          component: () => import('@Views/GlobalEventPageView.vue')
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
          path: '/customer/:tag/establishment/:id/reviews/:type?',
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
        },
        {
          path: '/customer/:tag/establishment/:id/files',
          name: 'Download',
          component: () => import('@/views/BlankView.vue') // Composant vide
          // beforeEnter: [download]
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
              path: '/public/customer/:tag/discount/auth/:discountTag',
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
              path: 'public/discount/code/validation/:discountTag',
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
            if (!to.params.rfuid) {
              const rfuid = generateRandomString(16)
              next({ name: 'UnitFeedBack', params: { ...to.params, rfuid } })
            } else {
              if (to.params.rfuid == 'preview') {
                const rfuid = generateRandomString(16)
                next({
                  name: 'UnitFeedBack',
                  params: { ...to.params, rfuid },
                  query: { preview: true }
                })
              } else {
                next()
              }
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
          path: '/public/customer/:tag/advantagecontact/:discountTag',
          name: 'QRCodeAdvContact',
          component: () => import('@Views/QRCodeAdvantagePageView.vue')
        },
        {
          path: '/public/:tag_establishment/:tag_contact/unsubscribe',
          name: 'UnsubscribePage',
          component: () => import('@Views/UnsubscribePageView.vue')
        }
      ]
    },
    {
      path: '/',
      name: 'profileLayout',
      component: ProfileLayout,
      redirect: '/',
      children: [
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
          path: '/home/erep',
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
              path: 'customer/:tag/establishment/categorization',
              name: 'Categorization',
              component: () => import('@Views/CategorizationPageView.vue')
            },
            {
              path: 'customer/:tag/establishment/search/reviews',
              name: 'CustomerSearchReview',
              component: () => import('@Views/SearchReviewsPageView.vue')
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
          path: '/home/leadgen',
          name: 'Leadgen',
          beforeEnter: [CheckAccess],
          component: () => import('@Views/HomeLeadgenPageView.vue'),
          children: [
            {
              path: 'customer/:tag/advantage',
              name: 'LeadgenAdvantage',
              component: () => import('@Views/LeadgenAdvantageView.vue')
            },
            {
              path: 'customer/:tag/partnership',
              name: 'LeadgenPartnership',
              component: () => import('@Views/LeadgenPartnershipView.vue')
            },
            {
              path: 'customer/:tag/discount-coupon',
              name: 'LeadgenDiscountCoupon',
              component: () => import('@Views/LeadgenDiscountCouponView.vue')
            },
            {
              path: 'customer/:tag/contact',
              name: 'LeadgenContact',
              component: () => import('@Views/LeadgenContactView.vue')
            },
            {
              path: 'customer/:tag/my-qrcode',
              name: 'LeadgenMyQrcode',
              component: () => import('@Views/LeadgenMyQrcodeView.vue')
            },
            {
              path: 'customer/:tag/my-screen',
              name: 'LeadgenMyScreen',
              component: () => import('@Views/LeadgenMyScreenView.vue')
            },
            {
              path: 'customer/:tag/establishment/analytic',
              name: 'Analytic',
              component: () => import('@Views/StatistiquePageView.vue')
            }
          ]
        },
        {
          path: '/customer/:tag/first-step',
          name: 'Step',
          beforeEnter: [CheckAccess],
          component: () => import('@Views/HomeStepPageView.vue')
        },
        {
          path: '/customer/:tag/step-view',
          name: 'StepView',
          beforeEnter: [CheckAccess],
          component: () => import('@Views/StepPageView.vue'),
          children: [
            {
              path: 'first-step',
              name: 'firstStep',
              component: () => import('@Components/step/MyEstablishmentFormPageView.vue')
            },
            {
              path: 'second-step',
              name: 'secondStep',
              component: () => import('@Components/step/MyPublicFormPageView.vue')
            },
            {
              path: 'third-step',
              name: 'thirdStep',
              component: () => import('@Components/step/PlatformReadyPageView.vue')
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
              path: 'personal_details',
              name: 'Personal_details',
              component: () => import('@Components/users/UserDetailComponent.vue')
            },
            {
              path: 'contact',
              name: 'Contact',
              component: () => import('@Components/advantage/AdvantageContactComponent.vue')
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
              path: 'screens/:sub_tab?',
              name: 'Screen',
              component: () => import('@Views/MyScreen.vue')
            },

            {
              path: 'parameters/:tab?/:sub_tab?',
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
  if (
    to.name != 'Login' &&
    to.name != 'Signup' &&
    to.name != 'externalUrl' &&
    !to.path.startsWith('/public') &&
    session.getItemWithTTL('verification_session') == null
  ) {
    console.log('session expired')
    useUserStore().signOut()
    useUserStore().authenticated = false
    useAppStore().isLoading = false
    // profileLayout
    if (useUserStore().authenticated === false) next({ name: 'Login' })
  } else {
    if (to.name != 'Login') {
      session.setItemWithTTL('verification_session', 1000 * 60 * 30, 1000 * 60 * 60 * 4)
      window.scrollTo(0, 0)
      if (to.matched.some((record) => record.meta.requiresAuth)) {
        const isAuthenticated = checkAuthentication()
        if (!isAuthenticated) {
          next({
            name: 'DiscountAuthentication',
            params: {
              tag: to.params.tag
            },
            query: { redirect: to.fullPath }
          })
          localStorage.setItem('isSellerAuthenticated', false)
        } else {
          next()
        }
      } else {
        next()
      }
    } else next()
  }
})

function checkAuthentication() {
  const isAuthenticated = localStorage.getItem('isSellerAuthenticated')
  return isAuthenticated === 'true'
}

export default router
