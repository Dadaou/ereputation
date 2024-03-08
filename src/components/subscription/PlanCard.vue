<template>
    <div v-if="data.name" class="plan-card">
        <h4>{{ data.name }}</h4>
        <h3 v-if="data.amount == '0'">Let's Talk!</h3>
        <h2 v-else>{{ data.currency }}{{ fprice }}<span>/{{ data.periodicity }}</span></h2>
        <ul class="grid">
            <li v-if="data.name.toLowerCase().includes('business')">All yours establishments</li>
            <li v-if="data.additional_establishment != '0' && !data.name.toLowerCase().includes('business')">
                <input v-model="enumber" type="number" name="enumber" min="1"> establishment(s)
            </li>
            <li v-if="data.additional_establishment != '0'">+ {{ data.additional_establishment }} {{ data.currency }} per
                additionnal establishment</li>
            <li>1 establishement (1 QR CODE by establishment)</li>
            <li v-if="data.name.toLowerCase().includes('business')">Adjustable reviews limit</li>
            <li v-else>{{ data.review_limit || 'Illimited' }} Reviews / Year</li>
            
            <li v-if="data.name.toLowerCase().includes('business')">Adjustable leads limit</li>
            <li v-else>{{ data.contact_limit || 'Illimited' }} leads</li>
            
            <li v-if="data.name.toLowerCase().includes('business')">Adjustable events limit</li>
            <li v-else>{{ data.event_limit || 'Illimited' }} events</li>
            
            <li v-if="data.name.toLowerCase().includes('business')">Adjustable #hashtag limit</li>
            <li v-else>{{ data.hashtag_limit || 'Illimited' }} monitored #hashtag</li>
            
            <li v-if="data.name.toLowerCase().includes('business')">Adjustable points of sale limit</li>
            <li v-else>{{ data.pointofsale_limit || 'Illimited' }} monitored points of sale (1 QR Code by point of sale)</li>
            
            <li v-if="data.name.toLowerCase().includes('business')">Adjustable monitored sources</li>
            <li v-else>{{ data.provider_limit || 'Illimited' }} monitored sources</li>
            
            <li v-if="data.name.toLowerCase().includes('business')">Adjustable number of reviews categorization</li>
            <li v-else>{{ data.category_limit || 'Illimited' }} reviews categorization</li>
            
            <li v-if="data.name.toLowerCase().includes('business')">Adjustable monitored competitors</li>
            <li v-else>{{ data.competitor_limit || 'Illimited' }} reviews categorization</li>
            
            <li v-if="data.name.toLowerCase().includes('basic')">Standard forms</li>
            <li v-else>Custom forms</li> 

            <li v-if="!data.name.toLowerCase().includes('basic')">Reviews history</li>
            
            <li v-if="data.crm && data.name.toLowerCase().includes('business')">Leads integration in your CRM</li>
            <li v-if="data.sale && data.name.toLowerCase().includes('business')">Sales integration (API)</li>
        </ul>
        <button v-if="data.amount == '0'" class="selection-btn btn btn-primary-2"
            style="margin-top: 20px; border-radius: 8px;" @click="() => emitEvent(data)">Contact
            our
            team</button>
        <button v-else-if="data.additional_establishment != '0'" class="selection-btn btn btn-danger-o"
            style="margin-top: 20px; border-radius: 8px;" @click="() => emitEvent(data, enumber)">Get {{ data.name
            }}</button>
        <button v-else class="selection-btn btn btn-danger-o" style="margin-top: 20px; border-radius: 8px;"
            @click="() => emitEvent(data)">Get {{ data.name
            }}</button>
    </div>
</template>
<script setup>
import { ref, watch, onMounted, computed } from 'vue';
const props = defineProps({
    data: {
        type: Object,
        required: true,
    }
})

console.log(props.data)

const emits = defineEmits(['selected']);
const fprice = ref(parseFloat(props.data.amount));
const enumber = ref(1);

const emitEvent = (data, eNumber) => {
    if (props.hasinput && eNumber == 0) {
        alert("Please add the number of establishments.");
    } else {
        emits('selected', data, eNumber, fprice.value);
    }
}

// onMounted(() => {
//     setTimeout(() => { enumber.value = 2; }, 500);
// })

watch(enumber, () => {
    fprice.value = Math.round(((((enumber.value - 1) * parseFloat(props.data.additional_establishment)) + parseFloat(props.data.amount)) + Number.EPSILON) * 100) / 100;
});
</script>
<style>
.plan-card {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    text-align: center;
    box-shadow: rgba(149, 157, 165, 0.2) 2px 4px 16px;
    flex-basis: 150px;
    padding: 38px;
    border-radius: 10px;
    border-radius: 12px;
    border: 1px outset rgba(149, 157, 165, 0.1);
    transition: transform .3s ease-in-out;
    transform: scale(1);
    cursor: pointer;
    min-width: 360px;
    height: 670px;
}

.plan-card:hover {
    transition: transform .3s ease-in-out;
    transform: scale(1.05);
}

.plan-card.active {
    transition: transform .3s ease-in-out;
    transform: scale(1.05);
}

.plan-card h4 {
    font-weight: 500;
    font-size: 18px;
    color: var(--color-black2);
    height: 31px;
}

.plan-card h2 {
    font-weight: 800;
    font-size: 38px;
    color: var(--color-danger);
    margin-block: 24px;
}

.plan-card h3 {
    font-weight: 700;
    font-size: 32px;
    color: var(--color-primary);
    margin-block: 42px 32px;
}

.plan-card h2 span {
    font-size: 18px;
}

.plan-card ul {
    list-style-image: url('sqpurple.gif');
    text-align: left;
    justify-self: flex-start;
}

.plan-card input[type=number] {
    border: none;
    padding: 0;
    width: 32px;
}

.plan-card input[type=number]::-webkit-inner-spin-button {
    opacity: 1;
}

.plan-card ul li {
    font-size: 13px;
    font-weight: 500;
    color: #444;
    display: inline-block;
    margin-block: 3px;
}

.plan-card ul li::before {
    content: "\2714   ";
}

.plan-card .selection-btn {
    position: absolute;
    bottom: 24px;
    width: calc(100% - 76px);
}
</style>
