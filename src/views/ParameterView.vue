<template>
    <div class="user__main__container">
        <el-tabs v-model="activeName" type="card" class="demo-tabs">
            <el-tab-pane label="Establishments" name="establishments">
                <el-tabs v-model="activeEstablishmentTab" class="demo-tabs" @tab-click="() => clearEstablishmentForm()">
                    <el-tab-pane label="Establishments" name="establishment_list">
                        <EstablishmentListComponent
                            @edit="(establishment) => handleEdit(establishment, 'establishment')"
                            @setEnable="(id) => setStatus(id, 'enable')"
                            @setDisable="(id) => setStatus(id, 'disable')" />
                    </el-tab-pane>
                    <el-tab-pane label="Add a new establishment" name="establishment_form">
                        <EstablishmentFormComponent />
                    </el-tab-pane>
                </el-tabs>
            </el-tab-pane>
            <el-tab-pane label="Links" name="links">
                <!--
                    <LinksConfComponent />
                -->
                <el-tabs v-model="activeEstablishmentTab" class="demo-tabs">
                    <el-tab-pane label="Links" name="establishment_list">
                        <LinksConfComponent />
                    </el-tab-pane>
                    <el-tab-pane label="Add a new Links" name="">
                        <LinksFomrComponent />
                    </el-tab-pane>
                </el-tabs>
            </el-tab-pane>
            <el-tab-pane label="competitors" name="competitors">
                <el-tabs v-model="activeCompetitorsTab" class="demo-tabs" @tab-click="() => clearEstablishmentForm()">
                    <el-tab-pane label="Competitors" name="competitor_list">
                        <CompetitorListComponent @edit="(establishment) => handleEdit(establishment, 'competitor')"
                            @reload="reloadCompetitorList('list')" />
                    </el-tab-pane>
                    <el-tab-pane label="Add a new competitor" name="competitor_form">
                        <CompetitorFormComponent @reload="reloadCompetitorList('form')" />
                    </el-tab-pane>
                </el-tabs>
            </el-tab-pane>
            <el-tab-pane label="Staff" name="staff">
                <el-tabs v-model="activeStaffTab" class="demo-tabs">
                    <el-tab-pane label="Staffs" name="staff_list">
                        <StaffListComponent @edit="(staff) => handleEdit(staff, 'staff')" />
                    </el-tab-pane>
                    <el-tab-pane label="Add a new staff member" name="staff_form">
                        <StaffFormComponent />
                    </el-tab-pane>
                </el-tabs>
            </el-tab-pane>
            <el-tab-pane label="Services" name="service">
                <el-tabs v-model="activeUnitTab" class="demo-tabs">
                    <el-tab-pane label="Services" name="unit_list">
                        <UnitListComponent @edit="(service) => handleEdit(service, 'service')" />
                    </el-tab-pane>
                    <el-tab-pane label="Add a new service" name="unit_form">
                        <UnitFormComponent />
                    </el-tab-pane>
                </el-tabs>
            </el-tab-pane>
            <el-tab-pane label="Events" name="event">
                <el-tabs v-model="activeEventTab" class="demo-tabs">
                    <el-tab-pane label="Events" name="event_list">
                        <EventListComponent @edit="(event) => handleEdit(event, 'event')" />
                    </el-tab-pane>
                    <el-tab-pane label="Add a new event" name="event_form">
                        <EventFormComponent />
                    </el-tab-pane>
                </el-tabs>
            </el-tab-pane>
            <el-tab-pane label="AI categorizations" name="categorization">
                <el-tabs v-model="activeCategorizationTab" class="demo-tabs">
                    <el-tab-pane label="Categories" name="categorization_list">
                        <CategorizationListComponent @edit="(category) => handleEdit(category, 'category')" />
                    </el-tab-pane>
                    <el-tab-pane label="Add a new category" name="categorization_form">

                        <CategorizationFormComponent />
                    </el-tab-pane>
                </el-tabs>
            </el-tab-pane>
            <!-- <el-tab-pane label="Advantages" name="advantage">
                <el-tabs v-model="activeAdvantageTab" class="demo-tabs">
                    <el-tab-pane label="Advantages" name="advantage_list">
                        <AdvantageListComponent @edit="(advantage) => handleEdit(advantage, 'advantage')"
                            @setEnable="(advantage) => handleEnable(advantage, 'advantage')"
                            @setDisable="(advantage) => handleDisable(advantage, 'advantage')" />
                    </el-tab-pane>
                    <el-tab-pane label="Add a new advantage" name="advantage_form">
                        <AdvantageFormComponent />
                    </el-tab-pane>
                </el-tabs>
            </el-tab-pane> -->
           <!--  <el-tab-pane label="Partnerships" name="partnerships">
                <el-tabs v-model="activePartnershipTab" class="demo-tabs">
                    <el-tab-pane label="Partnership list" name="partnership_list">
                        <PartnershipListComponent @update="() => reloadPartnershipsData()" />
                    </el-tab-pane>
                    <el-tab-pane label="Request a new partnership" name="partnership_form">
                        <PartnershipFormComponent @update="() => reloadPartnershipsData()" />
                    </el-tab-pane>
                </el-tabs>
            </el-tab-pane> -->
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

