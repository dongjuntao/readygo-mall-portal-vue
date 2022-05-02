import request from '@/utils/httpRequest'
const prefix = "/mall-member";

/**
 * 新增收藏店铺
 */
export function saveCollectShop(data) {
  return request({
    url: prefix+'/collect/shop/save',
    method: 'POST',
    data: data
  })
}

/**
 * 取消收藏店铺
 */
export function deleteCollectShop(params) {
  return request({
    url: prefix+'/collect/shop/delete',
    method: 'DELETE',
    params: params
  })
}

/**
 * 判断是否已收藏
 */
export function isCollected(params) {
  return request({
    url: prefix+'/collect/shop/isCollected',
    method: 'GET',
    params: params
  })
}

/**
 * 收藏店铺列表
 */
export function shopListAll(params) {
  return request({
    url: prefix+'/collect/shop/listAll',
    method: 'GET',
    params: params
  })
}

