// pages/loading/loading.js
const app = getApp()
const util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    value: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let timer;
    timer = () => {
      setTimeout(() => {
        const val = this.data.value;
        this.setData({
          value: val < 100 ? val + 10 : 0
        });
        timer();
      }, 200);
    }
    timer();
    var getUidInterval = setInterval(function() {
      if (app.globalData.openid != '') {
        clearInterval(getUidInterval)
        clearTimeout(timer)
        app.wxRequest('/base/user/auth/login/openid/wxmini', {
          openid: app.globalData.openid
        }, 'get').then(data => {
          if (data.statusCode == 200) {
            if (data.data.errno == 0) {
              let session = data.data.data
              wx.setStorageSync('session', session)
              app.globalData.session = session
              //获取个人身份信息
              app.getMyInfo()
              console.log(options.groupid)
              if (options.groupid){
                wx.redirectTo({
                  url: '/pages/groupbuy/gbdetail/gbdetail?groupid='+options.groupid,
                })
              }else{
              wx.switchTab({
                url: '/pages/homepage/homepage',
              })
              }
            } else if (data.data.errno == '605') {
              wx.redirectTo({
                url: '/pages/login/register/register',
              })
            } else {
              util.errorTip('登录失败')
              console.log('data.data.errno3', data.data.errno)
              console.log('errormsg', data.data.errmsg)
            }
          } else {
            util.errorTip('请求失败')
          }
        })
      } else {
        var timer = setTimeout(function() {
          clearInterval(getUidInterval)
          if (app.globalData.uid == 0) {
            util.errorTip('加载异常请重试')
          }
        }, 8000);
      }
    }, 1000)
  },
})