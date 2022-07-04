var WXBizDataCrypt = require('./WXBizDataCrypt')
var crypto = require('./Crypot')
var appId = 'wx1ba374f0b4a5fa37'
var appsecret = 'eeee9ee4d5ebbfcc47b2fb7129717dbf'

const BaseURL = require('../utils/api')


 var userData = function getUInfo(userInfo){
   return new Promise((resolve,reject) => {
  let encryptedData = toString(wx.getStorageSync('encryptedData')) 
      let iv = wx.getStorageSync('iv')
      let code = wx.getStorageSync('code')
      let openid = ''
      let data = userInfo
    //console.log(userInfo)
  wx.request({
    url: 'https://api.weixin.qq.com/sns/jscode2session',  //通过code、appid、appsecret换取user的session_key、openid、unionid
    data:{
      appid:appId,
      secret:appsecret,
      js_code:code,
      grant_type:'authorization_code'
    },
    success:(res)=>{
      wx.request({
        url: BaseURL+'user_api/user_login',
        data:{
          openid:res.data.openid,
          userNickname:userInfo.nickName,
          gender:userInfo.gender,
          avatarUrl:userInfo.avatarUrl
        },
        success(res){
          //todo：返回余额，电话号码
          
          console.log(res.data)
          if(res.data.code == 0){
              data = res.data
              wx.setStorageSync('loginUser',res.data.data.userInfo)
          }else{
            wx.showToast({
              title: '请求登录失败！',
              icon:'error'
            })
          }
          resolve(res)
        },
        fail(e){
          reject(e)
        }
      })
      wx.setStorageSync('session_key', res.data.session_key)
      console.log(res)
    }
  })
  let sessionKey = wx.getStorageSync('session_key')
  //  console.log(sessionKey)
  //  console.log(encryptedData)
  //  console.log(iv)
    // var pc = new WXBizDataCrypt(appId, sessionKey)
    // console.log(pc)
    // var data = pc.decryptData(encryptedData,iv)
    // var data = JSON.parse(crypto.AES_DE(encryptedData,sessionKey,iv))
    // console.log(data)
    //return data
   })
     
}

module.exports ={
  // getUInfo,
  userData,

} 