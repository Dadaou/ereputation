<template>
    <div v-if="data.name" class="plan-card">
        <h4>{{ data.name }}</h4>
        <h3 v-if="data.amount == '0'">Let's Talk!</h3>
        <h2 v-else>{{ data.currency }}{{ fprice }}<span>/{{ data.periodicity }}</span></h2>
        <ul class="grid">
            <li v-if="data.additional_establishment != '0'">
                <input v-model="enumber" type="number" name="enumber" min="1"> establishment(s)
            </li>
            <li v-if="data.additional_establishment != '0'">+ {{ data.additional_establishment }} {{ data.currency }} per
                additionnal establishment</li>
            <li>1 establishement (1 QR CODE by establishment)</li>
            <li>Illimited intern reviews</li>
            <li>Illimited leads</li>
            <li>{{ data.event_limit || 'Illimited' }} events</li>
            <li>{{ data.pointofsale_limit || 'Illimited' }} monitored points of sale (1 QR Code by point of sale)</li>
            <li v-if="data.crm">Leads integration in your CRM</li>
            <li v-if="data.sale">Sales integration (API)</li>
        </ul>
        <button v-if="data.amount == '0'" class="selection-btn btn btn-primary-2"
            style="margin-top: 12px; border-radius: 8px;" @click="() => emitEvent(data)">Contact
            our
            team</button>
        <button v-else-if="data.additional_establishment != '0'" class="selection-btn btn btn-danger-o"
            style="margin-top: 12px; border-radius: 8px;" @click="() => emitEvent(data, enumber)">Get {{ data.name
            }}</button>
        <button v-else class="selection-btn btn btn-danger-o" style="margin-top: 12px; border-radius: 8px;"
            @click="() => emitEvent(data)">Get {{ data.name
            }}</button>
    </div>
</template>
<script setup>
import { ref, watch } from 'vue';
const props = defineProps({
    data: {
        type: Object,
        required: true,
    }
})

const emits = defineEmits(['selected']);
const fprice = ref(parseFloat(props.data.amount));
const enumber = ref(2);

const emitEvent = (data, eNumber) => {
    if (props.hasinput && eNumber == 0) {
        alert("Please add the number of establishments.");
    } else {
        emits('selected', data, eNumber, fprice.value);
    }
}

watch(enumber, () => {
    fprice.value = Math.round(((((enumber.value - 1) * parseFloat(props.data.additional_establishment)) + parseFloat(props.data.amount)) + Number.EPSILON) * 100) / 100;
})
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
    min-width: 340px;
    height: 600px;
}

.plan-card:hover {
    transition: transform .3s ease-in-out;
    transform: scale(1.115);
}

.plan-card.active {
    transition: transform .3s ease-in-out;
    transform: scale(1.115);
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
    font-size: 14px;
    font-weight: 500;
    color: #444;
    display: inline-block;
    margin-block: 8px;
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
