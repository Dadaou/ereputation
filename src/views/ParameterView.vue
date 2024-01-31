<template>
    <div class="user__main__container">
        <el-tabs v-model="activeName" type="card" class="demo-tabs" @tab-click="handleClick">    
            <el-tab-pane label="Establishments" name="establishments">
                <el-tabs v-model="activeEstablishmentTab" class="demo-tabs" @tab-click="() => clearEstablishmentForm()">
                    <el-tab-pane label="Establishment list" name="establishment_list">
                        <EstablishmentListComponent @edit="(establishment) => handleEdit(establishment, 'establishment')" />
                    </el-tab-pane>
                    <el-tab-pane label="Add a new establishment" name="establishment_form">
                        <EstablishmentFormComponent />
                    </el-tab-pane>
                </el-tabs>
            </el-tab-pane>
            <el-tab-pane label="Links" name="links">
                <LinksConfComponent />
            </el-tab-pane>
              <el-tab-pane label="competitors" name="competitors">
                <el-tabs v-model="activeCompetitorsTab" class="demo-tabs" @tab-click="() => clearEstablishmentForm()">
                    <el-tab-pane label="Competitors list" name="competitor_list">
                        <CompetitorListComponent @edit="(establishment) => handleEdit(establishment, 'competitor')"  @reload="reloadCompetitorList('list')"/>
                    </el-tab-pane>
                    <el-tab-pane label="Add a new competitor" name="competitor_form">
                        <CompetitorFormComponent @reload="reloadCompetitorList('form')" />
                    </el-tab-pane>
                </el-tabs>
            </el-tab-pane>
            <el-tab-pane label="Staff" name="staff">
                <el-tabs v-model="activeStaffTab" class="demo-tabs">
                    <el-tab-pane label="Staff list" name="staff_list">
                        <StaffListComponent @edit="(staff) => handleEdit(staff, 'staff')" />
                    </el-tab-pane>
                    <el-tab-pane label="Add a new staff member" name="staff_form">
                        <StaffFormComponent />
                    </el-tab-pane>
                </el-tabs>
            </el-tab-pane>
            <el-tab-pane label="Event" name="event">
                <el-tabs v-model="activeEventTab" class="demo-tabs">
                    <el-tab-pane label="Event list" name="event_list">
                        <EventListComponent @edit="(event) => handleEdit(event, 'event')" />
                    </el-tab-pane>
                    <el-tab-pane label="Add a new event" name="event_form">
                        <EventFormComponent />
                    </el-tab-pane>
                </el-tabs>
            </el-tab-pane>
            <el-tab-pane label="Advantage" name="advantage">
                <el-tabs v-model="activeAdvantageTab" class="demo-tabs">
                    <el-tab-pane label="Advantage list" name="advantage_list">
                        <AdvantageListComponent @edit="(advantage) => handleEdit(advantage, 'advantage')"
                            @setEnable="(advantage) => handleEnable(advantage, 'advantage')"
                            @setDisable="(advantage) => handleDisable(advantage, 'advantage')" />
                    </el-tab-pane>
                    <el-tab-pane label="Add a new advantage" name="advantage_form">
                        <AdvantageFormComponent />
                    </el-tab-pane>
                </el-tabs>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script setup>
import { ref, provide, defineAsyncComponent, onBeforeMount, watch } from 'vue';
import moment from 'moment';
import { ElTabs, ElTabPane } from 'element-plus';
import services from '@Services/services.js';
import { useAppStore } from "@Stores/app.js";
import { useUserStore } from "@Stores/user.js";
import { useWindowSize } from '@vueuse/core';
import { useRoute } from 'vue-router';
import 'element-plus/es/components/tabs/style/css';
import 'element-plus/es/components/tab-pane/style/css';


const { width } = useWindowSize();
const route = useRoute();


const StaffFormComponent = defineAsyncComponent(() =>
    import("@Components/staffs/StaffFormComponent.vue")
)

const StaffListComponent = defineAsyncComponent(() =>
    import("@Components/staffs/StaffListComponent.vue")
)

const EventFormComponent = defineAsyncComponent(() =>
    import("@Components/events/EventFormComponent.vue")
)

const EventListComponent = defineAsyncComponent(() =>
    import("@Components/events/EventListComponent.vue")
)

const AdvantageFormComponent = defineAsyncComponent(() =>
    import("@Components/advantage/AdvantageFormComponent.vue")
)

const AdvantageListComponent = defineAsyncComponent(() =>
    import("@Components/advantage/AdvantageListComponent.vue")
)

const LinksConfComponent = defineAsyncComponent(() =>
    import("@Components/links/LinksConfComponent.vue")
)

const EstablishmentListComponent = defineAsyncComponent(() =>
    import("@Components/establishments/EstablishmentListComponent.vue")
)

const EstablishmentFormComponent = defineAsyncComponent(() =>
    import("@Components/establishments/EstablishmentFormComponent.vue")
)

const CompetitorListComponent = defineAsyncComponent(() =>
    import("@Components/competitor/CompetitorListComponent.vue")
)

const CompetitorFormComponent = defineAsyncComponent(() =>
    import("@Components/competitor/CompetitorFormComponent.vue")
)

const position = ref('top')
watch(width, () => {
    if (width.value < 800) {
        position.value = 'top'
    } else {
        position.value = 'right'
    }
});

const clearEstablishmentForm = () => {
    cleanEstablishmentForm.value = !cleanEstablishmentForm.value;
}

const appStore = useAppStore();
const userStore = useUserStore();
const activeName = ref('establishments');
const activeStaffTab = ref('staff_list')

