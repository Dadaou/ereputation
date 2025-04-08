import axios from 'axios'

const setToken = (token) => {
  localStorage.setItem('token', token)
}

const setAccess = (token) => {
  localStorage.setItem('access', token)
}

const setUser = () => {
  localStorage.setItem('user_authenticated', true)
}

const getInstance = (isPublic = false, isNoAuth = false) => {
  const instance = axios.create({
    headers: {
      'Content-Type': 'application/json'
    }
  })



  const baseURL = import.meta.env.VITE_APP_API_URL

  if (isNoAuth) {
    instance.defaults.baseURL = baseURL.slice(0, baseURL.length - 3)
  } else {
    instance.defaults.baseURL = baseURL
    if (isPublic == true) {
      instance.defaults.headers['Authorization'] = `Bearer ${localStorage.getItem('access')}`
    } else {
      instance.defaults.headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`
    }
  }

  return instance
}

const getInstanceFormData = (isPublic = false, isNoAuth = false) => {
  const instance = axios.create({
    headers: {
      
    }
  })

  const baseURL = import.meta.env.VITE_APP_API_URL

  if (isNoAuth) {
    instance.defaults.baseURL = baseURL.slice(0, baseURL.length - 3)
  } else {
    instance.defaults.baseURL = baseURL
    if (isPublic == true) {
      instance.defaults.headers['Authorization'] = `Bearer ${localStorage.getItem('access')}`
    } else {
      instance.defaults.headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`
    }
  }

  return instance
}

const logout = () => {
  localStorage.removeItem('access')
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  localStorage.removeItem('user_authenticated')
}

const getRecords = async (entity, next, isPublic = false, isNoAuth = false) => {
  try {
    const axiosInstance = getInstance(isPublic, isNoAuth)
    let url = `/${entity}`
    await axiosInstance.get(`${url}`).then((response) => {
      return next(response)
    })
  } catch (error) {
    return next(error.response)
  }
}

const getRecordsByParams = async (entity, params, next, isPublic = false, isNoAuth = false) => {
  try {
    const axiosInstance = getInstance(isPublic, isNoAuth)
    let url = `/${entity}?${params}`
    await axiosInstance.get(`${url}`).then((response) => {
      return next(response)
    })
  } catch (error) {
    return next(error.response)
  }
}

const getRecord = async (entity, recordId, next, isPublic = false, isNoAuth = false) => {
  try {
    const axiosInstance = getInstance(isPublic, isNoAuth)
    let url = `/${entity}/${recordId}`
    await axiosInstance.get(`${url}`).then((response) => {
      next(response)
    })
  } catch (error) {
    return next(error.response)
  }
}

const get_Record = async (url, next, isPublic = false, isNoAuth = false) => {
  try {
    const axiosInstance = getInstance(isPublic, isNoAuth)
    await axiosInstance.get(`${url}`).then((response) => {
      next(response)
    })
  } catch (error) {
    return next(error.response)
  }
}

const post_Record = async (url, body, next, isPublic = false, isNoAuth = false) => {
  try {
    const axiosInstance = getInstance(isPublic, isNoAuth)
    await axiosInstance.post(`${url}`, body).then((response) => {
      next(response)
    })
  } catch (error) {
    return next(error.response)
  }
}

const post_Record_formData = async (url, body, next, isPublic = false, isNoAuth = false) => {
  try {
    const axiosInstance = getInstanceFormData(isPublic, isNoAuth)
    await axiosInstance.post(`${url}`, body).then((response) => {
      next(response)
    })
  } catch (error) {
    return next(error.response)
  }
}

const createRecord = async (entity, value, next, isPublic = false, isNoAuth = false) => {
  try {
    let url = `/${entity}`
    const axiosInstance = getInstance(isPublic, isNoAuth)
    await axiosInstance.post(`${url}`, value).then((response) => {
      return next(response)
    })
  } catch (error) {
    return next(error.response)
  }
}



const createActionVisitor = async (value, next, isPublic = false, isNoAuth = false) => {
  try {
    let url = `/public/visitors/actions`
    const axiosInstance = getInstance(isPublic, isNoAuth)
    await axiosInstance.post(`${url}`, value).then((response) => {
      return next(response)
    })
  } catch (error) {
    return next(error.response)
  }
}

