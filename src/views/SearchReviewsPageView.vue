<template>
    <div class="filters">
        <div class="row">
            <div class="select_info">
                  <el-select v-model="establishments" multiple size="large" class="space" placeholder="All Etablishments">
                    <el-option label="All Etablishments" :value="'all'" @click="handleEstablishmentDropdown('all')"
                        :disabled="establishments.length > 1 && !establishments.includes('all')" />
                    <el-option v-for="item in userStore.user.customer.establishments" :key="item.id" :label="item.name"
                        :value="item.id" @click="handleEstablishmentDropdown('other')" />
                  </el-select>
            </div>
   
            <div class="date_picker">
                <el-date-picker v-model="start_date" type="date" :size="'large'" />
            </div>
            <div class="date_picker">
                <el-date-picker v-model="end_date" type="date" :size="'large'" />
            </div>
            <div class="catfiltre">
                <el-input v-model="terms" size="large" />
            </div>
             <div class="catfiltre">
                <el-button @click="  loadReviews(route.params.tag,optionsReview.page,optionsReview.rowLimit,optionsReview.current, start_date, end_date,terms,establishments)" type="primary" class="search_button" :icon="Search">Search</el-button>
            </div>
        </div>
    </div>

    <!-- <span v-if=" 0 >= visibleData.length">Loading...</span> -->

    <div class="society__list mt-5" v-if="visibleData.length > 0">
        <suspense>

              <div class="reviews__content">
                        <div class="reviews__pagination">
                            <PaginationComponent :options="optionsReview" v-if="visibleData.length > 0" @next="(option) => {
                                loadReviews(companyId, option.page, option.limit, option.current, start_date, end_date, selectedWebsites, selectedStars, categoryFilters, language)
                            }" @prev="(option) => {
                                loadReviews(companyId, option.page, option.limit, option.current, start_date, end_date, selectedWebsites, selectedStars, categoryFilters, language)
                            }" />
                        </div>
                        <CommentComponent v-if="reviews_loader == false" :reviews="visibleData" :showEmoji="true"
                            @reloadData="(review) => reloadData(review)" :categories="categories" @update-feeling="updateFeeling" via='analysis' />
                        <div v-else role="status"
                            class="space-y-4 divide-y divide-gray-200 rounded shadow animate-pulse dark:divide-gray-700 md:p-6 mb-5"
                            v-for="index in 5" :key="index">
                            <div>
                                <div class="flex items-center justify-between mb-4">
                                    <div>
                                        <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
                                        <div class="w-24 h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-1"></div>
                                        <div class="w-24 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                                    </div>
                                    <div class="h-7 bg-gray-300 dark:bg-gray-700 w-7"></div>
                                </div>
                                <div>
                                    <div class="w-full h-5 bg-gray-200 rounded-2 dark:bg-gray-700 mb-1"></div>
                                    <div class="w-full h-5 bg-gray-200 rounded-2 dark:bg-gray-700 mb-1"></div>
                                    <div class="w-full h-5 bg-gray-200 rounded-2 dark:bg-gray-700"></div>
                                </div>
                            </div>
                            <span class="sr-only">Loading...</span>
                        </div>
                        <div class="no-comment" v-if="visibleData.length == 0">
                            No reviews meet to the current filters
                        </div>
                        <div class="reviews__pagination">
                            <PaginationComponent :options="optionsReview" v-if="visibleData.length > 0" @next="(option) => {
                                loadReviews(companyId, option.page, option.limit, option.current, start_date, end_date, selectedWebsites, selectedStars, categoryFilters, language)
                            }" @prev="(option) => {
                                loadReviews(companyId, option.page, option.limit, option.current, start_date, end_date, selectedWebsites, selectedStars, categoryFilters, language)
                            }" />
                        </div>
             </div>
          
        </suspense>
    </div>
</template>

