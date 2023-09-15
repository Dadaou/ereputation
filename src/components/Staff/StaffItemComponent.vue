<template>
    <div class="staff__list">
        <div class="staff__card" v-if="staffs.length>0" v-for="staff in staffs">
            <h5>{{ staff.firstname }} <span v-if="staff.lastname != null">{{ staff.lastname }}</span></h5>
            <ul>
                <li class="Gender">
                <span class="label">Gender: </span> <i :class="['uil', (staff.gender=='M'&& staff.gender!='F' && staff.gender!='O')?'uil-mars':'', (staff.gender=='F'&& staff.gender!='M' && staff.gender!='O')?'uil-venus':'']"> </i>
                </li>

                <li><span class="label">Department: </span> <span>{{ staff.department }}</span></li>
                <li class="period"><span class="label">Period: </span> <span>{{ moment(staff.datefrom).format('DD MMMM YYYY') }}</span> <span v-if="staff.dateto != null">{{ `to ${moment(staff.dateto).format('DD MMMM YYYY')}` }}</span></li>
            </ul>
        </div>
    </div>
    <div v-if="staffs.length==0">No staff</div>
</template>
<script setup>
import {ref, inject} from 'vue';
import moment from 'moment';
const staffs = inject('staffs');
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