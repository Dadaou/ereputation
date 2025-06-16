<template>
    <div class="staff__list" v-if="staffs.length > 0">
        <div class="staff__card" v-for="staff in staffs" :key="staff.id">
            <div class="staff__qrcode">
                <div>
                    <RouterLink
                        :to="`/customer/${tag}/establishment/${$route.params.id}/services/staff/${staff.tag}/reviews`"
                        @Click="() => { selectedStaff = staff }">
                        <h5>{{ staff.firstname }} <span v-if="staff.lastname != null">{{ staff.lastname }}</span></h5>
                    </RouterLink>
                    <ul>
                        <li class="Gender">
                            <span class="label">Gender: </span> <i
                                :class="['uil', (staff.gender == 'M' && staff.gender != 'F' && staff.gender != 'O') ? 'uil-mars' : '', (staff.gender == 'F' && staff.gender != 'M' && staff.gender != 'O') ? 'uil-venus' : '']">
                            </i>
                        </li>

                        <li><span class="label">Department: </span> <span>{{ staff.department }}</span></li>
                        <li class="period"><span class="label">Period: </span> <span>{{
                            moment(staff.datefrom).format('DD MMMM YYYY') }}</span> <span
                                v-if="staff.dateto != null">{{ `to ${moment(staff.dateto).format('DD MMMM YYYY')}`
                                }}</span></li>
                    </ul>
                </div>
                <!-- <div>
                    <div id="qrcode__container mt-5" ref="qrcode">
                             <el-tooltip content="Click me to download The staff QRCode" placement="top">
                                 <vue-qrious
                                    class="qr__code"
                                    @click="showModal=true, staf = staff"
                                     :value="`${baseurl}/public/${tag}/establishment/${staff.establishment_tag}/staffs/${staff.tag}/feedback`"
                                    @change="onDataUrlChange"
                                    />
                             </el-tooltip>
                    </div>   
                </div> -->
            </div>
            <div class="pie__chart">
                <div>
                    <h3 class="mb-2">Before (<span class="rating">{{
                        calculateAverageRating(staffRatingDataset(staff.data,
                            'beforeData'))}}</span>)</h3>
                    <Pie :data="staffRatingDataset(staff.data, 'beforeData')" :options="options" />
                </div>
                <div>
                    <h3 class="mb-2">During (<span class="rating">{{
                        calculateAverageRating(staffRatingDataset(staff.data,
                            'duringData'))}}</span>)</h3>
                    <Pie :data="staffRatingDataset(staff.data, 'duringData')" :options="options" />
                </div>
                <div>
                    <h3 class="mb-2">After (<span class="rating">{{
                        calculateAverageRating(staffRatingDataset(staff.data,
                            'afterData'))}}</span>)</h3>
                    <Pie :data="staffRatingDataset(staff.data, 'afterData')" :options="options" />
                </div>
            </div>
            <BaseLegend class="legend" :LegendData="legendData" :alignment="'horizontal'">
            </BaseLegend>
            <div class="list__actions">

                <button class="btn mr-2 reviews" @click="redirectToSearch(staff.establishment_id, staff.firstname)">
                    <i class="uil uil-question-circle"></i> Am I mentioned? 
                </button>

                <button class="btn mr-2 reviews" @click="showReview(tag, staff.tag, $route.params.id, staff)">
                    <i class="uil uil-comment-alt-lines"></i> QR code Reviews
                </button>
            </div>
        </div>
    </div>
    <div class="no__data" v-if="staffs.length == 0">No staff</div>
    <QrCodeModalComponent v-if="staf"
        :qrcodeValue="`${baseurl}/public/${tag}/establishment/${staf.establishment_tag}/staffs/${staf.tag}/feedback`"
        :showModal="showModal" :filename="`${staf.firstname} ${staf.lastname}-feedback-link`" @close="showModal = false"
        :customer="tag" :establishment="staf.establishment_tag" type="staff" />
</template>
<script setup>
import { ref, inject, computed, defineAsyncComponent } from 'vue';
import moment from 'moment';
import VueQrious from 'vue-qrious';
import { useWindowSize } from '@vueuse/core';
import { ElTooltip } from 'element-plus';
import { Chart as ChartJS, ArcElement, Tooltip } from 'chart.js'
import { Pie } from 'vue-chartjs';
import { useRouter } from 'vue-router';
import services from '@Services/services.js';

const ModalComponent = defineAsyncComponent(() =>
    import('@Components/utils/ModalComponent.vue')
)

const QrCodeModalComponent = defineAsyncComponent(() =>
    import('@Components/utils/QrCodeModalComponent.vue')
)

ChartJS.register(ArcElement, Tooltip)
const router = useRouter();
const staffs = inject('staffs');
const staf = ref(null)
const selectedStaff = inject('selectedStaff')
const baseurl = window.location.origin;
const base64Image = ref(null);
const qrcode = ref(null);
const onDataUrlChange = (dataUrl) => {
    base64Image.value = dataUrl;
}
const { width } = useWindowSize()
const showModal = ref(false);
const tag = inject('tag')

