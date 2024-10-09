<template>
    <div v-if="item.label || item.logo || logoSrc" @click="handleClick">
        <a class="gate__link" :href="item.document || item.href" target="_blank" rel="noopener noreferrer">
            <!-- <Icon v-if="!item.logo && icon" :icon="icon"  :alt="`${item.label} logo`" class="mb-2" width="24px" color="grey" /> -->
            <img v-if="!item.logo && icon" :src="appStore.account.brand === 'LinkyStar' ? qrlinkystarLogo : appStore.account.logo"
                :class="appStore.account.brand === 'LinkyStar' ? 'gate__logo__linkystar' : 'gate__logo'">
            <img v-if="item.logo && item.logo.length > 0" :src="item.logo" class="gate__logo">
            <img v-if="logoSrc" :src="logoSrc" :alt="`${item.label} logo`" class="gate__logoSrc">
            <h4 v-else class="mb-1">{{ item.label }}</h4>
        </a>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue';
import { computed } from 'vue';
import { useAppStore } from "@Stores/app.js"
import qrlinkystarLogo from '@/assets/images/logo/qrlinkystar.png';
const appStore = useAppStore();

const emits = defineEmits(['click']);

const handleClick = () => {
    emits('click')
};





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
        case 'staff':
            return 'material-symbols:frame-person'

        case 'Unit':
            return 'mdi:service-toolbox'

        case 'Establishment':
            return 'carbon:home'

        default:
            return null
    }
})

const logoSrc = computed(() => {
    if (props.type === 'Social') {
        if (props.item.href.includes('facebook.com')) {
            return new URL('@/assets/images/logo/Facebook.svg', import.meta.url).href;
        } else if (props.item.href.includes('instagram.com')) {
            return new URL('@/assets/images/logo/Instagram.svg', import.meta.url).href;
        } else if (props.item.href.includes('x.com')) {
            return new URL('@/assets/images/logo/Twitter.svg', import.meta.url).href;
        } else if (props.item.href.includes('tiktok.com')) {
            return new URL('@/assets/images/logo/Tiktok.svg', import.meta.url).href;
        } else if (props.item.href.includes('linkedin.com')) {
            return new URL('@/assets/images/logo/LinkedIn.svg', import.meta.url).href;
        } else if (props.item.href.includes('youtube.com')) {
            return new URL('@/assets/images/logo/Youtube.svg', import.meta.url).href;
        }
    }

    if (props.type === 'Platform') {
        if (props.item.href.includes('booking.com')) {
            return new URL('@/assets/images/logo/Booking.svg', import.meta.url).href;
        } else if (props.item.href.includes('camping.com')) {
            return new URL('@/assets/images/logo/Camping.png', import.meta.url).href;
        } else if (props.item.href.includes('expedia.fr')) {
            return new URL('@/assets/images/logo/Expedia.svg', import.meta.url).href;
        } else if (props.item.href.includes('google.com')) {
            return new URL('@/assets/images/logo/Google.svg', import.meta.url).href;
        } else if (props.item.href.includes('google.fr')) {
            return new URL('@/assets/images/logo/Google.svg', import.meta.url).href;
        } else if (props.item.href.includes('hotels.com')) {
            return new URL('@/assets/images/logo/Hotel.svg', import.meta.url).href;
        } else if (props.item.href.includes('maeva.com')) {
            return new URL('@/assets/images/logo/Maeva.svg', import.meta.url).href;
        } else if (props.item.href.includes('opentable.com')) {
            return new URL('@/assets/images/logo/Opentable.svg', import.meta.url).href;
        } else if (props.item.href.includes('opentable.co.uk')) {
            return new URL('@/assets/images/logo/Opentable.svg', import.meta.url).href;
        } else if (props.item.href.includes('thefork.fr')) {
            return new URL('@/assets/images/logo/Thefork.svg', import.meta.url).href;
        } else if (props.item.href.includes('thefork.com')) {
            return new URL('@/assets/images/logo/Thefork.svg', import.meta.url).href;
        } else if (props.item.href.includes('tripadvisor.com')) {
            return new URL('@/assets/images/logo/Tripadvisor.svg', import.meta.url).href;
        } else if (props.item.href.includes('tripadvisor.fr')) {
            return new URL('@/assets/images/logo/Tripadvisor.svg', import.meta.url).href;
        } else if (props.item.href.includes('tripadvisor.es')) {
            return new URL('@/assets/images/logo/Tripadvisor.svg', import.meta.url).href;
        } else if (props.item.href.includes('fr.trustpilot.com')) {
            return new URL('@/assets/images/logo/Trustpilot.svg', import.meta.url).href;
        } else if (props.item.href.includes('yelp.com')) {
            return new URL('@/assets/images/logo/Yelp.svg', import.meta.url).href;
        }
    }
    return null
})

</script>
<style scoped>
.gate__link {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 170px;
    height: 140px;
    aspect-ratio: 1/1;
    border-radius: 5px;
    /* box-shadow: rgba(149, 157, 165, 0.2) 0px 4px 12px; */
    border: 1px solid rgba(220, 220, 220, .4);
    cursor: pointer;
    padding: 8px;
    transition: all .5s linear;
    background: white;

}

.gate__link:hover {
    transform: scale(1.12);
    border: 1px solid var(--color-primary);
    transition: all .5s ease-out;
}

.gate__link h4 {
    font-size: .8rem;
    /* color: var(--color-primary); */
    /* text-transform: uppercase; */
    text-align: center;
}

.gate__link span {
    font-size: .65rem;
    color: rgba(120, 160, 160, 1)
}

.gate__logo {
    object-fit: cover;
    margin-bottom: 5px;
    border-radius: 6px;
    width: 160px;
    height: 80px;
}
.gate__logo__linkystar {
    object-fit: cover;
    margin-bottom: 5px;
    border-radius: 6px;
    width: 75%;
    height: 75%;
}
.gate__logoSrc {
    width: 100px;
    /* height: 70%; */
    margin-bottom: 5px;
    border-radius: 6px;
    object-fit: cover;
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