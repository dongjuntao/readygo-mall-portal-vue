import request from '@/utils/httpRequest'
const prefix = "/mall-search";
//【elasticsearch】中查询
/**
 * 商品列表
 */
export function getGoodsListFromES(params) {
  return request({
    url: prefix+'/es/goods/search',
    method: "GET",
    params: params
  })
}
