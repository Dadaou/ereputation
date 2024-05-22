<template>

    <!-- Table of ranking -->
    <div class="relative overflow-x-auto" style="margin-top: 15px;">
        <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                    <th scope="col" class="px-6 py-3">
                        Staff Name
                    </th>
                    <th scope="col" class="px-6 py-3">
                        Number of Evaluations
                    </th>
                    <th scope="col" class="px-6 py-3">
                        Average grades
                    </th>
                    <th scope="col" class="px-6 py-3">
                        last 5 grades
                    </th>
                </tr>
            </thead>
            <tbody v-if="staffs.length > 0">
                <tr v-for="staff in staffs" :key="staff.id"
                    class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                    <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        {{ staff.name }}
                    </th>
                    <td class="px-6 py-4">
                        {{ staff.nb_eval }}
                    </td>
                    <td class="px-6 py-4">
                        {{ staff.note_moyenne }}
                    </td>
                    <td class="px-6 py-4">
                        <div class="flex items-center">
                            <div v-for="(note, index) in staff.last_notes" :key="index"
                                class="rounded-full w-6 h-6 mx-1" :class="{
                                    'bg-red-600': Math.round(note.rating) == 0,
                                    'bg-red-500': Math.round(note.rating) == 1,
                                    'bg-orange-400': Math.round(note.rating) == 2,
                                    'bg-yellow-200': Math.round(note.rating) == 3,
                                    'bg-green-400': Math.round(note.rating) == 4,
                                    'bg-green-600': Math.round(note.rating) == 5
                                }">
                                <span class="text-white flex items-center justify-center h-full">
                                    {{ Math.round(note.rating) }}
                                </span>
                            </div>
                        </div>
                    </td>
                </tr>
            </tbody>
            <tbody v-else>
                <tr class="no__staff">
                    <td colspan="4">
                        <div style="text-align: center;">
                            <span>no staff</span>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup>
import moment from 'moment';
import services from '@Services/services.js';
import { useAppStore } from "@Stores/app.js";
import { useRoute } from "vue-router";
import { useCompanyStore } from "@Stores/company.js";
import DropdownComponent from '@Components/utils/DropdownComponent.vue';
import {
    ref,
    watch,
    onBeforeMount,
    provide,
    inject,
    onUpdated,
} from 'vue';
import { ElDatePicker } from 'element-plus';

import { useResizeObserver } from '@vueuse/core';

const companiesStore = useCompanyStore();
const appStore = useAppStore();

appStore.setIsExist(true);

const route = useRoute();

const dataLoading = ref(true)
let establishment = ref({});
provide('establishment', establishment)
let staffs = ref([]);
provide('staffs', staffs);
const companyId = route.params.id;
let timePeriods = ref(['Daily', 'Monthly', 'Yearly']);
let selectedTimePeriod = ref(timePeriods.value[0]);
const date = ref([]);
const currentDate = new Date();
const start_date = inject('start_date');
const end_date = inject('end_date');

provide('date', date);
provide('type', selectedTimePeriod);
const all_items = ref([
    { title: "Rating", value: 0, icon: "uil-star" },
    { title: "Reviews", value: 0, icon: "uil-comment" },
    { title: "Competitors", value: 0, icon: "uil-building" },
]);

const IsValueOkay = (value) => (value == '' || value == null || value == undefined) ? false : true;
watch([start_date, end_date], () => {
    if (IsValueOkay(start_date.value) && IsValueOkay(end_date.value)) {
        date.value = [start_date.value, end_date.value]
    } else {
        date.value = [];
    }

})

const customerTag = inject('tag')

const loadFromServer = async (type, company, datefrom, dateto) => {
    switch (type) {
        case 'yearly':
            datefrom = moment(datefrom).format('YYYY');
            dateto = moment(dateto).format('YYYY');
            break;
        case 'monthly':
            datefrom = moment(datefrom).format('YYYY-MM');
            dateto = moment(dateto).format('YYYY-MM');
            break;
        default:
            datefrom = moment(datefrom).format('YYYY-MM-DD');
            dateto = moment(dateto).format('YYYY-MM-DD');
            break;
    }

    const response = await new Promise((resolve) => {
        services.get_Record(`establishment/${company}/${type}/${datefrom}/${dateto}/staffs/notes`, (response) => {
            resolve(response)
        });

    });

    if (response.status == 200) {
        staffs.value = response.data;
    }
}

watch([start_date, end_date, selectedTimePeriod], () => {
    loadFromServer(selectedTimePeriod.value.toLowerCase(), companyId, start_date.value, end_date.value);
})

onBeforeMount(async () => {

    await loadFromServer(selectedTimePeriod.value.toLowerCase(), companyId, start_date.value, end_date.value);

})


const el = ref(null);
const chartWidth = ref(0);

onUpdated(() => {
    chartWidth.value = (el.value != null && el.value != undefined) ? Math.abs(el.value.offsetWidth) : chartWidth.value;
})

useResizeObserver(el, (entries) => {
    const entry = entries[0]
    const { width } = entry.contentRect;
    chartWidth.value = Math.abs(width);
});
</script>