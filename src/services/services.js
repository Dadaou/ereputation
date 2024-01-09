import axios from 'axios'
import { pinia } from '@/main';
// import { useUserStore } from "@Stores/user.js";
// import { useCompanyStore } from "@Stores/company.js";
// import { useChartsStore } from "@Stores/charts.js";
// import { useSocialStore } from "@Stores/social.js";
// import { useStaffStore } from '@Stores/staff.js';

var axiosInstance = null
var publicAxiosInstance = null

// const userStore = useUserStore();
// const companiesStore = useCompanyStore();
// const chartsStore = useChartsStore();
// const socialStore = useSocialStore();
// const staffStore = useStaffStore();

const resetAllStores = () => {
  Object.keys(pinia.state.value).forEach((storeId) => {
    const store = pinia.store(storeId);
    store.$reset();
  });
}

const setToken = (token) => {
  localStorage.setItem('access', token)
}

const setUser = () => {
  localStorage.setItem('user_authenticated', true)
}

const setURL = (baseURL) => {
  axiosInstance = axios.create({
    baseURL: baseURL,
    headers: {
      'Content-Type': 'application/json'
    }
  })
  publicAxiosInstance = axios.create({
    baseURL: baseURL.slice(0, baseURL.length - 3),
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

const logout = () => {
  localStorage.removeItem('access')
  localStorage.removeItem('user')
  localStorage.removeItem('user_authenticated')
  delete axiosInstance.defaults.headers['Authorization']
  resetAllStores();
}

const checkConnexionInfo = () => {
  if (!axiosInstance || !axiosInstance.defaults['baseURL']) {
    console.log(
      'Request canceled! Please ensure that the URL to the API is configured using the setURL(baseURL) function and that you are connected to the server through login(username, password).'
    )
    return false
  } else return true
}

const getRecords = async (entity, next) => {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('access')}`
  }
  try {
    let url = `/${entity}`
    if (checkConnexionInfo()) {
      await axiosInstance.get(`${url}`, { headers }).then((response) => {
        return next(response)
      })
    }
  } catch (error) {
    return next(error.response)
  }
}

const getRecordsByParams = async (entity, params, next) => {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('access')}`
  }
  try {
    let url = `/${entity}?${params}`
    if (checkConnexionInfo()) {
      await axiosInstance.get(`${url}`, { headers }).then((response) => {
        return next(response)
      })
    }
  } catch (error) {
    return next(error.response)
  }
}

const getRecord = async (entity, recordId, next) => {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('access')}`
  }
  try {
    let url = `/${entity}/${recordId}`
    if (checkConnexionInfo()) {
      await axiosInstance.get(`${url}`, { headers }).then((response) => {
        next(response)
      })
    }
  } catch (error) {
    return next(error.response)
  }
}

const get_Record = async (url, next, isPublic = false) => {
  const headers = {
    'Content-Type': 'application/json'
  }

  if (!isPublic) {
    headers['Authorization'] = `Bearer ${localStorage.getItem('access')}`

    try {
      if (checkConnexionInfo()) {
        await axiosInstance.get(`${url}`, { headers }).then((response) => {
          next(response)
        })
      }
    } catch (error) {
      return next(error.response)
    }
  } else {
    try {
      await publicAxiosInstance.get(`${url}`, { headers }).then((response) => {
        next(response)
      })
    } catch (error) {
      return next(error.response)
    }
  }
}

const post_Record = async (url, body, next, isPublic = false) => {
  const headers = {
    'Content-Type': 'application/json'
  }

  if (!isPublic) {
    headers['Authorization'] = `Bearer ${localStorage.getItem('access')}`

    try {
      if (checkConnexionInfo()) {
        await axiosInstance.post(`${url}`, body, { headers }).then((response) => {
          next(response)
        })
      }
    } catch (error) {
      return next(error.response)
    }
  } else {
    try {
      await publicAxiosInstance.post(`${url}`, body, { headers }).then((response) => {
        next(response)
      })
    } catch (error) {
      return next(error.response)
    }
  }
}

const createRecord = async (entity, value, next) => {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('access')}`
  }
  if (checkConnexionInfo()) {
    try {
      let url = `/${entity}`
      await axiosInstance.post(`${url}`, value, { headers }).then((response) => {
        return next(response)
      })
    } catch (error) {
      return next(error.response)
    }
  }
}

const deleteRecord = async (entity, recordId, next) => {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('access')}`
  }
  if (checkConnexionInfo()) {
    try {
      let url = `/${entity}/${recordId}`
      await axiosInstance.delete(`${url}`, { headers }).then((response) => {
        return next(response)
      })
    } catch (error) {
      console.log(error)
      return next(error.response)
    }
  }
}

const patchRecord = async (entity, recordId, value, next) => {
  const headers = {
    'Content-Type': 'application/merge-patch+json',
    Authorization: `Bearer ${localStorage.getItem('access')}`
  }
  if (checkConnexionInfo()) {
    try {
      let url = `/${entity}/${recordId}`
      await axiosInstance.patch(url, value, { headers }).then((response) => {
        return next(response)
      })
    } catch (error) {
      console.log(error)
      return next(error.response)
    }
  }
}

const putRecord = async (entity, recordId, value, next) => {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('access')}`
  }
  if (checkConnexionInfo()) {
    try {
      let url = `/${entity}/${recordId}`
      await axiosInstance.put(`${url}`, value, { headers }).then((response) => {
        return next(response)
      })
    } catch (error) {
      return next(error.response)
    }
  }
}

const login = async (email, password) => {
  try {
    const response = await axiosInstance.post('/login', { email: email, password: password })
    if (response.status == 200) {
      setToken(response.data['token'])
	    console.log(response.data)
    }
    return response
  } catch (error) {
    return error.response
  }
}

const login_2nd = async (email, password, next) => {
  try {
    const headers = {
      'Content-Type': 'application/json'
    }
    await axiosInstance
      .post('/login', { email: email, password: password }, { headers })
      .then((response) => {
        console.log(response)
        if (response.status == 200) {
          setToken(response.data['token'])
        }
        next(response)
      })
  } catch (error) {
    return next(error.response)
  }
}

const reviewAnalysis = async (path, value, next) => {
  try {
    await axios.post(path, value).then((response) => {
      next(response)
    })
  } catch (error) {
    console.log(error)
  }
}

export default {
  setToken,
  setURL,
  getRecords,
  getRecord,
  get_Record,
  createRecord,
  deleteRecord,
  putRecord,
  patchRecord,
  logout,
  login,
  login_2nd,
  setUser,
  getRecordsByParams,
  reviewAnalysis,
  post_Record
}
