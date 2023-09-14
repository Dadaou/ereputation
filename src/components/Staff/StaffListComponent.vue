<template>
    <div class="security__header border__bottom">
        <div class="security__edit">
            <h4><i class="uil uil-users-alt"></i> Staff List</h4>
        </div>
    </div>
    <div class="mt-5">
        <el-table :data="filterTableData" style="width: 100%">
            <el-table-column label="Date" prop="date" />
            <el-table-column label="Name" prop="name" />
            <el-table-column label="Gender" prop="gender"/>
            <el-table-column label="Establishment" prop="establishment"/>
            <el-table-column label="Department" prop="department"/>
            
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
  import { computed, ref } from 'vue'
  
  const search = ref('')
  const filterTableData = computed(() =>
    tableData.filter(
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
  
  const tableData= [
    {
      date: '2016-05-03',
      name: 'Tom',
      address: 'No. 189, Grove St, Los Angeles',
    },
    {
      date: '2016-05-02',
      name: 'John',
      address: 'No. 189, Grove St, Los Angeles',
    },
    {
      date: '2016-05-04',
      name: 'Morgan',
      address: 'No. 189, Grove St, Los Angeles',
    },
    {
      date: '2016-05-01',
      name: 'Jessy',
      address: 'No. 189, Grove St, Los Angeles',
    },
  ]
</script>
<style scoped>
@tailwind base;
@tailwind components;
@tailwind utilities;

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
  