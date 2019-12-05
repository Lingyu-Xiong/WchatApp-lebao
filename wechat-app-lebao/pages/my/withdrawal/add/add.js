  // pages/my/withdrawal/add/add.js
const app = getApp()
const util = require('../../../../utils/util.js')
const bankData = require('../../../../utils/data/bank.js')
const getUrl = '/base/user/bank/list'
const addUrl = '/base/user/bank/add'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    selectArray: [],
    isIphone5: false,
    bankId: -1,
    cardId: '',
    cardValue: '',
    name: '',
    phone: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const that = this
    that.setData({
      isIphone5: app.globalData.isIphone5,
      selectArray: bankData.bankList
    })

    // app.wxRequest(getUrl, {
    //   limit: 100
    // }, 'get').then(res => {
    //   console.log(res.data)
    //   if (res.statusCode == 200) {
    //     if (res.data.errno === 0) {
    //       let data = {}
    //       let list = []
    //       let dataList = res.data.data.items
    //       for (var i = 0; i < dataList.length; i++) {
    //         data = {}
    //         data.id = dataList[i].id
    //         data.text = dataList[i].name
    //         data.picUrl = dataList[i].picUrl
    //         data.abbr = dataList[i].abbr
    //         list.push(data)
    //       }
    //       that.setData({
    //         selectArray: list
    //       })
    //     } else {
    //       util.errorTip('获取失败')
    //       console.log(res.data.errmsg)
    //     }
    //   } else {
    //     util.errorTip('请求失败')
    //   }
    // })
  },
  clearCard: function() {
    this.setData({
      cardId: ''
    })
  },
  clearName: function() {
    this.setData({
      name: ''
    })
  },
  clearPhone: function() {
    this.setData({
      phone: ''
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
  inputCardId: function(e) {
    let value = e.detail.value
    let cardId = value.replace(/\s/g, '').replace(/[^\d]/g, '').replace(/(\d{4})(?=\d)/g, '$1 ')
    this.setData({
      cardId: cardId
    })
  },
  inputName: function(e) {
    let value = e.detail.value
    this.setData({
      name: value
    })
  },
  //输入手机号码
  inputPhone: function(e) {
    if (!/^((13[0-9])|(14[5,7,9])|(15[^4])|(16[6])|(17[0,1,2,3,5,6,7,8])|(18[0-9])|(19[8,9]))\d{8}$/.test(e.detail.value)) {
      this.setData({
        phone_valid: 'invalid',
        phone: e.detail.value
      })
    } else {
      this.setData({
        phone_valid: '',
        phone: e.detail.value
      })
    }
    let phone = {}
    if (e.detail.value == null) {
      phone.number = ''
    } else {
      phone.number = e.detail.value
    }
    phone.isValid = this.data.phone_valid
    this.setData({
      modifyPhone: phone
    })
  },
  getBank: function(e) {
    const that = this
    let bankId = e.detail.id,
      index = e.detail.index
    that.setData({
      bankId: bankId,
      index: index
    })
    console.log('bankId', bankId)
  },

  ensureAdd: function() {
    const that = this,
      bank = that.data.selectArray[that.data.index],
      cardId = that.data.cardId.replace(/\s*/g, ""),
      name = that.data.name,
      phone = that.data.phone,
      bankId = that.data.bankId
    if (bankId == -1) {
      util.errorTip('请选择银行名称')
      return false
    }
    if (cardId == '') {
      wx.showToast({
        title: '银行卡号不能为空',
        icon: 'none',
        duration: 5000
      })

      //util.errorTip('银行卡号不能为空')
      return false
    }
    if (cardId.length>19||cardId.length<16) {
      wx.showToast({
        title: '银行卡号格式错误',
        icon: 'none',
        duration: 5000
      })
     // util.errorTip('银行卡号格式错误')
      return false
    }
    if (name == '') {
      wx.showToast({
        title: '请完整填写银行卡信息',
        icon: 'none',
        duration: 5000
      })
      //util.errorTip('请完整填写银行卡信息')
      return false
    }
    if (util.verifyLegal(phone, that.data.phone_valid, '请完整填写银行卡信息', '请输入正确的手机号')) {
      wx.showLoading({
        title: '添加中...',
      })
      app.wxRequest(addUrl, {
        bankAbbr: bank.abbr,
        bankCardId: cardId,
        userName: name,
        userPhone: phone,
        isFirst: 0,
        bankType: bank.id
      }).then(res => {
        if (res.statusCode == 200) {
          if (res.data.errno === 0) {
            wx.hideLoading()
            wx.showToast({
              title: '添加成功!',
              icon: 'success'
            })
            setTimeout(function() {
              that.back()
            }, 1500)
          } else {
            util.errorTip('获取失败')
            console.log(res.data.errmsg)
          }
        } else {
          util.errorTip('请求失败')
        }
      })
    }
  },
  back: function() {
    wx.navigateBack({
      delta: 1,
      success: function(e) {
        var page = getCurrentPages().pop();
        if (page == undefined || page == null) return;
        page.onLoad();
        page.onShow();
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