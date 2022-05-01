import request from '@/utils/httpRequest'
const prefix = "/mall-member";

/**
 * 会员足迹列表
 */
export function getFootprintList(params) {
  return request({
    url: prefix+'/footprint/list',
    method: 'GET',
    params: params
  })
}

