<template>
    <div class="security__header border__bottom">
        <div class="security__edit">
            <h4><i class="uil uil-users-alt"></i> Staff List</h4>
        </div>
    </div>
    <div class="mt-5">
        <el-table :data="filterTableData" :style="{'width': '1000px','overflow' : 'hidden' }">
            <el-table-column label="Period" prop="period" width="150"/>
            <el-table-column label="Name" prop="name" width="150"/>
            <el-table-column label="Gender" prop="gender" width="100"/>
            <el-table-column label="Establishment" prop="establishment_name" width="150"/>
            <el-table-column label="Department" prop="department" width="150"/>
            
            <el-table-column  width="200">
                <template #header>
                <el-input v-model="search" size="small" placeholder="Type to search" />
                </template>
                <template #default="scope">
                   <el-button size="small" @click="showQRCode(scope.row)"
                    ><i class="uil uil-qrcode-scan"></i></el-button>
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
    <ModalComponent :showModal="showModal" @close="showModal=false" :width="modalWidth">
        <template #content>
            <div class="modal__header">
                <div class="modal__title">
                    <h3 class="font-semibold text-gray-900 dark:text-white">
                        <i class="uil uil-qrcode-scan"></i> QR Code
                    </h3>
                </div>
                <div class="modal__close">
                    <i class="uil uil-times-circle"  @click="showModal = false"></i>
                </div>
            </div>

            <div  v-if="downloaded==false" class="establishment__review__qrcode">
                <p class="mb-5">
                    Download this QR code to link your client to the feedback page
                </p>
                <div id="qrcode__container mt-5" ref="qrcode">
                    <vue-qrious
                        class="qr__code"
                        :value="`${baseurl}/customer/${tag}/establishment/${staff.establishment_tag}/staffs/${staff.tag}/feedback`"
                        @change="onDataUrlChange"
                    />
                </div>
            </div>
            <div v-else class="establishment__review__qrcode">
                <p class="mb-5">
                    Your download is successfully complete!
                </p>
            </div>
            <div class="mt-5 download__qr_btn">
                <button v-if="
                downloaded==false" class="btn__light_secondary" @click="downloadQrcode">
                    <i class="uil uil-download-alt"></i> Download
                </button>
                <button v-else class="btn__light_secondary" @click="showModal=false, downloaded=false">
                    close
                </button>
            </div>

        </template>
    </ModalComponent>
</template>
  
<script setup>
import { computed, ref, inject } from 'vue';
import { useUserStore } from "@Stores/user.js";
import { useWindowSize } from '@vueuse/core';
import moment from 'moment';
import { useStaffStore } from "@Stores/staff.js"; 
import { useCompanyStore } from "@Stores/company.js";
import VueQrious from 'vue-qrious';
import * as htmlToImage from 'html-to-image';
import ModalComponent from '@Components/utils/ModalComponent.vue';
import { ElMessage, ElTable, ElTableColumn, ElPopconfirm, ElButton, ElInput } from 'element-plus';
import 'element-plus/es/components/message/style/css'
import 'element-plus/es/components/table/style/css'
import 'element-plus/es/components/table-column/style/css'
import 'element-plus/es/components/popconfirm/style/css'
import 'element-plus/es/components/button/style/css'
import 'element-plus/es/components/input/style/css'
  
  const emit = defineEmits(['edit']);
  const userStore = useUserStore();
  const staffStore = useStaffStore();
  const companiesStore = useCompanyStore();
  const baseurl = window.location.origin;
  const showModal = ref(false);
  const downloaded = ref(false);
  const staff = ref(null);
  const { width, height } = useWindowSize()
  const modalWidth= computed(()=>{
    let windowSize = 1500;
    let gap = (windowSize - width.value)/19;
    return gap + 35;
  })
  const staffs = inject('staffs')
  const tag = inject('tag');

  let tableData = computed(()=>{
    let establishments = userStore.user.customer !=null ? companiesStore.establishments: [];
    let data = []; 
    staffs.value.forEach(staff_item=>{
      staff_item['period'] = staff_item.dateto!=null?`${moment(staff_item.datefrom).format('YYYY MMM DD')} to ${moment(staff_item.dateto).format('YYYY MMM DD')}`:`${moment(staff_item.datefrom).format('YYYY MMM DD')} to -`;
       console.log(staff_item) 
       data.push(staff_item);
    })
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
    let data = [];
    staffs.value.forEach(staff_item=>{
      if(staff_item.id !== staff.id) data.push(staff_item);
    })
    staffs.value = data;
  }

  const handleEdit = (index, staff) => {
   emit('edit', staff);
  }

  const handleDelete = async(index, staff) => {
   await staffStore.removeStaff(staff.id, (response)=>{
    console.log(response)
    if(response.status == 204){
      reloadData(staff);
        ElMessage({
          message: `Staff removed successfully.`,
          type: 'success',
        });
    }
   })
  }
  const showQRCode = (value)=>{
    staff.value=value;
    showModal.value =true;
  }
  const base64Image = ref(null);
  const qrcode = ref(null);
  const downloadQrcode = ()=>{
    let link = document.createElement('a');
    link.download = `${staff.value.name}-feedback-link.jpeg`;
    link.href = base64Image.value;
    link.click();
    downloaded.value = true;
}

const onDataUrlChange = (dataUrl) =>{
      base64Image.value = dataUrl;
};
  
</script>
<style scoped>
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

.modal__header{
    display: flex;
    justify-content: space-between;
}

.modal__header div{
    align-self: center;
}

.modal__close i{
   float: right;
   font-size: 25px;
   color: red;
   cursor: pointer;
   transition: var(--transition);
}

.establishment__review__qrcode p{
    font-size: 15px;
    font-weight: 500;
    color: var(--color-bg2);
}

.download__qr_btn{
    display: flex;
    justify-content: center;
}

.download__qr_btn button{
    flex-basis: 50%;
}

.qr__code{
    width: 35% !important;
    padding: 50px auto !important;
    margin: auto;
}
.modal__close i:hover{
    transform: rotate(360deg);
}
  </style>
  