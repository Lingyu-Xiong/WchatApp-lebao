// pages/news/news.js
const app = getApp()
const util = require('../../../utils/util.js')
const getmylaunchUrl = '/biz/trade/groupon/found/myList'
const getmyjoinUrl ='/biz/trade/groupon/follow/myList'

Page({

  data: {
    orderType:0,
    currentTab:0,
    itemlist: [{param:'',name:'全部'},{ param: 1, name: '拼团中' }, { param: 3, name: '拼团成功' }, { param: 4, name: '拼团失败' }],
    mygbList: [],
    urls: [getmylaunchUrl, getmyjoinUrl]
  },

  onLoad: function (options) {
    if (options.groupRole==1){
      this.setData({
        orderType: options.groupRole
      })
      
   }
  },

  onShow:function(){
    this.getmygbList()
  },

  //获取我的开团list
  getmygbList:function(){
    let orderType = this.data.orderType,    
        currentTab=this.data.currentTab, 
        itemlist=this.data.itemlist
    let url=this.data.urls[orderType],
        params={
      objType:1,
      status:itemlist[currentTab].param,
      limit: 50
    }
    app.wxRequest(url, params, 'get').then(res => {
      console.log(res.data)
      if (res.data.errno === 0) {
        let data = res.data.data.items
        let item = {}, mygbList = []
        for (var i = 0; i < data.length; i++) {
          item = {}
          item.id=data[i].foundId
          item.actLogoUrl = data[i].actLogoUrl
          item.actName = data[i].actName
          item.originalPrice = data[i].originalPrice
          item.discountPrice = data[i].discountPrice
          item.status = data[i].status
          item.orderId = data[i].orderId
          mygbList.push(item)
        }
        console.log(mygbList)
        this.setData({
          mygbList: mygbList
        })
      } else {
        util.errorTip('获取失败')
        console.log(res.data.errmsg)
      }
    })
  },

//点击切换大类
  switchType: function (e) {
    if (this.data.orderType !== e.currentTarget.dataset.type) {
      this.setData({
        orderType: parseInt(e.currentTarget.dataset.type),
        currentTab: 0
      })
    }
    this.getmygbList()
  },
  //点击切换tab页
  switchNav: function (e) {
    let current = e.currentTarget.dataset.current
    if (this.data.currentTab !== current) {
      this.setData({
        currentTab: parseInt(e.currentTarget.dataset.current),
      })
    }
    this.getmygbList()
  },

//团购详情
  togbdetail:function(e){
    let groupid = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/groupbuy/gbdetail/gbdetail?groupid=' + groupid,
    })
  },

//订单详情
  gborderdetail:function(e){
    let orderid = e.currentTarget.dataset.orderid
    wx.navigateTo({
      url: '/pages/my/mygroupbuy/gborderdetail/gborderdetail?orderid=' + orderid,
    })
  },


})