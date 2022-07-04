// pages/appointment/appointment.js
var BaseURL = require('../../utils/api')
var isChild = 0
var doctors = []
var selectDT = []
Page({
  /**
   * 页面的初始数据
   */
  data: {
    aptType:-1,
    keshi: -1,
    isChooseDoc: 0,
    normalFee:10,
    who:0,
    index1:0,
    index2:0,
    today:'',
    endday:'',
    selectdate:'',
    selectTime:'09:00',
    dtInfo:[],
    depInfo:[],
    childBirthday:'2004-01-01'

  },
  getChoose(e){
    let id = e.target.id
    console.log(id)
      this.setData({
        isChooseDoc:id
      })   
  },
  whoDo(e){
    let id = e.target.id
    console.log(id)
      this.setData({
        who:id
      })
  },
  getDate:()=>{
    var mil = new Date().getTime() + 86400000 //从当前日期后一天开始预约
    var date = new Date(mil)
    var year = date.getFullYear();
    var month = (date.getMonth()+1 <10)?("0"+(date.getMonth()+1)):date.getMonth()+1;
    var day = (date.getDate() < 10)?("0"+date.getDate()):date.getDate();
    return year+"-"+month+"-"+day
  },
  getEndDate:()=>{
    // var date = new Date()
    // console.log(date.getTime())
    var endSecends = new Date().getTime() + 691200000; //从可预约日期后7天的毫秒数
    // console.log(endSecends)
    var endDate = new Date(endSecends)
    var year = endDate.getFullYear();
    var month = (endDate.getMonth()+1 <10)?("0"+(endDate.getMonth()+1)):endDate.getMonth()+1;
    var day = (endDate.getDate() < 10)?("0"+endDate.getDate()):endDate.getDate();
    // console.log(year+"-"+month+"-"+day)
    return year+"-"+month+"-"+day
  },
  bindDatePickerChange(e){
    this.setData({
    selectdate:e.detail.value
    })
  },
  bindPickerChangeCB(e){
    this.setData({
      childBirthday:e.detail.value
    })

  },
  bindTimePickerChange(e){
    this.setData({
      selectTime:e.detail.value
      })
  },
  formSubmit(e){
    // var that = this
    console.log(e)
    var u_name = e.detail.value.u_name;
    // console.log(u_name)
    var phone_rule = /^1[3|4|5|7|8][0-9]{9}$/; //验证规则    //11位电话号码校验
    var u_phNumber = e.detail.value.u_phNumber;
    //console.log(e.detail.value.c_name)
    if(e.detail.value.c_name != undefined){
      var c_name = e.detail.value.c_name;
      var c_birthday = e.detail.value.c_birthday;
      var flag = false;
      if(c_name == '' || c_birthday == '')
          flag = true;
    }
   // console.log(flag)
    if(u_name == '' || u_phNumber=='') { 
      wx.showToast({
        title: '个人信息未填写完整！',
        icon: 'none'
      })
      
    }else if(u_phNumber != '' && !phone_rule.test(u_phNumber)){
      // console.log(u_phNumber)
      // console.log(phone_rule.test(u_phNumber))
      wx.showToast({
        title: '电话号码格式错误！',
        icon: 'none'
      })
    }
    else if(flag){
      wx.showToast({
        title: '儿童信息未填写完整！',
        icon: 'none'
      })
     
    }
   else if(e.detail.value.keshi == '' || e.detail.value.apt_date == ''|| e.detail.value.apt_time == ''){
      wx.showToast({
        title: '预约信息未填写完整！',
        icon: 'none'
      })
     
    }else{
       //todo：生成预约申请
      var user = wx.getStorageSync('loginUser')
      console.log(user)
      var fee = this.data.normalFee
      if(this.data.isChooseDoc == 1){
        console.log(fee)
        console.log(e.detail.value.doctor)
      fee = this.data.dtInfo[Number(e.detail.value.doctor)].appointFee 
      }
      console.log(fee)
      wx.showToast({
         title: '加载中',
         icon:'loading',
         duration:1500,
         success:()=>{
          var aptInfo = {
            apponitNo:'',
            userId:user.id,
            userName:e.detail.value.u_name,
            userPhone:e.detail.value.u_phNumber,
            isChild:isChild,
            childName:e.detail.value.c_name,
            childBirthday:e.detail.value.c_birthday,
            depId:Number(e.detail.value.keshi)+1,
            appointDocId: (typeof(e.detail.value.doctor) !="undefined" )? Number(e.detail.value.doctor)+1 : '',
            appointFee:fee,
            appointDate:e.detail.value.apt_date,
            appointTime:e.detail.value.apt_time,
            recordStatus: -1
          }
          wx.navigateTo({
              url: '/pages/record_operation/record_operation?aptInfo='+JSON.stringify(aptInfo),
           })
         }
       })    
    }

   
  },
  bindPickerChangeKs(e){
    console.log(e.detail.value)
    selectDT = [] //清空上一个可选医生数组
    //根据科室id构成可选医生数据
    doctors.forEach(el => {
      if(el.docDepId == (Number(e.detail.value)+1) &&el.isExpert == 1){
        selectDT.push(el)
      }
      //console.log(selectDT)
    });
    this.setData({
      index1:e.detail.value,
      keshi:Number(e.detail.value)+1,
      dtInfo:selectDT
    })
  },
  bindPickerChangeDt(e){
    // console.log(e)
    this.setData({
      index2:e.detail.value
    })

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //console.log(this.getEndDate())
    this.setData({
      today:this.getDate(),
      selectdate:this.getDate(),
      endday:this.getEndDate()
    })
   
    console.log(options)
    wx.request({
      url: BaseURL+'doc_api/doctorsInfo', //仅为示例，并非真实的接口地址
      data:{
        canApt:0
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: (res)=>{
        console.log(res.data.data)
        let r = res.data.data.dtInfoList
        if(r != null){
          doctors = r
          //console.log(1)
          this.setData({
            dtInfo:r
          })
        }
      }
    })

    wx.request({
      url: BaseURL+'dep_api/depInfo', //仅为示例，并非真实的接口地址
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: (res)=>{
        console.log(res.data.data);
         let r = res.data.data.DepInfo
        if(r != null){
          //console.log(1)
          this.setData({
            depInfo:r
          })
        }
      }
    })
    //获取预约类型标记（0/1）
    let code = options.aptType;
    let keshi = options.keshi;
    if(code == "1"){
      isChild = code
      this.setData({
      aptType:1
    })
    }
    if(keshi != ""){
      this.setData({
        keshi:keshi,
        index1:keshi - 1
      })
      //根据科室id构成可选医生数据
    doctors.forEach(el => {
      if(el.docDepId == (Number(keshi)+1) &&el.isExpert == 1){
        selectDT.push(el)
      }
      //console.log(selectDT)
    });
    this.setData({
      dtInfo:selectDT
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