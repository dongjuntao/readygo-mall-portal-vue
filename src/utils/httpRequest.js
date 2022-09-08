import axios from 'axios'
import router from '@/router'
import qs from 'qs'
import merge from 'lodash/merge'
import { Message } from 'view-design';
import { clearLoginInfo, getToken } from '@/utils/auth'

const http = axios.create({
  baseURL: process.env.BASE_API, // api 的 base_url
  timeout: 1000 * 30,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json; charset=utf-8'
  }
})

/**
 * 请求拦截
 */
http.interceptors.request.use(config => {
  var token = getToken(sessionStorage.getItem("userNameKey"))
  config.headers['Authorization'] = token ?  ('Bearer ' + token) : "" // 如果有token,就带上token, 没有token,就传空串
  return config
}, error => {
  return Promise.reject(error)
})

/**
 * 响应拦截
 */
http.interceptors.response.use(response => {
  if(response.data && response.data.code === "401") {
    clearLoginInfo()
    router.push({ name: 'login'})
  }
  return response
}, error => {
  return Promise.reject(error)
})

/**
 * 请求地址处理
 */
http.urlHandler = (actionName) => {
  return actionName;
}

/**
 * 对请求参数进行处理
 * @param {*} params 参数对象
 * @param {*} openDefultParams 是否开启默认参数?
 */
http.paramsHandler = (params = {}, openDefaultParams = true) => {
  var defaults = {
    'timestamp': new Date().getTime()
  }
  return openDefaultParams ? merge(defaults, params) : params
}

/**
 * 对请求题进行处理
 * @param {*} data 数据对象
 * @param {*} openDefaultData 是否开启默认数据?
 * @param {*} contentType 数据格式
 *  json: 'application/json; charset=utf-8'
 *  form: 'application/x-www-form-urlencoded; charset=utf-8'
 */
http.dataHandler = (data = {}, openDefaultData = true, contentType = 'json') => {
  var defaults = {
    't': new Date().getTime()
  }
  data = openDefaultData ? merge(defaults, data) : data
  return contentType === 'json' ? JSON.stringify(data) : qs.stringify(data)
}

export default http
