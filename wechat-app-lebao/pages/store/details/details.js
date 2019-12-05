// pages/store/details/details.js
const app = getApp()
const util = require('../../../utils/util.js')
const getUrl = '/mall/admin/brand/list'
const goodsUrl = '/mall/admin/goods/list'
let blockHeight = 90
let animation
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab: 0,
    showBuyBtn: false, //显示买单按钮
    title: '',
    openTime: '',
    telephone: '',
    address: '',
    tabbar: [{
        title: '商品菜单',
      },
      {
        title: '店铺信息',
      }
    ],
    showModal: false,
    animationData: '', //动画效果
    keyboard: [{
        key: 1,
        value: 1
      },
      {
        key: 2,
        value: 2
      },
      {
        key: 3,
        value: 3
      },
      {
        key: 4,
        value: 4
      },
      {
        key: 5,
        value: 5
      },
      {
        key: 6,
        value: 6
      },
      {
        key: 7,
        value: 7
      },
      {
        key: 8,
        value: 8
      },
      {
        key: 9,
        value: 9
      },
      {
        key: '确定',
        value: -1
      },
      {
        key: 0,
        value: 0
      }
    ],
    time: '',
    money: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const that = this
    var time = util.formatTime(new Date(), 2)
    let swiperMinHeight = app.globalData.sysH - 315
    if (app.globalData.isIphone5) {
      swiperMinHeight = app.globalData.sysH - 295
    }
    that.setData({
      id: options.id,
      time: time,
      isIphone5:app.globalData.isIphone5,
      swiperMinHeight: swiperMinHeight
    })
    app.wxRequest(getUrl, { id:  options.id}, 'get').then(res => {
      if (res.statusCode == 200) {
        if (res.data.errno == 0) {
          let brand = res.data.data.items[0]
          let item
          let pictures = []
          if (brand.pictures != null && brand.pictures.length > 0) {
            for (var i = 0; i < brand.pictures.length; i++) {
              item = {}
              item.picUrl = util.jointUrl(brand.pictures[i].picUrl)
              item.video = brand.pictures[i].video
              pictures.push(item)
            }
            console.log(pictures)
          }
          let title = brand.name,      
            openTime = brand.openTime,
            address = brand.address,
            longitude = brand.longitude,
            latitude = brand.latitude,
            telephone = brand.phoneNumPrimary,
            desc = brand.desc
          wx.setNavigationBarTitle({
            title: title
          })
          that.setData({
            title: title,
            pictures:pictures,
            openTime: openTime,
            address: address,
            telephone: telephone,
            longitude:longitude,
            latitude:latitude,
            desc: desc
          })
          wx.setNavigationBarTitle({
            title: title
          })
        } else {
          util.errorTip('获取失败')
          console.log(res.data.errmsg)
        }
      } else {
        util.errorTip('请求失败')
        console.log(res.errmsg)
      }
    })
    that._sliderChange()
  },
  callPhone: function () {
    wx.makePhoneCall({
      phoneNumber: this.data.telephone
    })
  },
  getGoodsList: function() {
    const that = this
    app.wxRequest(goodsUrl, {
      brandId: that.data.id
    }, 'get').then(res => {
      if (res.statusCode == 200) {
        if (res.data.errno == 0) {
          let list = res.data.data.items
          let data = {}
          let goodsList = []
          for (var i = 0; i < list.length; i++) {
            data = {}
            data.id = list[i].id
            data.picUrl = util.jointUrl(list[i].picUrl)
            data.title = list[i].name
            data.desc = list[i].brief
            data.price = list[i].counterPrice
            goodsList.push(data)
          }
          let show = false
          if (goodsList.length > 0) {
            show = true
          }
          that.setData({
            showBuyBtn: show,
            goodsList: goodsList,
            pageHeight: goodsList.length * blockHeight + 60
          })
        } else {
          util.errorTip('获取失败')
          console.log(res.data.errmsg)
        }
      } else {
        util.errorTip('请求失败')
        console.log(res.errmsg)
      }
    })
  },

  //更新tab页高度
  _sliderChange: function() {
    const that = this
    switch (this.data.currentTab) {
      case 0:
        that.getGoodsList()
        break
      case 1:
        this.setData({
          pageHeight: 200
        })
        break
    }
  },
  //点击切换teb页
  switchNav: function(e) {
    if (this.data.currentTab !== e.currentTarget.dataset.current) {
      this.setData({
        currentTab: parseInt(e.currentTarget.dataset.current),
      })
      this._sliderChange()
    }
  },
  //滑动切换tab页
  bindChange: function(e) {
    this.setData({
      currentTab: e.detail.current
    })
    this._sliderChange()
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

  showModal: function(e) {
    const that = this;
    that.setData({
      showModal: true
    })
    animation = wx.createAnimation({
      duration: 600, //动画的持续时间 默认400ms 数值越大，动画越慢 数值越小，动画越快
      timingFunction: 'ease', //动画的效果 默认值是linear
    })
    setTimeout(function() {
      that._fadeIn(); //调用显示动画
    }, 200)
  },
  getMoney: function(e) {
    const that = this
    const value = e.currentTarget.dataset.value
    if (value == -1) {
      if (that.data.money * 1 <= 0) {
        util.errorTip('输入金额要>0')
        return false
      }
      that.hideModal()
      wx.navigateTo({
        url: '/pages/createShopOrder/create?orderType=0&brandId=' + that.data.id + '&goodsPrice=' + that.data.money
      })
    } else {
      let password = that.data.money + value
      that.setData({
        money: password
      })
    }
  },
  init: function() {
    this.setData({
      money: ''
    })
  },
  deletePassword: function() {
    const that = this
    let money = that.data.money
    that.setData({
      money: money.substring(0, money.length - 1)
    })
  },
  //动画函数
  _fadeIn: function() {
    animation.translateY(0).step()
    this.setData({
      animationData: animation.export()
    })
  },
  _fadeDown: function() {
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
    })
  },

  // 隐藏遮罩层
  hideModal: function() {
    var that = this
    animation = wx.createAnimation({
      duration: 800, //动画的持续时间 默认400ms 数值越大，动画越慢 数值越小，动画越快
      timingFunction: 'ease', //动画的效果 默认值是linear
    })
    that._fadeDown(); //调用隐藏动画
    setTimeout(function() {
      that.setData({
        showModal: false
      })
    }, 720) //先执行下滑动画，再隐藏模块
  },
  goToAddress: function() {
    wx.openLocation({
      latitude: parseFloat(this.data.latitude),
      longitude: parseFloat(this.data.longitude),
      name: this.data.title,
      address: this.data.address,
      success: function(res) {
        console.log('res', res)
      }
    })
  },
  back: util.back,
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