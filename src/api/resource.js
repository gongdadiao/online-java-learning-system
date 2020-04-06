
import api from './index'
import { axios } from '../utils/request'


export function submitHomework (id,parameter) {
  return axios({
    url: api.SubmitHomework+id,
    method: 'post',
    data:parameter
  })
}

export function getHomework (parameter) {
  return axios({
    url: api.GetHomework+parameter,
    method: 'get'
  })
}


export function getLessonDetail () {
  return axios({
    url: api.LessonDetail,
    method: 'get'
  })
}

export function getResourceList () {
  return axios({
    url: api.ResList,
    method: 'get'
  })
}

export function getAdminResourceList (parameter) {
  return axios({
    url: api.AdminResList,
    method: 'get',
    params: parameter
  })
}

export function addOneResource (parameter) {
  return axios({
    url: api.AddRes,
    method: 'post',
    data: parameter
  })
}