import axios from 'axios'
import {Message} from 'element-ui'
import {getConfig} from '@/utils/config'
import {getToken, setToken} from './cookie'

import router from '../router'

const BASE_URL = getConfig().baseUrl
export const BASE_IMG_URL = getConfig().baseImgUrl
let pending = [] // 声明一个数组用于存储每个ajax请求的取消函数和ajax标识
const cancelToken = axios.CancelToken
const removePending = (config) => {
  for (const p in pending) {
    if (pending[p].u === config.url + '&' + config.method) { // 当当前请求在数组中存在时执行函数体
      pending[p].f() // 执行取消操作
      pending.splice(p, 1) // 把这条记录从数组中移除
    }
  }
}

axios.interceptors.request.use(config => {
  // removePending(config); //在一个ajax发送前执行一下取消操作
  // config.cancelToken = new cancelToken((c) => {
  //   // 这里的ajax标识我是用请求地址&请求方式拼接的字符串，当然你可以选择其他的一些方式
  //   // pending.push({u: config.url + '&' + config.method, f: c});
  // })

  config.headers['Authorization'] = getToken()
  config.headers['web'] = ''
  return config
}, err => {
  Message.error({message: '请求超时!'})
  return Promise.reject(err)
})

// 是否正在刷新的标记
let isRefreshing = false

function refreshToken() {
  return postRequest('/user/refreshToken', {token: getToken()})
}

function tokenExpire(response) {
  if (!isRefreshing) {
    isRefreshing = true
    return refreshToken()
      .then(res => {
        const token = res.data.data.token
        setToken(token)
        const config = response.config
        config.headers['Authorization'] = token
        config.baseURL = ''
        return axios(config)
      }).catch(res => {
        console.error('refreshtoken error =>', res)
        // window.location.href = '/'
      }).finally(() => {
        isRefreshing = false
      })
  }
}

/**
 * 没有权限，跳转到登录界面
 */
function toLogin(response) {
  const data = response.data
  Message.warning({message: data.message})
  setToken();
  router.replace({
    path: '/login',
    query: {redirect: router.currentRoute.fullPath}
  })
}

function un() {
  Message.error({message: data.message})
  let error = new Error(data.message)
  throw error
}

const codeHandler = {
  //token离快过期了，重新刷新token
  406: (response) => {
    let token = response.data.data
    if (token) {
      setToken(token)
    }
    return axios.request(response.config);
  },
  503: toLogin,
  505: toLogin,
  601: toLogin,
  602: toLogin
}

axios.interceptors.response.use(response => {
  const data = response.data
  let code = data.code;
  if (typeof (code) !== 'undefined' && code !== 200) {
    let handler = codeHandler[code]
    if (handler) {
      let request = handler(response);
      if (request) {//刷新token后，重新发起请求
        return request;
      }
    } else {
      Message.error({message: '未知错误!'})
      return response
    }
  } else {
    return response
  }
}, err => {
  let response = err.response
  if (typeof (response) === 'undefined') {
    Message.error({message: '没有返回结果'})
  } else {
    let status = response.status
    if (status === 404) {
      Message({
        message: '暂无资源',
        type: 'warning'
      })
    } else if (status === 403) {
      Message.error({message: '权限不足,请联系管理员!'})
    } else {
      // if (response.data && response.data.exception) {
      //   return tokenExpire(response)
      // } else {
      Message.error({message: '未知错误!'})
      // }
    }
  }
  return Promise.reject('服务器请求出错，请联系管理员')
})

export const postRequest = (url, params) => {
  return axios({
    method: 'post',
    url: `${BASE_URL}${url}`,
    data: params,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}
export const uploadFileRequest = (url, params) => {
  return axios({
    method: 'post',
    url: `${BASE_URL}${url}`,
    data: params,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}
export const putRequest = (url, params) => {
  return axios({
    method: 'put',
    url: `${BASE_URL}${url}`,
    data: params,
    transformRequest: [function (data) {
      let ret = ''
      for (const it in data) {
        ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
      }
      return ret
    }],
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}
export const deleteRequest = (url) => {
  return axios({
    method: 'delete',
    url: `${BASE_URL}${url}`
  })
}
export const getRequest = (url) => {
  return axios({
    method: 'get',
    url: `${BASE_URL}${url}`
  })
}



export const downloader = () => {
  var downLoader = {}
  downLoader.fileDownload = (data, fileName) => {
    let blob = new Blob([data], {type: 'application/octet-stream'})
    let filename = fileName + '.xls' || 'filename.xls'
    if (typeof window.navigator.msSaveBlob !== 'undefined') {
      window.navigator.msSaveBlob(blob, filename)
    } else {
      var blobURL = window.URL.createObjectURL(blob)
      var tempLink = document.createElement('a')
      tempLink.style.display = 'none'
      tempLink.href = blobURL
      tempLink.setAttribute('download', filename)
      if (typeof tempLink.download === 'undefined') {
        tempLink.setAttribute('target', '_blank')
      }
      document.body.appendChild(tempLink)
      tempLink.click()
      document.body.removeChild(tempLink)
      window.URL.revokeObjectURL(blobURL)
    }
  }
  downLoader.downloadByGet = (url, fileName) => {
    url = BASE_URL.replace('/monitor', '') + url
    const axiosConfig = {crossDomain: true}
    let http = axios.create(axiosConfig)
    http({
      method: 'get',
      url: url,
      responseType: 'arraybuffer'

    })
      .then((response) => {
          fileName = fileName || url.substring(url.lastIndexOf('/') + 1)
          downLoader.fileDownload(response.data, fileName)
        }
      )
      .catch((error) => {
          console.log(error)
        }
      )
  }
  downLoader.downloadByPost = (url, params, fileName) => {
    // const axiosConfig = {crossDomain: true}
    // let http = axios.create(axiosConfig)
    axios({
      method: 'post',
      url: `${BASE_URL}${url}`,
      data: params,
      responseType: 'arraybuffer'
    })
      .then((response) => {
          fileName = fileName || url.substring(url.lastIndexOf('/') + 1)
          downLoader.fileDownload(response.data, fileName)
        }
      )
      .catch((error) => {
          console.log(error)
        }
      )
  }
  return downLoader
}
