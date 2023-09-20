<template>
    <div class="security__header border__bottom">
        <div class="security__edit">
            <h4><i class="uil uil-users-alt"></i> Staff List</h4>
        </div>
    </div>
    <div class="mt-5">
        <el-table :data="filterTableData" style="width: 100%">
            <el-table-column label="Period" prop="period" />
            <el-table-column label="Name" prop="name" />
            <el-table-column label="Gender" prop="gender"/>
            <el-table-column label="Establishment" prop="establishment_name"/>
            <el-table-column label="Department" prop="department"/>
            
            <el-table-column align="right">
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
  import { useStaffStore } from "@Stores/staff.js"; 
  import { useCompanyStore } from "@Stores/company.js";
  
  const emit = defineEmits(['edit']);
  const userStore = useUserStore();
  const staffStore = useStaffStore();
  const companiesStore = useCompanyStore();

  let tableData = computed(()=>{
    let establishments = userStore.user.customer !=null ? userStore.user.customer.establishments: [];
    let data = []; 
    establishments.forEach(establishment => {
      let staffs = establishment.staff;
      staffs.forEach(staff_item => {

        let staff = {
          period: staff_item.dateto!=null?`${moment(staff_item.datefrom).format('YYYY MMM DD')} to ${moment(staff_item.dateto).format('YYYY MMM DD')}`:`${moment(staff_item.datefrom).format('YYYY MMM DD')} to -`,
          datefrom : staff_item.datefrom,
          dateto: staff_item.dateto,
          department: staff_item.department,
          establishment_name: establishment.name,
          establishment: staff_item.establishment,
          name: `${staff_item.firstname} ${staff_item.lastname}`,
          gender: staff_item.gender,
          firstname: staff_item.firstname,
          lastname: staff_item.lastname,
          id: staff_item.id,
        }
        data.push(staff);
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

  const reloadData = (staff)=>{
    if(userStore.user.customer != null){
        userStore.user.customer.establishments.forEach((element, index) => {
            if(`/api/${companiesStore.entity}/${element.id}` == staff.establishment){
              userStore.user.customer.establishments[index].staff= userStore.user.customer.establishments[index].staff.filter(item=>item.id !== staff.id);
            }
        });
    }
  }

  const handleEdit = (index, staff) => {
   emit('edit', staff);
  }

  const handleDelete = async(index, staff) => {
   await staffStore.removeStaff(staff.id, (response)=>{
    if(response.status == 204){
      reloadData(staff);
    }
   })
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
  