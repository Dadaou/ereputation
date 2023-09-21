import { defineStore } from "pinia";
import { ref, watch, computed } from 'vue';
import services from '@Services/index.js';
import { useLocalStorage } from "@vueuse/core";
import { useCompanyStore } from "@Stores/company.js";
import localforage from 'localforage';

export const useUserStore = defineStore("user",()=> {
  const user = ref(useLocalStorage('user', {}));
  const users = ref([]);
  const authenticated = ref(localStorage.getItem('user_authenticated'));
  const entity = ref('users');
  const nb = computed(()=>{
    return users.value.length;
  })
  
  const fetchAll =  async(next)=>{
        await services.getRecords(this.entity, (response)=>{
          if (response.status == 200) {
            users.value = response.data['hydra:member'];
            next(response);
          }
        })
  }

  const signIn = async (email, password, next)=>{
          const response = await services.login(email, password); 
          console.log(response)
          if (response.status == 200) {
            services.setUser(response.data['user']);
            user.value = response.data['user'];
            authenticated.value = true;
            next({authenticated:authenticated.value, status: 200});
          } else if (response.status == 401) {
            next({authenticated:authenticated.value, status: 401});
          } else if (response.status == 500) {
            next({authenticated:authenticated.value, status: 500});
          }
    }

    const signOut = ()=>{
          services.logout();
    }

    const getInitials = (firstName, lastName) =>{
          const firstInitial = firstName.charAt(0).toUpperCase();
          const secondInitial = lastName.charAt(0).toUpperCase();
          return `${firstInitial}${secondInitial}`;
    }
    
    const getInitialsV2 = (name)=>{
          let full_name = name.split(' ');
          let firstInitial = full_name[0].charAt(0).toUpperCase();
          let secondInitial = '';
          if(full_name.length>=2){
            secondInitial = full_name[1].charAt(0).toUpperCase();
          }
          return `${firstInitial}${secondInitial}`;
    }

  return {
    user, users, authenticated, entity, nb, fetchAll, signIn, signOut, getInitials,
    getInitialsV2
  }
},{
  persist: true
});