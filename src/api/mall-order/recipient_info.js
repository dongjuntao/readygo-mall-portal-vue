import request from '@/utils/httpRequest'
const prefix = "/mall-order";

/**
 * 结算页收货人信息
 */
export function getPayRecipientInfoList(params) {
  return request({
    url: prefix+'/recipientInfo/payInfo',
    method: 'get',
    params: params
  })
}

/**
 * 选择收货人信息
 */
export function selectAddress(params) {
  return request({
    url: prefix+'/recipientInfo/selectAddress',
    method: 'POST',
    params: params
  })
}
