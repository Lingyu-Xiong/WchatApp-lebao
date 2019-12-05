// pages/examReg/examstu/examstu.js
const app = getApp()
const util = require('../../../utils/util.js')
const getstuUrl = '/base/user/favorStu/list'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isIphone5: false,
    stuList:[],
    selectNum:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取学生列表
    app.wxRequest(getstuUrl, {}, 'get').then(res => {
      console.log(res.data)
      if (res.data.errno == 0) {
        //请求成功
        let stuList = res.data.data.items
        for (var i = 0; i < stuList.length; i++) {
          stuList[i].isSelect = false
        }
        this.setData({
          stuList: stuList
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
  chooseTap:function(e){
    let index = e.currentTarget.dataset.index;
    console.log(index)
    let stuList = this.data.stuList;
    for (var i = 0; i < stuList.length; i++) {
      stuList[i].isSelect = false
    }
    console.log(stuList[index])
    stuList[index].isSelect = true
    this.setData({
      selectNum: index,
      stuList: stuList
    })
  },
confirmstu:function(){
  let selectstu = this.data.stuList[this.data.selectNum]
  let pages = getCurrentPages();
  let prevPage = pages[pages.length - 2];
  if (typeof (selectstu.schoolId) == 'undefined'){
    selectstu.schoolId=1
  }
  if (typeof (selectstu.schoolName) == 'undefined') {
    selectstu.schoolName = '黄陂区前川街第四小学'
  }
  console.log(selectstu.name, selectstu.id)
  prevPage.setData({
    name: selectstu.name,
    stuid: selectstu.id,
    schid:selectstu.schoolId,
    schname:selectstu.schoolName,
    addshow:false,
    selectstu:selectstu,
  })
  wx.navigateBack({
    delta: 1,
  })
},
addstu:function(){
  wx.navigateTo({
    url: '/pages/my/setting/student/myaddstudent/myaddstudent'
  })
}
 
})