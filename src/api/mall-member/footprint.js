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

/**
 * 删除会员足迹
 */
export function deleteFootprint(params) {
  return request({
    url: prefix+'/footprint/delete',
    method: 'DELETE',
    params: params
  })
}
