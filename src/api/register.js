import axios from 'axios';
import mainConfig from "../configs/main";

export default {
    registerUser: userData => axios.post(`${mainConfig.apiHost  }/candidates`, userData).then(res => res.data),
}
