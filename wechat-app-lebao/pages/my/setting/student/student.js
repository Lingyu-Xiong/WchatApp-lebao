// pages/my/setting/student/student.js
const app = getApp()
const util = require('../../../../utils/util.js')
const getstuUrl = '/base/user/favorStu/list'
const delstuUrl = '/base/user/favorStu/delete'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isIphone5: false,
    studentList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      isIphone5: app.globalData.isIphone5
    })
    //获取学生列表
    app.wxRequest(getstuUrl, {}, 'get').then(res => {
      console.log(res.data)
      if (res.data.errno == 0) {
        //请求成功
        let studentList = res.data.data.items
        for (var i = 0; i < studentList.length; i++) {
          studentList[i].isSelect = false
        }
        this.setData({
          studentList: studentList
        })
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
  delstudent:function(e){
    //删除一个学生
    var that=this
    let id = e.currentTarget.dataset.id
    wx.showModal({
      title: '提示',
      content: '确定删除该学员？',
      success(res) {
        if (res.confirm) {
          app.wxRequest(delstuUrl, { ids: id }, 'get').then(res => {
            console.log(res.data)
            if (res.data.errno == 0) {
              //请求成功 
              wx.showToast({
                title: '删除成功！',
                icon: 'success'
              })
              that.onLoad()     
            } else {
              util.errorTip(res.errmsg)
            }
          })
        }
      }
    })
   
    
  },

  stuDetails: function (e) {
    const that = this
    const name = e.currentTarget.dataset.id
    console.log(name)
    wx.navigateTo({
      url: 'detail/detail?name=' + name,
    })
  },

  adddetail: function () {
    wx.navigateTo({
      url: '/pages/my/setting/student/myaddstudent/myaddstudent'
    })
  },
 
})