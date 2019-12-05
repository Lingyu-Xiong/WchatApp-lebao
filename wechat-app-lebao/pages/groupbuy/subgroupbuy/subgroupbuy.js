// pages/groupbuy/groupbuy.js
const app = getApp()
const util = require('../../../utils/util.js')
const getsubactUrl = '/biz/trade/groupon/act/list'
const getUrl = '/mall/admin/class/read/'
Page({

  /**
   * 页面的初始数据
   */
  data: {
   subactList:[],
   objId:'',
    schoolId: '',
    schoolName: '',
    courseName:'',
    logoUrl:'',
    classTime:'',
    address: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      objId:options.objId
    })
    this.getsubactList(options.objId)
    this.getcourse(options.objId)
  },

  //获取该课程下的活动list
  getsubactList: function (objId) {
    app.wxRequest(getsubactUrl, {
      objId:objId,
      limit: 50
    }, 'get').then(res => {
      console.log(res.data)
      if (res.data.errno === 0) {
        let data = res.data.data.items
        let item = {}, subactList = []
        for (var i = 0; i < data.length; i++) {
          item = {}
          item.id = data[i].id
          item.name = data[i].name
          item.discountPrice = data[i].discountPrice
          item.originalPrice = data[i].originalPrice
          subactList.push(item)
        }
        this.setData({
          subactList: subactList
        })

      } else {
        util.errorTip('获取失败')
        console.log(res.data.errmsg)
      }
    })
  },

  //获取课程信息
  getcourse:function(objId){
    app.wxRequest(getUrl + objId, {}, 'get').then(res => {
      if (res.data.errno == 0) {
        let course = res.data.data
        console.log(course)
        let schoolId = course.schoolId,
          schoolName = course.schoolName,
          courseName = course.name,
          logoUrl = course.pictureUrl,
          classTime = course.timeDescription,
          address= course.address
 
        this.setData({
          schoolId: schoolId,
          schoolName: schoolName,
          courseName: courseName,
          logoUrl: logoUrl,
          classTime: classTime,
          address: address
        })
      } else {
        util.errorTip('获取失败')
        console.log(res.data.errmsg)
      }
    })
  },

  //封装下单数据
  gbconfirmOrder: function (e) {
    let price=e.currentTarget.dataset.price
    let id=e.currentTarget.dataset.id
    let itemsinfo = {//待添加学员
      orgId: parseInt(this.data.schoolId),//学校id
      orgName: this.data.schoolName,//学校名称
      objId: parseInt(this.data.objId),//课程id
      objName: this.data.courseName,//课程名称            
      picUrl: this.data.logoUrl,
      price: parseFloat(price.toFixed(2)),
    }
    let showinfo = {
      classTime: this.data.classTime,
      address: this.data.address,
    }
    let orderinfo = {
      courseId: parseInt(this.data.objId),
      orderPrice: parseFloat(price.toFixed(2)),
      orderType: 0,  // 订单类型, 0-线下课程, 1-视频课程
      courseName: this.data.courseName,
      courseCover: this.data.logoUrl,
      orgId: parseInt(this.data.schoolId),//学校id
      orgName: this.data.schoolName,//学校名称
      groupStatus: 1, //是否拼单, 0-否, 1-是
      groupRole: 0, //0：团长；1：参团
      groupActivityId: parseInt(id), //团购活动id
      groupId: '', //团id----车牌号
      quantity: 1,
    }
    console.log(itemsinfo, showinfo, orderinfo)
    let itemsinfoStr = JSON.stringify(itemsinfo)
    let showinfoStr = JSON.stringify(showinfo)
    let orderinfoStr = JSON.stringify(orderinfo)
    wx.navigateTo({
      url: '/pages/groupbuy/gbconfirmOrder/gbconfirmOrder?itemsinfoStr=' + itemsinfoStr + '&showinfoStr=' + showinfoStr + '&orderinfoStr=' + orderinfoStr
    })
  },

})