import request from '@/utils/httpRequest'
const prefix = "/mall-order";

/**
 * 结算页购物车列表信息
 */
export function getPayInfoGoods(params) {
  return request({
    url: prefix+'/payInfo/goods',
    method: 'get',
    params: params
  })
}

