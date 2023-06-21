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
      const response = await services.login(email, password); 
        if (response.status == 200) {
          console.log(response.data['token']);

          await services.getRecord(this.entity,response.data.user.id, (res)=>{
            if (res.status == 200) {
              services.setUser(res.data);
              this.user = res.data;
              this.authenticated = true;
              if(this.user.roles.includes("ROLE_USER")){
                if (this.user.roles.includes("ROLE_ADMIN")) {
                    localStorage.setItem("user_role",  "Admin")
                    this.roleSummary="Admin"; 
                } else{
                    if (this.user.roles.includes("ROLE_API")){
                        localStorage.setItem("user_role",  "Client")
                        this.roleSummary="Client";
                    }
                }
            }
              next({authenticated:this.authenticated, status: 200});
            } 
          })
        } else if (response.status == 401) {
          next({authenticated:this.authenticated, status: 401});
        } else if (response.status == 500) {
          next({authenticated:this.authenticated, status: 500});
        }
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