<template>
    <div class="security__header border__bottom">
        <div class="security__edit">
            <h4><i class="uil uil-calender"></i> Event List</h4>
        </div>
    </div>
    <div class="mt-5 erep_table">
        <el-table :data="filterTableData" style="width: 100%">
            <el-table-column fixed label="Name" prop="name" width="150"/>
            <el-table-column label="Category" prop="category" width="150"/>
            <el-table-column label="Establishment" prop="establishmentName" width="250"/>
            <el-table-column label="Date" prop="date" width="250"/>
            <el-table-column fixed="right" label="Operations" width="150">
                <template #header>
                <el-input v-model="search" size="small" placeholder="Type to search" />
                </template>
                <template #default="scope">
               <el-popconfirm 
                  title="Are you sure to delete this?"  
                  @confirm="handleDelete(scope.$index, scope.row)">
                    <template #reference>
                      <el-button
                        size="small"
                        ><i class="uil uil-trash-alt"></i></el-button>
                    </template>
                  </el-popconfirm>
                 
                <el-button size="small" @click="handleEdit(scope.$index, scope.row)"
                    ><i class="uil uil-edit"></i></el-button>
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
  import { ElMessage } from 'element-plus';
  

  const emit = defineEmits(['edit']);
  const userStore = useUserStore();
  const eventStore = useEventStore();
  const companiesStore = useCompanyStore();

  const getEstablishmentsName = (data)=>{
    let establishments = userStore.user.customer !=null ? companiesStore.establishments: [];
    let names = ''; 
    data.forEach(item=>{
        establishments.forEach(establishment=>{
          if(item.id==establishment.id){

            if(names != ''){
              names = `${names}, ${establishment.name}`;
            }else{
              names = `${names} ${establishment.name}`;
            }
          }
        })
    })
    return names;
  }

  const getURI = (data, entity, dataset)=>{
    let uris = [];
    data.forEach(item=>{
        dataset.forEach(item_data=>{
          if(item.id==item_data.id){
            const uri = `/api/${entity}/${item.id}`;
            const exists = uris.some(item => item === uri);
            if(exists == false)  uris.push(uri);
          }
        })
    })

    return uris;
  }

  let tableData = computed(()=>{
    let establishments = userStore.user.customer !=null ? companiesStore.establishments: [];
    let data = []; 
    establishments.forEach(establishment => {
      let events = establishment.events;
      events.forEach(event_item => {
        let event = {
          id: event_item.id,
          name: event_item.name,
          category: event_item.category,
          datefrom: event_item.datefrom,
          dateto: event_item.dateto,
          establishmentName : getEstablishmentsName(event_item.establishment),
          event_establishment: getURI(event_item.establishment, 'establishments', establishments),
          establishment: event_item.establishment,
          date: `${moment(event_item.datefrom).format('YYYY-MM-DD')} to ${moment(event_item.dateto).format('YYYY-MM-DD')}` 
        }
        const exists = data.some(item => item.id === event.id);
        if(exists == false) data.push(event);
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

  const reloadData = (event)=>{
    if(userStore.user.customer != null){
      event.establishment.forEach(item =>{
         companiesStore.establishments.forEach((element, index) => {
            if(element.id == item.id){
              companiesStore.establishments[index].events= companiesStore.establishments[index].events.filter(value=>value.id !== event.id);
            }
        });
      })
    }
  }
  const handleEdit = (index, event) => {
    emit('edit', event);
  }
  const handleDelete = async(index, event) => {
     await eventStore.removeEvent(event.id, (response)=>{
      console.log(response)
      if(response.status == 204){
        reloadData(event);
         ElMessage({
                    message: `Event removed successfully.`,
                    type: 'success',
                  });
      }
     })
  };
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
  