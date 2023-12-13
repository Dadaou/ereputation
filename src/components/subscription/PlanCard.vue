<template>
    <div v-if="name" class="plan-card" :class="active && 'active'">
        <h4>{{ name }}</h4>
        <h3 v-if="premium">Let's Talk!</h3>
        <h2 v-else>{{ devise }}{{ fprice }}<span>/month</span></h2>
        <ul>
            <li v-if="hasinput">
                <input v-model="enumber" type="number" name="enumber" min="0"> establishment(s)
            </li>
            <li v-if="hasinput">+ {{ addprice }} {{ devise }} per additionnal establishment</li>
            <li v-for="item in items" :key="item">{{ item }}</li>
        </ul>
        <button v-if="premium" class="btn btn-primary-2" style="margin-top: 12px; border-radius: 8px;">Contact our
            team</button>
    </div>
</template>
<script setup>
import { ref, watch } from 'vue';
const props = defineProps({
    name: {
        type: String,
        required: false,
        default: ""
    },
    active: {
        type: Boolean,
        required: false,
        default: false
    },
    price: {
        type: Number,
        required: false,
        default: 0
    },
    devise: {
        type: String,
        required: false,
        default: "$"
    },
    addprice: {
        type: Number,
        required: false,
        default: 0
    },
    hasinput: {
        type: Boolean,
        required: false,
        default: false
    },
    items: {
        type: Array,
        required: false,
        default: () => []
    },
    premium: {
        type: Boolean,
        required: false,
        default: false
    }
})
const fprice = ref(props.price);
const enumber = ref(0);

watch(enumber, () => {
    fprice.value = Math.round((((enumber.value * props.addprice) + props.price) + Number.EPSILON) * 100) / 100;
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
    min-width: 280px;
    height: 532px;
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

.plan-card ul li {
    font-size: 14px;
    font-weight: 500;
    color: #444;
    display: inline-block;
    margin-block: 8px;
}

.plan-card ul li input {
    width: 60px;
}

.plan-card ul li::before {
    content: "\2714   ";
}
</style>
