<template>
    <footer>
        <div class="container footer__container">
            <div class="footer__info">
                <ul>
                    <li><i class="uil uil-copyright"></i> eReputation, allright reserved</li>
                    <li>Legal Notice</li>
                    <li>Contact</li>
                    <li>Powered by Twenit</li>
                </ul>
            </div>
            <div class="footer__links">
                <ul>
                    <li><i class="uil uil-facebook-f"></i></li>
                    <li><i class="uil uil-linkedin-alt"></i></li>
                </ul>
            </div>        
        </div>
    </footer>
</template>

<script setup>

</script>

<style scoped>
@import "@Assets/css/base.css";

/*Footer*/

footer{
    position: relative;
    top: 100px;
    padding: 3rem;
    background-color: var(--color-bg2);
    color: var(--color-white);
    margin-top: 100px;
}

.footer__container{
    display: flex;
    justify-content: space-between;
    font-size: 0.9rem;
    gap: 4rem;
    align-items: center;
}

.footer__container ul{
    display: flex;
    justify-content: space-between;
}

.footer__info ul{
    gap: 1rem;
}

.footer__links ul{
   gap: 2rem;
}

.footer__links li{
   padding: 0.6rem 0.9rem;
   border: 1px solid var(--color-white);
   border-radius: 80%;
}

@media screen and (max-width:1200px) {
    .footer__container{
       width: 100% !important;
    }
}

@media screen and (max-width:1006px) {
    .footer__container{
        gap: 1rem;
    }
    .footer__info ul{
        gap: 0.5rem;
    }
    .footer__links ul{
        gap: 0.5rem;
    }
    .footer__links li{
        padding: 0.1rem 0.5rem;
    }
}

@media screen and (max-width:870px) {
    .footer__container{
        flex-direction: column;
        font-size: 0.75rem;
    }

    .footer__info ul{
        gap: 0.3rem;
    }
    .footer__links ul{
        gap: 0.3rem;
    }

    footer{
        margin-top: 150px !important;
    }
}

@media screen and (max-width:651px) {
   .footer__info ul{
    flex-direction: column;
    text-align: center;
   }
}

</style>