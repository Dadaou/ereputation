<template>
    <div class="user__main__container" v-if="!showForm">
        <div class="user__table">
            <!-- <span class="tab__title">Utilisateurs</span> -->
            <!-- Custom research -->
            <div class="table__search">
                <i class="uil uil-search"></i>
                <input type="text" name="Search" placeholder="Recherche" v-model="searchValue">
                <i class="uil uil-times" v-show="searchValue" v-on:click="initSearch()"></i>
            </div>
            <div class="table__actions">
            <span :class="isAligned?'active':''" @click="isAligned=!isAligned"><i class="uil uil-apps"></i></span> 
            <span :class="!isAligned?'active':''" @click="isAligned=!isAligned"><i class="uil uil-align-justify"></i></span>
            <span class="add__user" @click="showForm=true"><i class="uil uil-user-plus"></i></span>
            </div>
            <!-- Refactoring needed -->
        </div>
        <div class="user__lists">
                <div v-for="(user, index) in visibleUsers" :key="index">
                    <div class="user__main">
                        <div class="user__main__info">
                            <div class="info user__main__avatar">
                                <div class="circle" :class="user.is_active?'active':''"></div>
                                <img :src="'/src/assets/images/Portrait_Placeholder.png'">
                            </div>
                            <div class="info user__main__info__name">{{user.firstname}} {{user.lastname}}</div>
                            <div class="info user__main__info__email">{{user.email}}</div>
                            <div class="info user__main__info__partner" v-if="user.partner">{{user.partner}}</div> <div class="user__main__info__partner">-</div>
                            <div class="info user__main__info__login" v-if="user.last_login">{{user.last_login}}</div>
                            <div class="user__main__info__partner">-</div>
                        </div>
                        <div class="main__actions">
                            <span class="action__edit"><i class="uil uil-edit"></i></span>
                            <span class="action__delete"><i class="uil uil-trash-alt"></i></span>
                        </div>
                    </div>
                </div>
                <PaginationComponent
                        @updatePage="updatePage"
                        :config="paginationConfig"
                        :color="color"
                />
        </div>
    </div>
    <div class="user__main__container" v-else>
        <form @submit.prevent="create">
            <div class="multiples__input">
                <div class="form__input">
                    <div class="form__label">Firstname</div>
                    <input type="text" name="Fistname" v-model="form.firstname" required>
                </div>
                <div class="form__input">
                    <div class="form__label">Lastname</div>
                    <input type="text" name="Lastname"  v-model="form.lastname" required>
                </div>
            </div>
            <div class="form__input">
                <div class="form__label">Email</div>
                <input type="email" name="Email"  v-model="form.email" required>
            </div>
            <div class="form__select">
                <div class="form__label">Role</div>
                <select  v-model="form.role" name="" id=""  required>
                    <option value="ROLE_ADMIN">ROLE ADMIN</option>
                    <option value="ROLE_USER">ROLE USER</option>
                    <option value="ROLE_API">ROLE API</option>
                </select>
            </div>
            <div class="form__input">
                <div class="form__label">Password</div>
                <input type="password" name="Password"  v-model="form.password" required>
            </div>
           <div class="form__actions">
                <button class="btn" @click="showForm=false" type="reset">Cancel</button>
                <button class="btn" type="submit">Save</button>
           </div>
        </form>
    </div>
</template>

<script setup>
import {ref, watch, onBeforeMount} from 'vue';
import PaginationComponent from '@Components/utils/PaginationComponent.vue';
import { useUserStore } from "@Stores/user.js";

/*About the table*/
const searchValue = ref('');
const color = ref('#6c63ff');
const isAligned = ref(true);
const userStore = useUserStore();
const form = ref({
    firstname: '',
    lastname: '',
    email: '',
    role: '',
    password: ''
});

watch(searchValue, () => {
    console.log(searchValue.value);
});

const initSearch = ()=>{
    searchValue.value = '';
}

let paginationConfig = ref({
    current:0,
    size:5,
    data: [],
    _data: [],
});

let visibleUsers = ref([]);

let updateVisibleUsers = function(_users){
    let data = paginationConfig.value;

    paginationConfig.value.data = _users.slice(data.current*data.size, (data.current * data.size) + data.size)
                

    if (paginationConfig.value.data.length == 0 && paginationConfig.value.current > 0) {
        updatePage( paginationConfig.value.current -1);
    }
    visibleUsers.value = paginationConfig.value.data;
}

let updatePage = function(pageNumber){
    paginationConfig.value.current = pageNumber;
    updateVisibleUsers(userStore.users);
}

