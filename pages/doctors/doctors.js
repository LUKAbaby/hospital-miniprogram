// pages/doctors/doctors.js
var BaseURL = require('../../utils/api')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dtInfo:[],
    depInfo:[],
    key:'',
    urlPath:'../appointment/appointment?keshi=',
    currentNo: 0,
    BaseURL:BaseURL
  },
  changeNav(e){
    this.setData({
      currentNo:e.currentTarget.dataset.value
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    /**
     * 判断非空传参路径
     */
    var val1 = options.keshiVal 
    var val2 = options.docInfo;
    var key
    if(typeof val1 != 'undefined'){
      key = val1
      this.setData({
        currentNo:options.keshiVal,
      })
    }
    if(typeof val2 != 'undefined'){
      key = val2,
      wx.request({
        url: BaseURL+'doc_api/search_doc', //仅为示例，并非真实的接口地址
        data: {
          docName:key,
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: (res)=>{
          //console.log(res.data.data)
          let r = res.data.data.docInfo
          if(r != null){
            //console.log(1)
            this.setData({
              dtInfo:r,
            })
          }
        }
      })
    }
    else{
      console.log(key)
      wx.request({
      url: BaseURL+'doc_api/doctorsInfo', //仅为示例，并非真实的接口地址
      data: {
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: (res)=>{
        //console.log(res.data.data)
        let r = res.data.data.dtInfoList
        if(r != null){
          //console.log(1)
          this.setData({
            dtInfo:r,
          })
        }
      }
    })
  }
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
    console.log("页面传值key:"+key)

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