<script setup>
import { ref, onMounted, defineAsyncComponent, inject, watch, provide } from 'vue';
import EstablishmentListLoadedComponent from '@Components/utils/EstablishmentListLoadedComponent.vue';
import { ElOption, ElSelect, ElDatePicker,ElInput,ElButton } from 'element-plus';
import 'element-plus/es/components/option/style/css'
import 'element-plus/es/components/select/style/css'
import 'element-plus/es/components/date-picker/style/css'
import services from '@Services/services.js';
import moment from 'moment';
import { useUserStore } from '@Stores/user.js';
import { useRoute } from "vue-router";
import { Search } from '@element-plus/icons-vue'
import CommentComponent from '@Components/utils/CommentComponent.vue';
import PaginationComponent from '@Components/utils/PaginationComponentV2.vue';

const route = useRoute();
const establishments = ref('all');
const terms = ref(null);
const dataLoading = ref(true);
const customerTag = route.params.tag;
const userStore = useUserStore();
const userId = userStore.user.id;

const review_category = ref('');



const categories = ref([]);

const categoryFilters = ref('all');
const start_date = inject('start_date');
const end_date = inject('end_date');
const dataCategoriesLoading = ref([]);

provide('categories', categories)
const avgScore = ref(0)

// calcul feedBack

let reviewFeedbackData = ref({
    width: 0,
    red: 0,
    green: 0,
    feeling: 0
});

const handleEstablishmentDropdown = (type) => {
    const filters = type == 'other' ? establishments.value.filter(name => name != 'all') : ['all']
    establishments.value = establishments.value.length > 0 ? filters : ['all']
}

// calcul sentiment analysis
const calculSentimentAnalysis = (_score) =>{

        
        let rawWidth = _score * 100 / 2
        let width = rawWidth < 0 ? -1 * rawWidth : rawWidth
        let feeling = rawWidth > 0 ? 1 : -1
        let red = 255
        let green = 255
        if (feeling == -1) {
            red = 255
            green = 255 - ((_score * 100 * 255) / 100)
        } else {
            green = 255
            red = 255 - ((_score * 100 * 255) / 100)
        }

       let _reviewFeedbackData = {
            width: width,
            red: red,
            green: green,
            feeling: feeling,
            score: _score
        }
        console.log(_score)
           console.log(rawWidth)
        return _reviewFeedbackData;
}

const updateFeeling = (newFeedbackData) =>{
   
    reviewFeedbackData.value = newFeedbackData;
}

provide('reviewFeedbackData',reviewFeedbackData);
provide('calculSentimentAnalysis',calculSentimentAnalysis);

let reviews_loader = ref(true);
let visibleData = ref([])
const optionsReview = ref({
    rowLimit: 20,
    max: 100,
    current: 1,
    page: 1,
});


const loadCategories = async (tag) => {
       const api = `customer/establishments/categorizations?tag=${tag}`
    const response = await new Promise((resolve) => {
        services.get_Record(api, (response) => {
            resolve(response)
        });
    });

    if (response.status == 200) {
         if (response.data) {
            let cats=[];
            response.data.forEach((_cat,_index)=>{
                cats.push({id:_index,category:_cat});
            });

            categories.value = cats;
        }
        // if (response.data && response.data.data) {
        //     categories.value = response.data.data
        // }
    }
}


// watch([terms, establishments, optionsReview,start_date, end_date], async () => {
//     await loadReviews(route.params.tag,optionsReview.value.page,optionsReview.value.rowLimit,optionsReview.value.current, start_date.value, end_date.value,terms.value,establishments.value);
// });

const IsValueOkay = (value) => (value !== '' && value !== 0 && value !== null && value !== undefined);

