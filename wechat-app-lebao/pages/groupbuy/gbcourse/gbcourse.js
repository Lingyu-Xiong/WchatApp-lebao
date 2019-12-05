// pages/school/details/course/course.js
const app = getApp()
const util = require('../../../utils/util.js')
const getUrl = '/mall/admin/class/read/'
const getactUrl = '/biz/trade/groupon/act/read/'
const getgroupUrl = '/biz/trade/groupon/found/list'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    objId:'',
    actid:'',
    groupList: [],
    timeList:[],
    countdownList:[],
    //课程信息
    pictures: '',
    coverImgPath: '',
    schoolId:'',
    schoolName: '',
    courseName: '',
    picUrl: '',
    logoUrl: '',
    teacher: '',
    originalPrice: '',
    discountPrice: '',
    times: '',
    classTime: '',
    description: '',
    maxStudent: '',
    address: '',
    phone: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.actid, options.objId)
    this.setData({
      objId:options.objId,
      actid:options.actid
    })
    this.getgbcourse()
    this.getact()
    this.getgroupList()
  },

onShow:function(){
    this.countDown()
  
},

  //课程信息
  getgbcourse:function(){
    app.wxRequest(getUrl + this.data.objId, {}, 'get').then(res => {
      if (res.data.errno == 0) {
        let course = res.data.data
        console.log(course)
        let item
        let coverImgPath = ''
        let pictures = []
        if (course.detailPictures != null && course.detailPictures.length > 0) {
          for (var i=0;i<course.detailPictures.length;i++){
            item = {}
            item.picUrl = util.jointUrl(course.detailPictures[i].picUrl)
            item.video = course.detailPictures[i].video
            if (item.video && 'videoCoverUrl' in course) {
              coverImgPath = util.jointUrl(course.videoCoverUrl)
            }
            pictures.push(item)
          }
          console.log('coursepictures', pictures)
        }
        let schoolId=course.schoolId,
          schoolName = course.schoolName,
          courseName = course.name,
          picUrl = util.jointUrl(course.pictureUrl),
          logoUrl = course.pictureUrl,
          teacherList = '',
          times = course.times,
          classTime = course.timeDescription,
          description = course.description,
          maxStudent = course.maxStudent,
          address = course.address,
          phone = course.phone,
          isgroupbuy = course.grouponNum
        wx.setNavigationBarTitle({
          title: schoolName
        })
        if (course.litemallTeacherList.length == 0) {
          teacherList = '待定'
        } else {
          let teacher = ''
          for (var j = 0; j < course.litemallTeacherList.length; j++) {
            teacher = ''
            teacher = course.litemallTeacherList[j].name
            teacherList += teacher + '、'
          }
          teacherList = teacherList.substring(0, teacherList.length - 1)
        }
        this.setData({
          pictures: pictures,
          coverImgPath: coverImgPath,
          schoolId:schoolId,
          schoolName: schoolName,
          courseName: courseName,
          picUrl: picUrl,
          logoUrl: logoUrl,
          teacher: teacherList,
          times: times,
          classTime: classTime,
          description: description,
          maxStudent: maxStudent,
          address: address,
          phone: phone,
        })
        wx.setNavigationBarTitle({
          title: schoolName
        })
      } else {
        util.errorTip('获取失败')
        console.log(res.data.errmsg)
      }
    })
  },

  //价格信息
  getact: function () {
    app.wxRequest(getactUrl + this.data.actid, {}, 'get').then(res => {
      console.log('act', res.data)
      if (res.data.errno === 0) {
        let data = res.data.data
        let discountPrice=data.discountPrice,
          originalPrice=data.originalPrice
        this.setData({
          originalPrice: originalPrice,  // 原价
          discountPrice: discountPrice,
        })

      } else {
        util.errorTip('获取失败')
        console.log(res.data.errmsg)
      }
    })
  },

  //团购信息
  getgroupList: function () {
    app.wxRequest(getgroupUrl, {
      objId: this.data.objId,
      actId:this.data.actid
    }, 'get').then(res => {
      console.log('group', res.data)
      if (res.data.errno === 0) {
        let data = res.data.data.items
        let item = {},groupList = [],timeitem={},timeList=[]
        for (var i = 0; i < data.length; i++) {
          item={}
          timeitem={}
          if (data[i].status==1){
          item.id = data[i].id
          item.avatar = util.jointAvatar(data[i].avatar)
          item.nickname = util.jointName(data[i].nickname,data[i].mobile)        
          item.neednum = data[i].requireNum - data[i].soldNum 
          timeitem.addTime = data[i].addTime
          timeitem.expireMinute = data[i].expireMinute
          groupList.push(item)
          timeList.push(timeitem)
          }
        }
        console.log('groupList',groupList)
        console.log('timeList', timeList)
        this.setData({
          groupList: groupList,
          timeList:timeList
        })

      } else {
        util.errorTip('获取失败')
        console.log(res.data.errmsg)
      }
    })
  },

  //倒计时
  countDown() {
    let timeList=this.data.timeList
    let countdownList=[]
    let time_now = new Date().getTime()//当前时间
  for(var i=0;i<timeList.length;i++){
    let now = new Date(timeList[i].addTime.replace(/-/g, '/'))//开始时间
    let minutes = Number(timeList[i].expireMinute);  //处理输入的过期时间
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
    countdownList.push(obj)
    }
    this.setData({
      countdownList:countdownList
    })
    setTimeout(this.countDown, 1000)
  },

  timeFormat(param) {//小于10的格式化函数
    return param < 10 ? '0' + param : param;
  },

  goToAddress: function () {
    if (this.data.lat != '') {
      wx.openLocation({
        latitude: parseFloat(this.data.lat),
        longitude: parseFloat(this.data.lng),
        success: function (res) {
          console.log('res', res)
        }
      })
    }
  },

  //封装下单数据
  gbconfirmOrder: function () {
    let itemsinfo = {//待添加学员
      orgId:parseInt(this.data.schoolId),//学校id
      orgName: this.data.schoolName,//学校名称
      objId: parseInt(this.data.objId),//课程id
      objName: this.data.courseName,//课程名称            
      picUrl: this.data.logoUrl,
      price: parseFloat(this.data.discountPrice.toFixed(2)), 
    }
    let showinfo={
      classTime: this.data.classTime,
      address: this.data.address,
    }
    let orderinfo={
      courseId: parseInt(this.data.objId),
      orderPrice: parseFloat(this.data.discountPrice.toFixed(2)),
      orderType: 0,  // 订单类型, 0-线下课程, 1-视频课程
      courseName: this.data.courseName,
      courseCover: this.data.logoUrl,
      orgId: parseInt(this.data.schoolId),//学校id
      orgName: this.data.schoolName,//学校名称
      groupStatus: 1, //是否拼单, 0-否, 1-是
      groupRole: 0, //0：团长；1：参团
      groupActivityId: parseInt(this.data.actid), //团购活动id
      groupId: '', //团id----车牌号
      quantity: 1,
    }
    console.log(itemsinfo, showinfo, orderinfo)
    let itemsinfoStr = JSON.stringify(itemsinfo)
    let showinfoStr = JSON.stringify(showinfo)
    let orderinfoStr = JSON.stringify(orderinfo)
    wx.navigateTo({
      url: '/pages/groupbuy/gbconfirmOrder/gbconfirmOrder?itemsinfoStr=' + itemsinfoStr+'&showinfoStr='+showinfoStr+'&orderinfoStr='+orderinfoStr
    })
  },
  
  //参加别人的团
  tojoin: function (e) {
    let groupid = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/groupbuy/gbdetail/gbdetail?groupid=' + groupid,
    })
  },

  /*
     *点击自定义视频封面开始播放
     */
  playvideo: function (e) {
    let videocon = wx.createVideoContext("myVideo", this)
    videocon.play()
    console.log(videocon)
    this.setData({
      show: false
    })
  },

  back: util.back,
  onShareAppMessage: function () {
    let that = this;
    return {
      title: '乐宝教育365', // 转发后 所显示的title
      path: '/pages/loading/loading'
    }
  }
})