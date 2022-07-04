
// utils/check.js
let api = require('../api/index')
let toast = require('./toast')
let check = {}
/**
* session是否过期
* @param {function} success seesion_key未过期时调用的方法
* @param {function} error seesion_key过期时调用的方法
* @param {eventhandle} e getPhoneNumber传参
*/
check.session = (success, error, e) => {
wx.checkSession({
  //session_key 未过期，并且在本生命周期一直有效
  success,
  fail() {
    // session_key 已经失效，需要重新执行登录流程
    wx.login({
      success(res1) {
        if (res1.code) {
          wx.setStorageSync('code', res1.code);
          // 后台获取用户openid
          api.user.getOpenID({
            code: res1.code
          }).then(res2 => {
            if (res2.code === 2000) {
              wx.setStorageSync('openid', res2.data.openid);
              wx.setStorageSync('session_key', res2.data.session_key)
              // 后台小程序自动登录
              api.user.autologin({
                openid: res2.data.openid,
                code: res1.code
              }).then(res3 => {
                if (res3.code === 2000) {
                  wx.setStorageSync('access_token', res3.data.access_token)
                  error(e);
                }
              })
            }
          })
        } else {
          toast('登录失败！' + res.errMsg);
        }
      }
    })
  }
})
}
module.exports = {
check
} 