<template>
    <div class="left__side">
        <RouterView />
    </div>
    <div class="tablet_mobile__filter">
        <DropdownComponent :showTitle="false" class="dropdown w-full" placeholder="" :data="timePeriods" @submit="(timePeriod) => {
            selectedTimePeriod = timePeriod
        }" :default="timePeriods[0]" />
        <div class="date__picker px-2">

            <el-date-picker v-model="start_date" type="date" placeholder="Select the start date" :size="'large'" />
        </div>
        <div class="date__picker px-2">

            <el-date-picker v-model="end_date" type="date" placeholder="Select the end date" :size="'large'" />
        </div>
    </div>

    <div class="tablet_mobile__head">
        <div class="establishment__info_tablet">
            <label v-if="!dataLoading">{{ establishment.name }}</label>
            <label v-else class="h-3 mt-1 bg-gray-200 dark:bg-gray-700 w-full mb-4"></label>
            <div>
                <i
                    :class="['uil', establishment.category == 'Restaurant' ? 'uil-restaurant' : '', establishment.category == 'Hotel' ? 'uil-bed-double' : '', establishment.category == 'Residence' ? 'uil-home' : '', establishment.category == 'Other' ? 'uil-home' : '']"></i>
                <span v-if="!dataLoading">{{ establishment.category }}</span>
                <span v-else class="h-3 mt-1 bg-gray-200 dark:bg-gray-700 w-48 mb-4"></span>
            </div>
            <div class="society__location" v-if="establishment.country != null">
                <i class="uil uil-map"></i>
                <span v-if="!dataLoading">{{ establishment.country }}</span>
                <span v-else class="h-3 mt-1 bg-gray-200 dark:bg-gray-700 w-full mb-4"></span>
            </div>
            <div class="society__location">
                <i class="uil uil-location-point"></i>
                <span v-if="!dataLoading">{{ establishment.city }}</span>
                <span v-else class="h-3 mt-1 bg-gray-200 dark:bg-gray-700 w-full mb-4"></span>
            </div>
        </div>
        <div class="photo" v-if="!dataLoading">
            <div v-if="establishment.url_source !== null" class="establishment__img">
                <img :src="establishment.url_source" alt="" id="logoimagemobile" />
            </div>
            <div v-else role="status"
                class="flex items-center justify-center max-w-sm bg-gray-300 rounded-lg animate-pulse dark:bg-gray-700">
                <svg class="w-10 h-10 text-gray-200 dark:text-gray-600" aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 20">
                    <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.98 2.98 0 0 0 .13 5H5Z" />
                    <path
                        d="M14.066 0H7v5a2 2 0 0 1-2 2H0v11a1.97 1.97 0 0 0 1.934 2h12.132A1.97 1.97 0 0 0 16 18V2a1.97 1.97 0 0 0-1.934-2ZM9 13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2Zm4 .382a1 1 0 0 1-1.447.894L10 13v-2l1.553-1.276a1 1 0 0 1 1.447.894v2.764Z" />
                </svg>
                <span class="sr-only">Loading...</span>
            </div>
        </div>
        <div class="photo" v-else>
            <div role="status"
                class="flex items-center justify-center max-w-sm bg-gray-300 rounded-lg animate-pulse dark:bg-gray-700">
                <svg class="w-10 h-10 text-gray-200 dark:text-gray-600" aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 20">
                    <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.98 2.98 0 0 0 .13 5H5Z" />
                    <path
                        d="M14.066 0H7v5a2 2 0 0 1-2 2H0v11a1.97 1.97 0 0 0 1.934 2h12.132A1.97 1.97 0 0 0 16 18V2a1.97 1.97 0 0 0-1.934-2ZM9 13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2Zm4 .382a1 1 0 0 1-1.447.894L10 13v-2l1.553-1.276a1 1 0 0 1 1.447.894v2.764Z" />
                </svg>
                <span class="sr-only">Loading...</span>
            </div>
        </div>
    </div>
    <div class="right__side">
        <div
            class="establishment bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
            <a href="#" v-if="!dataLoading">
                <div v-if="!dataLoading" class="establishment__img">
                    <img :src="establishment.url_source" alt="" id="logoimage"/>
                </div>
                <div v-else role="status"
                    class="flex items-center justify-center h-56 max-w-sm bg-gray-300 rounded-lg animate-pulse dark:bg-gray-700">
                    <svg class="w-10 h-10 text-gray-200 dark:text-gray-600" aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 20">
                        <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.98 2.98 0 0 0 .13 5H5Z" />
                        <path
                            d="M14.066 0H7v5a2 2 0 0 1-2 2H0v11a1.97 1.97 0 0 0 1.934 2h12.132A1.97 1.97 0 0 0 16 18V2a1.97 1.97 0 0 0-1.934-2ZM9 13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2Zm4 .382a1 1 0 0 1-1.447.894L10 13v-2l1.553-1.276a1 1 0 0 1 1.447.894v2.764Z" />
                    </svg>
                    <span class="sr-only">Loading...</span>
                </div>
            </a>
            <a href="#" v-else>
                <div role="status"
                    class="flex items-center justify-center h-56 max-w-sm bg-gray-300 rounded-lg animate-pulse dark:bg-gray-700">
                    <svg class="w-10 h-10 text-gray-200 dark:text-gray-600" aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 20">
                        <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.98 2.98 0 0 0 .13 5H5Z" />
                        <path
                            d="M14.066 0H7v5a2 2 0 0 1-2 2H0v11a1.97 1.97 0 0 0 1.934 2h12.132A1.97 1.97 0 0 0 16 18V2a1.97 1.97 0 0 0-1.934-2ZM9 13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2Zm4 .382a1 1 0 0 1-1.447.894L10 13v-2l1.553-1.276a1 1 0 0 1 1.447.894v2.764Z" />
                    </svg>
                    <span class="sr-only">Loading...</span>
                </div>
            </a>
            <div class="establishment__info">
                <label class="society__name" v-if="!dataLoading">{{ establishment.name }}</label>
                <label v-else class="h-3 mt-1 bg-gray-200 dark:bg-gray-700 w-full mb-4"></label>
                <div class="society__location">
                    <i
                        :class="['uil', establishment.category == 'Restaurant' ? 'uil-restaurant' : '', establishment.category == 'Hotel' ? 'uil-bed-double' : '', establishment.category == 'Residence' ? 'uil-home' : '', establishment.category == 'Other' ? 'uil-home' : '']"></i>
                    <span v-if="!dataLoading" class="society__location">{{ establishment.category }}</span>
                    <span v-else class="h-3 mt-1 bg-gray-200 dark:bg-gray-700 w-full mb-4"></span>
                </div>
                <div class="society__location">
                    <i class="uil uil-location-point"></i>
                    <span v-if="!dataLoading" class="society__location">{{
                        establishment.city }}</span>
                    <span v-else class="h-3 mt-1 bg-gray-200 dark:bg-gray-700 w-full mb-4"></span>
                </div>
            </div>
            <div class="date__filter">
                <div class="text-sm title">Select a date range</div>
                <el-date-picker v-model="start_date" type="date" placeholder="Select the start date" :size="'large'" />
                <el-date-picker class="mt-2" v-model="end_date" type="date" placeholder="Select the end date"
                    :size="'large'" />
                <DropdownComponent v-if="route.name !== 'StaffReview' && route.name !== 'UnitReview'" :showTitle="false"
                    placeholder="" :data="timePeriods" @submit="(timePeriod) => {
                        selectedTimePeriod = timePeriod
                    }" :default="timePeriods[0]" />
            </div>
        </div>
    </div>
