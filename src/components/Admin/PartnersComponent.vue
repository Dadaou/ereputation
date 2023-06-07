<template>
   <div class="partner__main__container" v-if="!showForm">
        <TableComponent @add-event="showForm=true" :data="partners">
            <template #content="slotProps">
                <div v-for="(partner, index) in slotProps.data" :key="index">
                    <div class="data__main">
                        <div class="data__main__info">
                            <div class="main__info__model">{{partner.model}}</div>
                            <div class="main__info__address">{{partner.address}}</div>
                            <div class="main__info__address">{{partner.zip}}</div>
                            <div class="main__info__city">{{partner.city}}</div>
                            <div class="main__info__country">{{partner.country}}</div>
                        </div>
                        <div class="main__actions">
                            <span class="action__edit"><i class="uil uil-edit"></i></span>
                            <span class="action__delete"><i class="uil uil-trash-alt"></i></span>
                        </div>
                    </div>
                </div>
            </template>
        </TableComponent>
   </div>
   <div class="partner__main__container" v-else>
    <form class="partner__form">
            <div class="form__input">
                <label for="">Modele</label>
                <input type="text" name="Model" required>
            </div>
            <div class="multiples__input">
                <div class="form__input">
                    <label for="">Adrèsse</label>
                    <input type="text" name="address" required>
                </div>
                <div class="form__input">
                    <label for="">Deuxième Adrèsse</label>
                    <input type="text" name="address"  required>
                </div>
            </div>
            <div class="multiples__input">
                <div class="form__input">
                    <label for="">ZipCode</label>
                    <input name="zip" type="text" inputmode="numeric" pattern="^(?(^00000(|-0000))|(\d{5}(|-\d{4})))$" required>
                </div>
                <div class="form__input">
                    <label for="">Pays</label>
                    <vue-country-code
                    @onSelect="onSelect"
                    >
                    </vue-country-code>
                </div>
            </div>
            <div class="form__input">
                <label for="">Ville</label>
                <input type="city" name="city"  required>
            </div>
           <div class="form__actions">
                <button class="btn" @click="showForm=false" type="reset">Annuler</button>
                <button class="btn" type="submit">Enregistrer</button>
           </div>
        </form>
   </div>
</template>

<script setup>
import  {ref} from 'vue';
import TableComponent from "@Components/utils/TableComponent.vue";
import VueCountryCode from "@Components/utils/VueCountryCode.vue";

/* About the form */
const showForm = ref(false)
const onSelect = ({name, iso2, dialCode}) => {
       console.log(name, iso2, dialCode);
}
/* Tables */
const partners = ref([
    {
        model: 'Vincent', 
        address: '1234 Main St', 
        zip: '12345', 
        city: 'New York', 
        country: 'United States',
    },
    {
        model: 'Vincent', 
        address: '1234 Main St', 
        zip: '12345', 
        city: 'New York', 
        country: 'United States',
    },
    {
        model: 'Vincent', 
        address: '1234 Main St', 
        zip: '12345', 
        city: 'New York', 
        country: 'United States',
    },
])
</script>

<style scoped>
.partner__main__container{
    margin: 50px 100px 0px 0px;
}

/* Style of the Form */
.partner__main__container form{
    /* background-color: var(--color-bg2); */
    padding: 15px;
    border-radius: 5px;
    box-shadow: 0 1rem 2rem rgba(0,0,0,0.15);
}
.partner__form input, .vue-country-select{
    width: 100%;
}

.partner__form .form__actions{
    width: 100%;
}
.partner__main__container .form__actions{
    width: 100%;
}

.partner__main__container .form__input, .partner__main__container .form__select{
    flex-direction: column;
    align-items: flex-start;
    gap: 0.2rem;
}
.partner__main__container label{
    font-weight: bold;
    color: var(--color-bg2);
    font-size: 15px;
    width: 100%;
}
</style>