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
            <div class="info__title">
                Name
            </div>
            <div class="info__content">
                <div class="info__container">
                    <span v-if="!enableEdit.name">{{ userStore.user.firstname }} {{ userStore.user.lastname }}</span>
                    <div v-else class="info__edit">
                            <div class="form__input">
                                <div class="label">Firstname (s)</div>
                                <input type="text" name="firstname" v-model="user.firstname">
                            </div>
                            <div class="form__input">
                                <div class="label">Lastname (s)</div>
                                <input type="text" name="lastname" v-model="user.lastname">
                            </div>
                    </div>
                </div>
                <div class="edit__actions">
                    <div class="edit__actions">
                        <span class="cancel" v-if="enableEdit.name" @click="enableEdit.name=false">
                            Cancel
                        </span>
                        <span class="edit" @click="enableEdit.name=true">
                            <i class="uil uil-edit"></i>
                            Edit
                        </span>
                    </div>
                </div>
            </div>
        </div>
        <div class="personal__info border__bottom">
            <div class="info__title">
                Email Address
            </div>
            <div class="info__content">
                <div class="info__container">
                    <div class="info__edit">
                        <span v-if="!enableEdit.email">{{ userStore.user.email }}</span>
                        <p v-if="!enableEdit.email">This is the email address you use to sign in. It’s also where we send you all confirmations.</p>
                            <div v-else class="form__input">
                                <div class="label">Email Address</div>
                                <input type="email" name="email" v-model="user.email" required>
                            </div>
                    </div>
                </div>
                <div class="edit__actions">
                    <div class="edit__actions">
                        <span class="cancel" v-if="enableEdit.email" @click="enableEdit.email=false">
                            Cancel
                        </span>
                        <span class="edit" @click="enableEdit.email=true">
                            <i class="uil uil-edit"></i>
                            Edit
                        </span>
                    </div>
                </div>
            </div>
        </div>
        <div class="personal__info border__bottom">
            <div class="info__title">
                Phone Number
            </div>
            <div class="info__content">
                <div class="info__container">
                    <div class="info__edit phone__number">
                        <span v-if="!enableEdit.phone">Add Your Phone Number</span>
                        <p v-if="!enableEdit.phone">Allows us to contact you directly.</p>
                            <div v-else class="form__input">
                                <div class="label">Phone number</div>
                                    <vue-country-code
                                    @onSelect="onSelect"
                                    :enabledPhoneNumbers="true"
                                    >
                                    </vue-country-code>
                            </div>
                    </div>
                </div>
                <div class="edit__actions">
                    <div class="edit__actions">
                    <span class="cancel" v-if="enableEdit.phone" @click="enableEdit.phone=false">
                        Cancel
                    </span>
                    <span class="edit" @click="enableEdit.phone=true">
                        <i class="uil uil-edit"></i>
                        Edit
                    </span>
                </div>
                </div>
            </div>
        </div>
        <div class="personal__info border__bottom">
            <div class="info__title">
                Date of Birth
            </div>
            <div class="info__content">
                <div class="info__container">
                    <div class="info__edit date__birth">
                        <span v-if="!enableEdit.birth">Date of birth</span>
                        <p v-if="!enableEdit.birth">Enter Your date of Birth</p>
                            <div v-else class="form___input">
                                <div class="label">Date of birth</div>
                                <VueDatePicker v-model="date" :flow="flow"  />
                            </div>
                    </div>
                </div>
                <div class="edit__actions">
                    <span class="cancel" v-if="enableEdit.birth" @click="enableEdit.birth=false">
                        Cancel
                    </span>
                    <span class="edit" @click="enableEdit.birth=true">
                        <i class="uil uil-edit"></i>
                        Edit
                    </span>
                </div>
            </div>
        </div>
        <div class="personal__info border__bottom">
            <div class="info__title">
                Address
            </div>
            <div class="info__content">
                <div class="info__container">
                    <div class="info__edit">
                        <span v-if="!enableEdit.address">Address</span>
                        <p v-if="!enableEdit.address">Add your address</p>
                            <div v-if="enableEdit.address" class="form__input">
                                <div class="label">Address</div>
                                <input type="text" name="address" placeholder="Your Street name and house/apartment number">
                            </div>
                            <div v-if="enableEdit.address" class="multiples__input">
                                <div class="form__input">
                                    <div class="label">Town/City</div>
                                    <input type="city" name="city"  required>
                                </div>
                                <div class="form__input">
                                    <div class="label">PostCode</div>
                                    <input name="zip" type="text" inputmode="numeric" pattern="^(?(^00000(|-0000))|(\d{5}(|-\d{4})))$" required>
                                </div>
                            </div>
                            <div v-if="enableEdit.address" class="form__input">
                                <div class="label">Country</div>
                                <vue-country-code
                                @onSelect="onSelect"
                                >
                                </vue-country-code>
                            </div>
                    </div>
                </div>
                <div class="edit__actions">
                    <span class="cancel" v-if="enableEdit.address" @click="enableEdit.address=false">
                        Cancel
                    </span>
                    <span class="edit" @click="enableEdit.address=true">
                        <i class="uil uil-edit"></i>
                        Edit
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import VueCountryCode from "@Components/utils/VueCountryCode.vue";
import { ref, onBeforeMount } from 'vue';
import { useUserStore } from "@Stores/user.js";

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

let user = ref({
    firstname: '',
    lastname: '',
    email: '',
    birth: '',
    address: '',
});

onBeforeMount(() => {
    user.value.firstname = userStore.user.firstname;
    user.value.lastname = userStore.user.lastname;
    user.value.email = userStore.user.email;
    user.value.address = userStore.user.address;
    console.log(userStore.user)
});
</script>

<style scoped>

.dp__theme_light{
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
.user__main__avatar img{
    width: 50px;
    height: 48px;
    border: 3px solid var(--color-primary);
    padding: 3px;
}

.user__main__avatar i{
    position: relative;
    left: 17px;
    top: -25px;
    color: var(--color-warning);
}

.personal__info{
    display: flex;
    gap: 2rem;
    align-items: center;
    padding: 15px;
    font-size: 15px;
}
.info__content{
    display: flex;
    justify-content: space-between;
    width: 100%;
}

.info__title{
    width: 20%;
}
.edit__actions{
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}
.edit__actions .edit{
    color: var(--color-primary);
    cursor: pointer;
    transition: var(--transition);
    padding: 5px;
    border-radius: 5px;
}

.edit__actions .cancel{
    color: var(--color-primary);
    font-weight: 500;
    cursor: pointer;
}

.edit__actions .edit:hover{
    background-color: var(--color-primary);
    color: var(--color-white);
}
.info__edit{
    width: 500px;
}
.info__edit input{
    width: 100%;
}

.info__edit .label{
    color: var(--color-black);
    font-weight: 600;
}

.form___input{
    margin: 5px;
}

.form__input{
    margin: 5px;
}

.info__content span, p{
    font-size: 14px;
}

.info__content span{
    font-weight: 500;
}
</style>