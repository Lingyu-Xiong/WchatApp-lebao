// pages/confirmOrder/addstudent/addstudent.js
const app = getApp()
const util = require('../../../utils/util.js')
const getstuUrl = '/base/user/favorStu/list'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    courseinfo: '',
    isIphone5: false,
    studentList: [],
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
    })
    let courseinfo = JSON.parse(options.courseinfoStr)
    this.setData({
      courseinfo:courseinfo,
      isIphone5: app.globalData.isIphone5
    })
    //获取学生列表
    app.wxRequest(getstuUrl, {},'get').then(res => {
      console.log(res.data)
      if (res.data.errno == 0) {
        //请求成功
        let studentList=res.data.data.items
      for(var i=0;i<studentList.length;i++){
        studentList[i].isSelect=false
      }
      this.setData({
        studentList:studentList
      })
        wx.hideLoading()
      } else {
        util.errorTip(res.errmsg)
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
  chooseTap:function(e){
    let index = e.currentTarget.dataset.index;
    let studentList=this.data.studentList;
    studentList[index].isSelect=!studentList[index].isSelect;
    this.setData({
      studentList:studentList
    })
  },
  adddetail: function () {
    let courseinfo = this.data.courseinfo
    let courseinfoStr = JSON.stringify(courseinfo)
    wx.redirectTo({
      url: '/pages/confirmOrder/addstudent/addstudentdetail/addstudentdetail?courseinfoStr=' + courseinfoStr
    })
  },
  confirmstu:function(){
    let courseinfo=this.data.courseinfo
    let studentList=this.data.studentList;
    let chooseStudentList =[]
    for(var i=0;i<studentList.length;i++){
      if (studentList[i].isSelect){
        console.log(studentList[i])
        chooseStudentList.push(studentList[i])
      }
    }
    console.log(chooseStudentList)
    let chooseStudentListstr = JSON.stringify(chooseStudentList)
    let courseinfoStr = JSON.stringify(courseinfo)
    wx.redirectTo({
      url: '/pages/confirmOrder/confirmOrder?chooseStudentListstr=' + chooseStudentListstr + '&courseinfoStr=' + courseinfoStr
    })
  }

})