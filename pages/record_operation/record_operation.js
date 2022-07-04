// pages/record_operation/record_operation.js
var BaseURL = require('../../utils/api')
var formateTime = require('../../utils/util')

var payPwd='';
var aptInfo = {}
var isfresh = false
var aptNo = ''

Page({

  /**
   * 页面的初始数据
   */
  data: {
    aptInfo:{},
    crTime:'',
    ischild: 0,
    isshowMask:false,
    isshowDialog:false,
    flag:false,
    canPay:false, //若当前用户已有预约则禁用支付按钮
    canRefund:false,  //  当前状态是否可以申请退款
    cancelApt:false,  //当前状态是否可以取消预约

  },

  BtnConfirm(e){
    //确认信息返回
    wx.navigateBack(-1)
  },
  reFund(e){
    var that = this 
    console.log("申请退款")
    var reason = ['病情好转，已不需要','计划改变，预约滞后','其他原因']
    wx.showActionSheet({
      itemList: reason,
      success (res) {
        console.log(res.tapIndex)
        //提交到数据库，按编号
        new Promise((resolve,reject)=>{
          wx.request({
          url: BaseURL+'/apt_api/change_AptInfo',
          data:{
            appointNo:that.data.aptInfo.appointNo,
            recordStatus:3, //设置状态为退款中
            refundReason:reason[res.tapIndex]
          },
          success:(res)=>{
            resolve(res)
          },
          fail(e){
            reject(e)
          }
        })
        }).then(res=>{
          if(res.data.code == 0){
            wx.showToast({
              title: '提交申请成功！',
              icon:'success'
            })
            isfresh = true  //设置需要刷新页面更新数据
            that.onShow()
          }
        }).catch(e=>{
          wx.showToast({
            title: '申请失败！',
            icon:'error'
          })
        })
        
      },
      fail (res) {
        console.log(res.errMsg)
      }
    })
    //申请退款
  },

  toPay(e){
    //确认并支付
    var user = wx.getStorageSync('loginUser')
    // var user =false
    console.log(user)
    if(JSON.stringify(aptInfo)  != '{}' ){
    if(user.payPwd != '' && user.payPwd != "undefined" &&user.payPwd !=null){
      // if(user){
      wx.showLoading({
        title: '请求中',
      })
      setTimeout(()=>{
        wx.hideLoading({
          success: (res) => {
            this.setData({
              isshowDialog:true,
              isshowMask:true
            })
          },
        })
      },1500)
    }else{
      wx.showModal({
        title: '提示',
        content: '请设置支付密码！',
        success (res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '../userinfo/userinfo?user='+JSON.stringify(user),
            })
            console.log('用户点击确定')
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }
  }else{
    wx.showToast({
      title: '暂无数据！',
      icon:'error'
    })
  }
    
  },
  reAppoint(e){
    //重新预约
    wx.navigateBack(-1)
  },
  cancel(e){
    //取消预约
    wx.switchTab({
      url: '/pages/index/index',
    })
  },

  preventTap(){}, //空事件，防止冒泡
  payPwd(options){
    //console.log(options.detail.value)
    payPwd = options.detail.value
  },
  //确认支付事件
  confirmPay(){
    var user = wx.getStorageSync('loginUser')
   
    new Promise(function(resolve,reject){
      if(user.money >= aptInfo.appointFee){
      wx.request({
        url: BaseURL+'/user_api/user_pay',
        data:{
          money:aptInfo.appointFee,
          payPwd:payPwd,
          openid:user.openid
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success:(res) =>{
          if(res.data.code == 0){
            console.log(res)
            resolve(res)
          }else{
            reject(e)
          }
          
        },
        fail:(e)=>{
          wx.showToast({
            title: '请求失败！',
            icon:"error"
          })
        }
      }) 
    }else{
      var that = this
      wx.showToast({
        title: '余额不足！',
        icon:'error'
      }).then(()=>{
        that.setData({
        isshowDialog:false,
        isshowMask:false
      })
      })
      
    }  
      }).then((res)=>{
        if(res.data.code == 0){
          //如果支付成功，则创建新订单
         new Promise((resolve,reject)=>{
           wx.request({
            url: BaseURL+ '/apt_api/createApt',
            data:{
              userId:aptInfo.userId,
              userName:aptInfo.userName,
              userPhone:aptInfo.userPhone,
              isChild:aptInfo.isChild,
              childName:aptInfo.childName,
              childBirthday:aptInfo.childBirthday,
              depId:aptInfo.depId,
              appointDocId:aptInfo.appointDocId,
              appointFee:aptInfo.appointFee,
              appointDate:aptInfo.appointDate,
              appointTime:aptInfo.appointTime,
              recordStatus:1
            },
            success:(res)=>{
              if(res.data.code == 0){
                resolve(res)
               
              }else{ 
                reject(res)
               
              }
            }
          })
         }).then(res=>{
          console.log("创建订单"+res)
          aptNo = res.data.data.aptNo
           //重新加载页面
          isfresh = true  //判断是否请求后刷新
          setTimeout(()=>{
            this.setData({
              isshowDialog:false,
              isshowMask:false
            })
            this.onShow()
          },1500)
         }).catch(res=>{
          wx.showToast({
            title: res.data.data.result,
            icon:"error"
          })
         }) 
          wx.showToast({
            title: '支付成功！',
            icon:'success'
          })
        } else{
          // this.setData({
          //   isshowDialog:false,
          //   isshowMask:false
          // })
          wx.showToast({
            title: '支付失败！',
            icon:"error"
          })
          
        }
      }).catch((e)=>{
        wx.showToast({
          title: '请求支付失败！',
          icon:"error"
        })
        console.log("请求支付失败！")
      })
  },
  cancelPay(){
    this.setData({
      isshowMask:false,
      isshowDialog:false,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
      if(JSON.stringify(options) != '{}'){
        //预约界面获取预约信息
      if(typeof(options.aptInfo) != 'undefined'){
        console.log('提交申请'+options)
        aptInfo = JSON.parse(options.aptInfo)
        if(!(aptInfo.recordStatus == 0 || aptInfo.recordStatus == -1) ){
          this.setData({
            cancelApt:true
          })
        }
        this.setData({
          flag:true,
          ischild:aptInfo.isChild,
          aptInfo:aptInfo,
          crTime:formateTime.formatTime(new Date())
        })
        //TODO：查询数据库最近是否有过预约
        var user = wx.getStorageSync('loginUser')
        wx.request({
          url: BaseURL+'/apt_api/getLastRecordByUserId',
          data:{
            userId:user.id,
            crTime:new Date().getTime()
          },success:(res)=>{
            if(res.data.code == -1){
              this.setData({
                canPay:true
              })
              wx.showToast({
                title: '最近已有预约',
                icon:'error'
              })
            }
          }
        })
  
      }   
  
      //订单详情获取订单编号或ID
      if(typeof(options.aptNo) != 'undefined'){
        console.log(options.aptNo)
        aptNo = options.aptNo
      wx.request({
        url: BaseURL+'/apt_api/get_recordInfoByNo',
        data:{
          aptNo: options.aptNo
        },
        success:(res)=>{
          console.log(res)
          if(res.data.code == 0){
            aptInfo = res.data.data.aptInfo
            //预约状态为待就诊或者已完成七天内可申请退款
            if(!(aptInfo.recordStatus == 1 || aptInfo.recordStatus == 2) || aptInfo.createTime < new Date().getTime() - 604800000){
              this.setData({
                canRefund:true
              })
            }

            var crTime = new Date(res.data.data.aptInfo.createTime);
            console.log(crTime)
            this.setData({
              aptInfo:res.data.data.aptInfo,
              ischild:res.data.data.aptInfo.isChild,
              crTime: formateTime.formatTime(crTime)
            })
            
          }else{
            wx.showToast({
              title: '获取信息失败！',
              icon:'error'
            })
          }
        }
      })
      }
      }else{
        wx.showToast({
          title: '暂未获取到数据！',
          icon:'error'
        })
      }
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
    //刷新页面
    if(isfresh){
      isfresh = !isfresh
      //请求更新数据
      wx.request({
        url: BaseURL+'/apt_api/get_recordInfoByNo',
        data:{
          aptNo:aptNo,
        },
        success:(res)=>{
          console.log(res)
          if(res.data.code == 0){
            var crTime = new Date(res.data.data.aptInfo.createTime);
            console.log(crTime)
            this.setData({
              aptInfo:res.data.data.aptInfo,
              ischild:res.data.data.aptInfo.isChild,
              crTime: formateTime.formatTime(crTime),
              flag:false
            })
          }else{
            wx.showToast({
              title: '获取信息失败！',
              icon:'error'
            })
          }
        }
      })
    }

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