const loadReviews = async (tag, page, limit, current, dateStart, dateEnd, terms, establishments) => {
    optionsReview.value.current = current;
    optionsReview.value.page = page;
    reviews_loader.value = true;

    let apiBase = '/review/search';
    let apiParams = `tag=${tag}&page=${page}&limit=${limit}&terms=${terms}`;

    if (IsValueOkay(dateStart) && IsValueOkay(dateEnd)) {
        dateStart = moment(new Date(dateStart)).format('YYYY-MM-DD');
        dateEnd = moment(new Date(dateEnd)).format('YYYY-MM-DD');
        apiParams += `&from=${dateStart}&to=${dateEnd}`;
    }

    const establishments_ids = establishments.join(',')


    if (IsValueOkay(establishments_ids) && establishments_ids != "all") {
      
        apiParams += `&establishments=${establishments_ids}`;
    }

    const api = apiBase + '?' + apiParams;

    const response = await new Promise((resolve) => {
        services.get_Record(api, (response) => {
            resolve(response)
        });
    });

    reviews_loader.value=false;
    optionsReview.value.max=2;
    visibleData.value=[
        // {
        //     "id": 1,
        //     "author": "Anonymous",
        //     "author_url": null,
        //     "language": "en",
        //     "profile_photo": null,
        //     "rating": "2",
        //     "comment": "“We had a short but very lovely stay at this beautiful place”",
        //     "date_review": "2024-07-05 00:00:00",
        //     "translated": null,
        //     "source": "App (Private)",
        //     "created_at": "2024-05-06 18:01:07",
        //     "feeling": null,
        //     "score": null,
        //     "confidence": null,
        //     "email": null,
        //     "optin": null,
        //     "country": null,
        //     "date_visit": null,
        //     "url": null,
        //     "category_check": "Acceuil,Mobilier,Emplacement,Ménage,Service,Nourriture,Bar,Accueil,Test",
        //     "updated_at": null,
        //     "feeling_updated": null,
        //     "summary": [],
        //     "classifications": [
        //         {
        //             "classification_id": 19,
        //             "category": "Acceuil",
        //             "section": "Test section 6",
        //             "feeling": null,
        //             "classification_confidence": "0.012478",
        //             "classification_confidence_feeling": null,
        //             "id": 1
        //         },
        //         {
        //             "classification_id": 70,
        //             "category": "Accueil",
        //             "section": "… En savoir plus",
        //             "feeling": null,
        //             "classification_confidence": "0.80772823095321",
        //             "classification_confidence_feeling": null,
        //             "id": 1
        //         },
        //         {
        //             "classification_id": 69,
        //             "category": "Emplacement",
        //             "section": "Très beau séjour au calme.Résidence propre ( a par quelques truc)Idéal pour les personnes qui cherchent un cadre calme et reposant !",
        //             "feeling": null,
        //             "classification_confidence": "0.80844777822495",
        //             "classification_confidence_feeling": null,
        //             "id": 1
        //         },
        //         {
        //             "classification_id": 20,
        //             "category": "Emplacement",
        //             "section": "Test section 7",
        //             "feeling": null,
        //             "classification_confidence": "0.012478",
        //             "classification_confidence_feeling": null,
        //             "id": 1
        //         },
        //         {
        //             "classification_id": 62,
        //             "category": "Emplacement",
        //             "section": "L'arrivée a été un peu compliquée (en arrivée tardive nous avons eu le mauvais numéro de chambre dans l'enveloppe) mais après un coup de téléphone, le mal a été vite réparé !",
        //             "feeling": null,
        //             "classification_confidence": "0.82010415810312",
        //             "classification_confidence_feeling": null,
        //             "id": 1
        //         },
        //         {
        //             "classification_id": 63,
        //             "category": "Emplacement",
        //             "section": "Logement un peu vieillissant cependant avec quelques petits travaux d'embellissement à prévoir mais bien équipé...Nous aurions souhaité néanmoins avoir une terrasse côté soleil et vue dégagée mais ça n'a pas été",
        //             "feeling": null,
        //             "classification_confidence": "0.84348515340042",
        //             "classification_confidence_feeling": null,
        //             "id": 1
        //         },
        //         {
        //             "classification_id": 65,
        //             "category": "Emplacement",
        //             "section": "Nous avons apprécié notre séjour malgré quelques détails qui gâchent un peu le",
        //             "feeling": null,
        //             "classification_confidence": "0.81585311889148",
        //             "classification_confidence_feeling": null,
        //             "id": 1
        //         },
        //         {
        //             "classification_id": 67,
        //             "category": "Emplacement",
        //             "section": "Il y aurait besoin d un coup de rafraîchissement.",
        //             "feeling": null,
        //             "classification_confidence": "0.87718343734741",
        //             "classification_confidence_feeling": null,
        //             "id": 1
        //         },
        //         {
        //             "classification_id": 66,
        //             "category": "Emplacement",
        //             "section": "On a trouvé la résidence vieillissante.",
        //             "feeling": null,
        //             "classification_confidence": "0.87409514188711",
        //             "classification_confidence_feeling": null,
        //             "id": 1
        //         },
        //         {
        //             "classification_id": 68,
        //             "category": "Emplacement",
        //             "section": "Petit coin perché dans la montagne, mais qui vaut le détour.Nous avons passé un agréable we en pleine nature, petit village sympa et résidence au top.",
        //             "feeling": null,
        //             "classification_confidence": "0.80431008338928",
        //             "classification_confidence_feeling": null,
        //             "id": 1
        //         },
        //         {
        //             "classification_id": 64,
        //             "category": "Ménage",
        //             "section": "Logement un peu vieillissant cependant avec quelques petits travaux d'embellissement à prévoir mais bien équipé...Nous aurions souhaité néanmoins avoir une terrasse côté soleil et vue dégagée mais ça n'a pas été",
        //             "feeling": null,
        //             "classification_confidence": "0.88131147825241",
        //             "classification_confidence_feeling": null,
        //             "id": 1
        //         },
        //         {
        //             "classification_id": 17,
        //             "category": "Ménage",
        //             "section": "Test section 4",
        //             "feeling": null,
        //             "classification_confidence": "0.012478",
        //             "classification_confidence_feeling": null,
        //             "id": 1
        //         },
        //         {
        //             "classification_id": 7,
        //             "category": "Ménage",
        //             "section": "new section",
        //             "feeling": null,
        //             "classification_confidence": "0.012478",
        //             "classification_confidence_feeling": null,
        //             "id": 1
        //         },
        //         {
        //             "classification_id": 18,
        //             "category": "Mobilier",
        //             "section": "Test section 5",
        //             "feeling": null,
        //             "classification_confidence": "0.012478",
        //             "classification_confidence_feeling": null,
        //             "id": 1
        //         }
        //     ],
        //     "category": "Acceuil;Accueil;Emplacement;Ménage;Mobilier",
        //     "classification_feeling": {
        //         "Acceuil": null,
        //         "Accueil": null,
        //         "Emplacement": null,
        //         "Ménage": null,
        //         "Mobilier": null
        //     },
        //     "classification_section": {
        //         "Acceuil": "Test section 6",
        //         "Accueil": "… En savoir plus",
        //         "Emplacement": "Très beau séjour au calme.Résidence propre ( a par quelques truc)Idéal pour les personnes qui cherchent un cadre calme et reposant !",
        //         "Ménage": "Logement un peu vieillissant cependant avec quelques petits travaux d'embellissement à prévoir mais bien équipé...Nous aurions souhaité néanmoins avoir une terrasse côté soleil et vue dégagée mais ça n'a pas été",
        //         "Mobilier": "Test section 5"
        //     }
        // },
        // {
        //     "id": 1,
        //     "author": "Anonymous",
        //     "author_url": null,
        //     "language": "en",
        //     "profile_photo": null,
        //     "rating": "2",
        //     "comment": "“We had a short but very lovely stay at this beautiful place”",
        //     "date_review": "2024-07-05 00:00:00",
        //     "translated": null,
        //     "source": "App (Private)",
        //     "created_at": "2024-05-06 18:01:07",
        //     "feeling": null,
        //     "score": null,
        //     "confidence": null,
        //     "email": null,
        //     "optin": null,
        //     "country": null,
        //     "date_visit": null,
        //     "url": null,
        //     "category_check": "Acceuil,Mobilier,Emplacement,Ménage,Service,Nourriture,Bar,Accueil,Test",
        //     "updated_at": null,
        //     "feeling_updated": null,
        //     "summary": [],
        //     "classifications": [
        //         {
        //             "classification_id": 19,
        //             "category": "Acceuil",
        //             "section": "Test section 6",
        //             "feeling": null,
        //             "classification_confidence": "0.012478",
        //             "classification_confidence_feeling": null,
        //             "id": 1
        //         },
        //         {
        //             "classification_id": 70,
        //             "category": "Accueil",
        //             "section": "… En savoir plus",
        //             "feeling": null,
        //             "classification_confidence": "0.80772823095321",
        //             "classification_confidence_feeling": null,
        //             "id": 1
        //         },
        //         {
        //             "classification_id": 69,
        //             "category": "Emplacement",
        //             "section": "Très beau séjour au calme.Résidence propre ( a par quelques truc)Idéal pour les personnes qui cherchent un cadre calme et reposant !",
        //             "feeling": null,
        //             "classification_confidence": "0.80844777822495",
        //             "classification_confidence_feeling": null,
        //             "id": 1
        //         },
        //         {
        //             "classification_id": 20,
        //             "category": "Emplacement",
        //             "section": "Test section 7",
        //             "feeling": null,
        //             "classification_confidence": "0.012478",
        //             "classification_confidence_feeling": null,
        //             "id": 1
        //         },
        //         {
        //             "classification_id": 62,
        //             "category": "Emplacement",
        //             "section": "L'arrivée a été un peu compliquée (en arrivée tardive nous avons eu le mauvais numéro de chambre dans l'enveloppe) mais après un coup de téléphone, le mal a été vite réparé !",
        //             "feeling": null,
        //             "classification_confidence": "0.82010415810312",
        //             "classification_confidence_feeling": null,
        //             "id": 1
        //         },
        //         {
        //             "classification_id": 63,
        //             "category": "Emplacement",
        //             "section": "Logement un peu vieillissant cependant avec quelques petits travaux d'embellissement à prévoir mais bien équipé...Nous aurions souhaité néanmoins avoir une terrasse côté soleil et vue dégagée mais ça n'a pas été",
        //             "feeling": null,
        //             "classification_confidence": "0.84348515340042",
        //             "classification_confidence_feeling": null,
        //             "id": 1
        //         },
        //         {
        //             "classification_id": 65,
        //             "category": "Emplacement",
        //             "section": "Nous avons apprécié notre séjour malgré quelques détails qui gâchent un peu le",
        //             "feeling": null,
        //             "classification_confidence": "0.81585311889148",
        //             "classification_confidence_feeling": null,
        //             "id": 1
        //         },
        //         {
        //             "classification_id": 67,
        //             "category": "Emplacement",
        //             "section": "Il y aurait besoin d un coup de rafraîchissement.",
        //             "feeling": null,
        //             "classification_confidence": "0.87718343734741",
        //             "classification_confidence_feeling": null,
        //             "id": 1
        //         },
        //         {
        //             "classification_id": 66,
        //             "category": "Emplacement",
        //             "section": "On a trouvé la résidence vieillissante.",
        //             "feeling": null,
        //             "classification_confidence": "0.87409514188711",
        //             "classification_confidence_feeling": null,
        //             "id": 1
        //         },
        //         {
        //             "classification_id": 68,
        //             "category": "Emplacement",
        //             "section": "Petit coin perché dans la montagne, mais qui vaut le détour.Nous avons passé un agréable we en pleine nature, petit village sympa et résidence au top.",
        //             "feeling": null,
        //             "classification_confidence": "0.80431008338928",
        //             "classification_confidence_feeling": null,
        //             "id": 1
        //         },
        //         {
        //             "classification_id": 64,
        //             "category": "Ménage",
        //             "section": "Logement un peu vieillissant cependant avec quelques petits travaux d'embellissement à prévoir mais bien équipé...Nous aurions souhaité néanmoins avoir une terrasse côté soleil et vue dégagée mais ça n'a pas été",
        //             "feeling": null,
        //             "classification_confidence": "0.88131147825241",
        //             "classification_confidence_feeling": null,
        //             "id": 1
        //         },
        //         {
        //             "classification_id": 17,
        //             "category": "Ménage",
        //             "section": "Test section 4",
        //             "feeling": null,
        //             "classification_confidence": "0.012478",
        //             "classification_confidence_feeling": null,
        //             "id": 1
        //         },
        //         {
        //             "classification_id": 7,
        //             "category": "Ménage",
        //             "section": "new section",
        //             "feeling": null,
        //             "classification_confidence": "0.012478",
        //             "classification_confidence_feeling": null,
        //             "id": 1
        //         },
        //         {
        //             "classification_id": 18,
        //             "category": "Mobilier",
        //             "section": "Test section 5",
        //             "feeling": null,
        //             "classification_confidence": "0.012478",
        //             "classification_confidence_feeling": null,
        //             "id": 1
        //         }
        //     ],
        //     "category": "Acceuil;Accueil;Emplacement;Ménage;Mobilier",
        //     "classification_feeling": {
        //         "Acceuil": null,
        //         "Accueil": null,
        //         "Emplacement": null,
        //         "Ménage": null,
        //         "Mobilier": null
        //     },
        //     "classification_section": {
        //         "Acceuil": "Test section 6",
        //         "Accueil": "… En savoir plus",
        //         "Emplacement": "Très beau séjour au calme.Résidence propre ( a par quelques truc)Idéal pour les personnes qui cherchent un cadre calme et reposant !",
        //         "Ménage": "Logement un peu vieillissant cependant avec quelques petits travaux d'embellissement à prévoir mais bien équipé...Nous aurions souhaité néanmoins avoir une terrasse côté soleil et vue dégagée mais ça n'a pas été",
        //         "Mobilier": "Test section 5"
        //     }
        // }
        ]
    

    if (response.status == 200) {
        console.log(response)
        reviews_loader.value = false;
        optionsReview.value.max = response.data['count'];
        visibleData.value = response.data['data'];
    }
}



