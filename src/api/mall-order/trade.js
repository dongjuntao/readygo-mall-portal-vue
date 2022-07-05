import request from '@/utils/httpRequest'
const prefix = "/mall-order";

/**
 * 创建交易
 */
export function createTrade(data) {
  return request({
    url: prefix+'/trade/createTrade',
    method: 'POST',
    data: data
  })
}

/**
 * 交易详情
 */
export function tradePayInfo(params) {
  return request({
    url: prefix+'/trade/tradePayInfo',
    method: 'GET',
    params: params
  })
}
