const app = getApp()
const util = require('../../utils/util.js')
const imgURL = app.globalData.imageurl
const categoryUrl = '/mall/admin/lebaoCategory/query'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bannerUrl: imgURL + '/banner_test.png',
    categoryList: [],
    currentId:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    this.getCategory()
  },

  getCategory:function(){
    app.wxRequest(categoryUrl, {
      type: 1,
      limit: 20
    }, 'get').then(res => {
      console.log(res.data)
      if (res.data.errno == 0) {
        let data=res.data.data.items
        let categoryList = [],
          item = {}
        for (var i = 0; i < data.length; i++) {
          item = {}
          item.src= util.jointUrl(data[i].iconUrl)
          item.text = data[i].name
          item.id=data[i].id
          categoryList.push(item)
        }
        this.setData({
          categoryList: categoryList
        })
      } else {
        util.errorTip(res.errmsg)
      }
    })
  },
  chooseitem:function(e){
    let id = e.currentTarget.dataset.id
    this.setData({
      currentId:id
    })
  },
  totest:function(){
    let id=this.data.currentId
    if(id){
      wx.navigateTo({
        url: '/pages/guidance/test/test?id=' + id,
      })
    }else{
      wx.showModal({
        title: '提示',
        content: '请先选择科目',
        showCancel:false,
      })
    }
    
  },

  toResult:function(){
    wx.navigateTo({
      url: '/pages/guidance/result/result',
    })
  }


})