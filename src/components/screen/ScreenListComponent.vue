<template>
  <div class="mt-5 table__container">
    <div class="table-description" style="margin-bottom: 16px;">
      <p></p>
      <div>
        <el-input v-model="search" size="small" placeholder="Type to search" class="input_searchs" />
      </div>
    </div>
    <el-table :data="filterTableData" class="responsive-table">
      <el-table-column label="Name" prop="name" align="center" style="width: 5%; min-width: 200px;" />
      <el-table-column label="Establishment" prop="establishment_name" align="center"
        style="width: 5%; min-width: 400px;" />
      <el-table-column label="Screen Template" prop="screentemplate_name" align="center"
        style="width: 10%; min-width: 4%;" />
      <el-table-column label="Advantages" align="left" style="width: 40%; min-width: 400px;">
        <template #default="scope">
          <div v-if="scope.row.advantages && scope.row.advantages.length > 0">
            <div v-for="adv_screen, index in scope.row.advantages" :key="adv_screen">
              <el-tooltip placement="left">
                <template #content> See this advantage </template>
                <div
                  @click="setAdvantageScreenProps(adv_screen), showModal = true, screen_id = scope.row, type = 'edit', advantage_selected = ['/api/advantages/' + adv_screen.adv_id], advantage_screen_selected = { id: adv_screen.adv_id, name: adv_screen.adv_name, advantage_screen: adv_screen.id }"
                  v-if="adv_screen != ''" class="advantage_screen_list-container">

                  <span v-if="index == scope.row.advantage_names.split(',').length - 1" class="advantage_screen_list">{{
                    adv_screen.adv_name }}
                  </span>
                  <span v-else class="advantage_screen_list">{{
                    adv_screen.adv_name }} ,
                  </span>

                </div>
              </el-tooltip>
            </div>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="Actions" style="width: 20%; min-width: 200px;text-align: center;" align="right">
        <template #default="scope">
          <el-button style="margin-left: 2px;" size="small" @click="handleSee(scope.row.id, scope.row)"><i
              class="uil uil-presentation"></i></el-button>
          <el-button style="margin-left: 2px;" size="small" @click="showModal = true, screen_id = scope.row"><i
              class="uil uil-plus-circle"></i></el-button>
          <el-button style="margin-left: 2px;" size="small" @click="handleEdit(scope.$index, scope.row)"><i
              class="uil uil-edit"></i></el-button>
          <el-popconfirm title="Are you sure to delete this?" @confirm="handleDelete(scope.$index, scope.row)">
            <template #reference>
              <el-button style="margin-left: 2px;" size="small"><i class="uil uil-trash-alt"></i></el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <ScreenAdvantageModalComponent :screen="screen_id" :advantages="advantages" :showModal="showModal"
    @close="showModal = false" class="responsive-modal" />
</template>

<script setup>
import { computed, ref, provide, inject, defineAsyncComponent, onBeforeMount } from 'vue';
import { ElMessage, ElTable, ElTableColumn, ElPopconfirm, ElButton, ElInput, ElTooltip } from 'element-plus';
import 'element-plus/es/components/message/style/css'
import 'element-plus/es/components/table/style/css'
import 'element-plus/es/components/table-column/style/css'
import 'element-plus/es/components/popconfirm/style/css'
import 'element-plus/es/components/button/style/css'
import 'element-plus/es/components/input/style/css'
import services from '@Services/services.js';
import { useRoute, useRouter } from "vue-router";

const ScreenAdvantageModalComponent = defineAsyncComponent(() =>
  import('@Components/utils/ScreenAdvantageModalComponent.vue')
)

const showModal = ref(false);

const emit = defineEmits(['edit']);

const screens = inject('screens')
const advantage_screen_selected = ref(null);
const advantage_selected = ref([]);
const advantages = inject('advantages');
provide('advantage', advantage_selected);
provide('advantage_screen_selected', advantage_screen_selected)
const screen_id = ref(null);
console.log(screen_id)
const type = ref('add');
provide('type', type);

const date_from = ref('');
provide('date_from', date_from);
const date_to = ref('');
provide('date_to', date_to);
const category = ref('');
provide('category', category);
const advantage_screen = ref({
  d0: false,
  d1: false,
  d2: false,
  d3: false,
  d4: false,
  d5: false
});
provide('advantage_screen', advantage_screen);

