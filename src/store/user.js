import { defineStore } from "pinia";
import services from '@Services/index.js';

export const useUserStore = defineStore("user", {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user')),
    users: [],
    roleSummary: '',
    authenticated: localStorage.getItem('user_authenticated'),
    entity: 'users',
    nb: 0,
  }),
  actions: {
    async fetchAll(next){
      await services.getRecords(this.entity, (response)=>{
        if (response.status == 200) {
          this.users = response.data['hydra:member'];
          this.nb = this.users.length;
          next(response);
        }
      })
    },
    async signIn(email, password, next) {
      await services.login_2nd(email, password, (response)=>{
        if (response.status == 200) {
              services.setUser(response.data['user']);
              this.user = response.data['user'];
              this.authenticated = true;
              next({authenticated:this.authenticated, status: 200});
            } else if (response.status == 401) {
              next({authenticated:this.authenticated, status: 401});
            } else if (response.status == 500) {
              next({authenticated:this.authenticated, status: 500});
            }
      })
    },
    signOut(){
      services.logout();
    },
    getInitials(firstName, lastName) {
      const firstInitial = firstName.charAt(0).toUpperCase();
      const secondInitial = lastName.charAt(0).toUpperCase();
      return `${firstInitial}${secondInitial}`;
    },
    getInitialsV2(name){
      let full_name = name.split(' ');
      let firstInitial = full_name[0].charAt(0).toUpperCase();
      let secondInitial = '';
      if(full_name.length>=2){
        secondInitial = full_name[1].charAt(0).toUpperCase();
      }
      return `${firstInitial}${secondInitial}`;
    }
  }
});