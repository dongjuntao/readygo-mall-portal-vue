import request from '@/utils/httpRequest'
const prefix = "/mall-member";

/**
 * 新增收藏商品
 */
export function saveCollectGoods(data) {
  return request({
    url: prefix+'/collect/goods/save',
    method: 'POST',
    data: data
  })
}

/**
 * 取消收藏商品
 */
export function deleteCollectGoods(params) {
  return request({
    url: prefix+'/collect/goods/delete',
    method: 'DELETE',
    params: params
  })
}

/**
 * 判断是否已收藏
 */
export function isCollected(params) {
  return request({
    url: prefix+'/collect/goods/isCollected',
    method: 'GET',
    params: params
  })
}

/**
 * 收藏商品列表
 */
export function goodsListAll(params) {
  return request({
    url: prefix+'/collect/goods/listAll',
    method: 'GET',
    params: params
  })
}