const UnitFormComponent = defineAsyncComponent(() =>
    import("@Components/units/UnitFormComponent.vue")
)

const UnitListComponent = defineAsyncComponent(() =>
    import("@Components/units/UnitListComponent.vue")
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

const LinksFomrComponent = defineAsyncComponent(() =>
    import("@Components/links/LinksFormComponent.vue")
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

const CategorizationFormComponent = defineAsyncComponent(() =>
    import("@Components/categorization/CategorizationFormComponent.vue")
)

const CategorizationListComponent = defineAsyncComponent(() =>
    import("@Components/categorization/CategorizationListComponent.vue")
)

const PartnershipFormComponent = defineAsyncComponent(() =>
    import("@Components/partnership/PartnershipFormComponent.vue")
)

const PartnershipListComponent = defineAsyncComponent(() =>
    import("@Components/partnership/PartnershipListComponent.vue")
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
    cleanEstablishmentForm.value = !cleanEstablishmentForm.value
}

const appStore = useAppStore()
const userStore = useUserStore()
const activeName = ref('establishments')
const activeStaffTab = ref('staff_list')

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
const allPartnerships = ref({})

provide('staffs', allStaffs)
provide('events', allEvents)
provide('advantages', allAdvantages)
provide('categories', allCategories)
provide('units', allUnits)
provide('partnerships', allPartnerships)

const activeEventTab = ref('event_list')
provide('event_activeTab', activeEventTab)

const activeAdvantageTab = ref('advantage_list')
provide('advantage_activeTab', activeAdvantageTab)

const activeCategorizationTab = ref('categorization_list')
provide('categorization_activeTab', activeCategorizationTab)

const activePartnershipTab = ref('partnership_list')
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
};



const handleEnable = async (value, type) => {
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

const setStatus = async (id, status) => {
    userStore.user.customer.establishments = userStore.user.customer.establishments.map((x) => {
        if (x.id == id) {
            x.disable = status == 'disable' ? true : false
            return x;
        } else {
            return x;
        }
    });

    userStore.user.customer.establishments = userStore.user.customer.establishments.filter((x) => x.disable == false); await new Promise((resolve) => {
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

const reloadPartnershipsData = async () => {
    const response = await new Promise((resolve) => {
        services.get_Record(`partnership/${route.params.tag}/list`, (response) => {
            resolve(response);
        });
    });
    if (response.status === 200) {
        allPartnerships.value = response.data;
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

const filterCategory = (data) => {
    const establishments = userStore.user.customer.establishments;
    let categories = []
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
    return categories
}

onBeforeMount(async () => {
    if (width.value < 800) {
        position.value = 'top'
    } else {
        position.value = 'right'
    }

    await reloadCompetitorList();
    await reloadStaffsList();
    await reloadEventsList();
    // await loadAdvantage();
    await loadCategories();
    await loadUnits();
    // await reloadPartnershipsData();
});

</script>
<style scoped>
/*@media screen and (max-width: 800px) {
    .user__main__container {
        width: 100%;
    }
}*/

* {
    overflow: hidden;
}
</style>
