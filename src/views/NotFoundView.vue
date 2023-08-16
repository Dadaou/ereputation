<template> 
<div class="main__container">
    <div class="error_message__container">
        <div class="emoji__container">
            <i class="uil uil-frown"></i>
        </div>
        <div class="error__message">
            <div class="error__title"><span>404</span> - Page Not Found</div>
            <p>Sorry but the page you are looking for does not exist, has been removed, name changed or is temporarily unavailable.</p>
            <button class="btn" @click="$router.push('/home')">Back to Home page</button>
        </div>
    </div>    
</div>
</template>

<script setup>
</script>

<style scoped>
@tailwind base;
@tailwind components;
@tailwind utilities;

.error_message__container{
    margin-top: 5rem;
    min-height: 30rem;
    width: var(--container-width-lg);
    margin: 0 auto;
    padding: 100px;
    display: flex;
    gap:1rem;
    align-items: center;
}

.emoji__container i{
    font-size: 100px;
    color: var(--color-danger);
}

.error__title{
    font-weight: 600;
    font-size: 20px;
    color: var(--color-bg2);
}

.error__message p{
    line-height: 1.5;
    font-weight: 500;
    color: rgb(52, 52, 52);
    margin-bottom: 15px;
}

.error__message button{
    border: 1px solid var(--color-danger);
    transition: var(--transition);
    border-radius: 5px;
    font-size: 13px;
    font-weight: 500;
    padding: 2px 6px;
    color: var(--color-danger);
}

.error__message button:hover{
    background-color: var(--color-danger);
    color: white;
}

</style>