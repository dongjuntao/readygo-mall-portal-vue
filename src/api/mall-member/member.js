import request from '@/utils/httpRequest'
const prefix = "/mall-member";

/**
 * 用户注册
 */
export function register(data) {
  return request({
    url: prefix+'/member/register',
    method: 'POST',
    data: data
  })
}

/**
 * 会员登录
 */
export function login(params, data) {
  return request({
    url: prefix+'/member/login',
    method: 'POST',
    params: params,
    data: data
  })
}
/**
 * 会员退出登录
 */
export function logout() {
  return request({
    url: prefix+'/member/logout',
    method: 'DELETE'
  })
}

/**
 * 修改会员信息
 */
export function updateMember(data) {
  return request({
    url: prefix+'/member/update',
    method: 'PUT',
    data: data
  })
}

/**
 * 修改密码
 */
export function updatePassword(params) {
  return request({
    url: prefix+'/member/updatePassword',
    method: 'PUT',
    params: params
  })
}

