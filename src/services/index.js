import axios from 'axios'
var axiosInstance = null

const headers = {
    'Content-Type': 'application/json',
    // 'Authorization': 'Bearer ' + localStorage.getItem("access")
};

const setToken = (token) => {
    localStorage.setItem("access", token)
    axiosInstance.defaults.headers['Authorization'] = 'Bearer ' + token;
}

const setUser = (user) => {
    localStorage.setItem("user",  JSON.stringify(user))
    localStorage.setItem("user_authenticated",  true)
}

const setURL = (baseURL) => {
    axiosInstance = axios.create({
        baseURL: baseURL,
        headers: {
          "Content-Type": "application/json",
        },
    });
};

const logout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("user_authenticated");
    localStorage.removeItem("user");
    localStorage.removeItem("user_role");
    delete axiosInstance.defaults.headers["Authorization"];
};

const checkConnexionInfo = () => {
    if (!axiosInstance || !axiosInstance.defaults["baseURL"]) {
        console.log("Request canceled! Please ensure that the URL to the API is configured using the setURL(baseURL) function and that you are connected to the server through login(username, password).")
        return false
    }
    else return true
}

const getRecords= async (entity, next)=>{
    try {
        let url = `/api/${entity}`;
        if (checkConnexionInfo()) {
            await axiosInstance.get(`${url}`, {headers}).then((response)=>{
                return next(response);
            })   
        }
    } catch (error) {
        return next(error.response)
    }
}

const getRecord= async (entity, recordId, next)=>{
    try {
        let url = `/api/${entity}/${recordId}`;
        if (checkConnexionInfo()) {
            console.log(axiosInstance.defaults)
            await axiosInstance.get(`${url}`, {headers}).then((response)=>{
                next(response);
            })   
        }
    } catch (error) {
        return next(error.response)
    }
}

const createRecord = async (entity, value, next) => {
    if (checkConnexionInfo()) {
        try {
            let url = `/api/${entity}`;
            await axiosInstance.post(`${url}`, value, {headers})
                       .then((response)=> {return next(response)})
        } catch (error) {
            return next(error.response)
        }
    }
};

const deleteRecord = async (entity, recordId, next) => {
    if (checkConnexionInfo()) {
        try {
            let url = `/api/${entity}/${recordId}`;
            await axiosInstance.delete(`${url}`, {headers})
                       .then((response)=> {return next(response)})
        } catch (error) {
            console.log(error)
            return next(error.response)
        }
    }
};

const patchRecord = async (entity, recordId, value, next) => {
    if (checkConnexionInfo()) {
        try {
            let url = `/api/${entity}/${recordId}`;
            await axiosInstance.patch(url, value, {headers}).then((response)=> {return next(response)})
        } catch (error) {
            console.log(error)
            return next(error.response)
        }
    }
};

const putRecord = async (entity, recordId, value, next) => {
    if (checkConnexionInfo()) {
        try {
            let url = `/api/${entity}/${recordId}`;
            await axios.put(`${url}`, value, {headers})
                       .then((response)=> {return next(response)})
        } catch (error) {
            return next(error.response)
        }
    }
};

const login = async (email, password) => {
    try {
        const response = await axiosInstance.post("/api/login", { email: email, password: password})
       return response   
    } catch (error) {
       return error.response
    }
};

export default {
    setToken,
    setURL,
    getRecords,
    getRecord,
    createRecord,
    deleteRecord,
    putRecord,
    patchRecord,
    logout,
    login,
    setUser,
}