const deleteRecord = async (entity, recordId, next, isPublic = false, isNoAuth = false) => {
  try {
    let url = `/${entity}/${recordId}`
    const axiosInstance = getInstance(isPublic, isNoAuth)
    await axiosInstance.delete(`${url}`).then((response) => {
      return next(response)
    })
  } catch (error) {
    return next(error.response)
  }
}

const patchRecord = async (entity, recordId, value, next, isPublic = false, isNoAuth = false) => {
  try {
    var axiosInstance = getInstance(isPublic, isNoAuth)
    axiosInstance.defaults.headers['Content-Type'] = 'application/merge-patch+json'

    let url = `/${entity}/${recordId}`
    await axiosInstance.patch(url, value).then((response) => {
      return next(response)
    })
  } catch (error) {
    return next(error.response)
  }
}

const putRecord = async (entity, recordId, value, next, isPublic = false, isNoAuth = false) => {
  try {
    let url = `/${entity}/${recordId}`
    const axiosInstance = getInstance(isPublic, isNoAuth)
    await axiosInstance.put(`${url}`, value).then((response) => {
      return next(response)
    })
  } catch (error) {
    return next(error.response)
  }
}

const postFormData = async (entity, value, next, isPublic = false, isNoAuth = false) => {
  try {
    let url = `/${entity}`
    var axiosInstance = getInstance(isPublic, isNoAuth)
    axiosInstance.defaults.headers['Content-Type'] = 'multipart/form-data'
    await axiosInstance.post(`${url}`, value).then((response) => {
      return next(response)
    })
  } catch (error) {
    return next(error.response)
  }
}

const login = async (email, password) => {
  const baseURL = import.meta.env.VITE_APP_API_URL

  try {
    var axiosInstance = axios.create({
      baseURL: baseURL.slice(0, baseURL.length - 3),
      headers: {
        'Content-Type': 'application/json'
      }
    })

    const response = await axiosInstance.post('/erep/login', { email: email, password: password })

    if (response.status == 200) {
      setToken(response.data['token'])
    }
    return response
  } catch (error) {
    return error.response
  }
}

const login_2nd = async (email, password, next) => {
  try {
    var axiosInstance = axios.create({
      baseURL: import.meta.env.VITE_APP_API_URL,
      headers: {
        'Content-Type': 'application/json'
      }
    })
    await axiosInstance.post('/login', { email: email, password: password }).then((response) => {
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
  let width, red, feeling

  if (score === 0) {
    width = 0
    red = 255
    feeling = -1
  } else {
    width = calculateWidth(score)
    red = calculateRed(score)
    feeling = 1
  }

  return {
    width: width,
    red: red,
    green: 255,
    feeling: feeling,
    score: score
  }
}

function calculateWidth(score) {
  return score * 50
}

function calculateRed(score) {
  return (1 - score) * 255
}

const resizeBase64Image = async (base64, targetWidth, targetHeight) => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = async () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d', { colorSpace: 'srgb', pixelFormat: 'unorm8' })
      canvas.width = targetWidth
      canvas.height = targetHeight

      // Utilisation de createImageBitmap pour un redimensionnement sans flou
      let bitmap = await createImageBitmap(img, {
        resizeWidth: targetWidth,
        resizeHeight: targetHeight,
        resizeQuality: 'pixelated' // Pour une qualité pixelisée
      })

      // Dessin de l'image bitmap sur le canvas
      ctx.drawImage(bitmap, 0, 0, targetWidth, targetHeight)
      bitmap.close()

      const newBase64 = canvas.toDataURL('image/jpeg')
      resolve(newBase64)
    }
    img.onerror = reject
    img.src = base64
  })
}

const downloadQrcode = async (filename, base64Image) => {
  try {
    const resizedBase64Image = await resizeBase64Image(base64Image, 500, 500) // Exemple de dimensions
    let link = document.createElement('a')
    link.download = `${filename}.jpeg`
    link.href = resizedBase64Image
    link.click()
  } catch (error) {
    console.error("Erreur lors du redimensionnement de l'image", error)
  }
}

