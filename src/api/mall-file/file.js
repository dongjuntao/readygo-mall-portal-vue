import request from '@/utils/httpRequest'
const prefix = "/mall-file";

/**
 * 上传文件
 */
export function fileUpload(data,params) {
  return request({
    url: prefix+'/file/upload',
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data: data,
    params: params
  })
}

/**
 * 删除文件
 */
export function fileDelete(params) {
  return request({
    url: prefix+'/file/delete',
    method: 'delete',
    params: params
  })
}
