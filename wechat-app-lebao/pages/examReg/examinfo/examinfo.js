// pages/examReg/examinfo/examinfo.js
const app = getApp()
const util = require('../../../utils/util.js')
const getexaminfoUrl = '/biz/trade/exam/reg/read/'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isIphone5: false,
    examinfo: '',
    price: '',
    detailInfo:'',
    name: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let id = options.id
    app.wxRequest(getexaminfoUrl+id, {}, 'get').then(res => {
      console.log(res.data)
      if (res.data.errno === 0) {
        let examinfo = res.data.data
         let price=examinfo.price,
         detailInfo=examinfo.detailInfo,
         name=examinfo.name
        this.setData({
          examinfo: examinfo,
          price:price,
          detailInfo:detailInfo,
          name:name
        })

      } else {
        util.errorTip('获取失败')
        console.log(res.data.errmsg)
      }
    })

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },
examsign:function(){
  let einfo=this.data.examinfo,examinfo={}
  examinfo.id=einfo.id
  examinfo.name=einfo.name
  examinfo.price=einfo.price
  let examinfoStr = JSON.stringify(examinfo)
  wx: wx.navigateTo({
    url: '/pages/examReg/confirmsign/confirmsign?examinfoStr=' + examinfoStr
  })
},

})