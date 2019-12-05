const app = getApp()
const util = require('../../../utils/util.js')
const createUrl = '/biz/trade/order/course/create'
const cancelUrl = '/biz/trade/order/course/cancel/'
Page({
  data:{
    id: '',//订单id
    sn: '',
    courseName: '',
    addTime: '',
    orderPrice: '',
  },

  onLoad:function(options){
    let createinfo = JSON.parse(options.createinfoStr)
    console.log('createinfo', createinfo)
    this.createOrder(createinfo)
  },

  //创建订单
  createOrder: function (createinfo){
    app.wxRequest(createUrl, createinfo).then(res => {
        console.log(res.data)
        if (res.data.errno == 0) {
          let data = res.data.data
          let id = data.id,
            sn = data.sn,
            courseName = data.courseName,
            addTime = data.addTime,
            orderPrice = data.orderPrice
          this.setData({
            id: id,
            sn: sn,
            courseName: courseName,
            addTime: addTime,
            orderPrice: orderPrice,
          })
        } else {
          util.errorTip(res.data.errmsg)
          console.log(res.data.errmsg)
          setTimeout(() => {
            wx.navigateBack({
              delta: 1,
            })
          }, 3000)
        }
    })
  },

  //取消订单
  cancle: function () {
    const that = this
    wx.showModal({
      title: '取消订单',
      content: '确认取消订单吗?',
      success: function (res) {
        if (res.confirm) {
          wx.showLoading({
            title: '取消中...',
          })
          app.wxRequest(cancelUrl + that.data.id, {}, 'get').then(res => {
              if (res.data.errno == 0) {
                wx.hideLoading()
                wx.showToast({
                  title: '取消成功！',
                  icon: 'success'
                })
                setTimeout(function () {
                  wx.navigateBack({
                    delta: 1,
                  })
                }, 1500)
              } else {
                wx.hideLoading()
                util.errorTip('取消订单失败')
                console.log(res.data.errmsg)
              }
          })
        }
      }
    })
  },

//去支付
topay:function(){
  wx.navigateTo({
    url: '/pages/groupbuy/gbbuy/gbbuy?order=' + this.data.id + '&orderPrice=' + this.data.orderPrice,
  })
},

})