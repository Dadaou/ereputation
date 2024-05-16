<template>
    <a class="gate__link" :href="item.href" target="_blank">
        <Icon v-if="!item.logo && icon" :icon="icon" class="mb-2" width="24px" color="grey" />
        <img v-if="item.logo && item.logo.length > 0" :src="item.logo[0]" class="gate__logo">
        <h4 class="mb-1">{{ item.label }}</h4>
    </a>
</template>
<script setup>
import { Icon } from '@iconify/vue';
import { computed } from 'vue';

const props = defineProps({
    item: {
        type: Object,
        required: true,
    },
    type: {
        type: String,
        required: true,
    }
})

const icon = computed(() => {
    switch (props.type) {
        case 'Platform':
            return 'uil:external-link-alt';

        case 'Social':
            return 'ion:share-social'

        case 'Staff':
            return 'material-symbols:frame-person'

        case 'Unit':
            return 'mdi:service-toolbox'

        case 'Establishment':
            return 'carbon:home'

        default:
            return null
    }
})

</script>
<style scoped>
.gate__link {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 140px;
    height: 140px;
    border-radius: 5px;
    /* box-shadow: rgba(149, 157, 165, 0.2) 0px 4px 12px; */
    border: 1px solid rgba(220, 220, 220, 1);
    cursor: pointer;
    padding: 8px;
    transition: all .5s linear;
}

.gate__link:hover {
    transform: scale(1.12);
    border: 1px solid var(--color-primary);
    transition: all .5s ease-out;

}

.gate__link h4 {
    font-size: .8rem;
    /* color: var(--color-primary); */
    text-transform: uppercase;
    text-align: center;
}

.gate__link span {
    font-size: .65rem;
    color: rgba(120, 160, 160, 1)
}

.gate__logo {
    height: 70%;
    margin-bottom: 8px;
    border-radius: 6px;
    box-shadow: -1px -2px 2px 0 rgba(97, 94, 94, 0.2);
}

@media screen and (max-width:600px) {
    .gate__link h4 {
        font-size: .7rem !important;
        font-weight: 500;
    }

    .gate__link span {
        font-size: .7rem !important;
        font-weight: 500;
    }
}
</style>