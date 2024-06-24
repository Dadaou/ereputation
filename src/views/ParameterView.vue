<template>
    <div class="user__main__container">
        <el-tabs v-model="parametersUrlsConf.tabs" type="card" class="demo-tabs">
            <el-tab-pane label="Establishments" name="establishments">
                <el-tabs v-model="parametersUrlsConf.establishments" class="demo-tabs" @tab-click="() => clearEstablishmentForm()">
                    <el-tab-pane label="Establishments" name="establishments_list">
                        <EstablishmentListComponent
                            @edit="(establishment) => handleEdit(establishment, 'establishments')"
                            @setEnable="(id) => setStatus(id, 'enable')"
                            @setDisable="(id) => setStatus(id, 'disable')" />
                    </el-tab-pane>
                    <el-tab-pane label="Add a new establishment" name="establishments_form">
                        <EstablishmentFormComponent />
                    </el-tab-pane>
                </el-tabs>
            </el-tab-pane>
            <!-- <el-tab-pane label="Links" name="links">
                <el-tabs v-model="parametersUrlsConf.links" class="demo-tabs">
                    <el-tab-pane label="Links" name="links_list">
                        <LinksListComponent @reload="reloadLink()" @edit="(link) => handleEdit(link, 'links')" />
                    </el-tab-pane>
                    <el-tab-pane label="Add a new Links" name="links_form">
                        <LinksFormComponent @reload="reloadLink()" />
                    </el-tab-pane>
                </el-tabs>
            </el-tab-pane> -->
            <el-tab-pane label="URLs" name="urls">
                <el-tabs v-model="parametersUrlsConf.urls" class="demo-tabs">
                    <el-tab-pane label="URLs" name="urls_list">
                        <LinksListComponent @reload="reloadLink()" @edit="(url) => handleEdit(url, 'links')" />
                    </el-tab-pane>
                    <el-tab-pane label="Add a new provider URL" name="urls_provider_form">
                        <UrlProviderFormComponent @reload="reloadLink()" />
                    </el-tab-pane>
                    <el-tab-pane label="Add URL to Gate" name="urls_gate_form">
                        <UrlGateFormComponent @reload="reloadLink()" />
                    </el-tab-pane>
                </el-tabs>
            </el-tab-pane>
            <el-tab-pane label="Competitors" name="competitors">
                <el-tabs v-model="parametersUrlsConf.competitors" class="demo-tabs" @tab-click="() => clearEstablishmentForm()">
                    <el-tab-pane label="Competitors" name="competitors_list">
                        <CompetitorListComponent @edit="(establishment) => handleEdit(establishment, 'competitors')"
                            @reload="reloadCompetitorList('list')" />
                    </el-tab-pane>
                    <el-tab-pane label="Add a new competitor" name="competitors_form">
                        <CompetitorFormComponent @reload="reloadCompetitorList('form')" />
                    </el-tab-pane>
                </el-tabs>
            </el-tab-pane>
            <el-tab-pane label="Staff" name="staffs">
                <el-tabs v-model="parametersUrlsConf.staffs" class="demo-tabs" @tab-click="() => clearStaffForm()">
                    <el-tab-pane label="Staffs" name="staffs_list">
                        <StaffListComponent @edit="(staff) => handleEdit(staff, 'staffs')" />
                    </el-tab-pane>
                    <el-tab-pane label="Add a new staff member" name="staffs_form">
                        <StaffFormComponent />
                    </el-tab-pane>
                </el-tabs>
            </el-tab-pane>
            <el-tab-pane label="Services" name="services">
                <el-tabs v-model="parametersUrlsConf.services" class="demo-tabs" @tab-click="() => clearUnitForm()">
                    <el-tab-pane label="Services" name="services_list">
                        <UnitListComponent @edit="(service) => handleEdit(service, 'services')" />
                    </el-tab-pane>
                    <el-tab-pane label="Add a new service" name="services_form">
                        <UnitFormComponent />
                    </el-tab-pane>
                </el-tabs>
            </el-tab-pane>
            <el-tab-pane label="Events" name="events">
                <el-tabs v-model="parametersUrlsConf.events" class="demo-tabs">
                    <el-tab-pane label="Events" name="events_list">
                        <EventListComponent @edit="(event) => handleEdit(event, 'events')" />
                    </el-tab-pane>
                    <el-tab-pane label="Add a new event" name="events_form">
                        <EventFormComponent />
                    </el-tab-pane>
                </el-tabs>
            </el-tab-pane>
            <el-tab-pane label="AI categorizations" name="categories">
                <el-tabs v-model="parametersUrlsConf.categories" class="demo-tabs">
                    <el-tab-pane label="Categories" name="categories_list">
                        <CategorizationListComponent @edit="(category) => handleEdit(category, 'categories')" />
                    </el-tab-pane>
                    <el-tab-pane label="Add a new category" name="categories_form">
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
import { ref, reactive, provide, defineAsyncComponent, onBeforeMount, watch, computed } from 'vue';
import moment from 'moment';
import { ElTabs, ElTabPane } from 'element-plus';
import services from '@Services/services.js';
import { useAppStore } from "@Stores/app.js";
import { useUserStore } from "@Stores/user.js";
import { useWindowSize } from '@vueuse/core';
import { useRoute, useRouter } from 'vue-router';
import 'element-plus/es/components/tabs/style/css';
import 'element-plus/es/components/tab-pane/style/css';


const { width } = useWindowSize();
const route = useRoute();
const router = useRouter();


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

const LinksListComponent = defineAsyncComponent(() =>
    import("@Components/links/LinksListComponent.vue")
)