</template>

<script setup>
import moment from 'moment';
import { RouterView } from 'vue-router';
import services from '@Services/services.js';
import { useAppStore } from "@Stores/app.js";
import { useUserStore } from "@Stores/user.js";
import { useRoute } from "vue-router";
import { useCompanyStore } from "@Stores/company.js";
import DropdownComponent from '@Components/utils/DropdownComponent.vue';
import { useWindowSize } from '@vueuse/core';
import { ref, watch, onBeforeMount, computed, provide, onUpdated, inject } from 'vue';
import { ElDatePicker } from 'element-plus';
import {
    Chart as ChartJS,
    RadialLinearScale,
    ArcElement,
    Tooltip
} from 'chart.js';
ChartJS.register(RadialLinearScale, ArcElement, Tooltip);
import { useResizeObserver } from '@vueuse/core';

const userStore = useUserStore();
const companiesStore = useCompanyStore();
const appStore = useAppStore();
const customerTag = inject('tag');

const route = useRoute();
const breadcrumbData = ref([
    {
        title: "Back",
        path: `/customer/${route.params.tag}/establishment/${route.params.id}`,
        isCurrent: false,
    },
    {
        title: "Services",
        path: `${route.path}`,
        isCurrent: true
    }
])

appStore.setIsExist(true);

appStore.setBreadcrumbs([
    {
        title: "Establishment",
        path: `/customer/${route.params.tag}/establishment/${route.params.id}`,
        isCurrent: false,
    },
    {
        title: "Services",
        path: `${route.path}`,
        isCurrent: true
    }
]);

const route_name = computed(() => {
    return route.name;
})

const companyId = route.params.id;

const selectedStaff = ref(null);
provide('selectedStaff', selectedStaff);

