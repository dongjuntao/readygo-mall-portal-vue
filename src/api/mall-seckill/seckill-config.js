import request from '@/utils/httpRequest'
const prefix = "/mall-seckill";

/**
 * 秒杀配置
 */
export function getSeckillConfig(params) {
  return request({
    url: prefix+'/seckillConfig/getSeckillConfigByParams',
    method: "GET",
    params: params
  })
}