const LinksFormComponent = defineAsyncComponent(() =>
    import("@Components/links/LinksFormComponent.vue")
)

const UrlProviderFormComponent = defineAsyncComponent(() =>
    import("@Components/url/UrlProviderFormComponent.vue")
)


const UrlGateFormComponent = defineAsyncComponent(() =>
    import("@Components/url/UrlGateFormComponent.vue")
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

const clearStaffForm = () => {
    cleanStaffForm.value = !cleanStaffForm.value
}

const clearUnitForm = () => {
    cleanUnitForm.value = !cleanUnitForm.value
}

const appStore = useAppStore()
const userStore = useUserStore()
const activeName = ref('establishments')
const parametersUrlsConf = reactive({
    tabs: 'establishments',
    establishments : 'establishments_list',
    links: 'links_list',
    urls: 'urls_list',
    competitors: 'competitors_list',
    staffs: 'staffs_list',
    events: 'events_list',
    services: 'services_list',
    categories: 'categories_list' 
})

provide('parametersUrlsConf', parametersUrlsConf)
const cleanEstablishmentForm = ref(false);
provide('clearEstablishmentForm', cleanEstablishmentForm)

const cleanStaffForm = ref(false);
provide('clearStaffForm', cleanStaffForm)

const cleanUnitForm = ref(false);
provide('clearUnitForm', cleanUnitForm)

const allEvents = ref([])
const allStaffs = ref([])
const allAdvantages = ref([])
const allCategories = ref([])
const allUnits = ref([])
const allPartnerships = ref({})
const allLinks = ref([])
const providers = ref([])

provide('staffs', allStaffs)
provide('events', allEvents)
provide('advantages', allAdvantages)
provide('categories', allCategories)
provide('units', allUnits)
provide('partnerships', allPartnerships)
provide('links', allLinks)
provide('providers', providers)

const establishment_to_update = ref(null)
provide('establishment_to_update', establishment_to_update)

const staff_to_update = ref(null);
provide('staff_to_update', staff_to_update)

const event_to_update = ref(null)
provide('event_to_update', event_to_update)

const advantage_to_update = ref(null)
provide('advantage_to_update', advantage_to_update)

const category_to_update = ref(null)
provide('category_to_update', category_to_update)

const unit_to_update = ref(null)
provide('unit_to_update', unit_to_update)

const link_to_update = ref(null)
provide('link_to_update', link_to_update)

const reloadCompetitor = ref(false)
provide('reloadCompetitor', reloadCompetitor)
const competitorsData = ref([])
provide('competitorsData', competitorsData)

const handleEdit = (value, type) => {
    parametersUrlsConf[type] = `${type}_form`;
    if (type == 'staffs') {
        staff_to_update.value = value;
        staff_to_update.value['establishment'] = `/api/establishments/${value.establishment}`
    }

    // if (type == 'advantage') {
    //     advantage_to_update.value = value;
    // }

    if (type == 'establishments') {
        establishment_to_update.value = value;
    }

    if (type == 'competitors') {
        establishment_to_update.value = value;
    }

    if (type == 'events') {
        event_to_update.value = value;
    }

    if (type == 'categories') {
        category_to_update.value = value;
    }

    if (type == 'services') {
        unit_to_update.value = value;
    }

    if (type == 'links') {
        link_to_update.value = value;
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

        // if (type == 'form') activeEventTab.value = 'event_list';
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

        // if (type == 'form') activeStaffTab.value = 'staff_list';
    } catch (error) {
        console.error(error);
    }
}

const loadCategories = async () => {
    try {
        const response = await new Promise((resolve) => {
            services.get_Record(`customer/establishments/categories?tag=${route.params.tag}`, (response) => {
                resolve(response);
            });
        });
        if (response.status === 200) {
            allCategories.value = response.data;
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
            services.get_Record(`customer/setting/list?tag=${route.params.tag}&categ=all`, (response) => {
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

const loadProviders = async () => {
    try {
        const response = await new Promise((resolve) => {
            services.get_Record(`providers`, (response) => {
                resolve(response);
            });
        });

        if (response.status === 200) {
            const data = response.data['hydra:member'];

            data.forEach(item => {
                providers.value.push({
                    id: item.id,
                    category: item.category,
                    name: item.name,
                    url: item.url,
                    uri: `/api/providers/${item.id}`
                })
            })

        } else {
            console.error('Error fetching advantages:', response);
        }
    } catch (error) {
        console.error('Error in onBeforeMount:', error);
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

const routeParameters = async (conf)=>{
    router.push({ name: route.name, params: { ...route.params, tab: conf.tabs, sub_tab: conf[conf.tabs] } });
}

watch(parametersUrlsConf, (newValue, oldValue)=>{
    routeParameters(newValue)
})

const params = computed(()=> route.params)

watch(params, ()=>{
    parametersUrlsConf.tabs = route.params.tab;
    parametersUrlsConf[parametersUrlsConf.tabs] = route.params.sub_tab; 
})

onBeforeMount(async () => {
    parametersUrlsConf.tabs = (route.params.tab !== '')?route.params.tab:'establishments';
    parametersUrlsConf[parametersUrlsConf.tabs] = (route.params.sub_tab !== '')?route.params.sub_tab:'establishments_list';
    await routeParameters(parametersUrlsConf)

    if (width.value < 800) {
        position.value = 'top'
    } else {
        position.value = 'right'
    }

    await reloadCompetitorList();
    await reloadStaffsList();
    await reloadEventsList();
    await loadCategories();
    await loadUnits();
    await loadProviders();
    await reloadLink();
});

</script>
<style scoped>

* {
    overflow: hidden;
}
</style>
