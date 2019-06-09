import axios from 'axios';
import mainConfig from "../configs/main";

export default {
    getEvent: (eventId) => axios.get(`${mainConfig.apiHost}/events/${eventId}`).then(res => res.data),
    getAllEvents: () => axios.get(`${mainConfig.apiHost}/events`).then(res => res.data),
    createEvent: (eventData, artistsIds) => axios.post(`${mainConfig.apiHost}/events`, {eventData, artistsIds}).then(res => res.data),
    editEvent: (eventId, eventData) => axios.put(`${mainConfig.apiHost}/events/${eventId}`, eventData).then(res => res.data),
    editEventArists: (eventId, eventArtistData) => axios.put(`${mainConfig.apiHost}/events/artist/${eventId}`, eventArtistData).then(res => res.data),
    deleteEvent: (eventId) => axios.delete(`${mainConfig.apiHost}/events/${eventId}`).then(res => res.data),
}
