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
