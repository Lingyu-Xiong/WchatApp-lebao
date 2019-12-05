// pages/search/search.js
const app = getApp()
const util = require('../../utils/util.js')
const getlist = require('../../utils/list.js')
let searchType, searchUrl, historyUrl, delSearchHistoryUrl
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputShowed: true,
    search: '',
    schoolList: [],
    total: -1,
    historyList: []
  },

  getSearchHistory: function() {
    app.wxRequest(historyUrl, {}, 'get')
      .then(data => {
        const res = data.data
        if (res['errno'] == 0) {
          const dataList = res['data']['items']
          let list = []
          for (let i = 0, len = dataList.length; i < len; i++) {
            list.push(dataList[i]['keyword'])
          }
          this.setData({
            historyList: dataList
          })
        } else {
          util.errorTip(res['errmsg'])
        }
      })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const that = this
    let contentHeight = app.globalData.sysH - 40
    if (options.page == 'store') {
      searchType=1
      searchUrl = '/mall/admin/brand/list'
      historyUrl = '/mall/admin/history/userList?type=1'
      delSearchHistoryUrl = '/mall/admin/history/deleteAll?type=1'
    } else {
      searchType=0
      searchUrl = '/mall/admin/school/list'
      historyUrl = '/mall/admin/history/userList?type=0'
      delSearchHistoryUrl = '/mall/admin/history/deleteAll?type=0'
    }
    //获取搜索历史
    this.getSearchHistory()
    that.setData({
      isIphone5: app.globalData.isIphone5,
      contentHeight: contentHeight,
      page: options.page
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
  inputSearch: function(e) {
    const that = this
    let search = e.detail.value
    that.setData({
      search: search
    })
  },
  search: function() {
    const that = this
    app.wxRequest(searchUrl, {
      name: that.data.search,
      page: 1,
      limit: 50
    }, 'get').then(res => {
      console.log(res.data)
      if (res.data.errno == 0) {
        let data = {}
        let list = []
        let schoolList = res.data.data.items
        for (var i = 0; i < schoolList.length; i++) {
          data = {}
          data.name = schoolList[i].name
          data.id = schoolList[i].id
          if (that.data.page == 'store') {
            data.src = util.jointUrl(schoolList[i].logoUrl)
          } else {
            data.src = util.jointUrl(schoolList[i].logoUrl)
          }
          list.push(data)
        }
        //搜索成功，重新加载搜索历史
        that.getSearchHistory()
        that.setData({
          schoolList: list,
          total: res.data.data.total
        })
      } else {
        util.errorTip(res.data.errmsg)
        console.log(res.data.errmsg)
      }
    })
  },
  clearContent: function() {
    this.setData({
      search: '',
      total: -1
    })
  },
  clearSearchHistory: function(e) {
    app.wxRequest(delSearchHistoryUrl, {}, 'get')
      .then(data => {
        const res = data.data
        if (res['errno'] == 0) {
          this.setData({
            historyList: []
          })
        } else {
          util.errorTip(res['errmsg'])
        }
      })
  },
  goToDetails: function (e) {
    const that = this
    const id = e.currentTarget.dataset.id
    if (searchType ==1) {
      wx.navigateTo({
        url: '/pages/store/details/details?id=' + id,
      })
    }else{
    wx.navigateTo({
      url: '/pages/school/details/details?id=' + id,
    })
    }
  },
  setSearch: function(e) {
    this.setData({
      search: e.currentTarget.dataset.content
    })
    this.search()
  },
  goTop: function (e) {  // 一键回到顶部
    wx.pageScrollTo({
      scrollTop: 0
    })
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