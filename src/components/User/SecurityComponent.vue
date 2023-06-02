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
                        <div class="form__input">
                                    <div class="label">Old Password</div>
                                    <input type="password" name="oldPassword" required>
                                </div>
                                <div class="form__input">
                                    <div class="label">New Password</div>
                                    <input type="password" name="newPassword" required>
                                </div>
                    </div>
                </div>
                <div class="edit__actions">
                    <span class="cancel" v-if="enableEdit.password" @click="enableEdit.password=false">
                            Cancel
                        </span>
                        <span class="edit" @click="enableEdit.password=true">
                            <i class="uil uil-edit"></i>
                            Edit
                        </span>
                </div>
            </div>
        </div>
        <!-- <form>
            <div class="multiples__input">
                <div class="form__input">
                    <div class="label">Old Password</div>
                    <input type="password" name="oldPassword" required>
                </div>
                <div class="form__input">
                    <div class="label">New Password</div>
                    <input type="password" name="newPassword" required>
                </div>
            </div>
           <div class="form__actions">
                <button class="btn" type="submit">Save</button>
           </div>
        </form> -->
    </div>
</template>

<script setup>
import { ref } from 'vue';

let enableEdit = ref({
    password: false,
})
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

.personal__info{
    display: flex;
    gap: 2rem;
    align-items: center;
    padding: 15px;
    font-size: 15px;
    /* justify-content: space-between; */
}

.info__content{
    display: flex;
    justify-content: space-between;
    width: 100%;
    /* flex-wrap: wrap; */
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