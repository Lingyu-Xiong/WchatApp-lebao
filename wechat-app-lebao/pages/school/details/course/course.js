// pages/school/details/course/course.js
const app = getApp()
const util = require('../../../../utils/util.js')
const getUrl = '/mall/admin/class/read/'
const getgroupUrl = '/biz/trade/groupon/found/list'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    coverImgPath:'',
    pictures:'',
    schoolName: '',
    courseName: '',
    courseId:'',
    picUrl: '',
    logoUrl:'',
    originalPrice: '',
    discountPrice: '',
    teachers: '',
    times: '', //课次,
    classTime: '',
    address: '金银路八一路交叉口北150米路西',
    description: '',
    maxStudent: '',
    lat: '',
    lng: '',
    show: true,
    isgroupbuy:'',
    groupList:[],
    timeList: [],
    countdownList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const that = this
    let courseId = options.courseId,
      schoolId = options.schoolId
    that.setData({
      courseId: courseId,
      schoolId: schoolId,
      isIphone5: app.globalData.isIphone5,
      lng: options.lng,
      lat: options.lat
    })
    app.wxRequest(getUrl + courseId, {}, 'get').then(res => {
      if (res.statusCode == 200) {
        if (res.data.errno == 0) {
          let course = res.data.data
          console.log(course)
          let item
          let coverImgPath = ''
          let pictures = []
          if (course.detailPictures != null && course.detailPictures.length > 0) {
            for (var i = 0; i < course.detailPictures.length; i++) {
              item = {}
              item.picUrl = util.jointUrl(course.detailPictures[i].picUrl)
              item.video = course.detailPictures[i].video
              if (item.video && 'videoCoverUrl' in course) {
                coverImgPath = util.jointUrl(course.videoCoverUrl)
              }
              pictures.push(item)
            }
            console.log('coursepictures',pictures)
          }
          let schoolName = course.schoolName,
            courseName = course.name,
            picUrl = util.jointUrl(course.pictureUrl),
            logoUrl =course.pictureUrl,
            teacherList = '',
            originalPrice = course.counterPrice,
            discountPrice = course.retailPrice,
            times = course.times,
            classTime=course.timeDescription,
            description = course.description,
            maxStudent = course.maxStudent,
            address = course.address,
            phone = course.phone,
            isgroupbuy=course.grouponNum
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
          that.setData({
            pictures:pictures,
            coverImgPath: coverImgPath,
            schoolName: schoolName,
            courseName: courseName,
            picUrl: picUrl,
            logoUrl:logoUrl,
            teacher: teacherList,
            originalPrice: originalPrice,
            discountPrice: discountPrice,
            times: times,
            classTime:classTime,
            description: description,
            maxStudent: maxStudent,
            address: address,
            phone: phone,
            isgroupbuy:isgroupbuy
          })
          wx.setNavigationBarTitle({
            title: schoolName
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
    this.getgroupList()
    
  },

  onShow: function () {
      this.countDown()
  },

//团购信息
  getgroupList:function(){
    app.wxRequest(getgroupUrl, {
      objId:this.data.courseId
    }, 'get').then(res => {
      console.log('group',res.data)
      if (res.data.errno === 0) {
        let data = res.data.data.items
        let item = {}, groupList = [], timeitem = {}, timeList = []
        for (var i = 0; i < data.length; i++) {
          item = {}
          timeitem = {}
          if (data[i].status == 1) {
          item.id=data[i].id
          item.actName=data[i].actName
          item.leftTime='12:00:00'
          item.neednum = data[i].requireNum-data[i].soldNum
          timeitem.addTime = data[i].addTime
          timeitem.expireMinute = data[i].expireMinute
          groupList.push(item)
          timeList.push(timeitem)
          }
        }
        this.setData({
          groupList: groupList,
          timeList: timeList
        })

      } else {
        util.errorTip('获取失败')
        console.log(res.data.errmsg)
      }
    })
  },


  //倒计时
  countDown() {
    let timeList = this.data.timeList
    let countdownList = []
    let time_now = new Date().getTime()//当前时间
    for (var i = 0; i < timeList.length; i++) {
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
      countdownList: countdownList
    })
    setTimeout(this.countDown, 1000)
  },

  timeFormat(param) {//小于10的格式化函数
    return param < 10 ? '0' + param : param;
  },

  //打电话
  goToAddress: function() {
    if (this.data.lat != '') {
      wx.openLocation({
        latitude: parseFloat(this.data.lat),
        longitude: parseFloat(this.data.lng),
        success: function(res) {
          console.log('res', res)
        }
      })
    }
  },
  signUp: function() {
    let courseinfo={
      orderType:1,
      schoolName: this.data.schoolName,
      courseName: this.data.courseName,
      brandId: this.data.schoolId,
      courseId:this.data.courseId,
      goodsPrice:this.data.discountPrice,
      classTime:this.data.classTime,
      address:this.data.address,
      courseCover: this.data.picUrl
    }
    let courseinfoStr = JSON.stringify(courseinfo)
    console.log(courseinfoStr)
    wx.navigateTo({
      // url: '/pages/confirmOrder/confirmOrder?orderType=1&brandId=' + this.data.schoolId + '&goodsPrice=' + this.data.discountPrice
      url: '/pages/confirmOrder/confirmOrder?courseinfoStr='+courseinfoStr
    })
  },
  // 选择该课程下的活动
  tochoosegb:function(){
    wx.navigateTo({
      url: '/pages/groupbuy/subgroupbuy/subgroupbuy?objId='+this.data.courseId,
    })
  },
  //参加别人的团
  tojoin:function(e){
    let groupid=e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/groupbuy/gbdetail/gbdetail?groupid='+groupid,
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