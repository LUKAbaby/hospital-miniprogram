// pages/my/my.js
var uData = require('../../utils/getUInfo')
var BaseURL = require('../../utils/api')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    flag:true,
    userInfo: {},
    ucenterList:[
      {text:"个人信息",icon:'../../image/personal.jpg'},//BaseURL+'/api/file/personal.jpg'
      {text:"预约记录",icon:'../../image/appointment.jpg'}],//BaseURL+'/api/file/appointment.jpg'
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    canIUseGetUserProfile: false,
    canIUseOpenData: false // 如需尝试获取用户信息可改为false  wx.canIUse('open-data.type.userAvatarUrl') && wx.canIUse('open-data.type.userNickName')
  },
  toUserinfo(e){
   var user = JSON.stringify(this.data.userInfo)     //  将object类型的json数据转换为String字符串，作为参数传递
   if(user == '{}'){
     wx.showToast({
       title: '请先登录！',
       icon:'error'
     })
   }else{
     wx.navigateTo({
       url: '../userinfo/userinfo?user='+user,
     })
   }
  },
  toAptrecord(e){
    var user = JSON.stringify(this.data.userInfo)  //  将object类型的json数据转换为String字符串，作为参数传递
    //console.log(user)
    if( user == '{}'){
      wx.showToast({
        title: '请先登录！',
        icon:'error'
      })
    }else{
      // console.log(this.data.userInfo)
      wx.navigateTo({
        url: '../appointment_record/appointment_record?userId='+this.data.userInfo.id,
      })
    }

  },
  toRecharge(){
    var user = this.data.userInfo
    console.log(user)
    console.log(user.payPwd != '' && user.payPwd != undefined)
    if(user.payPwd != '' && user.payPwd != undefined){
      wx.navigateTo({
      url: '../re_charge/re_charge?user='+JSON.stringify(user),
    })
    }else{
      wx.showToast({
        title: '信息尚未完善！',
        icon:'error'
      }).then(()=>{
        setTimeout(()=>{
          wx.navigateTo({
          url: '../userinfo/userinfo?user='+JSON.stringify(user),
        })
        },1000)
        
      })
    }
    
  },
  getUserProfile(e) {
    
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
       wx.setStorageSync('encryptedData', res.encryptedData)
       wx.setStorageSync('iv', res.iv)
        //获取code换session_key
        //console.log(res.userInfo.avatarUrl)
        uData.userData(res.userInfo).then(res =>{
          console.log(res)
          if(res.data.code == 0){
            
            var userLogin = res.data.data.userInfo
            console.log(res)
            if(typeof(userLogin) !="undefined" && userLogin != ''){
              console.log(userLogin)
              this.setData({
                userInfo:  userLogin //userLogin.data.userInfo
              }) 
              
              if( userLogin.data.userInfo.userPhone == '' || userLogin.data.userInfo.userPhone == null ||typeof(userLogin.data.userPhone) == undefined){
                /**
               * 获取微信用户信息成功，跳转到个人信息页面完善必要资料
               */
              wx.showToast({
                title: '请绑定手机号码！',
                icon:'none',
                duration:3000,
                complete:()=>{
                  wx.navigateTo({
                  url: '/pages/userinfo/userinfo?user='+JSON.stringify(this.data.userInfo),
              })
                }
              })
              }  
          }
        }else{
          wx.showToast({
            title: '请求错误！',
            icon:'error'
          })
        }
          
      }).catch(e=>{
        console.log(e)
      })
       // var userLogin = wx.getStorageSync('loginUser')
        //console.log(userLogin)
        
        this.setData({
          //userInfo: res.userInfo,
          hasUserInfo: true,
        })
        try{
           wx.setStorageSync('user', res.userInfo)
        }catch(e){
          console.log(e);
        }
        //setTimeout(()=>{
          wx.showToast({
            title: '加载中',
            icon:'loading',
            mask:true,
            duration:1000
          })
         //},1000)
     }
   })
   
  },
  getUserInfo(e) {
    // 不推荐使用getUserInfo获取用户信息，预计自2021年4月13日起，getUserInfo将不再弹出弹窗，并直接返回匿名的用户个人信息
    console.log(e)
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    
     //调用wx.login()获取session_key
     wx.login({
      success:(e)=>{
        console.log(e)
       wx.setStorageSync('code', e.code)
      },
      fail(e){
        console.log("失败"+e.errMsg)
      },
      //timeout: 0,
    })
    
    //检查登录态是否过期
    wx.checkSession({
      success() {
        console.log("check success")
      },
      fail(){
        console.log("check failed,会话已过期，需重新登录")
        wx.login({
          success:(e)=>{
            console.log(e)
           wx.setStorageSync('code', e.code)
          },
          fail(e){
            console.log("失败"+e.errMsg)
          },
          //timeout: 0,
        })
      }
    })
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log("页面显示")
    //如果已经登录成功，则在显示页面之前重新获取用户数据
    if(this.data.hasUserInfo){
       wx.request({
      url: BaseURL+'user_api/getUserByOpenId',
      data:{
        openid:this.data.userInfo.openid
      },
      success:(res)=>{
        console.log(res)
        if(res.data.code == 0){
          this.setData({
            userInfo: res.data.data.userInfo
          })
          wx.setStorageSync('loginUser', res.data.data.userInfo)
        }
      }
    })
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})