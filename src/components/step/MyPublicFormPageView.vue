<template>
    <div>
        <div class="security__header border__bottom mt-10"></div>
        <h1 class="title">My public platforms</h1>
        <h1>
            Let's start by setting up your first establishment <b v-if="establishmentName">{{ establishmentName }} </b>
        </h1>
        <div class="table__container mt-4">
            <div>
                <form @submit.prevent="submit" @keydown.enter.prevent="submit" class="mt-4 px-2">
                    <div class="grid gap-6 mb-6 md:grid-cols-2">
                        <div>
                            <label for="google"
                                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Google
                            </label>
                            <p class="text-gray-900 text-sm">Url must start with
                                https://www.google.com/search?q={value1}</p>
                            <p v-if="!isValidGoogle && urlGoogle !== ''" class="text-red-500 text-sm">Invalid Google URL
                                format</p>
                            <input type="text" id="urlGoogle" v-model="urlGoogle"
                                :class="['bg-gray-50 border text-sm w-full p-2', isValidGoogle ? 'border-gray-300' : 'border-red-500']">
                        </div>

                        <div>
                            <label for="tripadvisor"
                                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Tripadvisor
                            </label>
                            <p class="text-gray-900 text-sm">Url must start with https://www.tripadvisor.com/{value1}
                            </p>
                            <p v-if="!isValidTripadvisor && urlTripadvisor !== ''" class="text-red-500 text-sm">Invalid
                                Tripadvisor URL format</p>
                            <input type="text" id="urlTripadvisor" v-model="urlTripadvisor"
                                :class="['bg-gray-50 border text-sm w-full p-2', isValidTripadvisor ? 'border-gray-300' : 'border-red-500']">
                        </div>
                        <div>
                            <label for="facebook"
                                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Facebook
                            </label>
                            <p class="text-gray-900 text-sm">Url must start with https://www.facebook.com/{value1}
                            </p>
                            <p v-if="!isValidFacebook && urlFacebook !== ''" class="text-red-500 text-sm">Invalid
                                Facebook URL format</p>
                            <input type="text" id="urlFacebook" v-model="urlFacebook"
                                :class="['bg-gray-50 border border-gray-300 text-gray-900 text-sm w-full p-2']">
                        </div>
                        <div>
                            <label for="instagram"
                                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Instagram
                            </label>
                            <p class="text-gray-900 text-sm">Url must start with https://www.instagram.com/{value1}
                            </p>
                            <p v-if="!isValidInstagram && urlInstagram !== ''" class="text-red-500 text-sm">Invalid
                                Instagram URL format</p>
                            <input type="text" id="urlInstagram" v-model="urlInstagram"
                                :class="['bg-gray-50 border border-gray-300 text-gray-900 text-sm w-full p-2']">
                        </div>
                        <div>
                            <label for="twitter"
                                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Twitter
                            </label>
                            <p class="text-gray-900 text-sm">Url must start with https://x.com/{value1}
                            </p>
                            <p v-if="!isValidTwitter && urlTwitter !== ''" class="text-red-500 text-sm">Invalid
                                Twitter URL format</p>
                            <input type="text" id="urlTwitter" v-model="urlTwitter"
                                :class="['bg-gray-50 border border-gray-300 text-gray-900 text-sm w-full p-2']">
                        </div>

                        <div></div>
                        <div>
                            <span @click="addNewPlatform" class="button__plus">
                                Platform +
                            </span>
                            <span @click="addNewSocial" class="button__plus">
                                Social +
                            </span>
                        </div>
                        <div></div>
                        <div v-for="(entry, index) in platformEntries" :key="index">
                            <div>
                                <div class="content__label">
                                    <label for="platforms"
                                        class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Platform</label>
                                    <p class="button__close" @click="removePlatform(index)">x</p>
                                </div>
                                <el-select id="platforms" v-model="entry.platform" placeholder="Choose platform"
                                    size="large" filterable clearable
                                    @change="value => handleChangePlatform(value, index)">
                                    <el-option v-for="item in dataPlatforms" :key="item.uri" :label="item.name"
                                        :value="`${item.id}`" />
                                </el-select>
                            </div>

                            <label for="platformLink"
                                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Link platform
                                <span>*</span></label>

                            <p v-if="entry.platform" class="text-gray-900 text-sm">Url must start with {{
                                entry.selectedPlatform.url }}</p>
                            <p v-if="entry.platformLink && !entry.isValidPlatform" class="text-red-500 text-sm">Invalid
                                URL format</p>
                            <input type="text" id="platformLink" v-model="entry.platformLink"
                                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm w-full p-2">
                        </div>

                        <div v-for="(entry, index) in socialEntries" :key="index">
                            <div>
                                <div class="content__label">
                                    <label for="socials"
                                        class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Social</label>
                                    <p class="button__close" @click="removeSocial(index)">x</p>
                                </div>
                                <el-select id="socials" v-model="entry.social" placeholder="Choose social" size="large"
                                    filterable clearable @change="value => handleChangeSocial(value, index)">
                                    <el-option v-for="item in dataSocials" :key="item.uri" :label="item.name"
                                        :value="`${item.id}`" />
                                </el-select>
                            </div>
                            <label for="socialLink"
                                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Link social
                                <span>*</span>
                            </label>
                            <p v-if="entry.social" class="text-gray-900 text-sm">Url must start with {{
                                entry.selectedSocial.url }}</p>
                            <p v-if="entry.socialLink && !entry.isValidSocial" class="text-red-500 text-sm">Invalid
                                URL format</p>
                            <input type="text" id="socialLink" v-model="entry.socialLink"
                                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm w-full p-2">
                        </div>
                    </div>

                    <div class="flex items-center justify-between py-4 border-t border-b dark:border-gray-600">
                        <button type="submit"
                            :class="['inline-flex items-center py-2.5 px-6 text-xs font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-blue-800']">
                            <SpinnerComponent :show-spinner="showSpinner" :color="'gray'" />
                            <span v-if="showSpinner">Loading...</span>
                            <span v-show="!showSpinner"><i class="uil uil-save"></i> Submit</span>
                        </button>
                    </div>
                </form>
            </div>

        </div>
    </div>
