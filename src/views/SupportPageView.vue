<template>
  <NavbarComponent></NavbarComponent>

    <div class="main__container">

        <div class="support__container" ref="form__ref">

            <div class="support__form">

                    <form @submit.prevent="submit" @keydown.enter.prevent="submit" class = "form">

                            <input type="text" name="subject" placeholder="Subject" v-model="subject" class="formInput" required>
                            <textarea class="formInput" style = "height: 250px;" placeholder="Support request" v-model="mailContent"></textarea>

                            <button type="submit" :class="['btn btn__light2', showSpinner == true ? 'isLoaded' : '']">
                                <SpinnerComponent v-if="showSpinner == true" :color="'red'" />
                                <span v-else>Send</span>
                            </button>

                    </form>
            </div>
        </div>
    </div>
</template>

<script setup>

import { ref, defineAsyncComponent} from 'vue'
import { ElMessage, ElButton, ElInput} from 'element-plus'
import services from '@Services/services.js'

const NavbarComponent = defineAsyncComponent(() =>
    import('@Components/layouts/NavbarComponent.vue')
)

const FooterComponent = defineAsyncComponent(() =>
    import('@Components/layouts/FooterComponent.vue')
)

const SpinnerComponent = defineAsyncComponent(() =>
  import('@Components/utils/SpinnerComponent.vue')
)


const mailContent = ref('')
const subject = ref('')
const showSpinner = ref(false)

const resetForm = () => {
    subject.value = ''
    mailContent.value = ''
}

const submit = async () => {

    const data = {
        to: "support@app.linkystar.com",
        subject: subject.value,
        support_request: mailContent.value,
    }

    const supportUrl = '/partner/send/support'

    showSpinner.value = true

    const response = await new Promise((resolve) => {

        services.post_Record(supportUrl, data, (response) => {
            resolve(response);
        })
    })

    if(response.status === 200) {
        ElMessage({
            type : 'success',
            message : "Your support request has been processed"
        })

        resetForm()
    }

    else {
        ElMessage.error('En error has been occured')
    }

    showSpinner.value = false

}

</script>


<style scoped>


input {
    caret-color: var(--color-primary) !important;
}

.formInput {
    width: 100%;
    border: 1px solid var(--light-color-bg2);
    border-radius: 5px;
    padding: 10px;
    font-size: 14px !important;
    font-weight: 500;
}

button.isLoaded {
    display: flex;
    justify-content: center;
    align-items: center;
}

.form {
    display: flex; 
    justify-content: center; 
    flex-direction: column; 
    gap: 15px;
}

.custom__container {
    position: relative;
    top: 0rem !important;
}
.title {
    font-weight: bold;
    font-size: 0.9em;
}

.support__container {
    height: inherit;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
}

form {
    margin: 0;
}

.support__form {
    height: 50%;
    width: 40%;
    min-width: 280px;
    margin-top: 60px;
    padding: 40px;
    display: flex;
    flex-direction: column;
    border-radius: 5px;
    gap: 1rem;
    box-shadow: 0 1rem 2rem rgba(0, 0, 0, 0.2);
}


.support__form button {
    height: 40px;
    cursor: pointer;
    transition: var(--transition);
    background-color: var(--color-danger) !important;
}

.register-link {
    font-size: .80rem !important;
    color: var(--color-primary) !important;
    font-weight: 700;
    text-decoration: underline !important;
}

/* For tablets */
@media screen and (max-width:1225px) {
    .support__container {
        width: 100%;
    }

    .support__form {
        width: 30%;
    }
}

@media screen and (max-width:1200px) {
    .support__form {
        width: 35%;
    }
}

@media screen and (max-width:900px) {
    .support__form {
        width: 40%;
    }

    .support__form span,
    .forgot__password {
        font-size: 15px;
    }
}

@media screen and (max-width:800px) {
    .support__form {
        width: 45%;
    }
}

@media screen and (max-width:700px) {
    .support__form {
        width: 50%;
    }
}

/* Media Queries (Phone) */
@media screen and (max-width:650px) {
    .support__form {
        width: 60%;
    }

    .support__form span {
        font-size: 14px;
    }
}

@media screen and (max-width:500px) {
    .support__form {
        width: 70%;
    }

    .support__form span {
        font-size: 13px;
    }
}

@media screen and (max-width:450px) {
    .support__form {
        width: 75%;
    }
}

@media screen and (max-width:400px) {
    .support__form {
        width: 80%;
    }
}

@media screen and (max-width:350px) {
    .support__form {
        width: 90%;
    }
}
</style>

