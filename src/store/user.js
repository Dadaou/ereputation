import { defineStore } from "pinia";
import services from '@Services/index.js';

export const useUserStore = defineStore("user", {
  state: () => ({
    user: null,
    users: [],
    roleSummary: null,
    authenticated: false,
    entity: 'users',
    nb: 0,
  }),

  actions: {
    async fetchAll(next){
      await services.getRecords(this.entity, (response)=>{
        if(response.status == 200){
          this.users = response.data['hydra:member']
          this.nb = this.users.length
          next(response)
        }
        // console.log(response.data['hydra:member'])
        // console.log(response)
      })
    },
    async fetchOne(id){
      await services.getRecord(this.entity, id, (response)=>{
        console.log(response)
      })
    },
    async create(user){
      await services.createRecord(this.entity, user, (response)=>{
        console.log(response)
      })
    },
    async update(id, user){
      await services.putRecord(this.entity, id, user, (response)=>{
        console.log(response)
      })
    },
    async remove(id){
      await services.deleteRecord(this.entity, id, (response)=>{
        console.log(response)
      })
    },
    async signIn(email, password, next) {
      await services.login(email, password, async (response)=>{
        console.log(response.data['token'])
        if(response.status == 200) {
          services.setToken(response.data['token'])  
          await services.getRecord(this.entity,response.data.user.id, (res)=>{
            console.log(res)
            if(res.status==200){
              this.user = res.data
              console.log(res.data)
              this.authenticated = true
              next({authenticated:this.authenticated, status: 200})
            } 
          })
        }else {
          this.authenticated = false
          if(response.status == 401){
            next({authenticated:this.authenticated, status: 401});
          } 
          else if(response.status == 500){
            next({authenticated:this.authenticated, status: 500});
          } 
        }
      })
    },
  }
});