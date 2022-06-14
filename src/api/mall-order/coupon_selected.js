import request from '@/utils/httpRequest'
const prefix = "/mall-order";

/**
 * 选择优惠券
 */
export function selectCoupon(data,params) {
  return request({
    url: prefix+'/couponSelected/select',
    method: 'POST',
    data: data,
    params: params
  })
}

/**
 * 获取已选择的信息
 */
export function getSelected(params) {
  return request({
    url: prefix+'/couponSelected/getSelected',
    method: 'GET',
    params: params
  })
}

