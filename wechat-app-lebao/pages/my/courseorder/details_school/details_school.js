// pages/my/order/details/details.js
const app = getApp()
const util = require('../../../../utils/util.js')
const getUrl = '/biz/trade/order/course/read/'
const payUrl = '/biz/trade/order/course/pay'
const cancelUrl = '/biz/trade/order/course/cancel/'
const cancelRefund = '/biz/trade/refund/course/cancel/'
let animation
Page({

  /**
   * 页面的初始数据
   */
  data: {
    student: '',
    objName: '',
    objLogo: '',
    orderSn: '',
    orgName: '',
    status: '',
    statusText: '',
    picUrl: '',
    addTime: '',
    price: '',
    address: '',
    phone: '',

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
  onLoad: function (options) {

    this.setData({
      id: options.id,
      isIphone5: app.globalData.isIphone5
    })
    app.wxRequest(getUrl + options.id, {
    }, 'get').then(res => {
      console.log(res.data.data)
      if (res.data.errno == 0) {
        let data = res.data.data
        let orgName = data.orgName,
          orgAddress = data.orgAddress,
          status = data.orderStatus,
          statusText = '',
          courseCover = util.jointUrl(data.courseCover),
          addTime = data.addTime,
          price = data.orderPrice,
          orderSn = data.sn,
          student=data.items,
          refundId=data.refundId
       
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
          id: options.id,
          name: orgName,
          addTime: addTime,
          orderPrice: price
        }

        this.setData({
          student: student,
          orgName: orgName,
          orgAddress: orgAddress,
          orderSn: orderSn,
          status: status,
          statusText: statusText,
          courseCover: courseCover,
          addTime: addTime,
          price: price,
          orderinfo: orderinfo,
          refundId: refundId
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
  cancel: function () {
    const that = this
    wx.showModal({
      title: '取消订单',
      content: '确认取消订单吗?',
      success: function (res) {
        if (res.confirm) {
          app.wxRequest(cancelUrl + that.data.id, {}, 'get').then(res => {
            if (res.data.errno == 0) {
              wx.showToast({
                title: '取消成功！',
                icon: 'success'
              })
              that.onLoad()
            } else {
              util.errorTip(res.data.errmsg)
              console.log(res.data.errmsg)
            }
          })
        }
      }
    })
  },
  applyRefund: function () {
    wx.navigateTo({
      url: '../../refund/apply/apply?id=' + this.data.id,
    })
  },
  refundDetail: function (e) {
    wx.navigateTo({
      url: '../../refund/details/details?refundId=' + this.data.refundId,
    })
  },
  cancelRefund: function () {
    const that = this
    wx.showModal({
      title: '取消退款',
      content: '确认取消退款吗?',
      success: function (res) {
        if (res.confirm) {
          app.wxRequest(cancelRefund + that.data.id, {}, 'get').then(res => {
            if (res.statusCode == 200) {
              if (res.data.errno == 0) {
                wx.showToast({
                  title: '取消成功！',
                  icon: 'success'
                })
                that.setData({
                  status: 2,
                  statusText: '已支付',
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
  onShareAppMessage: function () {
    let that = this;
    return {
      title: '乐宝教育365', // 转发后 所显示的title
      path: '/pages/loading/loading'
    }
  }
})