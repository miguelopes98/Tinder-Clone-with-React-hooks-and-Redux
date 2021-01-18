import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://tinder-9d380-default-rtdb.firebaseio.com/'
});

export default instance;