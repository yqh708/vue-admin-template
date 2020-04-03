let currentConfig = null
export const getConfig = function () {
  if (currentConfig == null) {
    if (process.env.NODE_ENV === 'development') {
      // currentConfig = devConfig
      currentConfig = envConfig
    } else {
      currentConfig = envConfig
    }
  }
  return currentConfig
}

const devConfig = {
  baseUrl: 'http://192.168.1.188:8087/',
  // baseUrl: 'http://192.168.1.23:8030/',
  baseImgUrl: 'http://192.168.1.23:8030/'
}

const envConfig = {
  baseUrl: 'http://113.108.192.100:8080/ocean/',
  baseImgUrl: 'http://113.108.192.100:8080/',
}

