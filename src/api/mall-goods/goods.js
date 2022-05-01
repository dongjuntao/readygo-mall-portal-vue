import request from '@/utils/httpRequest'
const prefix = "/mall-goods";

/**
 * 商品列表
 */
export function getGoodsList(params) {
  return request({
    url: prefix+'/front/goods/list',
    method: "GET",
    params: params
  })
}

/**
 * 商品信息
 */
export function getGoodsById(params) {
  return request({
    url: prefix+'/front/goods/getGoodsById',
    method: "GET",
    params: params
  })
}
