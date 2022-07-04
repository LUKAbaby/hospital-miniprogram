// pages/keshi/keshi.js
var BaseURL = require('../../utils/api')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    depInfo:[],
    BaseURL:BaseURL
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(BaseURL)
    wx.request({
      url: BaseURL+'dep_api/depInfo', //仅为示例，并非真实的接口地址
      data: {
        key:'',
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: (res)=>{
        console.log(res.data.data)
         let r = res.data.data.DepInfo
        if(r != null){
          //console.log(1)
          this.setData({
            depInfo:r
          })
        }
      }
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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