const selectedUnit = ref(null)
provide('selectedUnit', selectedUnit)

const onglet = ref('staffs');
provide('onglet', onglet)

const dataLoading = ref(true);
const chartLoading = ref(false);
provide('dataLoading', dataLoading);
provide('chartLoading', chartLoading);
const staffLoading = ref(false);
provide('staffLoading', staffLoading);
let establishment = ref({});
provide('establishment', establishment)
let staffs = ref([]);
provide('staffs', staffs);
const timePeriods = ref(['Daily', 'Weekly', 'Monthly', 'Yearly']);
const selectedTimePeriod = ref(timePeriods.value[0]);
const start_date = inject('start_date');
const end_date = inject('end_date');
const date = ref([start_date.value, end_date.value]);
provide('date', date);
provide('type', selectedTimePeriod);
const all_items = ref([
    { title: "Rating", value: 0, icon: "uil-star" },
    { title: "Reviews", value: 0, icon: "uil-comment" },
    { title: "Competitors", value: 0, icon: "uil-building" },
]);
const { width } = useWindowSize();


watch([start_date, end_date], async () => {
    if (start_date.value !== '' && end_date.value !== '') {
        date.value = [start_date.value, end_date.value]

    } else {
        date.value = [startDate, endDate];

    }
    // appStore.setDatesValue(start_date.value, end_date.value);
    await loadStaffs(companyId, start_date.value, end_date.value)
})

watch(route_name, () => {

    const establishment_name = establishment.value ? establishment.value.name : "Establishment";

    if (route_name.value == 'StaffReview') {
        appStore.setBreadcrumbs([
            {
                title: establishment_name,
                path: `/customer/${route.params.tag}/establishment/${route.params.id}`,
                isCurrent: false,
            },
            {
                title: "Services",
                path: `/customer/${route.params.tag}/establishment/${route.params.id}/services`,
                isCurrent: false
            },
            {
                title: "Staff Reviews",
                path: `${route.path}`,
                isCurrent: true,
            }
        ]);
    }

    if (route_name.value == 'UnitReview') {
        appStore.setBreadcrumbs([
            {
                title: establishment_name,
                path: `/customer/${route.params.tag}/establishment/${route.params.id}`,
                isCurrent: false,
            },
            {
                title: "Services",
                path: `/customer/${route.params.tag}/establishment/${route.params.id}/services`,
                isCurrent: false
            },
            {
                title: "Unit Reviews",
                path: `${route.path}`,
                isCurrent: true,
            }
        ]);
    }

    if (route_name.value == 'Services') {
        appStore.setBreadcrumbs([
            {
                title: establishment_name,
                path: `/customer/${route.params.tag}/establishment/${route.params.id}`,
                isCurrent: false,
            },
            {
                title: "Services",
                path: `${route.path}`,
                isCurrent: true
            }
        ]);
    }

})

const loadStaffs = async (tag, dateStart, dateEnd) => {
    staffLoading.value = true;
    dateStart = moment(new Date(dateStart)).format('YYYY-MM-DD')
    dateEnd = moment(new Date(dateEnd)).format('YYYY-MM-DD')

    const response = await new Promise((resolve) => {
        services.get_Record(`/establishment/${companyId}/staffs?dateFrom=${dateStart}&dateTo=${dateEnd}`, (response) => {
            resolve(response)
            if (response.status == 404) {
                appStore.setIsExist(false);
                appStore.isLoading = false;
            }
        });
    });

    if (response.status == 200) {
        staffs.value = response.data;
        staffLoading.value = false;
    }
}

