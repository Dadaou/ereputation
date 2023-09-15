<template>
    <div class="staff__list">
        <div class="staff__card" v-if="events.length>0" v-for="event in events">
            <h5>{{ event.name }}</h5>
            <ul>
                <li><span class="label">Category: </span> <span>{{ event.category }}</span></li>
                <li class="period"><span class="label">Period: </span> <span>{{ moment(event.datefrom).format('DD MMMM YYYY') }}</span> <span v-if="event.dateto != null">{{ `to ${moment(event.dateto).format('DD MMMM YYYY')}` }}</span></li>
            </ul>
        </div>
    </div>
    <div v-if="events.length==0">No Event</div>
</template>
<script setup>
import {ref, inject} from 'vue';
import moment from 'moment';
const events = inject('events');
</script>
<style scoped>
@tailwind base;
@tailwind components;
@tailwind utilities;

.staff__list{
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
}

.staff__card{
    border: 1px solid var(--light-color-bg2);
    padding: 5px;
    flex-basis: 400px;
    flex-grow: 1;
    box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
    border-radius: 5px;
}

.staff__card h5{
    color: var(--color-primary);
}

.uil-mars{
    color: blue;
}

.uil-venus{
    color: pink;
}

span{
    font-size: 14px;
    color: var(--color-bg2);
}
span.label{
    color: var(--color-bg1);
    font-size: 14px;
}


</style>