import request from '@/utils/httpRequest'
const prefix = "/mall-admin";

/**
 * 所属区域列表
 */
export function getRegionList(params) {
  return request({
    url: prefix+'/logistics/region/list',
    method: 'get',
    params: params
  })
}

/**
 * 区域名称集 如（安徽省 淮南市 寿县）
 * @param params
 * @returns {*}
 */
export function getRegionsNameByRegions(params) {
  return request({
    url: prefix+'/logistics/region/getRegionsNameByRegions',
    method: 'get',
    params: params
  })
}

/**
 * 根据id查询地区信息
 * @param params
 * @returns {*}
 */
export function getRegionById(params) {
  return request({
    url: prefix+'/logistics/region/getRegionById',
    method: 'get',
    params: params
  })
}



/**
 * 新增地区
 */
export function saveRegion(data) {
  return request({
    url: prefix+'/logistics/region/save',
    method: 'post',
    data: data
  })
}

/**
 * 修改地区
 */
export function updateRegion(data) {
  return request({
    url: prefix+'/logistics/region/update',
    method: 'put',
    data: data
  })
}

/**
 * 删除地区
 */
export function deleteRegion(params) {
  return request({
    url: prefix+'/logistics/region/delete',
    method: 'delete',
    params: params
  })
}
