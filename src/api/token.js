
import api from './index'
import { axios } from '../utils/request'

export function getToken (parameter) {
  return axios({
    url: api.getToken+parameter,
    method: 'get',
  })
}