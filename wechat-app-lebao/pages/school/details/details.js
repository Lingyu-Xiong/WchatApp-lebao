// pages/school/details/details.js
const app = getApp()
const util = require('../../../utils/util.js')
const getUrl = '/mall/admin/school/read/'
let blockHeight = 90
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: true,
    isIphone5: false,
    currentTab: 0,
    title: '',
    openTime: '',
    telephone: '',
    address: '',
    tabbar: [{
        title: '开设课程',
      },
      {
        title: '师资团队',
      },
      {
        title: '学校信息',
      }
    ],
    swiperMinHeight: '',
    courseUrl: '/mall/admin/class/list',
    teacherUrl: '/mall/admin/teacher/list',
    goodsUrl: '/mall/admin/goods/list'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const that = this
    let swiperMinHeight = app.globalData.sysH - 200
    if(app.globalData.isIphone5){
      swiperMinHeight = app.globalData.sysH - 300
    }
    that.setData({
      id: options.id,
      isIphone5: app.globalData.isIphone5,
      swiperMinHeight: swiperMinHeight
    })
    app.wxRequest(getUrl + options.id, {}, 'get').then(res => {
      if (res.statusCode == 200) {
        if (res.data.errno == 0) {
          console.log(res.data.data)
          let school = res.data.data
          let item
          let coverImgPath=''
          let pictures=[]
          if (school.pictures != null && school.pictures.length > 0) {
            for(var i=0;i<school.pictures.length;i++){
              item={}
              item.picUrl = util.jointUrl(school.pictures[i].picUrl)
              item.video=school.pictures[i].video
              if (item.video && 'videoCoverUrl' in school){
                coverImgPath = util.jointUrl(school.videoCoverUrl)
              }
                pictures.push(item)
              
            }
            console.log(pictures)
            console.log(coverImgPath)
          }
          
          let title = school.name,        
            openTime = school.openTime,
            address = school.address,
            telephone = school.phoneNumPrimary,
            desc = school.desc,
            longitude = school.longitude,
            latitude = school.latitude,
            phone = school.phoneNumPrimary
          wx.setNavigationBarTitle({
            title: title
          })

          that.setData({
            coverImgPath: coverImgPath,
            title: title,
            pictures: pictures,
            openTime: openTime,
            address: address,
            telephone: telephone,
            desc: desc,
            longitude: longitude,
            latitude: latitude,
            phone: phone
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
  //打电话
  callPhone: function() {
    wx.makePhoneCall({
      phoneNumber: this.data.phone
    })
  },
  getCourseList: function() {
    const that = this
    app.wxRequest(that.data.courseUrl, {
      schoolId: that.data.id,limit:100
    }, 'get').then(res => {
      if (res.statusCode == 200) {
        if (res.data.errno == 0) {
          console.log('course',res.data)
          let list = res.data.data.items
          let data = {}
          let courseList = []
          for (var i = 0; i < list.length; i++) {
            data = {}
            data.id = list[i].id
            data.picUrl = util.jointUrl(list[i].pictureUrl)
            data.title = list[i].name
            data.grouponNum=list[i].grouponNum
            if (list[i].litemallTeacherList.length != 0) {
              data.desc = '老师：'
              let teacher = ''
              for (var j = 0; j < list[i].litemallTeacherList.length; j++) {
                teacher = ''
                teacher = list[i].litemallTeacherList[j].name
                data.desc += teacher + '、'
              }
              data.desc = data.desc.substring(0, data.desc.length - 1)
            } else {
              data.desc = ''
            }
            data.price = list[i].retailPrice
            data.counterPrice = list[i].counterPrice
            courseList.push(data)
          }
          that.setData({
            courseList: courseList,
            pageHeight: courseList.length * blockHeight
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
  getTeacherList: function() {
    const that = this
    app.wxRequest(that.data.teacherUrl, {
      schoolId: that.data.id,limit:100
    }, 'get').then(res => {
      if (res.statusCode == 200) {
        console.log(res.data)
        if (res.data.errno == 0) {
          let list = res.data.data.items
          let data = {}
          let teacherList = []
          for (var i = 0; i < list.length; i++) {
            data = {}
            data.id = list[i].id
            data.title = list[i].name
            data.picUrl = util.jointUrl(list[i].pictureUrl)
            data.desc = list[i].description
            teacherList.push(data)
          }
          that.setData({
            teacherList: teacherList,
            pageHeight: teacherList.length * blockHeight
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
        that.getCourseList()
        break
      case 1:
        that.getTeacherList()
        break
      case 2:
        this.setData({
          pageHeight: 120
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
  goToCourse: function(e) {
    const courseId = e.currentTarget.dataset.id
    wx.navigateTo({
      url: 'course/course?schoolId=' + this.data.id + '&courseId=' + courseId +
        '&lat=' + this.data.latitude + '&lng=' + this.data.longitude,
    })
  },
  goToTeacher: function(e) {
    const teacherId = e.currentTarget.dataset.id
    wx.navigateTo({
      url: 'teacher/teacher?schoolId=' + this.data.id + '&teacherId=' + teacherId,
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
  goToAddress: function() {
    wx.openLocation({
      latitude: parseFloat(this.data.latitude),
      longitude: parseFloat(this.data.longitude),
      name: this.data.title,
      address:this.data.address,
      success: function(res) {
        console.log('res', res)
      }
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
  /*
  *视频播放完毕重新上封面
  */
  endvedio: function () {
    let vediocon = wx.createVideoContext("myvedio", this)
    // vediocon.play()
    console.log(vediocon)
    this.setData({
      show: true
    })
  },
  /**
   * 当发生错误时触发error事件，event.detail = {errMsg: 'something wrong'}
   */
  videoErrorCallback: function (e) {
    console.log('视频错误信息:')
    console.log(e.detail.errMsg)
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