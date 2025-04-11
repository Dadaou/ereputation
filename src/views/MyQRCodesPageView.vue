<template>
  <div class="user__main__container">
    <el-tabs v-model="activeName" type="card" class="demo-tabs" @tab-change="changeRoute">
      <el-tab-pane label="Establishments" name="establishments">
        <ShortEstablishmentListComponent @edit="(establishment) => handleEdit(establishment, 'establishment')"
          @setEnable="(id) => setStatus(id, 'enable')" @setDisable="(id) => setStatus(id, 'disable')" />
      </el-tab-pane>
      <el-tab-pane label="Staff" name="staff">
        <ShortStaffListComponent v-if="showStaffListView" @showStaffList="handleShowStaffView" />
        <StaffFormComponent v-else @showStaffList="handleShowStaffView" />
      </el-tab-pane>
      <el-tab-pane label="Services" name="service">
        <ShortUnitListComponent v-if="showServiceListView" @showServiceList="handleShowServiceView" />
        <UnitFormComponent v-else @showServiceList="handleShowServiceView" />
      </el-tab-pane>
      <el-tab-pane label="Gates" name="gates">
        <ShortGateListComponent />
      </el-tab-pane>
      <el-tab-pane label="External URLS" name="external_url">
        <ShortUrlExternalListComponent v-if="showExternalUrlList" @showExternalUrlList="handleShowExternalUrlList" />
        <ShortUrlExternalFormComponent v-else @showExternalUrlList="handleShowExternalUrlList" />
      </el-tab-pane>
      <el-tab-pane label="Documents" name="documents">
        <ShortDocumentListComponent v-if="showDocumentList" @showDocumentList="handleShowDocumentList" />
        <ShortDocumentFormComponent v-else @showDocumentList="handleShowDocumentList" />
      </el-tab-pane>
    </el-tabs>

  </div>
</template>
<script setup>
import { ref, provide, defineAsyncComponent, onBeforeMount, watch } from 'vue';
import moment from 'moment';
import { ElTabs, ElTabPane } from 'element-plus';
import services from '@Services/services.js';
import { useUserStore } from "@Stores/user.js";
import { useAppStore } from "@Stores/app.js";
import { useWindowSize } from '@vueuse/core';
import { useRoute, useRouter } from 'vue-router';
import 'element-plus/es/components/tabs/style/css';
import 'element-plus/es/components/tab-pane/style/css';


const { width } = useWindowSize();
const route = useRoute();
const router = useRouter();

const ShortStaffListComponent = defineAsyncComponent(() =>
  import("@Components/staffs/ShortStaffListComponent.vue")
)

const UnitFormComponent = defineAsyncComponent(() =>
  import("@Components/units/UnitFormComponent.vue")
)

const StaffFormComponent = defineAsyncComponent(() =>
  import("@Components/staffs/StaffFormComponent.vue")
)

const ShortEstablishmentListComponent = defineAsyncComponent(() =>
  import("@Components/establishments/ShortEstablishmentListComponent.vue")
)

const ShortUnitListComponent = defineAsyncComponent(() =>
  import("@Components/units/ShortUnitListComponent.vue")
)

const ShortGateListComponent = defineAsyncComponent(() =>
  import("@Components/gate/ShortGateListComponent.vue")
)

const ShortUrlExternalListComponent = defineAsyncComponent(() =>
  import("@Components/url/ShortUrlExternalListComponent.vue")
)

const ShortUrlExternalFormComponent = defineAsyncComponent(() =>
  import("@Components/url/ShortUrlExternalFormComponent.vue")
)

const ShortDocumentListComponent = defineAsyncComponent(() =>
  import("@Components/url/ShortDocumentListComponent.vue")
)

const ShortDocumentFormComponent = defineAsyncComponent(() =>
  import("@Components/url/ShortDocumentFormComponent.vue")
)

const position = ref('top')
watch(width, () => {
  if (width.value < 800) {
    position.value = 'top'
  } else {
    position.value = 'right'
  }
});

const userStore = useUserStore()
const activeName = ref(null)
const activeStaffTab = ref('staff_list')
const showStaffListView = ref(true)
const showServiceListView = ref(true)
const showExternalUrlList = ref(true)
const showDocumentList = ref(true)

