// pages/my/charge/charge.js
const app = getApp()
const util = require('../../../utils/util.js')
const payUrl = '/biz/trade/wxpay/minipay'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isIphone5: false,
    isSelected: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const that = this
    that.setData({
      isIphone5: app.globalData.isIphone5,
      balance: options.balance
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
  inputMoney: function(e) {
    const that = this
    var money = e.detail.value;
    that.setData({
      money: money
    })
  },
  charge: function() {
    const that = this
    if (that.data.money == '') {
      util.errorTip('请输入金额~')
      return false
    } else if (parseFloat(that.data.money) <= 0) {
      util.errorTip('充值金额>0~')
      return false
    } else {
      wx.showLoading({
        title: '充值中...',
      })
      app.wxRequest(payUrl, {
        total: that.data.money
      }, 'get').then(res => {
        if (res.statusCode == 200) {
          if (res.data.errno == 0) {
            let data = res.data.data
            wx.hideLoading()
            wx.requestPayment({
              timeStamp: data.timeStamp,
              nonceStr: data.nonceStr,
              package: data.package,
              signType: data.signType,
              paySign: data.sign,
              success: function() {
                wx.showToast({
                  title: '充值成功！',
                  icon: 'success'
                })
                var pages = getCurrentPages(); //页面指针数组 
                var prepage = pages[pages.length - 2]; //上一页面指针 
                prepage.setData({
                  balance: (parseFloat(prepage.data.balance) + parseFloat(that.data.money)).toFixed(2)
                }); //操作上一页面 
                setTimeout(function() {
                  wx.switchTab({
                    url: '/pages/my/person',
                  })
                }, 1500)
              },
              fail: function(res) {
                util.errorTip('充值失败')
                console.log('fail', res)
              }
            })
          } else {
            wx.hideLoading()
            util.errorTip('充值失败')
          }
        } else {
          wx.hideLoading()
          util.errorTip('请求失败')
        }
      })
    }
  },
  goTodetails: function() {
    wx.navigateTo({
      url: 'list/list?total=' + this.data.balance,
    })
  },
  clearMoney: function() {
    this.setData({
      money: ''
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