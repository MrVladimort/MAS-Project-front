import axios from 'axios';
import mainConfig from "../configs/main";

export default {
    getOrder: (orderId) => axios.get(`${mainConfig.apiHost}/orders/${orderId}`).then(res => res.data),
    getAllClientOrders: () => axios.get(`${mainConfig.apiHost}/orders/client`).then(res => res.data),
    createOrder: (orderData) => axios.post(`${mainConfig.apiHost}/orders`, orderData).then(res => res.data),
    deleteOrder: (orderId) => axios.delete(`${mainConfig.apiHost}/orders/${orderId}`).then(res => res.data),
}
