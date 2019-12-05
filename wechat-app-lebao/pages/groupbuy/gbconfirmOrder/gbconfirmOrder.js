const app = getApp()
const util = require('../../../utils/util.js')
Page({
  data:{
    itemsinfo:'',
    showinfo:'',
    orderinfo:'',
    selectstu: '',
    addshow: true,
  },
  onLoad: function (options) {
    let itemsinfo = JSON.parse(options.itemsinfoStr)
    let showinfo = JSON.parse(options.showinfoStr)
    let orderinfo = JSON.parse(options.orderinfoStr)
    this.setData({
      itemsinfo: itemsinfo,
      showinfo:showinfo,
      orderinfo:orderinfo 
    })
  },

  addstudent:function(){
    wx.navigateTo({
      url: '/pages/examReg/examstu/examstu'
    })
  },
  studelete: function () {
    this.setData({
      selectstu: '',
      addshow: true,
    })
  },

//封装参数，去下单
  signUp: function () {
    if (this.data.selectstu === '') {
      util.errorTip('请选择学员')
      return
    }
    let selectstu = this.data.selectstu
    let items = []
    let item = this.data.itemsinfo
    item.stuId = selectstu.id
    item.stuName = selectstu.name
    item.stuGender = selectstu.gender
    item.mobile = selectstu.mobile
    items.push(item)

    let createinfo = this.data.orderinfo
    createinfo.items=items
    let createinfoStr = JSON.stringify(createinfo)

    wx.redirectTo({
      url: '/pages/groupbuy/gbcreateOrder/gbcreateOrder?createinfoStr=' + createinfoStr
    })
  },

})