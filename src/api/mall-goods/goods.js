import request, {Method} from '@/plugins/request.js'
const prefix = "/mall-goods";

/**
 * 商品列表
 */
export function getGoodsList(params) {
  return request({
    url: prefix+'/goods/list',
    method: Method.GET,
    params: params
  })
}

/**
 * 商品信息
 */
export function getGoodsById(params) {
  return request({
    url: prefix+'/goods/getGoodsById',
    method: Method.GET,
    params: params
  })
}
