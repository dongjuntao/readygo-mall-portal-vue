import request from '@/utils/httpRequest'
const prefix = "/mall-payment";

/**
 * 支付宝支付
 */
export function alipay(params) {
  return request({
    url: prefix + '/alipay/createQR',
    method: 'GET',
    params: params
  })
}

/**
 * 获取支付宝交易结果
 */
export function tradeResult(params) {
  return request({
    url: prefix + '/alipay/tradeResult',
    method: 'GET',
    params: params
  })
}

