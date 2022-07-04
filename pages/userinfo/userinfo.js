// pages/userinfo/userinfo.js
var BaseURL = require('../../utils/api')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    index: 0,
    userInfo:{},
    gender:[
      {
        id:0,
        val:'男'
      },
      {
        id:1,
        val:'女'
      }
    ]

  },
  pikerChange(e){
    console.log("修改性别："+e.detail.value)
    this.setData({
      index:e.detail.value
    })
  },

  //提交表单信息
  Formsubmit(e){
   console.log(e.detail.value) 
   var value = e.detail.value
   var phone_rule = /^[1][3,4,5,7,8][0-9]{9}$/    //11位电话号码校验
    if(value.phone_number == "" || value.payPwd == ''){
      wx.showToast({
        title: '*为必填项',
        icon:'error'
      })
    }else if( !phone_rule.test(value.phone_number)){
      wx.showToast({
        title: '号码格式不正确',
        icon:"error"
      })
    }
    //号码不为空且格式正确时执行
    else{
      wx.request({
        url: BaseURL+'/user_api/userInfo_update',   //请求存入数据库
        data:{
          openid:this.data.userInfo.openid,
          gender:value.gender,
          userPhone:value.phone_number,
          payPwd:value.payPwd

        },
        success:(res)=>{
          wx.showToast({
            title: '修改成功！',
            icon:'success',
          }).then(()=>{
            setTimeout(()=>{
              wx.navigateBack(-1)
            },1000)
          })
        }
      })

    }
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    if(options.user != {} && typeof(options.user) != "undefined"){
      this.setData({
      userInfo:JSON.parse(options.user)
    })
    }else{
      wx.showToast({
        title: '暂未获取到数据',
        icon:'error'
      })
    }
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (options) {

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