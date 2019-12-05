// pages/my/charge/list/list.js
const app = getApp()
const util = require('../../../../utils/util.js')
const getUrl = '/biz/trade/account/charge/list/my'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isIphone5: false,
    contentHeight: 0,
    timeId: '1',
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
    detailList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const that = this
    let contentHeight = app.globalData.sysH - 40
    if (app.globalData.isIphone5) {
      contentHeight = app.globalData.sysH - 24
    }
    that.setData({
      isIphone5: app.globalData.isIphone5,
      contentHeight: contentHeight,
      total: options.total
    })
    that.getList(that.data.timeId)
  },
  getTime: function(e) {
    const that = this
    let timeId = e.detail.id,
      index = e.detail.index
    that.setData({
      timeId: timeId,
      index: index
    })
    that.getList(timeId)
    console.log('bankId', timeId)
  },
  getList: function(time) {
    const that = this
    let beginTime = '',
      endTime = util.formatTime(new Date(), 1)
    switch (time) {
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
    wx.showLoading({
      title: '获取中...',
    })
    app.wxRequest(getUrl, {
      limit: 50,
      beginTime: beginTime,
      endTime: endTime
    }, 'get').then(res => {
      if (res.statusCode == 200) {
        if (res.data.errno == 0) {
          wx.hideLoading()
          let list = res.data.data.items
          let data = {}
          let dataList = []
          for (var i = 0; i < list.length; i++) {
            data = {}
            data.id = list[i].id
            data.orderSn = list[i].balanceChargeSn
            data.time = list[i].chargeTime
            data.money = list[i].chargeMoney
            data.name = list[i].username
            dataList.push(data)
          }
          that.setData({
            detailList: dataList
          })
        } else {
          wx.hideLoading()
          util.errorTip('获取失败')
          console.log(res.data.errmsg)
        }
      } else {
        wx.hideLoading()
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
  onShareAppMessage: function () {
    let that = this;
    return {
      title: '乐宝教育365', // 转发后 所显示的title
      path: '/pages/loading/loading'
    }
  }
})