const legendData = ref([
    { name: '1 star', color: '#FF0000' },
    { name: '2 stars', color: '#FFA500' },
    { name: '3 stars', color: '#FFFF00' },
    { name: '4 stars', color: '#00FF00' },
    { name: '5 stars', color: '#008000' },
])

// const downloadQrcode = (staffname) => {
//   const filename = `${staffname}-feedback-link`;
//   services.downloadQrcode(filename, base64Image.value);
//   downloaded.value = true;
// }

const staffComparison = ref({})

const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            display: false,
        }
    },
    aspectRatio: 1,
};

const staffRatingDataset = (periods, type) => {
    return {
        labels: periods.labels,
        datasets: [
            {
                backgroundColor: [
                    '#FF0000',
                    '#FFA500',
                    '#FFFF00',
                    '#00FF00',
                    '#008000',
                ],
                data: periods[`${type}`], //beforeData, duringData, afterData
            },
        ],
    };
};

const redirectToSearch = (establishment_id, firstName) => {

    router.push({
        name: 'CustomerSearchReview',
        params: {...router.params}, 
        query : {
            establishment_id: establishment_id,
            staffFirstName: firstName
        }
    })
}

const calculateAverageRating = (data) => {
    const starRatings = [1, 2, 3, 4, 5];
    const ratingsData = data.datasets[0].data;

    // Calcul de la somme pondérée des évaluations
    let weightedSum = 0;
    for (let i = 0; i < starRatings.length; i++) {
        weightedSum += starRatings[i] * ratingsData[i];
    }

    // Calcul de la moyenne
    const totalRatings = ratingsData.reduce((total, count) => total + count, 0);
    const averageRating = weightedSum / totalRatings;
    if (isNaN(averageRating.toFixed(1))) return 0;
    return averageRating.toFixed(1);
};

const showReview = (customer_tag, staff_tag, establishment_tag, staff) => {
    selectedStaff.value = staff;
    router.push({
        name: 'StaffReview',
        params: {
            tag: customer_tag,
            id: establishment_tag,
            staff_tag: staff_tag
        }
    })
};
</script>
<style scoped>
a {
    text-decoration: none;
}

.staff__card {
    border: 1px solid var(--light-color-bg2);
    padding: 15px;
    flex-basis: 500px;
    flex-grow: 1;
    box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
    border-radius: 5px;
    display: flex;
    gap: 1rem;
    flex-direction: column;
    margin-bottom: 10px;
}

span.rating {
    color: var(--color-danger);
    font-weight: 600;
}

.staff__card h5 {
    color: var(--color-primary);
}

.uil-mars {
    color: blue;
}

.uil-venus {
    color: pink;
}

span {
    font-size: 14px;
    color: var(--color-bg2);
}

span.label {
    color: var(--color-bg1);
    font-size: 14px;
}

.qr__code {
    width: 100% !important;
    padding: 10px auto !important;
    cursor: pointer;
}

.qr__code_view {
    width: 30% !important;
    padding: 10px auto !important;
    margin: auto;
}

.pie__chart {
    display: flex;
    gap: 1rem;
    justify-content: center;
    height: 150px;
}

.pie__chart div {
    width: 30% !important;
    height: 100px !important;
}

.pie__chart h3 {
    text-align: center;
    font-weight: 500;
    color: var(--color-bg1);
    font-size: 14px;
}

.staff__qrcode {
    display: flex;
    justify-content: space-between;
}

.list__actions {
    display: flex;
    justify-content: flex-end;
}

.list__actions button {
    border: 1px solid var(--light-color-bg1);
    transition: var(--transition);
    border-radius: 5px;
    font-size: 13px;
    font-weight: 500;
    padding: 2px 6px;
}

.list__actions button.chart {
    color: var(--color-primary);
    border-color: var(--color-primary);
}

.list__actions button.reviews {
    color: var(--color-danger);
    border-color: var(--color-danger);
}

.list__actions button.chart:hover {
    color: white;
    background-color: var(--color-primary);
}

.list__actions button.reviews:hover {
    color: white;
    background-color: var(--color-danger);
}

.list__actions button:hover {
    transform: scale(0.95);
}


@media (max-width: 768px) {
    .pie__chart {

        display: flex;
        flex-wrap: wrap;
        /* Permet aux éléments de passer à la ligne lorsque la largeur est insuffisante */
        justify-content: center;
        gap: 10px;
        /* Ajoutez un espacement entre les graphiques */
    }

    .pie__chart div {
        width: calc(33.33% - 10px);
        /* Calculez la largeur des graphiques avec un espace entre eux */
        height: 150px !important;

    }

    .pie__chart h3 {
        text-align: center;
        margin-bottom: 5px;

    }

}

.no__data {
    font-size: 14px;
    color: #6B7280;
}

</style>