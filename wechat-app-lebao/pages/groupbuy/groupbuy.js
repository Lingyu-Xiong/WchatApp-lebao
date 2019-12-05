// pages/groupbuy/groupbuy.js
const app = getApp()
const util = require('../../utils/util.js')
const getactUrl = '/biz/trade/groupon/act/list'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputvideo:'',
    actList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
   this.getactList()
    
  },

  getactList:function(){
  app.wxRequest(getactUrl, {
    con:this.data.inputvideo,
    limit: 50
  }, 'get').then(res => {
    console.log(res.data)
    if (res.data.errno === 0) {
      let data = res.data.data.items
      let item = {}, actList = []
      for (var i = 0; i < data.length; i++) {
        item = {}
        item.id = data[i].id
        item.objId=data[i].objId
        item.name = data[i].name
        item.logoUrl=data[i].logoUrl
        item.discountPrice=data[i].discountPrice
        item.originalPrice=data[i].originalPrice
        actList.push(item)
      }
      this.setData({
        actList: actList
      })

    } else {
      util.errorTip('获取失败')
      console.log(res.data.errmsg)
    }
  })
  },


  inputSelect: function (e) {
    this.setData({
      inputvideo: e.detail.value
    })

  },
  clearSelect: function () {
    this.setData({
      inputvideo: ''
    })
    this.search()
  },
  search: function () {
    this.getactList()
  },
togbcourse:function(e){
  let actid=e.currentTarget.dataset.id
  let objId=e.currentTarget.dataset.objid
  console.log(actid,objId)
  console.log(e)
  wx.navigateTo({
    url: '/pages/groupbuy/gbcourse/gbcourse?actid='+actid+'&objId='+objId,
  })
}
})