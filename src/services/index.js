import axios from 'axios'
var axiosInstance = null

const setToken = (token) => {
    axiosInstance.defaults.headers["token"] = token;
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
    delete axiosInstance.defaults.headers["token"];
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
        if(checkConnexionInfo()){
            await axiosInstance.get(`${url}`).then((response)=>{
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
        if(checkConnexionInfo()){
            await axiosInstance.get(`${url}`).then((response)=>{
                return next(response);
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
            await axiosInstance.post(`${url}`, value)
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
            await axiosInstance.delete(`${url}`)
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
            await axiosInstance.patch(url, { value }).then((response)=> {return next(response)})
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
            await axios.put(`${url}`, value)
                       .then((response)=> {return next(response)})
        } catch (error) {
            return next(error.response)
        }
    }
};

const login = async (email, password, next) => {
    try {
        const response = await axiosInstance.post("/api/login", { email: email, password: password})
        next(response)   
    } catch (error) {
        next(error.response)
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
    login
}