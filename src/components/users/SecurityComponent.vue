<template>
    <div class="user__main__container">
        <div class="security__header border__bottom">
            <div class="security__edit">
                <h4>Security</h4>
                <p>Adjust your security settings for your account.</p>
            </div>
        </div>
        <div class="personal__info border__bottom">
            <div class="info__title">
                Password
            </div>
            <div class="info__content">
                <div class="info__container">
                    <span v-if="!enableEdit.password">
                        Click the edit button if you want to change your password
                    </span>           
                    <div v-else class="info__edit">
                        <div class="grid gap-6 mb-6 md:grid-cols-2">
                            <div>
                                <label for="oldPassword" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Old Password <span>*</span></label>
                                <input type="password" name="oldPassword"  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm w-full p-2 custom-input" required>
                            </div>
                        </div>
                        <div class="grid gap-6 mb-6 md:grid-cols-2">
                            <div>
                                <label for="NewPassword" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">New Password <span>*</span></label>
                                <input type="password" name="newPassword" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm w-full p-2 custom-input" required>
                            </div>
                        </div>
                        
                    </div>
                <div class="edit__actions">
                    <span class="cancel" v-if="enableEdit.password" @click="enableEdit.password = false">
                        Cancel
                    </span>
                    <span class="edit" @click="enableEdit.password = true">
                        <i class="uil uil-edit"></i>
                        Edit
                    </span>
                </div>
                </div>
                
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';

let enableEdit = ref({
    password: false,
});
</script>

<style scoped>
.border__bottom {
    border-bottom: 1px solid rgb(223, 223, 223);
}

.security__header {
    display: flex;
    justify-content: space-between;
}

.security__header h4 {
    color: var(--color-bg2);
}

.security__header p {
    font-size: 15px;
    margin: 8px 0;
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
    min-width: 200px;
}.edit__actions {
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

.info__edit {
    width: 100%;
}

.info__edit input {
    width: 250px;
}

.info__edit .label {
    color: var(--color-black);
    font-weight: 600;
}

.form___input {
    margin: 5px;
}

.form__input {
    margin: 5px;
}

.info__content span,
p {
    font-size: 14px;
}

.info__content span {
    font-weight: 500;
}
@media screen and (max-width: 800px) {
  .user__main__container {
    width: 120%; /* Occuper toute la largeur sur les petits écrans */
  }
  .info__title {
    display: none; /* Masquer la classe .info__title en version mobile */
  }

  .info__edit {
    width: 100%;
    display: flex;
    flex-direction: column;
  }

  .info__edit .form__input {
    margin: 5px;
    width: 100%;
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

</style>