// pages/store/store.js
const app = getApp()
const util = require('../../utils/util.js')
const getlist = require('../../utils/list.js')
const imageURL = app.globalData.imageUrl
const getUrl = '/mall/admin/brand/list'
const exhibitionUrl = '/mall/admin/ad/list'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentType: 0,
    contentHeight: '',
    isIphone5: '',
    navbarList: [],
    hotPic:[],
  },

  //获取类目信息和核心展示信息
  getCategory: function(data) {
    let navbarList = [],
      item = {},
      currentType = data[0]['id']
    //请求获取第一组数据展示
    getlist.getGoodsList(getUrl, currentType, 1, this, 'schoolList')
    for (var i = 0, len = data.length; i < len; i++) {
      item = {}
      item['name'] = data[i]['name']
      item['type'] = data[i]['id']
      navbarList.push(item)
    }
    this.setData({
      navbarList: navbarList,
      currentType: currentType
    })
  },
  //获取渲染广告
  getAd: function (data) {
    console.log(data)
    let hotPic = [],
      item = {}
    for (var i = 0, len = data.length; i < len; i++) {
      item = {}
      item['src'] = imageURL + data[i]['url']
      item['id'] = data[i]['id']
      item['type'] = data[i]['type']
      hotPic.push(item)
    }
    this.setData({
      hotPic: hotPic,
    })
    console.log('hotPic', hotPic)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const that = this
    let contentHeight = 0
    if (app.globalData.isIphone5) {
      contentHeight = app.globalData.sysH - 104
    } else {
      contentHeight = app.globalData.sysH - 100
    }
    that.setData({
      isIphone5: app.globalData.isIphone5,
      contentHeight: contentHeight
    })
    //获取类目信息
    app.wxRequest('/mall/admin/category/list', {
      type: 1,
      limit: 20
    }, 'get').then(data => {
      const res = data.data
      console.log('requst',res)
      if (res['errno'] == 0) {
        //请求成功，封装数据
        this.getCategory(res['data']['items'])
      } else {
        util.errorTip(res.errmsg)
      }
    })
    //请求广告
    app.wxRequest(exhibitionUrl, {
      position: 2,
      limit: 20
    }, 'get').then(data => {
      const res = data.data
      if (res['errno'] == 0) {
        //请求成功，封装数据
        this.getAd(res['data']['items'])
      } else {
        util.errorTip(res.errmsg)
      }
    })

  },

  changeType: function(e) {
    const that = this
    const type = e.currentTarget.dataset.type
    that.setData({
      currentType: type
    })
    getlist.getGoodsList(getUrl, type, 1, that, 'schoolList')
  },
  search: function() {
    wx.navigateTo({
      url: '/pages/search/search?page=store',
    })
  },
  storeDetails: function(e) {
    const that = this
    const id = e.currentTarget.dataset.id
    console.log('id', e)
    wx.navigateTo({
      url: '/pages/store/details/details?id=' + id,
    })
  },
  adDetails: function (e) {//广告跳转
    const that = this
    const type = e.currentTarget.dataset.type   
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/store/details/details?id=' + id,
    })
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

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    var self = this;
    setTimeout(() => {
      // 模拟请求数据，并渲染
      var arr = self.data.dataList,
        max = Math.max(...arr);
      for (var i = max + 1; i <= max + 3; ++i) {
        arr.unshift(i);
      }
      self.setData({
        dataList: arr
      });
      // 数据成功后，停止下拉刷新
      wx.stopPullDownRefresh();
    }, 1000);
  },
  onReachBottom: function() {
    var arr = this.data.dataList,
      max = Math.max(...arr);
    if (this.data.count < 3) {
      for (var i = max + 1; i <= max + 5; ++i) {
        arr.push(i);
      }
      this.setData({
        dataList: arr,
        count: ++this.data.count
      });
    } else {
      util.errorTip('没有更多数据了！')
    }
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },
  // 获取滚动条当前位置
  scroll: function (e) {
    console.log(e)
  },

  goTop: function (e) {  // 一键回到顶部
    let _top = this.data.scrollTop;
    if (_top == 1) {
      _top = 0
    } else {
      _top = 1
    }
    this.setData({
      scrollTop: _top
    });
  },
  goMiniprogram: function (e) {
    wx.navigateToMiniProgram({
      appId: 'wx0aeac8991ae4cd33',
      path: '',
      extraData: {
        openid: app.globalData.openid
      },
      envVersion: 'release',
      success(res) {
        console.log('打开成功')// 打开成功
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