onMounted(async () => {

  
        await Promise.all([
            loadCategories(route.params.tag),
           // loadReviews(route.params.tag,optionsReview.value.page,optionsReview.value.rowLimit,optionsReview.value.current,
           //  start_date.value,end_date.value,terms.value,establishments.value)
        ])

    

});

</script>

<style scoped>

.search_button{
   background-color: var(--color-danger);
}
.establishment-rank-view :deep(.reviews-count) {
    display: flex;
    /* padding: 5px; */
    border-radius: 5px;
}

.establishment-rank-view :deep(.review-box) {
    display: flex;
    align-items: center;
    background: #F5F5F5;
    padding: 2px;
    margin-top: -2.1px;
    border-radius: 5px;
    margin-right: 12px;
    cursor: pointer;
}

.establishment-rank-view :deep(.list__actions) {
    display: flex;
    justify-content: flex-end;
    /* margin-right: 10px; */
    /* margin-top: -8px; */
}

.filters {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 10px;
    background-color: #f5f5f5;
    border-radius: 5px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.row {
    display: flex;
    justify-content: space-between;
    width: 100%;
}

.select_info,
.catfiltre,
.date_picker {
    display: flex;
    align-items: center;
    flex-grow: 1;
    max-width: 300px;
    margin-right: 10px;
}

@media (min-width: 1500px) {
    .filters {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        align-items: center;
        padding: 10px;
        background-color: #f5f5f5;
        border-radius: 5px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .filters>* {
        flex-basis: 100%;
        margin-bottom: 10px;
        max-width: 100%;
        gap: 0.1rem;
    }
}

@media (max-width: 768px) {

    .select_info,
    .catfiltre,
    .date_picker {
        display: flex;
        align-items: center;
        flex-grow: 1;
        max-width: 100%;
        margin-right: 0;
        /* margin-right: 10px; */
    }

    .row {
        flex-direction: column;
    }

    .filters>* {
        flex-basis: 100%;
        margin-bottom: 10px;
        /* width: 500px; */
        gap: 0.5rem;
        /* margin-left: 200px; */
        margin-inline: 8px;
    }

    .establishment-rank-view :deep(.reviews-count) {
        display: flex;
        /* padding: 8px; */
        border-radius: 5px;

    }

    .establishment-rank-view :deep(.review-box) {
        display: flex;
        align-items: center;
        background: #F5F5F5;
        padding: 2px;
        border-radius: 5px;
        margin-right: 8px;

    }

    .establishment-rank-view :deep(.score) {
        font-weight: bold;
        margin-right: 1px;
        margin-top: 0px;
    }

    .establishment-rank-view :deep(.fa-star) {
        margin-top: 0px;
    }

    .establishment-rank-view :deep(.list__actions) {
        display: flex;
        justify-content: flex-end;
        margin-right: 0px;
        /* margin-top: 18px; */
    }
}

@media (min-width: 376px) and (max-width: 500px) {
    .select_info {
        display: flex;
        align-items: center;
        flex-grow: 1;
        /* max-width: 318px; */
        /* margin-right: 10px; */
    }

    .row {
        flex-direction: column;
    }

    .filters>* {
        flex-basis: 100%;
        margin-bottom: 10px;
        /* width: 500px; */
        gap: 0.5rem;
        /* margin-left: 200px; */
    }

    .establishment-rank-view :deep(.reviews-count) {
        display: flex;
        /* padding: 8px; */
        border-radius: 5px;

    }

    .establishment-rank-view :deep(.review-box) {
        display: flex;
        align-items: center;
        background: #F5F5F5;
        padding: 0px;
        border-radius: 5px;
        margin-right: 3px;
        width: 45px;

    }

    .establishment-rank-view :deep(.score) {
        font-weight: bold;
        margin-right: 0px;
        margin-top: 0px;
    }

    .establishment-rank-view :deep(.fa-star) {
        margin-top: 1px;
    }

    .establishment-rank-view :deep(.list__actions) {
        display: flex;
        justify-content: flex-end;
        margin-right: 0px;
        /* margin-top: 18px; */
    }
}

@media (max-width: 375px) {
    .select_info {
        display: flex;
        align-items: center;
        flex-grow: 1;
        /* max-width: 318px; */
        /* margin-right: 10px; */
    }

    .row {
        flex-direction: column;
    }

    .filters>* {
        flex-basis: 100%;
        margin-bottom: 10px;
        width: 500px;
        gap: 0.5rem;
        /* margin-left: 200px; */
    }

    .establishment-rank-view :deep(.reviews-count) {
        display: flex;
        /* padding: 8px; */
        border-radius: 5px;

    }

    .establishment-rank-view :deep(.review-box) {
        display: flex;
        align-items: center;
        background: #F5F5F5;
        padding: 0px;
        border-radius: 5px;
        margin-right: 3px;
        width: 39px;

    }

    .establishment-rank-view :deep(.score) {
        font-weight: bold;
        margin-right: 0px;
        margin-top: 0px;
    }

    .establishment-rank-view :deep(.fa-star) {
        margin-top: 1px;
    }

    .establishment-rank-view :deep(.list__actions) {
        display: flex;
        justify-content: flex-end;
        margin-right: 0px;
        /* margin-top: 18px; */
    }
}



@media (max-width: 420px) {
    .establishment-rank-view :deep(.society__rating) {
        display: flex;
        align-items: center;
        margin-top: -5px;
        margin-left: -90px;
        padding-right: 50px;
    }

    .establishment-rank-view :deep(.reviews) {
        font-size: 11px;
        margin-left: -20px;

    }
}

@media (min-width: 383px) and (max-width: 390px) {
    .establishment-rank-view :deep(.society__rating) {
        display: flex;
        align-items: center;
        margin-top: -5px;
        margin-left: -10px;
        padding-right: 60px;
    }

    .establishment-rank-view :deep(.reviews) {
        font-size: 11px;
        margin-left: 0px;

    }
}

@media (max-width: 375px) {
    .establishment-rank-view :deep(.society__rating) {
        display: flex;
        align-items: center;
        margin-top: -5px;
        margin-left: -10px;
        padding-right: 60px;
    }

    .establishment-rank-view :deep(.reviews) {
        font-size: 11px;
        margin-left: 5px;

    }

    .establishment-rank-view :deep(.reviews-count) {
        display: flex;
        /* padding: 8px; */
        border-radius: 5px;

    }

    .establishment-rank-view :deep(.review-box) {
        display: flex;
        align-items: center;
        background: #F5F5F5;
        padding: 0px;
        border-radius: 5px;
        margin-right: 4px;
        width: 42px;

    }
}
</style>
