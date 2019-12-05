// pages/news/newsdetail/newsdetail.js
const app = getApp()
const util = require('../../../utils/util.js')
const imgurl = app.globalData.imageURL
const avatarurl ='../../../images/blank.png'
const getdetail = '/biz/trade/groupon/found/read/'
const getUrl = '/mall/admin/class/read/'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    itemlist: [{ param: '', name: '全部' }, { param: 1, name: '拼团中' }, { param: 3, name: '拼团成功' }, { param: 4, name: '拼团失败' }],
    groupid: '',
    groupinfo: '',
    follows: [],
    blankavatarUrl:imgurl+'/user.png',
    logoUrl: '',
    classTime: '',
    address: '',
    countDown:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      groupid: options.groupid
    })
    
    
  },
  onShow:function(){
    this.getgroupdetail(this.data.groupid)
  },

//获取团购信息
  getgroupdetail: function(groupid) {
    app.wxRequest(getdetail + groupid, {}, 'get').then(res => {
      console.log(res.data)
      if (res.data.errno === 0) {
        let data = res.data.data,
          teamcurUser='',
          groupinfo = {},
          follows = []
        //学校课程信息
        groupinfo.orgId=data.objId
        groupinfo.orgName=data.orgName
        groupinfo.objId=data.objId
        groupinfo.objName=data.objName
        //团购信息
        groupinfo.id = data.id
        groupinfo.actId=data.actId
        groupinfo.actName = data.actName
        groupinfo.originalPrice = data.originalPrice
        groupinfo.discountPrice = data.discountPrice
        groupinfo.status=data.status
        groupinfo.neednum = data.requireNum - data.soldNum
        groupinfo.addTime=data.addTime
        groupinfo.expireMinute = data.expireMinute
        groupinfo.actLogoUrl=data.actLogoUrl
        groupinfo.leaderavatar = util.jointAvatar(data.avatar)
        groupinfo.curUser = data.curUser
        //队员头像
        for (var i = 0; i < data.requireNum - 1; i++) {
          let item = {}
          if (i < data.follows.length) {
            item.avatar = util.jointAvatar(data.follows[i].avatar)
          } else {
            item.avatar = avatarurl
          }
          follows.push(item)
          if (data.follows[i]&&data.follows[i].curUser){
            groupinfo.curUser=true
          }
        }
        console.log(follows)

        this.setData({
          groupinfo: groupinfo,
          follows: follows
        })
        setTimeout(() => {
          this.getcourse()
          this.countDown()
        }, 100)
      } else {
        util.errorTip('获取失败')
        console.log(res.data.errmsg)
      }
    })
  },

  //获取课程信息
  getcourse: function () {
    console.log(this.data.groupinfo)
    app.wxRequest(getUrl + this.data.groupinfo.objId, {}, 'get').then(res => {
      if (res.data.errno == 0) {
        let course = res.data.data
        console.log(course)
        let logoUrl = course.pictureUrl,
          classTime = course.timeDescription,
          address = course.address
        this.setData({
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
  gbconfirmOrder: function () {
    let itemsinfo = {//待添加学员
      orgId: parseInt(this.data.groupinfo.orgId),//学校id
      orgName: this.data.groupinfo.orgName,//学校名称
      objId: parseInt(this.data.groupinfo.objId),//课程id
      objName: this.data.groupinfo.objName,//课程名称         
      picUrl: this.data.logoUrl,
      price: parseFloat(this.data.groupinfo.discountPrice.toFixed(2)),
    }
    let showinfo = {
      classTime: this.data.classTime,
      address: this.data.address,
    }
    let orderinfo = {
      courseId: parseInt(this.data.groupinfo.objId),
      orderPrice: parseFloat(this.data.groupinfo.discountPrice.toFixed(2)),
      orderType: 0,  // 订单类型, 0-线下课程, 1-视频课程
      courseName: this.data.groupinfo.objName,
      courseCover: this.data.logoUrl,
      orgId: parseInt(this.data.groupinfo.orgId),
      orgName: this.data.groupinfo.orgName,//学校名称
      groupStatus: 1, //是否拼单, 0-否, 1-是
      groupRole: 1, //0：团长；1：参团
      groupActivityId: parseInt(this.data.groupinfo.actId), //团购活动id
      groupId: parseInt(this.data.groupinfo.id), //团id----车牌号
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

//倒计时
  countDown(){
    let addTime=this.data.groupinfo.addTime,
    expireMinute=this.data.groupinfo.expireMinute
    let time_now = new Date().getTime()//当前时间
    let now = new Date(this.data.groupinfo.addTime.replace(/-/g, '/'))//开始时间
    let minutes = Number(expireMinute);  //处理输入的过期时间
    let end = now.setMinutes(now.getMinutes() + minutes)//过期时间
    var msec = (end - time_now) / 1000;   //最后时间-当前时间
    if (msec > 0) {
      let day = parseInt(msec / (60 * 60 * 24));
      let hou = parseInt(msec % (60 * 60 * 24) / 3600);
      let min = parseInt(msec % (60 * 60 * 24) % 3600 / 60);
      let sec = parseInt(msec % (60 * 60 * 24) % 3600 % 60);
      var obj = {
        day: this.timeFormat(day),
        hou: this.timeFormat(hou),
        min: this.timeFormat(min),
        sec: this.timeFormat(sec)
      }
    } else {//活动已结束，全部设置为'00'
      var obj = {
        day: '00',
        hou: '00',
        min: '00',
        sec: '00'
      }
    }
    this.setData({
      countDown:obj
    })
    setTimeout(this.countDown, 1000)
  },
 
  timeFormat(param) {//小于10的格式化函数
    return param < 10 ? '0' + param : param;
  },
  tohome:function(){
    wx.switchTab({
      url: '/pages/homepage/homepage',
    })
  },

  onShareAppMessage: function() {
    let that = this;
    return {
      title: '您收到一个拼单邀请', // 转发后 所显示的title
      path: '/pages/loading/loading?groupid='+that.data.groupid
    }
  }
})