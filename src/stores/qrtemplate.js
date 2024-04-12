import { defineStore } from 'pinia'
import services from '@Services/services.js'
import { ref } from 'vue'
import moment from 'moment'

export const useQrStore = defineStore('qr', () => {
  const templates = ref(null)
  const qrcodeValue = ref(null);
  const last_request = ref(null)

  const IsValueOkay = (value) => (value == '' || value == 'Global' || value == 0 || value == null || value == undefined) ? false : true;
  const getTemplates = async (customer, establishment)=>{
  	let api = 'customer/qrtemplates'
  	let params = `tag=${customer}`
  	
  	if(IsValueOkay(establishment)){
  		params += `&establishment=${establishment}`
  	}

  	api += `?${params}`

  	if(last_request.value || last_request.value !== api){
  		last_request.value = api

  		const response = await new Promise((resolve) => {
	        services.get_Record(api, (response) => {
	            resolve(response);
	        });
	    });

	    if(response.status == 200){
	    	templates.value = response.data;
	    }
  	}

 	return templates.value
  }

  const setQrCodeValue = (value)=>{
  	if(qrcodeValue.value || qrcodeValue.value !== value){
  		qrcodeValue.value = value
  	}
  }

  return {
    templates,
    qrcodeValue,
    getTemplates,
    setQrCodeValue
  }
 },
  {
    persist: true
  }
)
