// pages/my/order/order.js
const app = getApp()
const util = require('../../../utils/util.js')
const getUrl = '/biz/trade/order/course/list/my'
const payUrl = '/biz/trade/order/course/pay'
const cancelUrl = '/biz/trade/order/course/cancel/'
const cancelRefund = '/biz/trade/refund/course/cancel/'
const blockHeight = 132
let animation, status = -1
const listNameArray = {
  '-1': 'allList',
  '0': 'waitPayList',
  '1': 'cancelList', 
  '2': 'hasPayList',
  '3':'refundList'
}
const statusText = ['待支付', '已取消', '已支付', '支付失败', '已评价', '退款中', '已退款','退款失败','已完成']
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isIphone5: false,
    orderType: 1,
    inputOrderSn: '',
    contentHeight: 0,
    currentTab: 0,
    tabbar:[],
    tabbar1: [{//线上
        status: -1,
        value: '全部',
      },
      {
        status: 0,
        value: '待支付',
      },
      {
        status: 1,
        value: '已取消',
      },
      {
        status: 2,
        value: '已支付',
      }

    ],
    tabbar0: [{//线下
      status: -1,
      value: '全部',
    },
      {
        status: 0,
        value: '待支付',
      },
      {
        status: 1,
        value: '已取消',
      },
      {
        status: 2,
        value: '已支付',
      },
      {
        status: 3,
        value: '退款/售后',
      }
    ],
    hasImg: false,
    selectArray: [{
        id: '1',
        text: '全部时间'
      },
      {
        id: '2',
        text: '近一周'
      },
      {
        id: '3',
        text: '近一个月'
      },
      {
        id: '4',
        text: '近三个月'
      }
    ],
    allList: [],
    timeId: '1',
    index: 0,
    waitPayList: [],
    completedList: [],
    hasPayList: [],
    showModal: false,
    animationData: '', //动画效果
    password: [{
        hasValue: false,
        value: ''
      },
      {
        hasValue: false,
        value: ''
      },
      {
        hasValue: false,
        value: ''
      },
      {
        hasValue: false,
        value: ''
      },
      {
        hasValue: false,
        value: ''
      },
      {
        hasValue: false,
        value: ''
      }
    ],
    keyboard: [{
        key: 1,
        value: 1
      },
      {
        key: 2,
        value: 2
      },
      {
        key: 3,
        value: 3
      },
      {
        key: 4,
        value: 4
      },
      {
        key: 5,
        value: 5
      },
      {
        key: 6,
        value: 6
      },
      {
        key: 7,
        value: 7
      },
      {
        key: 8,
        value: 8
      },
      {
        key: 9,
        value: 9
      },
      {
        key: '完成',
        value: -1
      },
      {
        key: 0,
        value: 0
      }
    ],
    payPassword: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const that = this
    if(that.data.orderType==0){
      that.data.tabbar=that.data.tabbar0
    } else if (that.data.orderType == 1) {
      that.data.tabbar = that.data.tabbar1
    }
    that.setData({
      isIphone5: app.globalData.isIphone5,
      contentHeight: app.globalData.sysH,
      tabbar: that.data.tabbar
    })
    that._sliderChange()
  },
  getList: function() {
    let beginTime = '',
      endTime = util.formatTime(new Date(), 1)
    switch (this.data.timeId) {
      case '1':
        beginTime = ''
        endTime = ''
        break
      case '2':
        beginTime = util.formatTime(util.addDateByDay(new Date(), -7), 1)
        break
      case '3':
        beginTime = util.formatTime(util.addDateByMonth(new Date(), -1), 1)
        break
      case '4':
        beginTime = util.formatTime(util.addDateByMonth(new Date(), -3), 1)
        break
    }
    let param = {
      limit: 50,
      orderType: this.data.orderType,
      beginTime: beginTime,
      endTime: endTime,
      order: "desc",    // 排序规则
      sort: "add_time",    // 排序字段
      con: this.data.inputOrderSn,
    }
    if (status != -1) {
      param['status'] = status
    }
    if (status=='5,6,7'){
      status=3
    }
    app.wxRequest(getUrl, param, 'get').then(res => {
      if (res.data.errno == 0) {
        let list = res.data.data.items
        console.log(list)
        let data = {}
        let dataList = []
        for (var i = 0; i < list.length; i++) {
          data = {}
          data.id = list[i].id     
          data.orgName = list[i].orgName 
          data.curOrgName = list[i].curOrgName          
          data.courseName = list[i].courseName       
          data.picUrl = util.jointUrl(list[i].courseCover)    
          data.orderType = list[i].orderType    
          data.payType = list[i].payType      
          data.orderSn = list[i].sn
          data.addTime = list[i].addTime.substring(0, 16)
          data.orderPrice = list[i].orderPrice
          data.status = list[i].orderStatus
          data.statusText = statusText[list[i].orderStatus]
          data.refundId = list[i].refundId 
          dataList.push(data)
        }
        this.setData({
          [listNameArray[status]]: dataList,
          pageHeight: dataList.length * blockHeight
        })
      } else {
        util.errorTip('获取失败')
        console.log(res.data.errmsg)
      }
    })
  },
  //更新tab页高度
  _sliderChange: function() {
    status = this.data.tabbar[this.data.currentTab].status  
    console.log(status)
    if(status==3){
      status='5,6,7'
    }
    this.getList()
  },
  switchType: function(e) {
    if (this.data.orderType !== e.currentTarget.dataset.type) {
      this.data.orderType=parseInt(e.currentTarget.dataset.type)
      if (this.data.orderType == 0) {
        this.data.tabbar = this.data.tabbar0
      } else if (this.data.orderType == 1) {
        this.data.tabbar = this.data.tabbar1
      }
      this.setData({
        orderType: parseInt(e.currentTarget.dataset.type),
        currentTab: 0,
        tabbar:this.data.tabbar
      })
      this._sliderChange()
    }
  },
  //点击切换teb页
  switchNav: function(e) {
    if (this.data.currentTab !== e.currentTarget.dataset.current) {
      this.setData({
        currentTab: parseInt(e.currentTarget.dataset.current),
      })
      this._sliderChange()
    }
  },
  //滑动切换tab页
  bindChange: function(e) {
    this.setData({
      currentTab: e.detail.current
    })
    this._sliderChange()
  },
  goToPay:function(e){
    console.log(e)
    let info=e.currentTarget.dataset.info
    let orderinfo = {
      orderSn: info.orderSn,
      id: info.id,
      name: info.orgName,
      addTime: info.addTime,
      orderPrice: info.orderPrice
    }
    let orderinfoStr = JSON.stringify(orderinfo)
    wx.navigateTo({
      url: '../../videoCourse/pay/pay?orderinfoStr=' + orderinfoStr
    })
  },
  applyRefund: function (e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../refund/apply/apply?id=' + id,
    })
  },
  refundDetail: function (e) {
    console.log(e)
    const orderSn = e.currentTarget.dataset.orderSn
    const refundId = e.currentTarget.dataset.refundid
    wx.navigateTo({
      url: '../refund/details/details?refundId=' + refundId,
    })
  },
  cancelRefund: function (e) {
    const that = this
    const id = e.currentTarget.dataset.id
    wx.showModal({
      title: '取消退款',
      content: '确认取消退款吗?',
      success: function (res) {
        if (res.confirm) {
          app.wxRequest(cancelRefund + id, {}, 'get').then(res => {
            if (res.data.errno == 0) {
              wx.showToast({
                title: '取消成功！',
                icon: 'success'
              })
            } else {
              util.errorTip(res.data.errmsg)
              console.log(res.data.errmsg)
            }
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },
  getTime: function(e) {
    let timeId = e.detail.id,
      index = e.detail.index
    this.setData({
      timeId: timeId,
      index: index
    })
    this.getList()
  },
  pay: function() {
 
    const that = this
    app.wxRequest(payUrl, {
      order: that.data.id,
      balance: that.data.balancePrice,
      payType: 1,// 支付类型, 1-余额, 2-小程序
      payPwd: that.data.payPassword
    }).then(res => {
      if (res.data.errno == 0) {
        wx.redirectTo({
          url: '/pages/my/courseorder/details/details?sn=' + that.data.orderSn+'&id='+that.data.id,
        })
      } else {
        util.errorTip(res.data.errmsg)
        console.log(res.data.errmsg)
      }
    })
  },
  showModal: function(e) {
    const that = this
    const orderSn = e.currentTarget.dataset.orderSn
    const orderPrice = e.currentTarget.dataset.price
    const id = e.currentTarget.dataset.id
    that.setData({
      showModal: true,
      orderSn: orderSn,
      balancePrice: orderPrice,
      id:id
    })
    animation = wx.createAnimation({
      duration: 600, //动画的持续时间 默认400ms 数值越大，动画越慢 数值越小，动画越快
      timingFunction: 'ease', //动画的效果 默认值是linear
    })
    setTimeout(function() {
      that._fadeIn(); //调用显示动画
    }, 200)
  },
  getPassword: function(e) {
    const that = this
    const value = e.currentTarget.dataset.value
    if (that.data.payPassword.length == 6 || value == -1) {
      that.hideModal()
      that.pay()
    } else {
      let passwordList = that.data.password
      passwordList[that.data.payPassword.length].hasValue = true
      passwordList[that.data.payPassword.length].value = value
      let password = that.data.payPassword + value
      that.setData({
        password: passwordList,
        payPassword: password
      })
      if (password.length == 6) {

        that.pay()
        that.hideModal()
      }
    }
  },
  init: function() {
    let list = []
    let data = {}
    for (var i = 0; i < 6; i++) {
      data = {}
      data.hasValue = false
      data.value = ''
      list.push(data)
    }
    this.setData({
      password: list,
      payPassword: ''
    })
  },
  deletePassword: function() {
    const that = this
    let passwordList = that.data.password
    let payPassword = that.data.payPassword
    passwordList[payPassword.length - 1].hasValue = false
    passwordList[payPassword.length - 1].value = ''
    that.setData({
      password: passwordList,
      payPassword: payPassword.substring(0, payPassword.length - 1)
    })
  },
  //动画函数
  _fadeIn: function() {
    animation.translateY(0).step()
    this.setData({
      animationData: animation.export()
    })
  },
  _fadeDown: function() {
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
    })
  },

  // 隐藏遮罩层
  hideModal: function() {
    var that = this
    that.init()
    animation = wx.createAnimation({
      duration: 800, //动画的持续时间 默认400ms 数值越大，动画越慢 数值越小，动画越快
      timingFunction: 'ease', //动画的效果 默认值是linear
    })
    that._fadeDown(); //调用隐藏动画
    setTimeout(function() {
      that.setData({
        showModal: false
      })
    }, 720) //先执行下滑动画，再隐藏模块
  },
  cancel: function(e) {
    const that = this
    //const orderSn = e.currentTarget.dataset.orderSn
    const orderId = e.currentTarget.dataset.orderid
    console.log(orderId)
    wx.showModal({
      title: '取消订单',
      content: '确认取消订单吗?',
      success: function(res) {
        if (res.confirm) {
          app.wxRequest(cancelUrl+orderId, {},'get').then(res => {
            if (res.data.errno == 0) {
              wx.showToast({
                title: '取消成功！',
                icon: 'success'
              })
              that.onLoad()
            } else {
              util.errorTip('取消订单失败')
              console.log(res.data.errmsg)
            }
          })
        }
      }
    })
  },
  goToDetails: function(e) {
    const id = e.currentTarget.dataset.orderid
    const sn = e.currentTarget.dataset.ordersn
    if(this.data.orderType==1){//视频课程详情
      wx.navigateTo({
        url: 'details/details?id=' + id + '&sn=' + sn,
      })
    }else{
      wx.navigateTo({
        url: 'details_school/details_school?id=' + id + '&sn=' + sn,
      })
    }
    
  },
  inputSelect: function(e) {
    this.setData({
      inputOrderSn: e.detail.value
    })
  },
  clearSelect: function() {
    this.setData({
      inputOrderSn: ''
    })
    this.search()
  },
  search: function(e) {
    this.getList()
  },
  onShareAppMessage: function() {
    let that = this;
    return {
      title: '乐宝教育365', // 转发后 所显示的title
      path: '/pages/loading/loading'
    }
  }
})