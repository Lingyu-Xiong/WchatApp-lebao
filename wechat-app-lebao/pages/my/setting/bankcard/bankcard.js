// pages/my/setting/bankcard/bankcard.js
const app = getApp()
const util = require('../../../../utils/util.js')
const deleteUrl = '/base/user/bank/delete'
const setDefaultUrl = '/base/user/bank/reset'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isIphone5: false,
    contentHeight: '',
    cardList: [],
    visible: false,
    actions: [{
      name: '设为默认银行卡',
      color: '#466466'
    }, {
      name: '删除银行卡',
      color: '#ed3f14'
    }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const that = this
    app.wxRequest('/base/user/bank/userlist', {}, 'get').then(res => {
      console.log(res)
      if (res.statusCode === 200) {
        if (res.data.errno == 0) {
          let bankList = res.data.data.items
          console.log(bankList)
          let data = {}
          let list = []
          for (var i = 0; i < bankList.length; i++) {
            data = {}
            data.id = bankList[i].id
            data.name = bankList[i].bankName
            data.picUrl = bankList[i].pictrueUrl
            data.abbr = bankList[i].bankAbbr
            data.type = bankList[i].banktype
            if (bankList[i].isFirst == 1) {
              data.isDefault = true
            } else {
              data.isDefault = false
            }
            list.push(data)
            that.setData({
              cardList: list
            })
          }
          this.onShow()
        } else {
          util.errorTip('加载失败')
          console.log(res.errormsg)
        }
      } else {
        util.errorTip('请求失败')
        console.log(res.errormsg)
      }
    })
    that.setData({
      isIphone5: app.globalData.isIphone5,
      contentHeight: app.globalData.sysH
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
  onShow:function(){
    this.onLoad();
  },
  add: function() {
    wx.navigateTo({
      url: '/pages/my/withdrawal/add/add',
    })
  },
  open: function(e) {
    const index = e.currentTarget.dataset.index
    const id = e.currentTarget.dataset.id
    this.setData({
      bankIndex: index,
      bankId: id,
      visible: true
    })
  },

  handleCancel: function() {
    this.setData({
      visible: false
    })
  },

  handleClickItem(e) {
    const index = e.detail.index
    switch (index) {
      case 0:
        this.setDefault()
        break
      case 1:
        this.deleteBank()
        break
    }
  },

  setDefault: function(e) {
    const that = this
    let bankList = that.data.cardList
    app.wxRequest(setDefaultUrl, {
      id: that.data.bankId
    }, 'get').then(res => {
      console.log(res)
      if (res.statusCode === 200) {
        if (res.data == 1) {
          that.handleCancel()
          for (var i = 0; i < bankList.length; i++) {
            bankList[i].isDefault = false
          }
          bankList[that.data.bankIndex].isDefault = true
          that.setData({
            cardList: bankList,
            visible: false
          })
          wx.showToast({
            title: '设置成功！',
            icon: 'success'
          })
        } else {
          util.errorTip('设置失败')
          console.log(res.errormsg)
        }
      } else {
        util.errorTip('请求失败')
        console.log(res.errormsg)
      }
    })
  },
  deleteBank: function() {
    const that = this
    let bankList = that.data.cardList
    wx.showModal({
      title: '提示',
      content: '确认删除银行卡吗?',
      success: function(res) {
        if (res.confirm) {
          app.wxRequest(deleteUrl, {
            id: that.data.bankId
          }, 'get').then(res => {
            console.log(res)
            if (res.statusCode === 200) {
              if (res.data.errno == 0) {
                that.handleCancel()
                wx.showToast({
                  title: '删除成功！',
                  icon: 'success'
                })
                setTimeout(function() {
                  bankList.splice(that.data.bankIndex,1)
                  that.setData({
                    cardList: bankList
                  })
                }, 1500)
              } else {
                util.errorTip('删除失败')
                console.log(res.errormsg)
              }
            } else {
              util.errorTip('请求失败')
              console.log(res.errormsg)
            }
          })
        }
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