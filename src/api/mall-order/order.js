import request from '@/utils/httpRequest'
const prefix = "/mall-order";

/**
 * 订单列表
 */
export function getOrderList(params) {
  return request({
    url: prefix+'/order/getOrderList',
    method: 'GET',
    params: params
  })
}

/**
 * 修改订单状态
 */
export function updateOrderStatus(params) {
  return request({
    url: prefix+'/order/updateOrderStatus',
    method: 'POST',
    params: params
  })
}

/**
 * 取消订单
 */
export function cancelOrder(params) {
  return request({
    url: prefix+'/order/cancelOrder',
    method: 'PUT',
    params: params
  })
}

/**
 * 删除订单
 */
export function deleteOrder(params) {
  return request({
    url: prefix+'/order/deleteOrder',
    method: 'DELETE',
    params: params
  })
}

/**
 * 获取订单信息（包括明细）
 */
export function getOrderAndDetailByParams(params) {
  return request({
    url: prefix+'/order/getOrderAndDetailByParams',
    method: 'GET',
    params: params
  })
}

/**
 * 根据参数获取订单明细
 * @param params
 * @returns {AxiosPromise}
 */
export function getOrderDetailByParams(params) {
  return request({
    url: prefix+'/order/getOrderDetailByParams',
    method: 'GET',
    params: params
  })
}

export function confirmReceiptAll(params) {
  return request({
    url: prefix+'/order/confirmReceiptAll',
    method: 'PUT',
    params: params
  })
}

export function confirmReceipt(params) {
  return request({
    url: prefix+'/order/confirmReceipt',
    method: 'PUT',
    params: params
  })
}
