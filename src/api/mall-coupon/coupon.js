import request from '@/utils/httpRequest'
const prefix = "/mall-coupon";

/**
 * 购物车列表
 */
export function getCouponList(params) {
  return request({
    url: prefix+'/coupon/list',
    method: 'get',
    params: params
  })
}