</template>
<script setup>
import { ref, onBeforeMount, watch } from 'vue'
import { ElMessage, ElOption, ElSelect } from 'element-plus'
import SpinnerComponent from '@Components/utils/SpinnerComponent.vue';
import services from '@Services/services.js';

const props = defineProps({
    establishmentName: String,
    competitorId: String
});

const emit = defineEmits(['changeStep']);

const goToNextStep = (establishmentName, competitorId) => {
    emit('changeStep', { step: 3, establishmentName, competitorId });
};

const showSpinner = ref(false);
const dataSocials = ref([]);
const dataPlatforms = ref([]);

const urlGoogle = ref('');
const urlTripadvisor = ref('');
const urlFacebook = ref('');
const urlInstagram = ref('');
const urlTwitter = ref('');

const isValidGoogle = ref(true);
const isValidTripadvisor = ref(true);
const isValidFacebook = ref(true);
const isValidInstagram = ref(true);
const isValidTwitter = ref(true);

const platform = ref(null);
const platformLink = ref('');
const isValidPlatform = ref(true);
const platformEntries = ref([]);

const socialLink = ref('');
const social = ref('');
const isValidSocial = ref(true);
const socialEntries = ref([]);

function addNewPlatform() {
    platformEntries.value.push({
        platform: null,
        platformLink: '',
        isValidPlatform: true,
        selectedPlatform: null
    });
}

function removePlatform(index) {
    platformEntries.value.splice(index, 1);
}

function addNewSocial() {
    socialEntries.value.push({
        social: null,
        socialLink: '',
        isValidSocial: true,
        selectedSocial: null
    })
}

function removeSocial(index) {
    socialEntries.value.splice(index, 1);
}

const validateGoogleUrl = () => {
    const googlePattern = /^https:\/\/www\.google\.com\/search\?q=.+/;
    isValidGoogle.value = googlePattern.test(urlGoogle.value);
};


const validateTripadvisorUrl = () => {
    const tripadvisorPattern = /^https:\/\/www\.tripadvisor\.com\/.+/;
    isValidTripadvisor.value = tripadvisorPattern.test(urlTripadvisor.value);
};

const validateFacebookUrl = () => {
    const facebookPattern = /^https:\/\/www\.facebook\.com\/.+/;
    isValidFacebook.value = facebookPattern.test(urlFacebook.value);
};

const validateInstagramUrl = () => {
    const instagramPattern = /^https:\/\/www\.instagram\.com\/.+/;
    isValidInstagram.value = instagramPattern.test(urlInstagram.value);
};

const validateTwitterUrl = () => {
    const twitterPattern = /^https:\/\/x\.com\/.+/;
    isValidTwitter.value = twitterPattern.test(urlTwitter.value);
};

watch(urlGoogle, validateGoogleUrl);
watch(urlTripadvisor, validateTripadvisorUrl);
watch(urlFacebook, validateFacebookUrl);
watch(urlInstagram, validateInstagramUrl);
watch(urlTwitter, validateTwitterUrl);


const handleChangePlatform = (value, index) => {
    const selected = dataPlatforms.value.find(item => item.id.toString() === value.toString());
    console.log('Available Platforms:', dataPlatforms.value);
    console.log('Selected ID:', value);
    console.log('Selected Platform:', selected);

    if (selected) {
        platformEntries.value[index].selectedPlatform = {
            id: selected.id,
            url: selected.url,
        };
    } else {
        platformEntries.value[index].selectedPlatform = { url: '' };
        console.error('No matching platform found for ID:', value);
    }
    validatePlatformUrl(index);
}

