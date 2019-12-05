const app = getApp()
const util = require('../../../utils/util.js')
const resdetailUrl = '/biz/trade/guidance/record/detail'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    feed:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getResdetail(options.id)
  },

  getResdetail: function (id) {
    app.wxRequest(resdetailUrl, {
      id: id,
    }, 'get').then(res => {
      console.log(res.data)
      if (res.data.errno == 0) {
        let feed = res.data.data
        this.setData({
          feed: feed
        })
      } else {
        util.errorTip(res.errmsg)
      }
    })
  },
tohome:function(){
  wx.reLaunch({
    url: '/pages/guidance/guidance',
  })
}

})