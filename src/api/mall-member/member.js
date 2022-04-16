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
