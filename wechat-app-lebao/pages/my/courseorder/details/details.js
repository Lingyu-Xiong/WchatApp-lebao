// pages/my/order/details/details.js
const app = getApp()
const util = require('../../../../utils/util.js')
const getUrl = '/biz/trade/order/course/read/'
const payUrl = '/biz/trade/order/course/pay'
const cancelUrl = '/biz/trade/order/course/cancel/'
const cancelRefund = '/biz/trade/refund/delete'
let animation
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderSn:'',
    status: '',
    statusText: '',
    courseCover: '',
    addTime: '',
    price: '',
    courseName:'' ,
    id:'',

    isIphone5: false,
    showModal: false,
    animationData: '', //动画效果
    isStore: false,
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
 
    this.setData({
      id: options.id,
      isIphone5: app.globalData.isIphone5
    })
    app.wxRequest(getUrl + options.id, {
    }, 'get').then(res => {
      console.log(res.data.data)
      if (res.data.errno == 0) {
        let data = res.data.data
        let courseName = data.courseName,
          status = data.orderStatus,
          statusText = '',
          courseCover = util.jointUrl(data.courseCover),
          addTime = data.addTime,
          price = data.orderPrice,
          orderSn=data.sn,
          id=data.id,
          orgName=data.orgName
        switch (data.orderStatus) {
          case 0:
            statusText = '待支付'
            break
          case 1:
            statusText = '已取消'
            break
          case 2:
            statusText = '已支付'
            break
          case 3:
            statusText = '支付失败'
            break
          case 5:
            statusText = '退款中'
            break
          case 6:
            statusText = '已退款'
            break
          case 7:
            statusText = '退款失败'
            break
          case 8:
            statusText = '已完成'
            break
        }
        let orderinfo = {
          orderSn: orderSn,
          id: id,
          name: orgName,
          addTime: addTime,
          orderPrice: price
        }
        this.setData({
          orderSn:orderSn,
          status: status,
          statusText: statusText,
          courseCover: courseCover,
          addTime: addTime,
          price: price,
          id:id,
          name:orgName,
          orderinfo: orderinfo
        })
        
      } else {
        util.errorTip('获取失败')
        console.log(res.data.errmsg)
      }
    })
  },
  goToPay: function () {
    
    let orderinfoStr = JSON.stringify(this.data.orderinfo)
    wx.navigateTo({
      url: '../../../videoCourse/pay/pay?orderinfoStr=' + orderinfoStr
    })
  },
  cancel: function (e) {
    const that = this
    const orderSn = that.data.orderSn
    wx.showModal({
      title: '取消订单',
      content: '确认取消订单吗?',
      success: function (res) {
        if (res.confirm) {
          app.wxRequest(cancelUrl + that.data.id, {}, 'get').then(res => {
            if (res.statusCode == 200) {
              if (res.data.errno == 0) {
                wx.showToast({
                  title: '取消成功！',
                  icon: 'success'
                })
                that.setData({
                  status: 1,
                  statusText: '已取消',
                })
              } else {
                util.errorTip(res.data.errmsg)
                console.log(res.data.errmsg)
              }
            } else {
              util.errorTip('请求失败')
              console.log(res.errmsg)
            }
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

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

  evaluate: function() {
    wx.showModal({
      title: '待开发',
      content: '该页面没有设计，没有接口',
    })
  },
  onShareAppMessage: function () {
    let that = this;
    return {
      title: '乐宝教育365', // 转发后 所显示的title
      path: '/pages/loading/loading'
    }
  }
})