// pages/my/myvideo/myvideo.js
const app = getApp()
const util = require('../../../../utils/util.js')
const uploadUrl = '/res/file/oss/video/user'
const uploadDesc ='/base/user/video/upload'
const host = app.globalData.host
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isIphone5: false,
    videoParams: {},
    desc:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (params) {
    var that = this
    console.log(params)
    that.setData({
      videoParams: params
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
  upload:function(e){
    let tempFilePath =this.data.videoParams.tempFilePath
    let desc=this.data.desc
wx.showLoading({
  title: '上传中...',
})
    app.wxUploadFile(uploadUrl, tempFilePath,'file',{}).then(res=>{
      console.log(res)
      let data = JSON.parse(res.data)
      let url=data.data[0]
     if (data.errno === 0){
       wx.hideLoading()
       console.log('descupload')
       this.uploadDesc(url,desc)
     }
   })
    // wx.uploadFile({
    //   url: host+uploadUrl,
    //   filePath: tempFilePath,
    //   name: 'file',
    //   formData: {},
    //   header: {
    //     'content-type': 'multipart/form-data',
    //     'X-Litemall-Admin-Token': app.globalData.session
    //   },
    //   success(res) {
    //    console.log(res)

    //   }
    // })
    },
  textinput: function (e) {
    console.log(e.detail.value)   
      this.setData({
        desc: e.detail.value
      })
  },
    uploadDesc:function(url,desc){
      console.log('descupload')
      app.wxRequest(uploadDesc,{
        videoUrl: url,
        description:desc
      }).then(res=>{
        console.log(res.data)
        if(res.data.errno==0){
          wx.showToast({
            title: '上传成功',
            icon: 'success',
            duration: 2000,
            success: function () {
              wx.redirectTo({
                url: '/pages/my/myvideo/myvideo',
              })
             },
          })

        }
      })
    },
  

  
})