onBeforeMount(async () => {
    appStore.isLoading = true;
    // staffLoading.value = true;
    chartLoading.value = true;

    companiesStore.getEstablishment(customerTag.value, companyId).then((data) => {

        if (data == false) {
            appStore.setIsExist(false);
            appStore.isLoading = false;
        }
        else {
            establishment.value = data;
            appStore.setCurrentPage({
                title1: "",
                title2: "Services",
                icon: "uil-clipboard-notes"
            });

            const establishment_name = establishment.value ? establishment.value.name : "Establishment";

            if (route_name.value == 'StaffReview') {
                appStore.setBreadcrumbs([
                    {
                        title: establishment_name,
                        path: `/customer/${route.params.tag}/establishment/${route.params.id}`,
                        isCurrent: false,
                    },
                    {
                        title: "Services",
                        path: `/customer/${route.params.tag}/establishment/${route.params.id}/services`,
                        isCurrent: false
                    },
                    {
                        title: "Reviews",
                        path: `${route.path}`,
                        isCurrent: true,
                    }
                ]);
            }

            if (route_name.value == 'UnitReview') {
                appStore.setBreadcrumbs([
                    {
                        title: establishment_name,
                        path: `/customer/${route.params.tag}/establishment/${route.params.id}`,
                        isCurrent: false,
                    },
                    {
                        title: "Services",
                        path: `${route.path}`,
                        isCurrent: true
                    },
                    {
                        title: "Unit Reviews",
                        path: `${route.path}`,
                        isCurrent: true,
                    }
                ]);
            }

            if (route_name.value == 'Services') {
                appStore.setBreadcrumbs([
                    {
                        title: establishment_name,
                        path: `/customer/${route.params.tag}/establishment/${route.params.id}`,
                        isCurrent: false,
                    },
                    {
                        title: "Services",
                        path: `${route.path}`,
                        isCurrent: true
                    }
                ]);
            }

            all_items.value[0].value = establishment.value.rating;
            all_items.value[1].value = establishment.value.totalReviews;
            widthimage(establishment.value.url_source);
            appStore.isLoading = false;
            
            dataLoading.value = false;
        }
    })

    await loadStaffs(companyId, start_date.value, end_date.value)
})

const el = ref(null);
const chartWidth = ref(0);
const barWidth = computed(() => {
    let result = 0;
    if (width.value >= 800) result = Math.abs(Number(chartWidth.value - 100));
    else result = 800;
    return result;
})
provide('barWidth', barWidth);

onUpdated(() => {
    chartWidth.value = (el.value != null && el.value != undefined) ? Math.abs(el.value.offsetWidth) : chartWidth.value;
})

useResizeObserver(el, (entries) => {
    const entry = entries[0]
    const { width } = entry.contentRect;
    chartWidth.value = Math.abs(width);
});

/**
 * obtenir width image from url
 */
 const getMeta = (url, cb) => {
  const img = new Image();
  img.onload = () => cb(null, img);
  img.onerror = (err) => cb(err);
  img.src = url;
};

/** Fonction widthimage pour savoir le width 
 * @param event 
*/
const  widthimage = (event) => {
    // Loadging establishment__img
    
    var imgmobile = document.getElementById("logoimagemobile");
    if(imgmobile !== null){
        imgmobile.classList.add("fade-in");
    }
    document.getElementsByClassName("establishment__img").innerText = "Loading image...";
    return getMeta(event,(err, img) =>{
        //if(img!=null){
            const heightresize = 160; //hauteur div pour l'image
            var aspectRatio = img.naturalWidth / img.naturalHeight;
            var newWidth = 0;
            if(aspectRatio == 1){
                // ici carre
                newWidth =heightresize;
            }else{
                newWidth =heightresize * aspectRatio;
            }   
            let classy =   (newWidth>240)? "largeClass" : "smallClass";
            // pour le desktop
            var elem = document.getElementById("logoimage");
            elem.classList.add("fade-in");
            setTimeout(() => {
                elem.classList.add('show');
                elem.style.display="block";
                }, 10);
            elem.classList.add(classy);
            elem.src = event;
            //new Promise(resolve=>{elem.onload = resolve})
        
            //pour le mobile
            var elemmob = document.getElementById("logoimagemobile");
            if(elemmob !== null){
                elemmob.classList.add(classy);
                
                elemmob.src=event;
                // Ajouter la classe 'show' pour déclencher l'animation de fondu en entrée
                setTimeout(() => {
                    
                    elemmob.classList.add('show');
                    elemmob.style.display = "block";
                }, 10);
            }
            
            return "OK";
        //}
        
    });
   
}
</script>

<style scoped>
.btn {
    width: 100%;
    background-color: var(--color-primary);
    color: white;
    border-radius: 5px;
    padding: 5px;
}


@media screen and (min-width: 540px) and (max-width: 975px) {

    .establishment__info_tablet{
        margin-top:50px! important;
    }
    .smallClass{
        margin-top:10px! important;
        margin-bottom:10px;
    }
    .largeClass{
        margin-top:10px! important;
        margin-bottom:10px;
    }
}

@media screen  and (max-width: 520px) {

    .establishment__info_tablet{
        margin-top:50px! important;
    }
    .smallClass{
        margin-top:60px! important;
        margin-bottom:10px;
    }
    .largeClass{
        margin-top:60px! important;
        margin-bottom:10px;
    }
}



.smallClass{
    width: auto! important;
    height: 100%! important;

}
.establishment__img{
    display:flex;
    justify-content:center;
    height: 160px;
    align-items:center;
}
.largeClass{
    width: 100%! important;
    height: auto! important;

}
.fade-in {
    opacity: 0;
    transition: opacity 1s ease-in;
}
.fade-in.show {
    opacity: 1;
}


</style>