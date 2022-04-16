import request from '@/plugins/request.js'
const prefix = '/mall-goods';

// 获取商品分类数据
export function getCategoryAndMergedCategory (params) {
  return request({
    url: prefix + '/goods/category/getCategoryAndMergedCategory',
    method: 'get',
    params
  })
}
