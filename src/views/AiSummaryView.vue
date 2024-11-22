<template>
    <div>
        <div class="toggle-switch active ml-auto mr-0 mt-2 mb-5">
            <div class="toggle-option" :class="{ 'selected': isActiveMonth }" @click="handleToggleMonth">Month</div>
            <div class="toggle-line"></div>
            <div class="toggle-option" :class="{ 'selected': !isActiveMonth }" @click="handleToggleYear">Year
            </div>
        </div>
        <div v-if="loading">Loading summary...</div>
        <div v-else-if="summaries.length > 0">
            <div v-if="summaries[0] && summaries[0].overview" class="summary-card">
                <div class="flex justify-between items-start">
                    <h2 v-if="summaries[0].datefrom && summaries[0].dateto && summaries[0].overview">
                        Summary reviews {{ summaries[0].date_to_display }} -
                        {{ summaries[0].establishment_name }}</h2>
                    <h2 v-else>Summary - {{ summaries[0].establishment_name }}</h2>
                    <span v-if="summaries[0].limit_item">{{ summaries[0].limit_item || "" }} {{
                        limit_item > 1 ? "reviews" : "review" }} </span>
                </div>
                <p v-html="formatOverview(summaries[0].overview)"></p>
            </div>
            <ExpansionPanel v-if="filteredSummary.length > 0" title="AI History">
                <div v-for="summary in filteredSummary" :key="summary.id" class="summary-card">
                    <div class="flex justify-between items-start">
                        <h2 v-if="summary.datefrom && summary.dateto && summary.overview">
                            Summary reviews {{ summary.date_to_display }} - {{ summary.establishment_name }}</h2>
                        <h2 v-else>Summary - {{ summary.establishment_name }}</h2>
                        <span v-if="summary.limit_item">{{ summary.limit_item || "" }} {{
                            limit_item > 1 ? "reviews" : "review" }} </span>
                    </div>
                    <p v-html="formatOverview(summary.overview)"></p>
                </div>
            </ExpansionPanel>
        </div>
        <div v-else>
            No summary found
        </div>
    </div>

</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import services from '@Services/services.js';
import { useRoute } from "vue-router";
import moment from 'moment';
import ExpansionPanel from '@Components/utils/ExpansionPanel.vue'

const route = useRoute();
const tag = route.params.id;
const summaries = ref([]);
const periodicity = ref('MONTH');
const loading = ref(false);



const loadAiSummary = async () => {
    loading.value = true;
    if (tag) {
        const api = `customer/establishment/summaries?tag=${tag}&periodicity=${periodicity.value}`;
        try {
            const response = await new Promise((resolve) => {
                services.get_Record(api, (response) => {
                    resolve(response);
                });
            });
            if (response.status === 200 && response.data) {
                addNewKeyToDisplayDate(response.data)
            } else {
                console.error('Error fetching summaries:', response);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    } else {
        console.error("Tag not found !!!")
    }

    loading.value = false
};

const formatOverview = (overview) => {
    return overview.replace(/\n/g, "<br>");
};

const isActiveMonth = ref(true);
const handleToggleMonth = () => {
    isActiveMonth.value = true
    periodicity.value = 'MONTH'
    loadAiSummary()
    // router.push({ name: 'EstablishmentList', params: { tag: customerTag.value } })
    //     .catch(err => console.error(err));
}

const handleToggleYear = () => {
    isActiveMonth.value = false
    periodicity.value = 'YEAR'
    loadAiSummary()
    // router.push({ name: 'LeadgenAdvantage', params: { tag: customerTag.value } })
    //     .catch(err => console.error(err));
}

const addNewKeyToDisplayDate = (data) => {

    data.forEach(item => {

        if (item.periodicity === 'MONTH') {
            item.date_to_display = `of ${moment(item.datefrom).format('MMMM YYYY')}`
        }

        else if (item.periodicity === 'YEAR') {
            item.date_to_display = `of ${moment(item.datefrom).format('YYYY')}`
        }
    })

    summaries.value = data

}

const filteredSummary = computed(() => {
    return summaries.value.slice(1)
})

onMounted(async () => {
    loadAiSummary()
});


</script>

<style scoped>
.summary-card h2,
.summary-card span {
    font-weight: bold;
    margin-bottom: 1.5rem;
}

.summary-card {
    border: 1px solid #ddd;
    padding: 20px;
    margin-bottom: 20px;
    border-radius: 10px;
}

.toggle-container {
    display: flex;
    align-items: center;
    justify-content: center;
}

.toggle-switch {
    display: flex;
    background-color: #f0f0f0;
    border-radius: 15px;
    overflow: hidden;
    width: 130px;
    height: 40px;
    cursor: pointer;
    position: relative;
    transition: background-color 0.3s;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.382);
    border: solid 1px var(--light-color-bg2);
}

.toggle-option {
    width: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    font-weight: 700;
    color: #888;
    transition: color 0.3s;
}

.toggle-line {
    background-color: rgba(128, 128, 128, 0.049);
    width: 1px;
    height: 40px;
}

.toggle-option.selected {
    color: #fff;
}

.toggle-switch .toggle-option {
    background-color: #fff;
}

.toggle-switch.active .toggle-option.selected {
    color: white;
    font-weight: bold;
    background-color: var(--light-color-bg2);
}

p {
    font-size: 16px;
    font-family: Montserrat, sans-serif;
    text-align: justify;
}

@media screen and (max-width: 568px) {

    .toggle-switch {
        order: 1;
        margin-left: 0;
        align-self: flex-end;
    }

    .toggle-switch {
        width: 100px !important;
    }

    .toggle-option {
        font-size: 9px;
    }
}
</style>
