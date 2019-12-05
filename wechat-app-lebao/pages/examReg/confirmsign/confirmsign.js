// pages/examReg/confirmsign/confirmsign.js
const app = getApp()
const util = require('../../../utils/util.js')
const applyUrl = '/biz/trade/exam/record/apply'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isIphone5: false,
    examinfo:'',
    examname:'',
    price:'',
    name:'',
    stuid:'',
    schid:'',
    schname: '',
    selectstu:'',
    applyinfo:'',
    addshow:true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let examinfo = JSON.parse(options.examinfoStr)
   
    this.setData({
      examname:examinfo.name,
      price:examinfo.price,
      examinfo:examinfo
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
  addstu:function(){
   wx.navigateTo({
      url: '/pages/examReg/examstu/examstu'
    })
  },
  submit: function () {
    if (this.data.name== '') {
      util.errorTip('请选择报名学员')
      return
    }
    let examinfo=this.data.examinfo,
        name=this.data.name,
        stuid=this.data.stuid,
        schid=this.data.schid,
        schname=this.data.schname
    app.wxRequest(applyUrl, {
      examId: examinfo.id,
      examName:examinfo.name,
      stuId: stuid,
      stuName: name,
      schId:schid,
      schName:schname
    }).then(res => {
      if (res.statusCode == 200) {
        console.log(res.data)
        if (res.data.errno == 0) {         
          let applyinfo=res.data.data
          let applyinfoStr=JSON.stringify(applyinfo)
          wx.navigateTo({
            url: '/pages/examReg/pay/pay?applyinfoStr='+applyinfoStr,
          })
        } else {
          util.errorTip('创建失败')
          console.log(res.data.errmsg)
        }
      } else {
        util.errorTip('请求失败')
        console.log(res.errmsg)
      }
    })
  },
studelete:function(){
this.setData({
  name:'',
  stuid: '',
  schid: '',
  schname: '',
  addshow:true,
})
}
 
})