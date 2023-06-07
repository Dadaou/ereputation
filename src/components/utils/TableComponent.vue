<template>
    <div class="main__table">
            <div class="table__search">
                <i class="uil uil-search"></i>
                <input type="text" name="Search" placeholder="Recherche" v-model="searchValue">
                <i class="uil uil-times" v-show="searchValue" v-on:click="initSearch()"></i>
            </div>
            <div class="table__actions">
            <span :class="isAligned?'active':''" @click="isAligned=!isAligned"><i class="uil uil-apps"></i></span> 
            <span :class="!isAligned?'active':''" @click="isAligned=!isAligned"><i class="uil uil-align-justify"></i></span>
            <span v-if="isAdmin" class="add__user" @click="$emit('addEvent')"><i class="uil uil-user-plus"></i></span>
            </div>
            <!-- Refactoring needed -->
        </div>
        <div class="table__content">
                <slot name="content" :data="visibleData"></slot>
                <PaginationComponent
                        @updatePage="updatePage"
                        :config="paginationConfig"
                        :color="color"
                />
        </div>
</template>

<script setup>
import {ref, watch, onBeforeMount, onMounted} from 'vue'
import PaginationComponent from '@Components/utils/PaginationComponent.vue'

const emit = defineEmits(['addEvent'])
const props = defineProps({
    data:{
        type: Array,
        required: true,
    },
    isAdmin:{
        type: Boolean,
        default: false,
    }
})
const searchValue = ref('');
const all_data = ref([]);
const color = ref('#6c63ff');
const isAligned = ref(true);

watch(searchValue, () => {
    console.log(searchValue.value);
})

const initSearch = () => {
    searchValue.value = '';
}

let paginationConfig = ref({
    current:0,
    size:5,
    data: [],
    _data: [],
});

let visibleData = ref([]);

let updateVisibleData = function(_data){
    let data = paginationConfig.value;

    paginationConfig.value.data = _data.slice(data.current*data.size, (data.current * data.size) + data.size);
                
    if (paginationConfig.value.data.length == 0 && paginationConfig.value.current > 0) {
        updatePage( paginationConfig.value.current -1);
    }
    visibleData.value = paginationConfig.value.data;
}

let updatePage = function(pageNumber){
    paginationConfig.value.current = pageNumber;
    updateVisibleData(all_data.value);
}

onMounted(() => {
    all_data.value = Array.from(props.data, obj => Object.assign({}, obj));

    console.log(all_data.value);
    updateVisibleData(all_data.value);  
})

</script>

<style>
.main__table{
    /* border-top: 2px solid var(--light-color-bg2);
    border-bottom: 2px solid var(--light-color-bg2); */
    width: inherit;
    padding: 15px;
    color: var(--color-bg2);
    font-size: 15px;
    box-shadow: 0 1rem 2rem rgba(0,0,0,0.15);
    display: flex;
    justify-content: space-between;
}

/* Custom Table */
.table__title{
   font-weight: bolder; 
}


.table__search input{
    border: 1px solid var(--light-color-bg2);
    padding: 5px 30px;
    border-radius: 5px;
}

.table__search .uil-search{
    position: relative;
    right: -25px;
}

.table__search .uil-times{
    position: relative;
    left: -25px;
    cursor: pointer;
}

.table__actions span{
    padding: 6px 8px;
    margin: 5px;
    border-radius: 3px;
    transition: var(--transition);
    cursor: pointer;
}

.table__actions span.active{
    background-color: var(--light-color-bg1);
    border: 1px solid var(--light-color-bg1);
}

.table__actions span.add__user{
    background-color: var(--color-primary);
    border: 1px solid var(--color-primary);
    color: var(--color-white);
}

.table__content{
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin-top: 25px;
    font-size: 13px;
    font-weight: bolder;
    color: rgb(97, 97, 97);
}

.data__main{
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-shadow: 0 1rem 2rem rgba(0,0,0,0.08);
    margin-bottom: 10px;
    padding: 20px;
    background-color: white;
    border-radius: 8px;
    position: relative;
}

.user__main__avatar img{
    width: 28px;
    height: 25px;
    border-radius: 50%;
}

.circle{
    height: 10px;
    width: 10px;
    border-radius: 50%;
    background-color: var(--light-color-bg2);
    transition: var(--transition);
}

.user__main__avatar div{
    position: absolute;
    top: 35px;
    left: 37px;
}

.user__main__avatar .active{
    background-color: var(--color-success);
}

.data__main__info{
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 2rem;
}

.main__actions span{
    padding: 6px 8px;
    margin: 5px;
    border-radius: 3px;
    transition: var(--transition);
    cursor: pointer;
    font-size: 15px;
    font-weight: bolder;
    background-color: var(--light-color-bg1);
    border: 1px solid var(--light-color-bg1);
}

.action__edit:hover{
    background-color: var(--color-primary);
    border: 1px solid var(--color-primary);
    color: var(--color-white);
}

.action__delete:hover{
    background-color: var(--color-danger3);
    border: 1px solid var(--color-danger3);
    color: var(--color-white);
}
</style>