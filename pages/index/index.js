// index.js
// 获取应用实例
var BaseURL = require('../../utils/api')

Page({
  data: {
    motto: 'Hello World',
    imageItem:'/image/sosuo.png',
    YuYueTitle:'—— 预约 ——',
    Nav1:'普通门诊',
    Nav2:'儿科门诊',
    userInfo: {},
    dtInfo:[],
    inputValue:'',
    BaseURL:BaseURL
  },
  //搜索框输入事件
  bindKeyInput(e){
    console.log(e.detail.value)
    let val = e.detail.value
    this.setData({
      inputValue: val
    })
    // console.log(this.inputValue)
  },

  //搜索按钮点击事件
  gosearch:function(e){
    console.log('搜索')
    wx.navigateTo({
      url: '../doctors/doctors?docInfo='+this.inputValue,
    })
  },

  ToNormal(){
    console.log("跳转到普通门诊");
    var userInfo = wx.getStorageSync('user')
    console.log(userInfo)
    if(userInfo != ''){
    wx.navigateTo({
      url: '/pages/appointment/appointment?aptType='+ 0,  // 0标记预约类型为普通门诊
    })
  }else{
    wx.showToast({
      title: '请先登录！',
      icon: 'error'
    })
  }
  },
  ToChildren(){
    console.log("跳转到儿科门诊")
    var userInfo = wx.getStorageSync('user')
   // console.log(userInfo)
    if( userInfo != '' ){
      wx.navigateTo({
      url: '/pages/appointment/appointment?aptType='+1, // 1标记预约类型为儿科门诊
    })
    }else{
      wx.showToast({
        title: '请先登录！',
        icon: 'error'
      })
    }
    
  },
    /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
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
        var doc = [{}]
        if(r != null){
          //展示五位可预约的医生
          for(var i =0,j=0;j<=5 && i < r.length ;i++){
            if(r[i].isOpen == 0){
              doc[i] = r[i]
              j++
            }
          }
          //console.log(1)
          this.setData({
            dtInfo:doc
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // this.setData({
    //   inputValue:''
    // })
    
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