const handleChangeSocial = (value, index) => {
    const selected = dataSocials.value.find(item => item.id.toString() === value.toString());
    console.log('Available social:', dataSocials.value);
    console.log('Selected ID:', value);
    console.log('Selected social:', selected);

    if (selected) {
        socialEntries.value[index].selectedSocial = {
            id: selected.id,
            url: selected.url,
        };
    } else {
        socialEntries.value[index].selectedSocial = { url: '' };
        console.error('No matching platform found for ID:', value);
    }
    validateSocialUrl(index);
}

// const isPlatformUrl = (url, urlTemplate) => {
//     const langAccept = ['fr', 'mu']
//     const splitLink = platformLink.value.split('/')
//     const existsInB = langAccept.some(item => splitLink.includes(item));
//     const pattern = urlPattern(urlTemplate);

//     let isValid = false

//     if (pattern.test(url)) {
//         isValid = true;
//     }

//     if (existsInB) {
//         isValid = true;
//     }

//     return isValid
// }

const validatePlatformUrl = (index) => {
    const entry = platformEntries.value[index];
    if (entry.platformLink && entry.selectedPlatform) {
        const pattern = urlPattern(entry.selectedPlatform.url);
        entry.isValidPlatform = pattern.test(entry.platformLink);
    } else {
        entry.isValidPlatform = false;
    }
}

const validateSocialUrl = (index) => {
    const entry = socialEntries.value[index];
    if (entry.socialLink && entry.selectedSocial) {
        const pattern = urlPattern(entry.selectedSocial.url);
        entry.isValidSocial = pattern.test(entry.socialLink);
    } else {
        entry.isValidSocial = false;
    }
}

// const isValidSocialUrl = (url, urlTemplate) => {
//     const langAccept = ['fr', 'mu'];
//     const splitLink = social.value.split('/');
//     const existsInB = langAccept.some(item => splitLink.includes(item));
//     const pattern = urlPattern(urlTemplate);

//     let isValid = false;

//     if (pattern.test(url)) {
//         isValid = true;
//     }

//     if (existsInB) {
//         isValid = true;
//     }

//     return isValid;
// };


