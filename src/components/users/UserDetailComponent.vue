<template>
    <div class="user__main__container">
        <el-tabs v-model="activeName" type="card" class="demo-tabs">
            <el-tab-pane label="Personal details" name="user">
                <div class="flex flex-row justify-between">

                    <ModalComponent :showModal="showModal" @close="showModal = false" :width="modalWidth">
                        <template #content>
                            <div class="modal__header mb-5">
                                <div class="modal__title">
                                    <h3 class="font-semibold text-gray-900 dark:text-white">
                                        <i class="uil uil-image-v"></i> Upload profile image
                                    </h3>
                                </div>
                                <div class="modal__close">
                                    <i class="uil uil-times-circle" @click="showModal = false"></i>
                                </div>
                            </div>
                            <EditProfileEdit />
                        </template>
                    </ModalComponent>
                    <div class="w-full mr-4">
                        <form v-if="editing" id="profilForm" @submit.prevent="submitUser"
                            @keydown.enter.prevent="submitUser" class="mt-4 px-2">
                            <div class="grid gap-6 mb-6 md:grid-cols-2">
                                <div>
                                    <label for="first_name"
                                        class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">First
                                        name
                                        <span>*</span></label>
                                    <input type="text" id="first_name" v-model="user.firstname"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm w-full p-2">
                                </div>
                                <div>
                                    <label for="last_name"
                                        class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Last
                                        name
                                        <span>*</span></label>
                                    <input type="text" id="last_name" v-model="user.lastname"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm w-full p-2">
                                </div>
                            </div>
                            <div class="grid gap-6 mb-6 md:grid-cols-2">
                                <div>
                                    <label for="email"
                                        class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email
                                        Address
                                        <span>*</span></label>
                                    <input type="email" id="email" v-model="user.email"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm w-full p-2"
                                        required>
                                </div>
                            </div>
                        </form>
                        <div v-if="!editing" class="personal__info border__bottom">
                            <div class="info__title">
                                Name
                            </div>
                            <div class="info__content">
                                <div class="info__container">
                                    <div class="info__edit">{{ userStore.user.firstname }} {{ userStore.user.lastname }}

                                    </div>
                                </div>
                            </div>
                        </div>
                        <div v-if="!editing" class="personal__info border__bottom">
                            <div class="info__title">
                                Email
                            </div>
                            <div class="info__content">
                                <div class="info__container">
                                    <div class="info__edit">
                                        <span>{{ userStore.user.email }}</span>
                                        <p></p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="edit__actions">
                            <a class="forgot__password" href="/user-confirmation/password/reset" target="_blank">
                                <i class="uil uil-key-skeleton"></i>
                                Change password
                            </a>
                            <span class="edit" v-if="editing == true" @click="updateUser">
                                <i class="uil uil-save"></i>
                                Save
                            </span>
                            <span class="cancel" v-if="editing" @click="editing = false">
                                Cancel
                            </span>
                            <span class="edit" v-else @click="editing = !editing">
                                <i class="uil uil-edit"></i>
                                Edit
                            </span>
                        </div>
                    </div>
                    <div class="profile__header">
                        <div class="profile__image" @click="showModal = true">
                            <div class="user__main__avatar">
                                <img src="/src/assets/images/Portrait_Placeholder.png">
                                <i class="uil uil-camera"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </el-tab-pane>
            <el-tab-pane label="Customer" name="customer">
                <ModalComponent :showModal="showModal" @close="showModal = false" :width="modalWidth">
                    <template #content>
                        <div class="modal__header mb-5">
                            <div class="modal__title">
                                <h3 class="font-semibold text-gray-900 dark:text-white">
                                    <i class="uil uil-image-v"></i> Upload profile image
                                </h3>
                            </div>
                            <div class="modal__close">
                                <i class="uil uil-times-circle" @click="showModal = false"></i>
                            </div>
                        </div>
                        <EditProfileEdit />
                    </template>
                </ModalComponent>

                <div class="grid gap-6 mb-6 grid-cols-1 w-full">
                    <div class="personal__info w-full">
                        <div class="info__title">
                            Back color
                        </div>
                        <div class="info__content">
                            <div class="info__container">
                                <div class="info__edit inline-flex w-full gap-6">
                                    <ColorViewer :value="colorData.back_color"
                                        @click="customerEditing = !customerEditing" style="width: 30%" />
                                    <ColorPicker v-if="customerEditing" :value="colorData.back_color"
                                        @sync="(color) => updateColorData(color, 'back_color')"
                                        style="width: 30%; margin-top:-2px;" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="personal__info">
                        <div class="info__title">
                            Font color
                        </div>
                        <div class="info__content">
                            <div class="info__container">
                                <div class="info__edit inline-flex w-full gap-6">
                                    <ColorViewer :value="colorData.font_color"
                                        @click="customerEditing = !customerEditing" style="width: 30%" />
                                    <ColorPicker v-if="customerEditing" :value="colorData.font_color"
                                        @sync="(color) => updateColorData(color, 'font_color')"
                                        style="width: 30%; margin-top:-2px;" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="personal__info">
                        <div class="info__title">
                            Title color
                        </div>
                        <div class="info__content">
                            <div class="info__container">
                                <div class="info__edit inline-flex w-full gap-6">
                                    <ColorViewer :value="colorData.title_color"
                                        @click="customerEditing = !customerEditing" style="width: 30%" />
                                    <ColorPicker v-if="customerEditing" :value="colorData.title_color"
                                        @sync="(color) => updateColorData(color, 'title_color')"
                                        style="width: 30%; margin-top:-2px;" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="edit__actions">
                    <button class="edit" v-if="customerEditing" @click="submitCustomer"><i
                            class="uil uil-save mr-1"></i>Apply</button>
                    <span class="cancel" v-if="customerEditing"
                        @click="() => { customerEditing = false; newColorData = {} }">
                        Cancel
                    </span>
                    <span class="edit" v-else @click="customerEditing = !customerEditing">
                        <i class="uil uil-edit"></i>
                        Edit
                    </span>
                </div>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script setup>
