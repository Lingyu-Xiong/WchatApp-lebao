// pages/news/news.js
const app = getApp()
const util = require('../../../../utils/util.js')
const gborderdetailUrl ='/biz/trade/order/course/read/'
const cancelUrl = '/biz/trade/order/course/cancel/'
Page({

  data: {
    orderid:'',
    gborderinfo:''
  },

  
  onLoad: function (options) {
    this.setData({
      orderid:options.orderid
    })
    this.getgborderdetail(options.orderid)
  },

//订单详情
getgborderdetail:function(id){
  app.wxRequest(gborderdetailUrl + id, {}, 'get').then(res => {
    console.log(res.data)
    if (res.data.errno === 0) {
      let data = res.data.data,gborderinfo={}
      gborderinfo.objLogo = util.jointUrl(data.courseCover)
      gborderinfo.objName=data.courseName
      gborderinfo.orderSn=data.sn
      gborderinfo.phone = data.orgPhonePrimary
      gborderinfo.price = data.orderPrice
      gborderinfo.orgName=data.orgName
      gborderinfo.address=data.orgAddress
      gborderinfo.student=data.items
      gborderinfo.addTime=data.addTime
      gborderinfo.status=data.orderStatus
      switch (data.orderStatus) {
        case 0:
          gborderinfo.statusText = '待支付'
          break
        case 1:
          gborderinfo.statusText = '已取消'
          break
        case 2:
          gborderinfo.statusText = '已支付'
          break
      }
      this.setData({
       gborderinfo:gborderinfo
      })

    } else {
      util.errorTip('获取失败')
      console.log(res.data.errmsg)
    }
  })
},

  //去支付
  topay: function () {
    wx.navigateTo({
      url: '/pages/groupbuy/gbbuy/gbbuy?order=' + this.data.orderid + '&orderPrice=' + this.data.gborderinfo.price,
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
          app.wxRequest(cancelUrl + that.data.orderid, {}, 'get').then(res => {
            if (res.data.errno == 0) {
              wx.hideLoading()
              wx.showToast({
                title: '取消成功！',
                icon: 'success'
              })
              setTimeout(function () {
                wx.redirectTo({
                  url: '/pages/my/mygroupbuy/mygroupbuy'
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

})