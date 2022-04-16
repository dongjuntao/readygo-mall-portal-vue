import Cookies from 'js-cookie'
import router from '@/router'

const TokenKey = 'Member-TokenKey'
const UserInfoKey = "Member-UserInfoKey"

export function getToken(key) {
  return Cookies.get(TokenKey+"-"+key)
}

export function setToken(key,token) {
  return Cookies.set(TokenKey+"-"+key, token)
}

export function removeToken(key) {
  return Cookies.remove(TokenKey+"-"+key)
}

export function setUserInfo(key,userInfo) {
  return Cookies.set(UserInfoKey+"-"+key, userInfo)
}

export function getUserInfo(key) {
  return Cookies.get(UserInfoKey+"-"+key)
}

export function removeUserInfo(key){
  return Cookies.remove(UserInfoKey+"-"+key)
}

/**
 * 是否有权限
 * @param {*} key
 */
export function isAuth (key) {
  return JSON.parse(sessionStorage.getItem('permissions') || '[]').indexOf(key) !== -1 || false
}

/**
 * 清除登录信息
 */
export function clearLoginInfo () {
  removeToken(sessionStorage.getItem("userNameKey"));
  removeUserInfo(sessionStorage.getItem("userNameKey"))
}
