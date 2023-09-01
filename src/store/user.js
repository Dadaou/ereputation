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
    async fetchOne(id){
      await services.getRecord(this.entity, id, (response)=>{
        console.log(response);
      })
    },
    async create(user){
      await services.createRecord(this.entity, user, (response)=>{
        console.log(response);
      })
    },
    async update(id, user){
      await services.putRecord(this.entity, id, user, (response)=>{
        console.log(response);
      })
    },
    async remove(id){
      await services.deleteRecord(this.entity, id, (response)=>{
        console.log(response);
      })
    },
    async signIn(email, password, next) {
      await services.login_2nd(email, password, (response)=>{
        console.log(response);
        if (response.status == 200) {
              console.log(response.data['token']);
              services.setUser(response.data['user']);
              this.user = response.data['user'];
              this.authenticated = true;
              console.log(this.user);
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
    }
  }
});