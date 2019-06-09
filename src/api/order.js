import axios from 'axios';
import mainConfig from "../configs/main";

export default {
    getOrder: (orderId) => axios.get(`${mainConfig.apiHost}/orders/${orderId}`).then(res => res.data),
    getAllClientOrders: () => axios.get(`${mainConfig.apiHost}/orders/client`).then(res => res.data),
    createOrder: (eventId, orderData) => axios.post(`${mainConfig.apiHost}/orders`, orderData, {params: {eventId}}).then(res => res.data),
    payForOrder: (orderId, amount) => axios.put(`${mainConfig.apiHost}/orders/pay/${orderId}`, null, {params: {amount}}).then(res => res.data),
    deleteOrder: (orderId) => axios.delete(`${mainConfig.apiHost}/orders/${orderId}`).then(res => res.data),

    getAllUserAttenders: () => axios.get(`${mainConfig.apiHost}/orders/attenders`).then(res => res.data),
    createAttender: (attenderData) => axios.post(`${mainConfig.apiHost}/orders/attenders`, attenderData).then(res => res.data),
}
