import { defineStore } from 'pinia'
import { ref } from 'vue'
import services from '@Services/services.js'
import { useAppStore } from '@Stores/app.js'

export const useUserStore = defineStore(
  'user',
  () => {
    const user = ref(null)
    const authenticated = ref(localStorage.getItem('user_authenticated'))
    const entity = ref('users')
    const customer = ref(null)
    const userId = ref(null)

    const signIn = async (email, password, next) => {
      const response = await services.login(email, password)

      if (response.status == 200) {
        
        const _user = response.data['user']
        const roles = _user ? _user.roles : []

        if (roles.includes('ROLE_EREP')) {
          
          authenticated.value = true

          if(_user?.is_active) {

            services.setUser()
            user.value = _user        
            userId.value = _user.id

            next({ authenticated: authenticated.value, userActive: true, status: 200 })
          }

          else {
            next({ authenticated: authenticated.value, userActive: false,  status: 200})
          }

      
        } else {
          next({ authenticated: authenticated.value, status: 403 })
        }
      
      } else if (response.status == 401) {
      
        next({ authenticated: authenticated.value, status: 401 })
      
      } else if (response.status == 500) {
      
        next({ authenticated: authenticated.value, status: 500 })
      
      }

    }

    const signOut = () => {
      const appStore = useAppStore()
      appStore.mustRefresh = true
      services.logout()
    }

    const verifyPassword = async (email, app_url, next) => {
      await services.post_Record(
        '/public/password/reset',
        { email: email,
          app_url: app_url 
        },
        (response) => {
          next(response)
        },
        true)
      
    }

    const resetPassword = async (password, confirmation, token, app_url, next) => {
      await services.post_Record(
        `/public/reinitialiser-mot-de-pass/${token}`,
        {
          password: password,
          confirmation: confirmation,
          app_url: app_url
        },
        (response) => {
          next(response)
        },
      true)
    }

    const getInitials = (firstName = '', lastName = '') => {
      const firstInitial = firstName.charAt(0).toUpperCase()
      const secondInitial = lastName.charAt(0).toUpperCase()
      return `${firstInitial}${secondInitial}`
    }

    const getInitialsV2 = (name = '') => {
      let full_name = name.split(' ')
      let firstInitial = full_name[0].charAt(0).toUpperCase()
      let secondInitial = ''
      if (full_name.length >= 2) {
        secondInitial = full_name[1].charAt(0).toUpperCase()
      }
      return `${firstInitial}${secondInitial}`
    }

    const updateCustomerTheme = async (next) => {
      if (customer.value) {
        await services.get_Record(`customer/theme?tag=${customer.value.tag}`, (response) => {
          if (response && response.status == 200) {
            customer.value.back_color = response.data.back_color
            customer.value.back_color = response.data.back_color
            customer.value.back_color = response.data.back_color
            next()
          }
        })
      } else {
        next()
      }
    }

    return {
      user,
      userId,
      customer,
      authenticated,
      entity,
      signIn,
      signOut,
      getInitials,
      getInitialsV2,
      verifyPassword,
      resetPassword,
      updateCustomerTheme
    }
  },
  {
    persist: true
  }
)