const downloadSVGQrcode = async (filename, elementID) => {
  try {
    var svg = document.getElementById(elementID)

    let link = document.createElement('a')
    link.download = `${filename}.svg`

    var serializer = new XMLSerializer()
    var source = serializer.serializeToString(svg)
    if (!source.match(/^<svg[^>]+xmlns="http:\/\/www\.w3\.org\/2000\/svg"/)) {
      source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"')
    }
    if (!source.match(/^<svg[^>]+"http:\/\/www\.w3\.org\/1999\/xlink"/)) {
      source = source.replace(/^<svg/, '<svg xmlns:xlink="http://www.w3.org/1999/xlink"')
    }
    source = '<?xml version="1.0" standalone="no"?>\r\n' + source
    var url = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(source)

    link.href = url
    link.click()
  } catch (error) {
    console.error("Erreur lors du redimensionnement de l'image", error)
  }
}

const downloadJPEGQrcode = async (filename, elementID, maxWidth, maxHeight) => {
  try {
    var svg = document.getElementById(elementID)
    var canvas = document.createElement('canvas')
    canvas.width = maxWidth
    canvas.height = maxHeight
    var ctx = canvas.getContext('2d')
    canvg(canvas, svg.outerHTML)

    // Ajout des marges de 20 pixels
    var marginX = 20
    var marginY = 20
    var newCanvas = document.createElement('canvas')
    newCanvas.width = canvas.width + 2 * marginX
    newCanvas.height = canvas.height + 2 * marginY
    var newCtx = newCanvas.getContext('2d')
    newCtx.fillStyle = 'white'
    newCtx.fillRect(0, 0, newCanvas.width, newCanvas.height)
    newCtx.drawImage(canvas, marginX, marginY)

    var dataURL = newCanvas.toDataURL('image/jpeg')

    let link = document.createElement('a')
    link.download = `${filename}.jpeg`
    link.href = dataURL
    link.click()
  } catch (error) {
    console.error("Erreur lors du redimensionnement de l'image", error)
  }
}

const hashString = (inputString) => {
  let hash = 0
  for (let i = 0; i < inputString.length; i++) {
    hash = (hash << 5) - hash + inputString.charCodeAt(i)
  }
  return hash
}

const truncateText=(text, length)=> {
    if (text.length > length) {
      return text.substring(0, length) + '...'; 
    } 
    return text;
  }

const generateColor = (text) => {
  const inputString = text
  const hash = hashString(inputString)

  const red = (hash & 0xff0000) >> 16
  const green = (hash & 0x00ff00) >> 8
  const blue = hash & 0x0000ff

  return `rgb(${red}, ${green}, ${blue})`
}

const mountChatWidget = () => {

  const liveChatID = import.meta.env.VITE_LIVE_CHAT_ID

  const callUsSelector = document.createElement("call-us-selector")
  callUsSelector.setAttribute(
    "phonesystem-url",
    "https://m-unit.on3cx.fr:5001"
  );
  callUsSelector.setAttribute("party", liveChatID)
  document.body.appendChild(callUsSelector)
}

const unmountChatWidget = () => {

  const callUsSelector = document.querySelector("call-us-selector");

  if (callUsSelector) {
    callUsSelector.remove()
  } else {
    console.log("Chat widget not found in the DOM.")
  }
}

const createTopScrollBar = () => {

  const scrollWrapper = document.querySelector('.scroll_wrapper');
  const tableScrollWrapper = document.querySelector('.el-table .el-scrollbar__wrap')

  if (scrollWrapper && tableScrollWrapper) {

      scrollWrapper.addEventListener('scroll', function() {
        tableScrollWrapper.scrollLeft = scrollWrapper.scrollLeft
      })
        
      tableScrollWrapper.addEventListener('scroll', function() {
        scrollWrapper.scrollLeft = tableScrollWrapper.scrollLeft
      })

  }
}



export default {
  setToken,
  mountChatWidget,
  unmountChatWidget,
  createTopScrollBar,
  setAccess,
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
  downloadSVGQrcode,
  generateColor,
  downloadJPEGQrcode,
  post_Record_formData,
  createActionVisitor
}
