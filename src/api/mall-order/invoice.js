import request from '@/utils/httpRequest'
const prefix = "/mall-order";

/**
 * 添加发票信息
 */
export function saveOrUpdateCartInvoice(data) {
  return request({
    url: prefix+'/invoice/saveOrUpdate',
    method: 'POST',
    data: data
  })
}

/**
 * 查询发票信息
 */
export function getInvoiceByParams(params) {
  return request({
    url: prefix+'/invoice/getInvoiceByParams',
    method: 'GET',
    params: params
  })
}

/**
 * 删除发票信息
 */
export function deleteInvoice(params) {
  return request({
    url: prefix+'/invoice/deleteInvoiceById',
    method: 'DELETE',
    params: params
  })
}
