import axios from 'axios'
import { pinia } from '@/main'

var axiosInstance = null
var publicAxiosInstance = null

const resetAllStores = () => {
  // Object.keys(pinia.state.value).forEach((storeId) => {
  //   const store = pinia.store(storeId)
  //   store.$reset()
  // })
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
  // resetAllStores()
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
    console.log(url)
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

const postFormData = async (entity, value, next) => {
  const headers = {
    'Content-Type': 'multipart/form-data',
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

function getScoreColor(score) {
    let width, red, feeling;

    if (score === 0) {
        width = 0;
        red = 255;
        feeling = -1;
    } else {
        width = calculateWidth(score);
        red = calculateRed(score);
        feeling = 1;
    }

    return {
        "width": width,
        "red": red,
        "green": 255,
        "feeling": feeling,
        "score": score
    };
}

function calculateWidth(score) {
    return score * 50;
}

function calculateRed(score) {
    return (1 - score) * 255;
}


const resizeBase64Image = async (base64, targetWidth, targetHeight) => {
 return new Promise(async (resolve, reject) => {
    const img = new Image();
    img.onload = async () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d', { colorSpace: 'srgb', pixelFormat: 'unorm8' });
      canvas.width = targetWidth;
      canvas.height = targetHeight;

      // Utilisation de createImageBitmap pour un redimensionnement sans flou
      let bitmap = await createImageBitmap(img, {
        resizeWidth: targetWidth,
        resizeHeight: targetHeight,
        resizeQuality: 'pixelated' // Pour une qualité pixelisée
      });

      // Dessin de l'image bitmap sur le canvas
      ctx.drawImage(bitmap, 0, 0, targetWidth, targetHeight);
      bitmap.close();

      const newBase64 = canvas.toDataURL('image/jpeg');
      resolve(newBase64);
    };
    img.onerror = reject;
    img.src = base64;
 });
};

const downloadQrcode = async (filename, base64Image) => {
 try {
    const resizedBase64Image = await resizeBase64Image(base64Image, 500, 500); // Exemple de dimensions
    let link = document.createElement('a');
    link.download = `${filename}.jpeg`;
    link.href = resizedBase64Image;
    link.click();
 } catch (error) {
    console.error('Erreur lors du redimensionnement de l\'image', error);
 }
};

const hashString = (inputString) => {
      let hash = 0;
      for (let i = 0; i < inputString.length; i++) {
        hash = (hash << 5) - hash + inputString.charCodeAt(i);
      }
      return hash;
}

const generateColor = (text) =>{
      const inputString = text;
      const hash = hashString(inputString);

      const red = (hash & 0xFF0000) >> 16;
      const green = (hash & 0x00FF00) >> 8;
      const blue = hash & 0x0000FF;

      return `rgb(${red}, ${green}, ${blue})`;
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
  post_Record,
  postFormData,
  getScoreColor,
  downloadQrcode,
  generateColor
}