const establishment_to_update = ref(null)
const activeEstablishmentTab = ref('establishment_list')
provide('establishment_to_update', establishment_to_update)
provide('establishment_activeTab', activeEstablishmentTab)
const cleanEstablishmentForm = ref(false);
provide('clearEstablishmentForm', cleanEstablishmentForm)

const activeCompetitorsTab = ref('competitor_list')
provide('activeCompetitorsTab', activeCompetitorsTab)

const staff_to_update = ref(null);
provide('staff_to_update', staff_to_update)
provide('staff_activeTab', activeStaffTab)

const allEvents = ref([])
const allStaffs = ref([])
const allAdvantages = ref([])
const allCategories = ref([])
const allUnits = ref([])
const allLinks = ref([])
const allDocuments = ref([])

const handleShowStaffView = async (payload) => {
  showStaffListView.value = payload;
  if (showStaffListView.value) await reloadStaffsList()
}

const handleShowServiceView = async (payload) => {
  showServiceListView.value = payload
  if (showServiceListView.value) await loadUnits()
}

const handleShowExternalUrlList = async (payload) => {
  showExternalUrlList.value = payload
  if (showExternalUrlList.value) await reloadLink()
}

const handleShowDocumentList = async (payload) => {
  showDocumentList.value = payload
  if (showDocumentList.value) await loadDocuments()
}

provide('staffs', allStaffs)
provide('events', allEvents)
provide('advantages', allAdvantages)
provide('categories', allCategories)
provide('units', allUnits)
provide('links', allLinks)
provide('documents', allDocuments)

const activeEventTab = ref('event_list')
provide('event_activeTab', activeEventTab)

const activeAdvantageTab = ref('advantage_list')
provide('advantage_activeTab', activeAdvantageTab)

const activeCategorizationTab = ref('categorization_list')
provide('categorization_activeTab', activeCategorizationTab)

const activePartnershipTab = ref('partner_list')
provide('partnership_activeTab', activePartnershipTab)

const activeUnitTab = ref('unit_list')
provide('unit_activeTab', activeUnitTab)

const event_to_update = ref(null)
provide('event_to_update', event_to_update)

const advantage_to_update = ref(null)
provide('advantage_to_update', advantage_to_update)

const category_to_update = ref(null)
provide('category_to_update', category_to_update)

const unit_to_update = ref(null)
provide('unit_to_update', unit_to_update)

const reloadCompetitor = ref(false)
provide('reloadCompetitor', reloadCompetitor)

const competitorsData = ref([])
provide('competitorsData', competitorsData)

const link_to_update = ref(null)
provide('link_to_update', link_to_update)

const document_to_update = ref(null)
provide('document_to_update', document_to_update)

const appStore = useAppStore();

const handleEdit = (value, type) => {
  if (type == 'staff') {
    activeStaffTab.value = 'staff_form';
    staff_to_update.value = value;
    staff_to_update.value['establishment'] = `/api/establishments/${value.establishment}`
  }

  if (type == 'advantage') {
    activeAdvantageTab.value = 'advantage_form';
    advantage_to_update.value = value;
  }

  if (type == 'establishment') {
    activeEstablishmentTab.value = 'establishment_form';
    establishment_to_update.value = value;
  }

  if (type == 'competitor') {
    activeCompetitorsTab.value = 'competitor_form';
    establishment_to_update.value = value;
  }

  if (type == 'event') {
    activeEventTab.value = 'event_form';
    event_to_update.value = value;
  }

  if (type == 'category') {
    activeCategorizationTab.value = 'categorization_form'
    category_to_update.value = value;
  }

  if (type == 'service') {
    activeUnitTab.value = 'unit_form'
    unit_to_update.value = value;
  }

  if (type == 'links') {
    link_to_update.value = value;
  }

  if (type == 'document') {
    document_to_update.value = value;
  }
};