const hour_from = ref();
provide('hour_from', hour_from);
const minute_from = ref();
provide('minute_from', minute_from);
const seconde_from = ref();
provide('seconde_from', seconde_from);
const hour_to = ref();
provide('hour_to', hour_to);
const minute_to = ref();
provide('minute_to', minute_to);
const seconde_to = ref();
provide('seconde_to', seconde_to);


const setAdvantageScreenProps = (_adv_screen) => {
  date_from.value = _adv_screen.date_from;
  date_to.value = _adv_screen.date_to;
  category.value = _adv_screen.category;
  advantage_screen.value.d0 = _adv_screen.d0;
  advantage_screen.value.d1 = _adv_screen.d1;
  advantage_screen.value.d2 = _adv_screen.d2;
  advantage_screen.value.d3 = _adv_screen.d3;
  advantage_screen.value.d4 = _adv_screen.d4;
  advantage_screen.value.d5 = _adv_screen.d5;
  advantage_screen.value.d6 = _adv_screen.d6;
  hour_from.value = _adv_screen.hour_from;
  minute_from.value = _adv_screen.minute_from;
  seconde_from.value = _adv_screen.seconde_from;
  hour_to.value = _adv_screen.hour_to;
  minute_to.value = _adv_screen.minute_to;
  seconde_to.value = _adv_screen.seconde_to;
  console.log(_adv_screen)

}

const route = useRoute();
const router = useRouter();
const handleSee = (screenId, row) => {
  const tag = route.params.tag;
  const link = router.resolve({ name: 'ScreenPage', params: { tag: tag, screen: screenId ,templates: row} });
  window.open(link.href, '_blank');
};


let tableData = computed(() => {
  let data = [];
  screens.value.forEach(screen_item => {
    let advantage_name = '';

    screen_item.advantages.forEach(adv => {
      if (advantage_name != '') {
        advantage_name = `${advantage_name}, ${adv.adv_name}`;
      } else {
        advantage_name = `${adv.adv_name}`;
      }

    });

    screen_item.advantage_names = advantage_name
    data.push(screen_item);
  })

  return data;
});

const search = ref('')
const filterTableData = computed(() => {
  let filterdata = tableData.value;
  filterdata = tableData.value.filter(
    (data) =>
      !search.value ||
      data.name.toLowerCase().includes(search.value.toLowerCase()) ||
      data.screentemplate_name.toLowerCase().includes(search.value.toLowerCase()) ||
      data.establishment_name.toLowerCase().includes(search.value.toLowerCase())
  )
  return filterdata
})

const reloadData = (screen) => {
  let data = [];
  screens.value.forEach(screen_item => {
    if (screen_item.id !== screen.id) data.push(screen_item);
  })
  screens.value = data;
}

const handleEdit = (index, screen) => {

  emit('edit', screen);
}

const handleDelete = async (index, screen) => {

  const response = await new Promise((resolve) => {
    services.deleteRecord('screens', screen.id, (response) => {
      resolve(response);

    });
  });

  if (response.status == 204) {
    reloadData(screen);
    ElMessage({
      message: `Screen removed successfully.`,
      type: 'success',
    });
  }

}
</script>
<style scoped>
button {
  border: none;
  cursor: pointer;
  font-size: 15px;
}

button i.uil-trash-alt {
  color: red !important;
}

button i.uil-edit {
  color: var(--color-danger) !important;
}

.table-description {
  display: flex;
  justify-content: space-between;
}

.table-description p {
  font-size: 14px;
  color: grey;
  font-weight: 500;
}

.responsive-table {
  width: 100%
}

.responsive-modal {
  width: 100%
}

@media screen and (max-width: 768px) {
  .responsive-table {
    width: 85%;
  }

  .input_searchs,
  .input_search {
    display: inline;
    margin-right: 7rem;
  }
}

@media screen and (max-width: 468px) {
  .input_search {
    display: inline;
    margin-right: 3.5rem;
  }

  .input_searchs {
    display: inline;
    margin-right: 9rem;
  }

  .el-table--fit {
    font-size: 11px !important;
  }

  .table-description p {
    font-size: 12px;
  }
}

@media screen and (max-width: 768px) {
  .responsive-modal {
    width: 50%;
    height: 20%;
    overflow-y: scroll;
  }

}

.advantage_screen_list {
  background: whitesmoke;

  border-radius: 8px;
  padding: 0 8px;
  cursor: pointer
}

.advantage_screen_list:hover {
  background: var(--color-danger);
  color: white;
}

el-table-column:hover .advantage_screen_list {
  background: white !important;
}
</style>