import { ref, onBeforeMount, defineAsyncComponent, computed } from 'vue';
import { useUserStore } from "@Stores/user.js";
import { useAppStore } from '@Stores/app.js';
import { ElDatePicker } from 'element-plus';
import 'element-plus/es/components/date-picker/style/css';
import services from '@Services/services.js';
import { ElMessage } from 'element-plus';
import { useWindowSize } from '@vueuse/core';
import { ElTabs, ElTabPane } from 'element-plus';
import 'element-plus/es/components/tabs/style/css';
import 'element-plus/es/components/tab-pane/style/css';
import { h } from 'vue'

const VueCountryCode = defineAsyncComponent(() =>
    import("@Components/utils/CountryCodeComponent.vue")
)

const EditProfileEdit = defineAsyncComponent(() =>
    import("@Components/users/EditProfilePictureComponent.vue")
)

const ModalComponent = defineAsyncComponent(() =>
    import('@Components/utils/ModalComponent.vue')
)

const ColorPicker = defineAsyncComponent(
    () => import("@Components/utils/ColorPickerComponent.vue")
);

const ColorViewer = defineAsyncComponent(
    () => import("@Components/utils/ColorViewComponent.vue")
);

const date = ref();
const flow = ref(['month', 'year', 'calendar']);
const activeName = ref('user');
const userStore = useUserStore();
const appStore = useAppStore();
const showModal = ref(false);
const { width, height } = useWindowSize();
const modalWidth = computed(() => {
    let windowSize = 1500;
    let gap = (windowSize - width.value) / 19;
    return gap + 45;
});

const colorData = ref({});
const newColorData = ref({});

let enableEdit = ref({
    name: false,
    email: false,
    phone: false,
    birth: false,
    address: false,
});


let editing = ref(false);
let customerEditing = ref(false);

let user = ref({
    firstname: '',
    lastname: '',
    email: '',
});

const updateColorData = (value, key) => {
    newColorData.value[key] = value;
}

const updateUser = () => {
    editing.value = true;
    if (user.value['firstname'] !== '' && user.value['lastname'] !== '' && user.value['email']) {
        services.patchRecord('users', userStore.user.id, user.value, (response) => {
            if (response.status == 200) {
                userStore.user['firstname'] = user.value['firstname'];
                userStore.user['lastname'] = user.value['lastname'];
                userStore.user['email'] = user.value['email'];
                editing.value = false;
            }
        })
    } else ElMessage.error(`Please, provide all needed information`);
}

const submitCustomer = async () => {
    const formData = {
        id: userStore.customer.id
    };
    if (newColorData.value) {
        if (newColorData.value.back_color)
            formData['backcolor'] = newColorData.value.back_color;
        if (newColorData.value.font_color)
            formData['fontcolor'] = newColorData.value.font_color;
        if (newColorData.value.title_color)
            formData['titlecolor'] = newColorData.value.title_color;
    }

    await saveTheme(formData);

};

