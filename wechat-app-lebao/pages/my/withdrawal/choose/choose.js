// pages/my/withdrawal/choose/choose.js
const app = getApp()
const util = require('../../../../utils/util.js')
const getMyBankUrl = '/base/user/bank/userlist'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    selectNum: 0,
    cardList: [],
    isIphone5: false,
    contentHeight:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const that = this
    that.setData({
      isIphone5: app.globalData.isIphone5,
      contentHeight:app.globalData.sysH
    })
    app.wxRequest(getMyBankUrl, {
      limit: 20
    }, 'get').then(res => {
      if (res.statusCode == 200) {
        if (res.data.errno === 0) {
          let data = {}
          let list = []
          let selectNum = 0
          let dataList = res.data.data.items
          for (var i = 0; i < dataList.length; i++) {
            data = {}
            data.id = dataList[i].id
            data.name = dataList[i].bankName
            data.pic = dataList[i].pictrueUrl
            data.abbr = dataList[i].bankAbbr
            data.isSelected = false
            if (dataList[i].isFirst == 1) {
              data.isSelected = true
              selectNum = i
            }
            list.push(data)
          }
          that.setData({
            cardList: list,
            selectNum: selectNum
          })
        } else {
          util.errorTip('获取失败')
          console.log(res.data.errmsg)
        }
      } else {
        util.errorTip('请求失败')
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.onLoad()
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

  add: function() {
    wx.navigateTo({
      url: '../add/add',
    })
  },
  chooseBank: function(e) {
    const that = this
    const index = e.currentTarget.dataset.index
    let cardList = that.data.cardList
    for (var i = 0; i < cardList.length; i++) {
      cardList[i].isSelected = false
    }
    cardList[index].isSelected = true
    that.setData({
      selectNum: index,
      cardList: cardList
    })
  },
  ensureBank: function() {
    let selectBank = this.data.cardList[this.data.selectNum]
    wx.navigateBack({
      delta: 1,
      success: function(e) {
        //var page = getCurrentPages().pop();
        //if (page == undefined || page == null) return;
        let pages = getCurrentPages(); 
        let prevPage = pages[pages.length - 2];  
        prevPage.setData({
          cardpic: selectBank.pic,
          bankCard: selectBank.name + '(' + selectBank.abbr + ')',
          bankId: selectBank.id
        })
      }
    })
  },
  back: util.back,
  onShareAppMessage: function () {
    let that = this;
    return {
      title: '乐宝教育365', // 转发后 所显示的title
      path: '/pages/loading/loading'
    }
  }
})