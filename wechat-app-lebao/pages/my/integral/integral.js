// pages/my/integral/integral.js
const app = getApp()
const util = require('../../../utils/util.js')
const getUrl = '/biz/trade/account/change/vouchers/list/my'
const blockHeight = 60
const listNameArray = {
  '-1': 'allList',
  '5': 'consumeGiveList',
  '0': 'consumeUseList',
  '1': 'consumeRefundList'
}
const statusText = ['使用', '退回', '转账', '提现', '兑换', '赠送']
const desText=['商城消费使用','商城退回','转账','提现','兑换','学校消费赠送']
let type = -1
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isIphone5: false,
    contentHeight: 0,
    currentTab: 0,
    tabbar: [{
        type: -1,
        value: '全部',
      },
      {
        type: 5,
        value: '赠送',
      },
      {
        type: 0,
        value: '使用',
      },
      {
        type: 1,
        value: '退款',
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
    consumeGiveList: [],
    consumeUseList: [],
    consumeRefundList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const that = this
    let contentHeight = app.globalData.sysH
    that.setData({
      isIphone5: app.globalData.isIphone5,
      contentHeight: contentHeight,
      total: options.total
    })
    that._sliderChange()
  },
  getList: function(type) {
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
      limit: 20,
      beginTime: beginTime,
      endTime: endTime
    }
    if (type != -1) {
      param['type'] = type
    }
    app.wxRequest(getUrl, param, 'get').then(res => {
      if (res.data.errno == 0) {
        let list = res.data.data.items
        let data = {}
        let dataList = []
        for (var i = 0; i < list.length; i++) {
          data = {}
          data.id = list[i].id
          data.date = list[i].changeTime.substring(0,10)
          data.time = list[i].changeTime.substring(11)
          if(list[i].changeMoney>0){
            data.money = '+'+list[i].changeMoney
          }else{
            data.money = list[i].changeMoney
          }
          data.name = statusText[list[i].changeType]
          dataList.push(data)
        }
        this.setData({
          [listNameArray[type]]: dataList,
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
    type = this.data.tabbar[this.data.currentTab].type
    this.getList(type)
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
    let timeId = e.detail.id
    this.setData({
      timeId: timeId
    })
    this.getList(type)
  },
  onShareAppMessage: function () {
    let that = this;
    return {
      title: '乐宝教育365', // 转发后 所显示的title
      path: '/pages/loading/loading'
    }
  }
})