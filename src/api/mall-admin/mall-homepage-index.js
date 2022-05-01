import request from '@/utils/httpRequest'
const prefix = "/mall-admin";

/**
 * 首页数据
 */
export function getIndexData() {
  return request({
    url: prefix+'/homepage/index/data',
    method: 'get'
  })
}

