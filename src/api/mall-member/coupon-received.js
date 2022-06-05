import request from '@/utils/httpRequest'
const prefix = "/mall-member";

/**
 * 优惠券列表
 */
export function getReceivedCouponList(params) {
  return request({
    url: prefix+'/coupon/received/list',
    method: 'GET',
    params: params
  })
}

/**
 * 优惠券列表(不分页)
 */
export function getReceivedCouponListAll(params) {
  return request({
    url: prefix+'/coupon/received/listAll',
    method: 'GET',
    params: params
  })
}


/**
 * 领取优惠券
 */
export function receiveCoupon(params) {
  return request({
    url: prefix+'/coupon/received/save',
    method: 'POST',
    params: params
  })
}
