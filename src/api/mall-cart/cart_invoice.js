import request from '@/utils/httpRequest'
const prefix = "/mall-cart";

/**
 * 添加发票信息
 */
export function saveOrUpdateCartInvoice(data) {
  return request({
    url: prefix+'/cartInvoice/saveOrUpdate',
    method: 'POST',
    data: data
  })
}

/**
 * 查询发票信息
 */
export function getCartInvoiceByParams(params) {
  return request({
    url: prefix+'/cartInvoice/getCartInvoiceByParams',
    method: 'GET',
    params: params
  })
}

/**
 * 删除发票信息
 */
export function deleteCartInvoice(params) {
  return request({
    url: prefix+'/cartInvoice/deleteCartInvoiceById',
    method: 'DELETE',
    params: params
  })
}
