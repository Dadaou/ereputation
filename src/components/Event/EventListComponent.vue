<template>
    <div class="security__header border__bottom">
        <div class="security__edit">
            <h4><i class="uil uil-calender"></i> Event List</h4>
        </div>
    </div>
    <div class="mt-5">
        <el-table :data="filterTableData" style="width: 100%">
            <el-table-column label="Name" prop="name" />
            <el-table-column label="Category" prop="category"/>
            <el-table-column label="Establishment" prop="establishment"/>
            <el-table-column label="Date" prop="date" />
            <el-table-column align="right">
                <template #header>
                <el-input v-model="search" size="small" placeholder="Type to search" />
                </template>
                <template #default="scope">
                <el-button size="small" @click="handleEdit(scope.$index, scope.row)"
                    >Edit</el-button
                >
                <el-button
                    size="small"
                    type="danger"
                    @click="handleDelete(scope.$index, scope.row)"
                    >Delete</el-button
                >
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>
  
<script setup>
  import { computed, ref } from 'vue';
  import { useUserStore } from "@Stores/user.js";
  import moment from 'moment';
  import { useEventStore } from "@Stores/event.js"; 
  import { useCompanyStore } from "@Stores/company.js";
  

  const emit = defineEmits(['edit']);
  const userStore = useUserStore();
  const eventStore = useEventStore();
  const companiesStore = useCompanyStore();


  let tableData = computed(()=>{
    let establishments = userStore.user.customer !=null ? userStore.user.customer.establishments: [];
    let data = []; 
    establishments.forEach(establishment => {
      let events = establishment.events;
      events.forEach(event_item => {
        console.log(event_item);
        let event = {
          id: event_item.id,
          name: event_item.name,
          category: event_item.category,
          datefrom: event_item.datefrom,
          dateto: event_item.dateto,
          establishment: event_item.establishment,
          date: `${moment(event_item.datefrom).format('YYYY-MM-DD')} to ${moment(event_item.dateto).format('YYYY-MM-DD')}` 
        }
        data.push(event);
      });
    });
    return data;
  });
  const search = ref('')
  const filterTableData = computed(() =>
    tableData.value.filter(
      (data) =>
        !search.value ||
        data.name.toLowerCase().includes(search.value.toLowerCase())
    )
  )
  const handleEdit = (index, row) => {
    console.log(index, row)
  }
  const handleDelete = (index, row) => {
    console.log(index, row)
  }
</script>
<style scoped>
@tailwind base;
@tailwind components;
@tailwind utilities;

button{
  border: none;
  cursor: pointer;
  font-size: 15px;
}

button i.uil-trash-alt{
  color: var(--color-danger) !important;
}

button i.uil-edit{
  color: var(--color-primary) !important;
}
.security__header {
    display: flex;
    justify-content: space-between;
}

.security__header h4 {
    color: var(--color-bg2);
    font-size: 19px;
    font-weight: bold;
}

.security__header p {
    font-size: 15px;
    margin: 8px 0;
}
  </style>
  