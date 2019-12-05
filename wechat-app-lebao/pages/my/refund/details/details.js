// pages/my/refund/details/details.js
const app = getApp()
const util = require('../../../../utils/util.js')
const getUrl = '/biz/trade/refund/course/read/'
const cancelRefund = '/biz/trade/refund/course/cancel/'
let fromPage
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isIphone5: false,
    current: 2,
    verticalCurrent: 2,
    stepList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const that = this
    that.setData({
      refundId: options.refundId,
      isIphone5: app.globalData.isIphone5
    })
    app.wxRequest(getUrl + that.data.refundId, {}, 'get').then(res => {
      if (res.statusCode == 200) {
        console.log('refunddetail',res.data)
        if (res.data.errno == 0) {
          let data = res.data.data
          let orderId = data.orderId,
            orgName = data.orgName,
            refundSn = data.sn,
            courseCover = data.courseCover,
            applyTime = data.applyTime,
            orderSn = data.orderSn,
            reason = data.reason
          that.setData({
            stepList: that.getStepList(data),
            verticalCurrent: data.status + 1,
            orgName: orgName,
            refundSn: refundSn,
            orderSn: orderSn,
            courseCover: courseCover,
            applyTime: applyTime,
            reason: reason,
            orderId: orderId
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
  // getStepList(data) {
  //   let statusName = ['申请成功，待商户审核', '商户审核通过, 待平台审核', '商家拒绝', '平台审核通过, 待退款', '平台拒绝', '退款完成']
  //   let stepList = []
  //   let step = {}
  //   step['title'] = statusName[0]
  //   step['content'] = data['applyTime']
  //   stepList.push(step)
  //   step = {}
  //   if (data['status'] == 0) {
  //     step['title'] = '等待商家审核'
  //     step['content'] = 'waiting...'
  //     stepList.push(step)
  //   }
  //   step = {}
  //   step['title'] = statusName[data['status']]
  //   step['content'] = '审核意见：' + data['feedbackMerchant'] + '\n' + data['merchantReviewTime']
  //   stepList.push(step)
  //   if (data['status'] == 2) {
  //     return stepList
  //   } else {
  //     step = {}
  //     step['title'] = '等待平台审核'
  //     step['content'] = 'waiting...'
  //     stepList.push(step)
  //   }
  //   step = {}
  //   step['title'] = statusName[data['status']]
  //   step['content'] = '审核意见：' + data['feedbackPlatform'] + '\n' + data['platformReviewTime']
  //   stepList.push(step)
  //   if (data['status'] == 4) {
  //     return stepList
  //   } else {
  //     step = {}
  //     step['title'] = '等待退款'
  //     step['content'] = 'waiting...'
  //     stepList.push(step)
  //   }
  //   step = {}
  //   if (data['status'] == 5) {
  //     step['title'] = statusName[data['status']]
  //     step['content'] = data['platformReviewTime']
  //     stepList.push(step)
  //   }
  //   return stepList
  // },
  getStepList(data) {
    let statusName = ['申请成功，待学校审核', '学校审核通过, 待平台审核', '学校拒绝', '平台审核通过, 待退款', '平台拒绝', '退款完成']
    let stepList = [],index
    let step = {}
    step['title'] = statusName[0]
    step['content'] = data['applyTime']
    stepList.push(step)
    step = {}
    index = data['refundStatus'] > 2 ? 1 : data['refundStatus']
    step['title'] = data['refundStatus'] == 0 ? '等待学校审核' : statusName[index]
    step['content'] = data['refundStatus'] == 0 ? '' : '审核意见：' + data['auditFeedback'] + '\n' + data['auditTime']
    stepList.push(step)
    if (data['refundStatus']==2){
      return stepList
    }
    step = {}
    index = data['refundStatus'] > 4 ? 3 : data['refundStatus']
    step['title'] = data['refundStatus'] <= 2 ? '等待平台审核' : statusName[index]
    step['content'] = data['refundStatus'] <= 2 ? '' : '审核意见：' + data['confirmFeedback'] + '\n' + data['confirmTime']
    stepList.push(step)
    if (data['status'] == 4) {
      return stepList
    }
    step = {}
    step['title'] = data['refundStatus'] <= 4 ? '退款成功' : statusName[data['refundStatus']]
    step['content'] = data['refundStatus'] <= 4 ? '' : data['confirmTime']
    stepList.push(step)
    return stepList
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
  cancelRefund: function() {
    const that = this
    wx.showLoading({
      title: '取消中...',
    })
    app.wxRequest(cancelRefund + that.data.orderId, {},'get').then(data => {
      let res = data.data
      if (res['errno'] == 0) {
        //取消成功
       wx.hideLoading()
       wx.showToast({
         title: '取消退款成功！',
         icon:'success'
       })
        wx.navigateTo({
          url: '../../courseorder/details_school/details_school?id=' + that.data.orderId,
        })

      } else {
        util.errorTip(res.errmsg)
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