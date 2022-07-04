// pages/re_charge/re_charge.js
const BaseURL = require('../../utils/api')
var chargeMoney = '';
var payPwd='';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    isshowMask:false,
    isshowDialog:false,
    userInfo:{},

  },
  //充值金额监听事件
  formSubmit(options){
   
    console.log(options)
    var Money = options.detail.value.charge_money
    if(typeof(Money) !="undefined" && Money != '' ){
      chargeMoney = Money
      wx.showLoading({
        title:'加载中',
        mask:true,
      })
      setTimeout(()=> {
        wx.hideLoading()
        this.setData({
          isshowMask:true,
          isshowDialog:true,
        })
      }, 1000)
      
    } else{
      wx.showToast({
        title: '请输入金额',
        icon:"error"
      })
    }
    console.log(chargeMoney)

  },
  preventTap(){}, //空事件，防止冒泡
  //确认支付事件
  confirmPay(){

    var that = this
    if(payPwd != '' && payPwd.length == 6){
      //请求后端接口
      console.log('即将请求支付'+payPwd.length)
      var total = Number(chargeMoney) //+ Number(this.data.userInfo.money)
      new Promise((resolve,reject)=>{
        wx.request({
          url: BaseURL+'/user_api/user_recharge',
          data:{
            openid:this.data.userInfo.openid,
            money:total,
            payPwd:payPwd,
          },
          success(res){
            console.log(res);
            resolve(res)
          },
          fail(e){
            reject(e)
          }
        }) 
      }).then(res=>{
        wx.showLoading({
          title: '请求支付中',
        })
        setTimeout(function () {
          wx.hideLoading()
        }, 2000)
        if(res.data.code == 0){
          wx.showToast({
            title: '充值成功！',
            icon:'success'
          }).then(()=>{
            setTimeout(()=>{
              wx.navigateBack(-1)
            },1000)
          })
          that.setData({
            isshowMask:false,
            isshowDialog:false,
          })
          
        }else{
          wx.showToast({
            title: '充值失败！',
            icon:'error'
          })
        }
      }).catch(e=>{
        wx.showToast({
          title: '请求失败！',
          icon:'error'
        })
      })
    
    }
    else{
      wx.showToast({
        title: '验证失败！',
        icon:'error',
        duration:1000
      })
      console.log("验证失败!")
    }
    
  },
  cancelPay(){
    this.setData({
      isshowMask:false,
      isshowDialog:false,
    })
  },
payPwd(options){
  //console.log(options.detail.value)
  payPwd = options.detail.value
},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      userInfo:JSON.parse(options.user)
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})