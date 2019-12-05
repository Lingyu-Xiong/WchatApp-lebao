// pages/my/refund/apply/apply.js
const app = getApp()
const util = require('../../../../utils/util.js')
//const getUrl = '/biz/trade/order/consume/list/my'
const getUrl = '/biz/trade/order/course/read/'
const applyUrl = '/biz/trade/refund/course/apply'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isIphone5: false,
    reason: '',
    id:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const that = this
    that.setData({
      id: options.id,
      isIphone5: app.globalData.isIphone5
    })
    app.wxRequest(getUrl + options.id, {}, 'get').then(res => {
      if (res.statusCode == 200) {
        console.log('apply',res.data)
        if (res.data.errno == 0) {
          let data = res.data.data
          let courseCover = data.courseCover,
            sn = data.sn,
            status = data.orderStatus,
            statusText = '',
            addTime = data.addTime,
            price = data.actualAmount

          switch (data.orderStatus) {
            case 0:
              statusText = '待支付'
              break
            case 1:
              statusText = '待评价'
              break
            case 2:
              statusText = '退款'
              break
            case 3:
              statusText = '已取消'
              break
            case 4:
              statusText = '已评价'
              break
          }
          that.setData({
            status: status,
            statusText: statusText,
            courseCover: courseCover,
            addTime: addTime,
            price: price,
            sn:sn
          })
        } else {
          util.errorTip('获取失败')
          console.log(res.data.errmsg)
        }
      } else {
        util.errorTip('请求失败')
        console.log(res.errmsg)
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
  inputReason: function(e) {
    let value = e.detail.value
    this.setData({
      reason: value
    })
  },
  ensureRefund: function() {
    const that = this
    wx.showLoading({
      title: '申请中..',
    })
    app.wxRequest(applyUrl,{
      id: that.data.id,
      reason:that.data.reason
    },'post').then(res => {
      if (res.statusCode == 200) {
        if (res.data.errno == 0) {
          wx.hideLoading()
          wx.showToast({
            title: '申请成功！',
            icon: 'success'
          })
          //获取该订单得到refundId
          app.wxRequest(getUrl + that.data.id, {}, 'get').then(res => {
            if (res.statusCode == 200) {
              if (res.data.errno == 0) {
                let refundId = res.data.data.refundId
                setTimeout(function () {
                  wx.redirectTo({
                    url: '../details/details?refundId=' + refundId,
                  })
                }, 1500)
              } else {
                util.errorTip(res.data.errmsg)
                console.log(res.data.errmsg)
              }
            } else {
              util.errorTip(res.errmsg)
              console.log(res.errmsg)
            }
          })

        } else {
          util.errorTip('申请失败')
          console.log(res.data.errmsg)
        }
      } else {
        util.errorTip('请求失败')
        console.log(res.errmsg)
      }
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