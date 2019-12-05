// pages/news/news.js
const app = getApp()
const util = require('../../utils/util.js')
const newsimgURL = app.globalData.imageurl
const getnewsUrl = '/mall/admin/topic/list'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isIphone5: false,
    newsList: [],
    bannerUrl: newsimgURL+'/newsbanner.png'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    var that = this
    that.setData({
      isIphone5: app.globalData.isIphone5,
    })
    app.wxRequest(getnewsUrl, {
      limit: 20
    }, 'get').then(res => {
      console.log(res.data)
      if (res.data.errno === 0) {
        let data = res.data.data.items
        let item={},newsList=[]
        for(var i=0;i<data.length;i++){
          item={}
          item.id=data[i].id
          item.title=data[i].title
          item.updateTime=data[i].updateTime.substring(0,10)
          item.readCount = data[i].visitNum
          item.picUrl=data[i].picUrl
          newsList.push(item)
        }
        this.setData({
          newsList: newsList
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

newsDetails:function(e){
  let newsid = e.currentTarget.dataset.id
  wx.navigateTo({
    url: '/pages/news/newsdetail/newsdetail?id=' + newsid,
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