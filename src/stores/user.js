import { defineStore } from 'pinia'
import { ref } from 'vue'
import services from '@Services/services.js'

export const useUserStore = defineStore(
  'user',
  () => {
    const user = ref(null)
    // const users = ref([])
    const authenticated = ref(localStorage.getItem('user_authenticated'))
    const entity = ref('users')
    const customer = ref(null)

    // const fetchAll = async (next) => {
    //   await services.getRecords(this.entity, (response) => {
    //     if (response.status == 200) {
    //       users.value = response.data['hydra:member']
    //       next(response)
    //     }
    //   })
    // }

    const signIn = async (email, password, next) => {
      const response = await services.login(email, password)
      if (response.status == 200) {
        console.log(response.data['user'])
        const _user = response.data['user']
        const roles = _user?_user.roles:[];
        if (roles.includes("ROLE_EREP")) {
            authenticated.value = true
            services.setUser()
            user.value = _user
            next({ authenticated: authenticated.value, status: 200 })
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
      services.logout()
    }

    const verifyPassword = async (email, next) => {
      await services.post_Record('password/reset', { email: email }, (response) => {
        console.log(response)
        next(response)
      })
    }

    const resetPassword = async (password, confirmation, token, next) => {
      await services.post_Record(
        `/reinitialiser-mot-de-pass/${token}`,
        {
          password: password,
          confirmation: confirmation
        },
        (response) => {
          console.log(response)
          next(response)
        }
      )
    }

    const getInitials = (firstName, lastName) => {
      const firstInitial = firstName.charAt(0).toUpperCase()
      const secondInitial = lastName.charAt(0).toUpperCase()
      return `${firstInitial}${secondInitial}`
    }

    const getInitialsV2 = (name) => {
      let full_name = name.split(' ')
      let firstInitial = full_name[0].charAt(0).toUpperCase()
      let secondInitial = ''
      if (full_name.length >= 2) {
        secondInitial = full_name[1].charAt(0).toUpperCase()
      }
      return `${firstInitial}${secondInitial}`
    }

    return {
      user,
      customer,
      authenticated,
      entity,
      signIn,
      signOut,
      getInitials,
      getInitialsV2,
      verifyPassword,
      resetPassword
    }
  },
  {
    persist: true
  }
)
