import request from '@/utils/httpRequest'
const prefix = "/mall-goods";

/**
 * 保存评价信息
 */
export function saveEvaluation(data) {
  return request({
    url: prefix+'/evaluation/save',
    method: "POST",
    data: data
  })
}