const urlPattern = (urlTemplate, extensions = ['fr', 'es', 'com']) => {
    const url = new URL(urlTemplate);

    const domainParts = url.hostname.split('.');

    let regexPattern = urlTemplate.replace(/[\-\[\]\/\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");

    regexPattern = regexPattern.replace(/{value1}/g, '(.+)');
    regexPattern = regexPattern.replace(/q=/g, '');

    const extensionPattern = extensions.join('|');
    regexPattern = regexPattern.replace(new RegExp(`\\.${domainParts[domainParts.length - 1]}`), `.(?:${extensionPattern})`);

    return new RegExp('^' + regexPattern);
};


const submit = async () => {
    showSpinner.value = true;

    const providersData = [
        { value1: urlGoogle.value, provider: providersMap.value.google, name: 'Google' },
        { value1: urlTripadvisor.value, provider: providersMap.value.tripadvisor, name: 'Tripadvisor UK' },
        { value1: urlFacebook.value, provider: providersMap.value.facebook, name: 'Facebook' },
        { value1: urlInstagram.value, provider: providersMap.value.instagram, name: 'Instagram' },
        { value1: urlTwitter.value, provider: providersMap.value.twitter, name: 'Twitter' },
    ];

    const platformsData = platformEntries.value.map(entry => ({
        value1: entry.platformLink,
        provider: `/api/providers/${entry.selectedPlatform.id}`,
        name: entry.selectedPlatform.name
    }));

    const socialsData = socialEntries.value.map(entry => ({
        value1: entry.socialLink,
        provider: `/api/providers/${entry.selectedSocial.id}`,
        name: entry.selectedSocial.name
    }));

    const providersAllData = [...providersData, ...platformsData, ...socialsData];
    const validProviders = providersAllData.filter(platform => platform.value1 !== '' && platform.provider);

    try {

        for (const platform of validProviders) {
            const data = {
                value1: platform.value1 || ' ',
                provider: platform.provider,
                enable: true,
                establishment: `/api/establishments/${props.competitorId}`,
                section: '',
                caption: null
            };

            const response = await new Promise((resolve, reject) => {
                services.createRecord('settings', data, (response) => {
                    if (response.status === 201) {
                        resolve(response);
                    } else {
                        reject(response);
                    }
                });
            });
        }
        ElMessage({
            message: `URL added successfully`,
            type: 'success',
        });

        goToNextStep(props.establishmentName, props.competitorId);

    } catch (error) {
        console.error('Error submitting platform data:', error);
    } finally {
        showSpinner.value = false;
        resetValue();
    }
};


watch(platformEntries.value, (newEntries) => {
    newEntries.forEach((entry, index) => {
        watch(() => entry.platformLink, () => validatePlatformUrl(index));
    });
}, { deep: true });

watch(socialEntries.value, (newEntries) => {
    newEntries.forEach((entry, index) => {
        watch(() => entry.socialLink, () => validateSocialUrl(index));
    });
}, { deep: true });

const resetValue = () => {
    platform.value = null;
    social.value = null;
    platformLink.value = '';
    socialLink.value = '';
    urlGoogle.value = '';
    urlTripadvisor.value = '';
    urlFacebook.value = '';
    urlInstagram.value = '';
    urlTwitter.value = '';
    isValidPlatform.value = true;
    isValidSocial.value = true;
    isValidGoogle.value = true;
    isValidTripadvisor.value = true;
    isValidFacebook.value = true;
    isValidInstagram.value = true;
    isValidTwitter.value = true;
};

const providersMap = ref({
    google: null,
    tripadvisor: null,
    facebook: null,
    instagram: null,
    twitter: null,
});


onBeforeMount(async () => {
    try {
        const response = await new Promise((resolve) => {
            services.get_Record(`providers`, (response) => {
                resolve(response);
            });
        });

        if (response.status === 200) {
            const dataSocial = response.data['hydra:member'];
            dataSocials.value = dataSocial.filter(item => item.category === 'Social' && item.name !== 'Facebook' && item.name !== 'Instagram' && item.name !== 'Twitter (X)');
            const dataPlatform = response.data['hydra:member'];
            dataPlatforms.value = dataPlatform.filter(item => item.category === 'Platform' && item.name !== 'Google' && item.name !== 'Tripadvisor UK');

            const providers = response.data['hydra:member'];

            if (Array.isArray(providers)) {
                const googleProvider = providers.find(provider => provider.name === 'Google');
                const tripadvisorProvider = providers.find(provider => provider.name === 'Tripadvisor UK');
                const facebookProvider = providers.find(provider => provider.name === 'Facebook');
                const instagramProvider = providers.find(provider => provider.name === 'Instagram');
                const twitterProvider = providers.find(provider => provider.name === 'Twitter (X)');


                providersMap.value.google = googleProvider ? googleProvider["@id"] : null;
                providersMap.value.tripadvisor = tripadvisorProvider ? tripadvisorProvider["@id"] : null;
                providersMap.value.facebook = facebookProvider ? facebookProvider["@id"] : null;
                providersMap.value.instagram = instagramProvider ? instagramProvider["@id"] : null;
                providersMap.value.twitter = twitterProvider ? twitterProvider["@id"] : null;

            } else {
                console.error('Providers data is not an array');
            }
        } else {
            console.error('Error fetching providers:', response);
        }
    } catch (error) {
        console.error('Error in onBeforeMount:', error);
    }
});

</script>

<style scoped>
.title {
    margin-bottom: 1.5rem;
    font-weight: 600;
}

form {
    height: 750px !important;
}

form button {
    min-width: 8rem !important;
}

button.isLoaded {
    display: flex;
    justify-content: center;
    align-items: center;
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

input,
select {
    border-radius: 4px !important;
    background-color: white;
}

label {
    font-weight: 500 !important;
    font-size: 14px !important;
    color: var(--color-bg2) !important;
}

label span {
    color: red;
}

input {
    caret-color: var(--light-color-bg2);
}

.image-selector {
    width: 100%;
    height: 250px;
    border-radius: 8px;
    border-width: 2px;
    border-style: solid;
    cursor: pointer;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    position: relative;
}

.image-selector.hover:hover {
    background: rgba(245, 245, 250, .4);
}

.image-selector * {
    font-size: 64px;
    color: var(--color-bg2)
}

.img-hover {
    width: 100%;
    height: 100%;
    z-index: 5;
    position: absolute;
    top: 0;
    left: 0;
    background: rgba(245, 245, 250, .4);
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
}

.table__container {
    overflow-y: auto;
    width: 100%;
}

form button {
    width: 100%;
}

@media screen and (min-width: 480px) {
    form button {
        width: 12rem !important;
    }
}

@media screen and (max-width: 800px) {
    .security__header {
        width: 100%;
    }
}

.button__plus {
    background-color: var(--light-color-bg2);
    margin-right: 15px;
    padding: 8px;
    color: white;
    font-size: 12px;
    border-radius: 5px;
}

.button__plus:hover,
.button__close:hover {
    cursor: pointer;
}

.content__label {
    display: flex;
    justify-content: space-between;
}

.button__close {
    font-weight: bold;
    color: red;
}
</style>