// app.js
App({
  onLaunch() {

    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    wx.removeStorageSync('user')
    wx.removeStorageSync('code')
    wx.removeStorageSync('iv')
    wx.removeStorageSync('encryptedData')
   wx.removeStorageSync('loginUser')

    // //检查登录态是否过期
    // wx.checkSession({
    //   success: (res) => {
    //     console.log("check success")
        
    //   },
    //   fail(){
    //     console.log("check failed,会话已过期，需重新登录")
    //     // wx.login({
    //     //   success(e){
    //     //     wx.setStorageSync('code', e.code)
    //     //   }
    //     // })
    //   }
    // })

    // // 登录
    // wx.login({
    //   success: res => {
    //     console.log(res)
    //     // 发送 res.code 到后台换取 openId, sessionKey, unionId
    //   }
    // })
  },

})

