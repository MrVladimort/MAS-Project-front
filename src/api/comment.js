import axios from 'axios';
import mainConfig from "../configs/main";

export default {
    getAllCommentsByEventId: (eventId) => axios.get(`${mainConfig.apiHost}/comment/event/${eventId}`).then(res => res.data),
    getAllComments: () => axios.get(`${mainConfig.apiHost}/comment`).then(res => res.data),
    getComment: (commentId) => axios.get(`${mainConfig.apiHost}/comment/${commentId}`).then(res => res.data),
    createComment: (commentData, eventId) => axios.post(`${mainConfig.apiHost}/comment`, commentData, {params: {eventId}}).then(res => res.data),
    editComment: (commentId, commentData) => axios.put(`${mainConfig.apiHost}/comment/${commentId}`, commentData).then(res => res.data),
    deleteComment: (commentId) => axios.delete(`${mainConfig.apiHost}/comment/${commentId}`).then(res => res.data),
}