const setStatus = async (id, status) => {
  userStore.user.customer.establishments = userStore.user.customer.establishments.map((x) => {
    if (x.id == id) {
      x.disable = status == 'disable' ? true : false
      return x;
    } else {
      return x;
    }
  });

  userStore.user.customer.establishments = userStore.user.customer.establishments.filter((x) => x.disable == false);
  await new Promise((resolve) => {
    services.post_Record(`/customer/establishment/${id}/${status}`, {}, (response) => {
      resolve(response)
    }, false);
  });
}

const transformData = (data) => {
  const establishmentMap = new Map();
  let tag = ''
  for (const [competitorName, establishments] of Object.entries(data)) {
    establishments.forEach(establishment => {
      const {
        establishment_competitor_tag,
        establishment_category,
        id,
        url_source,
        establishment_address1,
        establishment_address2,
        establishment_zipcode,
        establishment_city,
        establishment_country,
        establishment_region,
        establishment_gps,
        establishment_rank,
        competitor_competitor_tag,
        competitor_id
      } = establishment;

      tag = (tag !== competitor_competitor_tag) ? competitor_competitor_tag : tag;

      // Vérifie si cet établissement a déjà été traité
      if (!establishmentMap.has(id)) {
        establishmentMap.set(id, {
          name: establishment.establishment_name,
          id: id,
          uri: `/api/establishments/${id}`,
          tag: establishment_competitor_tag,
          category: establishment_category,
          address1: establishment_address1,
          address2: establishment_address2,
          city: establishment_city,
          country: establishment_country,
          zipcode: establishment_zipcode,
          region: establishment_region,
          rank: establishment_rank,
          gps: establishment_gps,
          media: url_source,
          establishments: [competitorName],
          competitors: [{
            competitor_id: competitor_id,
            name: competitorName
          }]
        });
      } else {
        // Ajoute le nom du concurrent à la liste des établissements existants
        if (!establishmentMap.get(id).establishments.includes(competitorName)) establishmentMap.get(id).establishments.push(competitorName);
        establishmentMap.get(id).competitors.push({
          competitor_id: competitor_id,
          name: competitorName
        });
      }
    });
  }

  return Array.from(establishmentMap.values());
}


const reloadCompetitorList = async (type) => {
  try {
    const response = await new Promise((resolve) => {
      services.get_Record(`customer/establishment/competitors?tag=${route.params.tag}`, (response) => {
        resolve(response);
      });
    });
    if (response.status === 200) {
      competitorsData.value = transformData(response.data);
    }

    if (type == 'form') activeCompetitorsTab.value = 'competitor_list';
  } catch (error) {
    console.error(error);
  }
}

const reloadEventsList = async (type) => {
  try {
    const response = await new Promise((resolve) => {
      services.get_Record(`customer/establishment/event/list?customer=${route.params.tag}`, (response) => {
        resolve(response);
      });
    });
    if (response.status === 200) {
      const events = response.data;

      if (events.length === 1 && typeof (events[0] == String)) return

      events.forEach(event => {
        let event_found = allEvents.value.find(obj => obj.id === event.id);
        if (event_found) {
          event_found.establishment_name = `${event_found.establishment_name}, ${event.establishment_name}`;
          event_found.establishment.push(event.establishment);

        } else {
          event['date'] = `${moment(event.datefrom).format('YYYY-MM-DD')} to ${moment(event.dateto).format('YYYY-MM-DD')}`
          const uri = `/api/establishments/${event['establishment']}`;
          event['establishment'] = [];
          event['establishment'].push(uri)
          allEvents.value.push(event);
        }
      })
    }

    if (type == 'form') activeEventTab.value = 'event_list';
  } catch (error) {
    console.error(error);
  }
}

const reloadStaffsList = async (type) => {
  try {
    const response = await new Promise((resolve) => {
      services.get_Record(`customer/establishment/staff/list?customer=${route.params.tag}`, (response) => {
        resolve(response);
      });
    });
    if (response.status === 200) {
      allStaffs.value = response.data
    }

    if (type == 'form') activeStaffTab.value = 'staff_list';
  } catch (error) {
    console.error(error);
  }
}