let create = async()=>{
    console.log(form.value)
    let user = {
        "email": form.value.email,
        "roles": [],
        "firstname": form.value.firstname,
        "lastname": form.value.lastname,
        "password": form.value.password,
    }
    user.roles.push(form.value.role)
    await userStore.create(user);
}

onBeforeMount(() => {
    onBeforeMount(async ()=>{
        await userStore.fetchAll((response) => {
            updateVisibleUsers(userStore.users);
            console.log(userStore.users);
        })
    })  
});

/* About the form */
const showForm = ref(false);

</script>

<style>
.user__main__container{
    margin: 50px 100px 0px 0px;
}

.user__table{
    /* border-top: 2px solid var(--light-color-bg2);
    border-bottom: 2px solid var(--light-color-bg2); */
    width: inherit;
    padding: 15px;
    color: var(--color-bg2);
    font-size: 15px;
    box-shadow: 0 1rem 2rem rgba(0,0,0,0.15);
    display: flex;
    justify-content: space-between;
}

/* Custom Table */
.table__title{
   font-weight: bolder; 
}

.table__search input{
    border: 1px solid var(--light-color-bg2);
    padding: 5px 30px;
    border-radius: 5px;
}

.table__search .uil-search{
    position: relative;
    right: -25px;
}

.table__search .uil-times{
    position: relative;
    left: -25px;
    cursor: pointer;
}

.table__actions span{
    padding: 6px 8px;
    margin: 5px;
    border-radius: 3px;
    transition: var(--transition);
    cursor: pointer;
}

.table__actions span.active{
    background-color: var(--light-color-bg1);
    border: 1px solid var(--light-color-bg1);
}

.table__actions span.add__user{
    background-color: var(--color-primary);
    border: 1px solid var(--color-primary);
    color: var(--color-white);
}

.user__lists{
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin-top: 25px;
    font-size: 13px;
    font-weight: bolder;
    color: rgb(97, 97, 97);
}

.user__main{
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-shadow: 0 1rem 2rem rgba(0,0,0,0.08);
    margin-bottom: 10px;
    padding: 20px;
    background-color: white;
    border-radius: 8px;
    position: relative;
}

.user__main__avatar img{
    width: 28px;
    height: 25px;
    border-radius: 50%;
}

.circle{
    height: 10px;
    width: 10px;
    border-radius: 50%;
    background-color: var(--light-color-bg2);
    transition: var(--transition);
}

.user__main__avatar div{
    position: absolute;
    top: 35px;
    left: 37px;
}

.user__main__avatar .active{
    background-color: var(--color-success);
}

.user__main__info{
    flex-grow:1;
    flex-basis: 75%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    text-align:center;
    /* gap: 2rem; */
}

.user__main__info__name{
    /* background-color: rgb(255, 94, 0); */
    flex-grow: 1;
    max-width: 10rem;
}

.user__main__info__partner{
    /* background-color: rgb(0, 255, 128); */
    flex-grow: 1;
}

.user__main__info__email{
    /* background-color: rgb(212, 0, 255); */
    flex-grow: 1;
    max-width: 15rem;
}

.user__main__info__login{
    /* background-color: blue; */
    flex-grow: 1;
}

.main__actions span{
    padding: 6px 8px;
    margin: 5px;
    border-radius: 3px;
    transition: var(--transition);
    cursor: pointer;
    font-size: 15px;
    font-weight: bolder;
    background-color: var(--light-color-bg1);
    border: 1px solid var(--light-color-bg1);
}

.action__edit:hover{
    background-color: var(--color-primary);
    border: 1px solid var(--color-primary);
    color: var(--color-white);
}

.action__delete:hover{
    background-color: var(--color-danger3);
    border: 1px solid var(--color-danger3);
    color: var(--color-white);
}

/* Style of the Form */
.user__main__container form{
    /* background-color: var(--color-bg2); */
    padding: 15px;
    border-radius: 5px;
    box-shadow: 0 1rem 2rem rgba(0,0,0,0.15);
}

.user__main__container form input, .user__main__container form select{
    width: 100%;
}

.user__main__container .form__actions{
    width: 100%;
}

.user__main__container .form__input, .user__main__container .form__select{
    flex-direction: column;
    align-items: flex-start;
    gap: 0.2rem;
}

.user__main__container label{
    font-weight: bold;
    color: var(--color-bg2);
    font-size: 15px;
    width: 100%;
}

.user__main__container .label{
    font-weight: bold;
    color: var(--color-bg2);
    font-size: 15px;
    width: 100%;
}

.form__label{
   font-weight: 650;
   color: var(--color-bg2)
}
</style>