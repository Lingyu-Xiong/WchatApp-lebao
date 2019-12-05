const app = getApp()
const util = require('../../../utils/util.js')
const resultUrl = '/biz/trade/guidance/record/list'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    resultList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
  this.getResult()
  },

  getResult: function () {
    app.wxRequest(resultUrl, {
      page: 1,
      limit: 50,
      sort: "add_time",    // 排序字段
      order: "desc",    // 排序规则
    }, 'get').then(res => {
      console.log(res.data)
      if (res.data.errno == 0) {
        let data = res.data.data.items
        let resultList = [],
          item = {}
        for (var i = 0; i < data.length; i++) {
          item = {}
          item.id = data[i].id
          item.addTime = data[i].addTime.substring(0, 10)
          item.checkStatus = data[i].checkStatus
          item.category=data[i].category
          resultList.push(item)
        }
        this.setData({
          resultList: resultList
        })
      } else {
        util.errorTip(res.errmsg)
      }
    })
  },
  toresultDetail:function(e){
    let id=e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/guidance/resultdetail/resultdetail?id='+id,
    })
  },
  showtips:function(){
    wx.showToast({
      title: '请耐心等待结果',
      icon: 'none'
    })
  }
  
})