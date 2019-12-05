// pages/my/withdrawal/withdrawal.js
const app = getApp()
const util = require('../../../utils/util.js')
const getMyBankUrl = '/base/user/bank/userlist'
const withDrawUrl = '/biz/trade/withdraw/apply'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cardpic: '',
    bankCard: '',
    bankId: '',
    balance: '',
    time: '',
    isIphone5: false,
    money:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const that = this
    var time = util.formatTime(new Date())
    that.setData({
      isIphone5: app.globalData.isIphone5,
      time: time,
      balance: options.balance
    })
    app.wxRequest(getMyBankUrl, {
      limit: 20
    }, 'get').then(res => {
      if (res.data.errno === 0) {
        let dataList = res.data.data.items
        for (var i = 0; i < dataList.length; i++) {
          if (dataList[i].isFirst == 1) {
            let cardpic = dataList[i].pictrueUrl,
              bankCard = dataList[i].bankName + '(' + dataList[i].bankAbbr + ')',
              bankId = dataList[i].id
            that.setData({
              cardpic: cardpic,
              bankCard: bankCard,
              bankId: bankId
            })
          }
        }
      } else {
        wx.hideLoading()
        util.errorTip('获取失败')
        console.log(res.data.errmsg)
      }
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
  inputMoney: function(e) {
    const that = this
    let value = e.detail.value
    that.setData({
      money: value
    })
  },
  allWithdraw: function() {
    this.setData({
      money: this.data.balance
    })
    //this.withdraw()
  },
  withdraw: function() {
    const that = this
    const money = that.data.money
    //首先判断有没有选择银行卡
    if(that.data.bankId==''){
      util.errorTip('请添加或选择提现银行卡')
      return false
    }
    if (money == '') {
      util.errorTip('请输入金额')
      return false
    } else if (money > that.data.balance) {
      util.errorTip('账户余额不足')
      return false
    } else if (parseFloat(money) <= 0) {
      util.errorTip('提现金额>0~')
      return false
    } else {
      wx.showLoading({
        title: '提现中...',
      })
      app.wxRequest(withDrawUrl, {
        userBankId: that.data.bankId,
        money: money
      }, 'get').then(res => {
        if (res.data.errno === 0) {
          let sn = res.data.data.id
          wx.hideLoading()
          util.errorTip('提现申请提交成功，请耐心等待!')
          var pages = getCurrentPages(); //页面指针数组 
          var prepage = pages[pages.length - 2]; //上一页面指针 
          prepage.setData({
            balance: parseFloat(prepage.data.balance) - parseFloat(money)
          }); //操作上一页面
          setTimeout(function() {
            wx.navigateTo({
              url: 'details/details?sn=' + sn + '&close=1',
            })
          }, 1500)
        } else {
          wx.hideLoading()
          util.errorTip(res.data.errmsg)
          console.log(res.data.errmsg)
        }
      })
    }

  },
  chooseCard: function() {
    wx.navigateTo({
      url: 'choose/choose',
    })
  },
  goTodetails: function() {
    wx.navigateTo({
      url: 'list/list?total=' + this.data.balance,
    })
  },
  clearMoney: function() {
    this.setData({
      money: ''
    })
  },
  back: util.back,
  onShareAppMessage: function() {
    let that = this;
    return {
      title: '乐宝教育365', // 转发后 所显示的title
      path: '/pages/loading/loading'
    }
  }
})