import request from '@/utils/httpRequest'
const prefix = "/mall-admin";

/**
 * 首页导航数据
 */
export function getNavbarData() {
  return request({
    url: prefix+'/homepage/data/navbarData',
    method: 'get'
  })
}
/**
 * 轮播图数据
 */
export function getCarouselData() {
  return request({
    url: prefix+'/homepage/data/carouselData',
    method: 'get'
  })
}
/**
 * 板块数据
 */
export function getPlateData() {
  return request({
    url: prefix+'/homepage/data/plateData',
    method: 'get'
  })
}

/**
 * 秒杀数据
 */
export function getSeckillData(params) {
  return request({
    url: prefix+'/homepage/data/seckillData',
    method: 'get',
    params: params
  })
}

/**
 * 获取当前及未来（共5个）时间批次
 */
export function afterFiveBatch() {
  return request({
    url: prefix+'/homepage/data/afterFiveBatch',
    method: 'get'
  })
}
