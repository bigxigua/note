import axios from 'axios';
import { DOMAIN } from './config.js';

export default axios.create({
  baseURL: DOMAIN,
  timeout: 3000,
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    'Content-Type': 'application/json; charset=utf-8'
  },
  // URL QUeryString parameters
  params: {},
  // `data` is the data to be sent as the request body
  data: {},
  // proxy: {
  //   host: '127.0.0.1',
  //   port: 9000,
  //   auth: {
  //     username: 'mikeymike',
  //     password: 'rapunz3l'
  //   }
  // },
});