const establishment_to_update = ref(null);
const activeEstablishmentTab = ref('establishment_list')
provide('establishment_to_update', establishment_to_update);
provide('establishment_activeTab', activeEstablishmentTab);
const cleanEstablishmentForm = ref(false);
provide('clearEstablishmentForm', cleanEstablishmentForm);

const activeCompetitorsTab = ref('competitor_form')
provide('activeCompetitorsTab', activeCompetitorsTab);

const staff_to_update = ref(null);
provide('staff_to_update', staff_to_update);
provide('staff_activeTab', activeStaffTab);

const allEvents = ref([]);
const allStaffs = ref([]);
const allAdvantages = ref([]);
const activeEventTab = ref('event_list')
provide('event_activeTab', activeEventTab)

const activeAdvantageTab = ref('advantage_list')
provide('advantage_activeTab', activeAdvantageTab)


const event_to_update = ref(null)
provide('event_to_update', event_to_update)

const advantage_to_update = ref(null)
provide('advantage_to_update', advantage_to_update)

provide('staffs', allStaffs)
provide('events', allEvents)
provide('advantages', allAdvantages)

const reloadCompetitor = ref(false)
provide('reloadCompetitor', reloadCompetitor)
const competitorsData = ref([])
provide('competitorsData', competitorsData)

const handleEdit = (value, type) => {
    if (type == 'staff') {
        activeStaffTab.value = 'staff_form';
        staff_to_update.value = value;
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
        console.log(value)
    }

    if(type == 'event') {
        activeEventTab.value = 'event_form';
        event_to_update.value = value;
    }
};

const handleEnable = async (value, type) => {
    console.log(type)
    const response = await new Promise((resolve) => {
        services.post_Record(`/customer/establishments/advantage/${value}/enable`, {}, (response) => {
            resolve(response)
        }, false);
    });
    if (response.status == 200) {
        allAdvantages.value = allAdvantages.value.map((adv) => {
            if (adv.id == value) {
                adv.enable = true;
            }
            return adv;
        })
    }
};

const handleDisable = async (value, type) => {
    console.log(type)
    const response = await new Promise((resolve) => {
        services.post_Record(`/customer/establishments/advantage/${value}/disable`, {}, (response) => {
            resolve(response)
        }, false);
    });
    if (response.status == 200) {
        allAdvantages.value = allAdvantages.value.map((adv) => {
            if (adv.id == value) {
                adv.enable = false;
            }
            return adv;
        })
    }
};

const transformData = (data) =>{
    const establishmentMap = new Map();
    let tag = ''
    console.log(data)
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
                competitor_competitor_tag
                } = establishment;

            tag  =  (tag !== competitor_competitor_tag)? competitor_competitor_tag: tag;

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
                    establishmentsTag: [{name: competitorName, tag: tag}] 
                });
            } else {
                // Ajoute le nom du concurrent à la liste des établissements existants
                if(!establishmentMap.get(id).establishments.includes(competitorName)) establishmentMap.get(id).establishments.push(competitorName);
            }
        });
    }

    // Convertir la Map en tableau
    return Array.from(establishmentMap.values());
}


const reloadCompetitorList = async(type)=>{
    try {
        const response = await new Promise((resolve) => {
            services.get_Record(`customer/establishment/competitors?tag=${route.params.tag}`, (response) => {
                resolve(response);
            });
        });
        if (response.status === 200) {
            competitorsData.value = transformData(response.data);
            console.log(competitorsData.value)
        } 

        if(type=='form') activeCompetitorsTab.value = 'competitor_list';
    } catch (error) {
        console.error(error);
    }
}

onBeforeMount(async () => {
    let staffs = [];
    let events = [];

    let promises = [];
    let event_promises = [];

    appStore.isLoading = true;

    if (width.value < 800) {
        position.value = 'top'
    } else {
        position.value = 'right'
    }

    if (userStore.user.customer !== null) {

        userStore.user.customer.establishments.forEach((establishment) => {
            let promise = services.get_Record(`/establishment/${establishment.competitor_tag}/staffs`, (response) => {
                staffs.push(response.data);
            });
            promises.push(promise);


            let promise_event = services.get_Record(`/establishment/${establishment.competitor_tag}/event`, (response) => {
                events.push(response.data);
            });
            event_promises.push(promise_event);
        })
        Promise.all(promises).then(() => {
            staffs.forEach(staffs_per_establisment => {
                staffs_per_establisment.forEach(staff => {
                    allStaffs.value.push(staff);
                })
            })
            appStore.isLoading = false;
        });

        Promise.all(event_promises).then(() => {
            events.forEach(events_per_establisment => {
                events_per_establisment.forEach(event => {
                    let event_found = allEvents.value.find(obj => obj.id === event.id);
                    if (event_found) {
                        event_found.establishment_name = `${event_found.establishment_name}, ${event.establishment_name}`;
                        event_found.establishment.push(event.establishment);

                    } else {
                        event['date'] = `${moment(event.datefrom).format('YYYY-MM-DD')} to ${moment(event.dateto).format('YYYY-MM-DD')}`
                        const uri = event['establishment'];
                        event['establishment'] = [];
                        event['establishment'].push(uri)
                        allEvents.value.push(event);
                    }
                })
            })
        });
    }

    await reloadCompetitorList();
    
    try {
        const response = await new Promise((resolve) => {
            services.get_Record(`advantage/list`, (response) => {
                resolve(response);
            });
        });
        if (response.status === 200) {
            allAdvantages.value = response.data;
        } else {
            console.error('Error fetching advantages:', response);
        }
    } catch (error) {
        console.error('Error in onBeforeMount:', error);
    }
});

</script>
<style scoped>
@media screen and (max-width: 800px) {
    .user__main__container {
        width: 120%;
    }
}

*{
    overflow: hidden;
}
</style>
