// pages/confirmOrder/confirmOrder.js
const app = getApp()
const util = require('../../utils/util.js')
const createUrl = '/biz/trade/order/course/create'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    courseinfo:'',
    isIphone5: false,
    totalPrice:'',
    time:'',
    selectstu:'',
    name: '',
    stuid: '',
    schid: '',
    schname: '',
    addshow: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this
    let courseinfo=JSON.parse(options.courseinfoStr)
    console.log(courseinfo)   
    that.setData({
      courseinfo:courseinfo,
      isIphone5: app.globalData.isIphone5
    })
    // if (options.chooseStudentListstr){
    //   let chooseStudentList = JSON.parse(options.chooseStudentListstr)
    //   console.log(chooseStudentList)
    //   that.setData({
    //     addstudentList: chooseStudentList,
    //   })
    //   setTimeout(function () {
    //     let num = that.data.addstudentList.length
    //     let totalPrice = that.data.courseinfo.goodsPrice * num
    //     that.setData({
    //       totalPrice: totalPrice,
    //     })
    //   }, 1000)
    // }
    
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
addstudent:function(){
  let courseinfoStr = JSON.stringify(this.data.courseinfo)
  // wx.navigateTo({
  //   url: '/pages/confirmOrder/addstudent/addstudent?courseinfoStr='+courseinfoStr
  // })
  wx.navigateTo({
    url: '/pages/examReg/examstu/examstu'
  })
},
  getTime: function (e) {
    this.setData({
      time: e.detail.value
    })
  },
  signUp: function () {
    if (this.data.selectstu==='') {
      util.errorTip('请选择学员')
      return
    }
    let selectstu = this.data.selectstu

    /*if (!this.data.time) {
      util.errorTip('请输入预约上课时间')
      return
    }*/
    // let totalPrice = parseFloat(this.data.totalPrice.toFixed(2))
    let items=[]
      let item={}
      item.orgId=parseInt(this.data.courseinfo.brandId)
      item.orgName=this.data.courseinfo.schoolName
      item.objId=parseInt(this.data.courseinfo.courseId)
      item.objName=this.data.courseinfo.courseName
      item.picUrl=this.data.courseinfo.logoUrl
      item.stuId=selectstu.id
      item.stuName=selectstu.name
      item.stuGender=selectstu.gender
      item.mobile=selectstu.mobile
      //item.remark=this.data.time
      item.price = this.data.courseinfo.goodsPrice
      items.push(item)
    
    let createinfo = {
      orgId: this.data.courseinfo.brandId,
      orgName: this.data.courseinfo.schoolName,
      address: this.data.courseinfo.address,
      orderPrice: parseFloat(this.data.courseinfo.goodsPrice.toFixed(2)),
      orderType: 0,  // 订单类型, 0-线下课程, 1-视频课程
      courseId: parseInt(this.data.courseinfo.courseId),
      courseName: this.data.courseinfo.courseName,
      courseCover: this.data.courseinfo.courseCover,
      groupStatus: 0, //是否拼单, 0-否, 1-是
      groupRole: '', //0：团长；1：参团
      groupActivityId: '', //团购活动id
      groupId: '', //团id----车牌号
      quantity:1,
      items:items
    }
    //let createinfoStr = JSON.stringify(createinfo)
    app.wxRequest(createUrl, createinfo).then(res => {
      if (res.statusCode == 200) {
        console.log(res.data)
        if (res.data.errno == 0) {
          let data = res.data.data
          let orderinfo = {
            orderSn: data.sn,
            id: data.id,
            name: data.orgName,
            addTime: data.addTime,
            orderPrice: data.orderPrice
          }
          let orderinfoStr = JSON.stringify(orderinfo)
          wx.navigateTo({
            url: '../videoCourse/pay/pay?orderinfoStr=' + orderinfoStr
          })
        } else {
          wx.showToast({
            title: '该课程已购买！',
            icon: 'none',
            duration: 2000
          })
          setTimeout(function () {
            wx.navigateBack({
              delta: 1,
            })
          }, 2000)

          console.log(res.data.errmsg)
        }
      } else {
        util.errorTip(res.errmsg)

        console.log(res.errmsg)
      }
    })
    /*
    wx.navigateTo({
      url: '/pages/createOrder/create?createinfoStr=' + createinfoStr
    })
*/
  },
  studelete: function () {
    this.setData({
      selectstu:'',
      name: '',
      stuid: '',
      schid: '',
      schname: '',
      addshow: true,
    })
  }
})