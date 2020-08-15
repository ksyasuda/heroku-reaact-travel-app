import axios from 'axios';

const instance = axios.create({
	baseURL: 'https://react-travel-app-3594e.firebaseio.com/'
});

export default instance;
