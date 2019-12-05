// pages/school/details/teacher/teacher.js
const app = getApp()
const util = require('../../../../utils/util.js')
const getUrl = '/mall/admin/teacher/read/'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    schoolName: '',
    picUrl: '',
    teacherName: '',
    desc: '',
    course: [],
    phone: '',
    isIphone5: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const that = this
    let teacherId = options.teacherId,
      schoolId = options.schoolId
    that.setData({
      teacherId: teacherId,
      schoolId: schoolId,
      isIphone5: app.globalData.isIphone5
    })
    app.wxRequest(getUrl+teacherId, {}, 'get').then(res => {
      if (res.statusCode == 200) {
        if (res.data.errno == 0) {
          let teacher = res.data.data
          let schoolName = teacher.schoolName,
            teacherName = teacher.name,
            gender = teacher.gender,
            star=teacher.star,
            hasPic = false,
            desc = teacher.description,
            phone = teacher.phone,
            courseList = []
          for (var j = 0; j < teacher.litemallClassList.length - 1; j++) {
            courseList.push(teacher.litemallClassList[j].className)
          }
          if (typeof(teacher.pictureUrl) !== 'undefined') {
            hasPic = true
            let picUrl = util.jointUrl(teacher.pictureUrl)
            that.setData({
              picUrl:picUrl
            })
          }
          that.setData({
            schoolName: schoolName,
            teacherName: teacherName,
            gender:gender,
            star: star,
            hasPic: hasPic,
            course: courseList,
            desc: desc,
            phone: phone
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
  },
  callPhone: function () {
    wx.makePhoneCall({
      phoneNumber: this.data.phone
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
  back: util.back,
  onShareAppMessage: function () {
    let that = this;
    return {
      title: '乐宝教育365', // 转发后 所显示的title
      path: '/pages/loading/loading'
    }
  }
})