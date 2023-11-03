<template>
    <div class="user__main__container">
        <div class="profile__header border__bottom">
            <div class="profile__edit">
                <h4>Personal details</h4>
                <p>Update your information and find out how it's used.</p>
            </div>
            <div class="profile__image">
                <div class="user__main__avatar">
                    <img src="/src/assets/images/Portrait_Placeholder.png">
                    <i class="uil uil-camera"></i>
                </div>
            </div>
        </div>
        <div class="personal__info border__bottom">
            <div v-if="!editing" class="info__title">
                Name
            </div>
            <div class="info__content">
                <div class="info__container">
                    <div class="info__edit">
                        <span v-if="!editing" >{{ userStore.user.firstname }} {{ userStore.user.lastname }}</span>
                        <div v-else>
                        <div class="grid gap-6 mb-6 md:grid-cols-2">
                            <div>
                                <label for="first_name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">First name <span>*</span></label>
                                <input type="text" id="first_name" v-model="user.firstname" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm w-full p-2">
                            </div>
                            <div>
                                <label for="last_name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Last name <span>*</span></label>
                                <input type="text" id="last_name" v-model="user.lastname" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm w-full p-2">
                            </div>
                        </div>
                        </div>
                    </div>        
                </div>
            </div>
        </div>
        <div class="personal__info">
            <div v-if="!editing" class="info__title">
                Email
            </div>
            <div class="info__content">
                <div class="info__container">
                    <div class="info__edit">
                        <span v-if="!editing">{{ userStore.user.email }}</span>
                        <p v-if="!editing"></p>
                        <div v-else>
                            <div class="grid gap-6 mb-6 md:grid-cols-2">
                                <div>
                                    <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email Address <span>*</span></label>
                                    <input type="email" id="email" v-model="user.email" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm w-full p-2" required>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="edit__actions">
                    <span class="cancel" v-if="editing" @click="editing = false">
                        Cancel
                    </span>
                     <span class="edit" v-if="editing == true" @click="updateUser">
                        <i class="uil uil-edit"></i>
                        Edit
                    </span>
                    <span class="edit" v-else @click="editing = !editing">
                        <i class="uil uil-edit"></i>
                        Edit
                    </span>
                </div>
    </div>
</template>

<script setup>
import { ref, onBeforeMount, defineAsyncComponent } from 'vue';
import { useUserStore } from "@Stores/user.js";
import { ElDatePicker } from 'element-plus';
import 'element-plus/es/components/date-picker/style/css';
import services from '@Services/services.js';
import { ElMessage } from 'element-plus';

const VueCountryCode = defineAsyncComponent(()=>
    import("@Components/utils/CountryCodeComponent.vue")
)
const date = ref();
const flow = ref(['month', 'year', 'calendar']);
const userStore = useUserStore();

let enableEdit = ref({
    name: false,
    email: false,
    phone: false,
    birth: false,
    address: false,
});


let editing = ref(false);

let user = ref({
    firstname: '',
    lastname: '',
    email: '',
});

const updateUser = ()=>{
    editing.value = true;
    if(user.value['firstname'] !== '' && user.value['lastname'] !== '' && user.value['email']){
        services.patchRecord('users', userStore.user.id, user.value, (response)=>{
            if(response.status == 200){
                userStore.user['firstname'] = user.value['firstname'];
                userStore.user['lastname'] = user.value['lastname'];
                userStore.user['email'] = user.value['email'];
                editing.value = false;
            }
        })
    }else ElMessage.error(`Please, provide all needed information`);
}

onBeforeMount(() => {
    user.value.firstname = userStore.user.firstname;
    user.value.lastname = userStore.user.lastname;
    user.value.email = userStore.user.email;
    user.value.address = userStore.user.address;
    console.log(userStore.user)
});

function toggleEdit() {
    editing.value = !editing.value;
    updateUser();
}
</script>

<style scoped>
.dp__theme_light {
    --dp-border-color-hover: var(--color-primary);
}

.border__bottom {
    border-bottom: 1px solid rgb(223, 223, 223);
}

.profile__header {
    display: flex;
    justify-content: space-between;
}


.profile__header h4 {
    color: var(--color-bg2);
}

.profile__header p {
    font-size: 15px;
}

.user__main__avatar {
    cursor: pointer;
}

.user__main__avatar img {
    width: 50px;
    height: 48px;
    border: 3px solid var(--color-primary);
    padding: 3px;
}

.user__main__avatar i {
    position: relative;
    left: 17px;
    top: -25px;
    color: var(--color-warning);
}

.personal__info {
    display: flex;
    gap: 2rem;
    align-items: center;
    padding-block: 15px;
    font-size: 15px;
    width: 100%;
    overflow: auto;
}
.info__content {
    display: flex;
    justify-content: space-between;
    width: 100%;
}

.info__title {
    width: 20%;
}

@media screen and (max-width: 800px) {
  .user__main__container {
    width: 120%;  }
    .personal__info {
        align-items: flex-start; /* Aligner les éléments en haut de la colonne */
    }
}
input, select{
    border-radius: 4px !important;
    background-color: white;
}

label {
    font-weight: 500 !important;
    font-size: 14px !important;
    color: var(--color-bg2) !important;
}

label span{
    color: red;
}
input{
    caret-color: var(--light-color-bg2);
}
.info__edit input {
    width: 100%;
}
.info__content {
    display: flex;
    flex-direction: column; /* Empiler les éléments verticalement */
    justify-content: flex-start; /* Aligner le contenu en haut de la colonne */
    
}
.edit__actions {
    display: flex;
    align-items: baseline; /* Aligner les éléments verticalement au centre */
    gap: 10px; /* Espacement entre les éléments */
}

.edit__actions .edit {
    color: var(--color-primary);
    cursor: pointer;
    transition: var(--transition);
    padding: 5px;
    border-radius: 5px;
}

.edit__actions .cancel {
    color: var(--color-primary);
    font-weight: 500;
    cursor: pointer;
}

.edit__actions .edit:hover {
    background-color: var(--color-primary);
    color: var(--color-white);
}

</style>
