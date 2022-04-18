import request from '@/utils/httpRequest'
const prefix = "/mall-member";

/**
 * 收货信息列表
 */
export function getRecipientInfoList(params) {
  return request({
    url: prefix+'/recipientInfo/list',
    method: 'GET',
    params: params
  })
}

/**
 * 新增收货信息
 */
export function saveRecipientInfo(data) {
  return request({
    url: prefix+'/recipientInfo/save',
    method: 'POST',
    data: data
  })
}

/**
 * 修改收货信息
 */
export function updateRecipientInfo(data) {
  return request({
    url: prefix+'/recipientInfo/update',
    method: 'PUT',
    data: data
  })
}

/**
 * 删除收货信息
 */
export function deleteRecipientInfo(params) {
  return request({
    url: prefix+'/recipientInfo/delete',
    method: 'DELETE',
    params: params
  })
}

/**
 * 根据主键id获取用户实体
 */
export function getRecipientInfoById(params) {
  return request({
    url: prefix+'/recipientInfo/getRecipientInfoById',
    method: 'GET',
    params: params
  })
}

/**
 * 设为默认 / 取消默认
 */
export function updateIsDefault(params) {
  return request({
    url: prefix+'/recipientInfo/updateIsDefault',
    method: 'PUT',
    params: params
  })
}