const loadAdvantage = async () => {
  try {
    const response = await new Promise((resolve) => {
      services.get_Record(`customer/establishments/advantages?tag=${route.params.tag}`, (response) => {
        resolve(response);
      });
    });
    if (response.status === 200) {
      allAdvantages.value = response.data.map(adv => {
        const { advantage_limit, ...advantage } = adv;
        return { ...advantage, advantageLimit: advantage_limit }
      });
    } else {
      console.error('Error fetching advantages:', response);
    }
  } catch (error) {
    console.error(error);
  }
}

const loadCategories = async () => {
  try {
    const response = await new Promise((resolve) => {
      services.get_Record('categories', (response) => {
        resolve(response);
      });
    });
    if (response.status === 200) {
      allCategories.value = filterCategory(response.data['hydra:member']);
    } else {
      console.error('Error fetching categories:', response);
    }
  } catch (error) {
    console.error(error);
  }
}

const loadUnits = async () => {
  try {
    const response = await new Promise((resolve) => {
      services.get_Record(`/customer/establishments/unit?tag=${route.params.tag}`, (response) => {
        resolve(response);
      });
    });
    if (response.status === 200) {
      let data = response.data
      data = data.filter(i => i.units.length > 0);
      data = data.map(i => i.units)
      allUnits.value = data.flat()
    } else {
      console.error('Error fetching units:', response);
    }
  } catch (error) {
    console.error(error);
  }
}

const reloadLink = async () => {
  try {
    const response = await new Promise((resolve) => {
      services.get_Record(`customer/setting/list?tag=${route.params.tag}&categ=all&type=all`, (response) => {
        resolve(response);
      });
    });
    if (response.status === 200) {
      allLinks.value = response.data
    } else {
      console.error('Error fetching links:', response);
    }
  } catch (error) {
    console.error(error);
  }
}

const loadDocuments = async () => {
  try {
    const response = await new Promise((resolve) => {
      services.get_Record(`customer/document/list?tag=${route.params.tag}`, (response) => {
        resolve(response);
      });
    });
    if (response.status === 200) {
      allDocuments.value = response.data;
    } else {
      console.error('Error fetching links:', response);
    }
  } catch (error) {
    console.error(error);
  }
}

const filterCategory = (data) => {
  const establishments = userStore.user?.customer?.establishments;
  let categories = []
  if (establishments) {
    data.forEach(category => {
      let establishment = establishments.find(i => category.establishment == `/api/establishments/${i.id}`);
      if (establishment) {
        const { id, name } = establishment
        categories.push({
          id: category.id,
          category: category.category,
          category_uri: category['@id'],
          establishment: category.establishment,
          establishment_id: id,
          establishment_name: name
        })
      }
    })
  }
  return categories
}

const changeRoute = () => {

  switch (activeName.value) {

      case 'establishments':
          router.push({ name: 'establishments', query : {...route.query, active_tab : 'establishments'}});
          break;
      case 'staff':
          router.push({ name: 'staff', query : {...route.query, active_tab: 'staff'} });
          break;
      case 'service':
          router.push({ name: 'service' , query : {...route.query, active_tab : 'service'}});
          break;
      case 'gates':
          router.push({ name: 'gates' , query : {...route.query, active_tab : 'gates'}});
          break;
      case 'external_url':
          router.push({ name: 'external_url' , query : {...route.query, active_tab : 'external_url'}});
          break;
      default:
          break;
  } 

}

watch(()=> route, () => {
  activeName.value = route?.query?.active_tab || 'establishments'
}, {deep : true})

onBeforeMount(async () => {

  activeName.value = route?.query?.active_tab

  appStore.setCurrentPage({
    title1: "My",
    title2: "QRCodes",
    icon: "uil-qrcode-scan"
  });

  if (width.value < 800) {
    position.value = 'top'
  } else {
    position.value = 'right'
  }

  await reloadCompetitorList();
  await reloadStaffsList();
  await reloadEventsList();
  await reloadLink();
  await loadAdvantage();
  await loadCategories();
  await loadUnits();
  await loadDocuments();
  appStore.isLoading = false;
});

</script>
<style scoped>
@media screen and (max-width: 800px) {
  .user__main__container {
    width: 120%;
  }
}

@media screen and (max-width: 750px) {
  .user__main__container {
    width: 200px;
    min-width: 104% !important;
  }
}

* {
  overflow: hidden;
}
</style>