const saveTheme = async (data) => {
    appStore.isLoading = true;

    services.post_Record('customer/update/colors', data, (response) => {

        if (response.status == 200) {
            appStore.isLoading = false;
            customerEditing.value = false;
            // newColorData.value = {};
            ElMessage({
                message: h('p', null, [
                    h('h4', { style: "color: var(--el-color-primary); font-weight: bold;" }, 'Information:'),
                    h('span', { style: "font-size: 13px;" }, "Your template has been successfully updated!"),
                ]),
            })
            userStore.customer.back_color = response.data.back_color;
            userStore.customer.font_color = response.data.font_color;
            userStore.customer.title_color = response.data.title_color;
            colorData.value = {
                'back_color': userStore.customer.back_color || appStore.account.back_color,
                'font_color': userStore.customer.font_color || appStore.account.font_color,
                'title_color': userStore.customer.title_color || appStore.account.title_color
            }

            appStore.setCssVariable('--color-bgp', (userStore.customer && userStore.customer.back_color) || appStore.account.back_color);
            appStore.setCssVariable('--color-danger', (userStore.customer && userStore.customer.title_color) || appStore.account.title_color);
            appStore.setCssVariable('--color-bg2', (userStore.customer && userStore.customer.font_color) || appStore.account.font_color);
            appStore.setCssVariable('--color-primary', (userStore.customer && userStore.customer.back_color) || appStore.account.back_color);
            appStore.setCssVariable('--light-color-bg2', `color-mix(in srgb, ${(userStore.customer && userStore.customer.back_color) || appStore.account.back_color} 70%, white)`);
            appStore.setCssVariable('--light-color-danger', `color-mix(in srgb, ${(userStore.customer && userStore.customer.title_color) || appStore.account.title_color} 25%, white)`);
            appStore.setCssVariable('--el-color-primary', (userStore.customer && userStore.customer.back_color) || appStore.account.back_color);

        } else {
            appStore.isLoading = false;
            ElMessage({
                message: h('p', null, [
                    h('h4', { style: "color: var(--el-color-warning); font-weight: bold;" }, 'Information:'),
                    h('span', { style: "font-size: 13px;" }, "An error has occured!"),
                ]),
            })
        }
    }, false);
};

onBeforeMount(() => {
    user.value.firstname = userStore.user.firstname;
    user.value.lastname = userStore.user.lastname;
    user.value.email = userStore.user.email;
    user.value.address = userStore.user.address;
    colorData.value = {
        'back_color': userStore.customer.back_color || appStore.account.back_color,
        'font_color': userStore.customer.font_color || appStore.account.font_color,
        'title_color': userStore.customer.title_color || appStore.account.title_color
    }
});

function toggleEdit() {
    editing.value = !editing.value;
    updateUser();
}
</script>

<style scoped>
.profile__edit h2 {
    font-weight: 600;
    font-size: 18px;
}

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


.profile__header h2 {
    color: var(--color-bg2);
}

.profile__header p {
    font-size: 14px;
    color: grey;
    font-weight: 500;
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

.info__title,
.info__edit span {
    width: 20%;
    font-weight: 500;
    color: grey;
    font-size: 14px;
}

input,
select {
    border-radius: 4px !important;
    background-color: white;
}

label {
    font-weight: 500 !important;
    font-size: 14px !important;
    color: var(--color-bg2) !important;
}

label span {
    color: red;
}

input {
    caret-color: var(--light-color-bg2);
}

.info__edit input {
    width: 100%;
}

.info__content {
    display: flex;
    flex-direction: column;
    /* Empiler les éléments verticalement */
    justify-content: flex-start;
    /* Aligner le contenu en haut de la colonne */

}

.edit__actions {
    display: flex;
    align-items: baseline;
    /* Aligner les éléments verticalement au centre */
    gap: 10px;
    /* Espacement entre les éléments */
    font-size: 14px;
    font-weight: 500;
    margin-top: 8px;
}

.edit__actions .edit {
    color: var(--color-primary);
    cursor: pointer;
    transition: var(--transition);
    padding: 2px 6px;
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

.forgot__password {
    background-color: var(--color-danger);
    color: white;
    padding: 2px 6px;
    border-radius: 5px;
}

.modal__header {
    display: flex;
    justify-content: space-between;
}

.modal__header div {
    align-self: center;
}

.modal__close i {
    float: right;
    font-size: 25px;
    color: red;
    cursor: pointer;
    transition: var(--transition);
}

.modal__close i:hover {
    transform: rotate(360deg);
}

@media screen and (max-width: 800px) {
    .user__main__container {
        width: 120%;
    }

    .personal__info {
        align-items: flex-start;
        /* Aligner les éléments en haut de la colonne */
    }
}
</style>
