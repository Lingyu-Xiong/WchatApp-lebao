// pages/examReg/examReg.js
const app = getApp()
const util = require('../../utils/util.js')
const getexamRegUrl = '/biz/trade/exam/reg/list'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isIphone5: false,
    examList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    var that = this
    that.setData({
      isIphone5: app.globalData.isIphone5,
    })
    app.wxRequest(getexamRegUrl, {
      limit: 20,
      sort: "update_time",
      order: "desc",    
    }, 'get').then(res => {
      console.log(res.data)
      if (res.data.errno === 0) {
        let examList = res.data.data.items,
        examlist=[],
        item
        for (var i = 0; i < examList.length; i++) {
          item = {}
          item.id = examList[i].id
          item.name = examList[i].name
          item.addTime = examList[i].addTime.substring(0,10)
          examlist.push(item)
        }       
        this.setData({
          examList: examlist
        })

      } else {
        util.errorTip('获取失败')
        console.log(res.data.errmsg)
      }
    })

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
  toExamDetail:function(e){
    let id=e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/examReg/examinfo/examinfo?id='+id,
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