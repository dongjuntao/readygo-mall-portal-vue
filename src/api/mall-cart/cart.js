import request from '@/utils/httpRequest'
const prefix = "/mall-cart";

/**
 * 加入购物车
 */
export function saveCart(params,data) {
  return request({
    url: prefix+'/cart/save',
    method: 'POST',
    params: params,
    data: data
  })
}

/**
 * 购物车列表
 */
export function getCartList(params) {
  return request({
    url: prefix+'/cart/list',
    method: 'get',
    params: params
  })
}

/**
 * 设置/取消 选中
 */
export function setChecked(params) {
  return request({
    url: prefix+'/cart/setChecked',
    method: 'POST',
    params: params
  })
}

/**
 * 设置 购买数量
 */
export function setCount(params) {
  return request({
    url: prefix+'/cart/setCount',
    method: 'POST',
    params: params
  })
}
/**
 * 删除 清空 购物车
 */
export function deleteCart(params) {
  return request({
    url: prefix+'/cart/deleteCart',
    method: 'DELETE',
    params: params
  })
}

