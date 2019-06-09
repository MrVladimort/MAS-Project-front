import axios from 'axios';
import mainConfig from "../configs/main";

export default {
    loginEmail: credentials => axios.post(`${mainConfig.apiHost}/auth/login`, credentials).then(res => res.data),
    authWithToken: () => axios.get(`${mainConfig.apiHost}/auth/user`).then(res => res.data),
    registerClient: clientData => axios.post(`${mainConfig.apiHost}/auth/register/client`, clientData).then(res => res.data),
    registerAdmin: adminData => axios.get(`${mainConfig.apiHost}/auth/register/admin`, adminData).then(res => res.data),
}
