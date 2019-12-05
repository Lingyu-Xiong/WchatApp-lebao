// pages/my/withdrawal/details/details.js
const app = getApp()
const util = require('../../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    verticalCurrent: 1,
    stepList: [],
    isIphone5: false
  },
  getStepList(data) {
    let statusName = ['申请成功，等待平台审核', '平台审核通过, 等待提现', '平台拒绝', '提现成功', '提现失败']
    let stepList = [],
      index
    let step = {}
    step['title'] = '申请成功，等待平台审核'
    step['content'] = data['bankName'] + '（' + data['bankCardNo'].substring(data['bankCardNo'].length - 4) + '）' + '\n' +
      data['applyTime']
    stepList.push(step)
    step = {}
    index = data['status'] > 2 ? 1 : data['status']
    step['title'] = data['status'] == 0 ? '等待平台审核' : data['auditFeedback']
    step['content'] = data['status'] == 0 ? '' : data['auditTime']
    stepList.push(step)
    if (data['status'] == 2) {
      return stepList
    }
    step = {}
    step['title'] = data['status'] > 2 ? data['confirmFeedback'] : '等待提现'
    step['content'] = data['status'] > 2 ? data['confirmTime'] : ''
    stepList.push(step)
    return stepList
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      isIphone5: app.globalData.isIphone5
    })
    const that = this
    app.wxRequest('/biz/trade/withdraw/read/' + options.sn, {}, 'get').then(data => {
      const res = data.data
      if (res.errno != 0) {
        util.errorTip(res.errmsg)
        return
      }
      let message = res.data
      let bankName = message.bankName,
        sn = message.withdrawDepositApplySn,
        name = message.bankCardHolder,
        phone = message.holderPhone,
        applyTime = message.applyTime,
        bankCard = message.bankCardNo.substring(message.bankCardNo.length - 4)
      that.setData({
        stepList: that.getStepList(res.data),
        verticalCurrent: res.data['status'] + 1,
        bankName: bankName,
        sn: sn,
        name: name,
        phone: phone,
        applyTime: applyTime,
        bankCard: bankCard
      })
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
    wx.navigateBack({
      delta: 2
    })
  },
  back: util.back,
  onShareAppMessage: function() {
    let that = this;
    return {
      title: '乐宝教育365', // 转发后 所显示的title
      path: '/pages/loading/loading'
    }
  }
})