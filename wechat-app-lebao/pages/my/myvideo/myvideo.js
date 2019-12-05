// pages/my/myvideo/myvideo.js
const app = getApp()
const util = require('../../../utils/util.js')
const getmyVideoUrl = '/base/user/video/myList'
const statusText = ['待审核', '通过', '被拒']
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isIphone5: false,
    myvideoList: [],
    inputvideo: '',
    maskShow:false,
    page: 1,
    total:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    this.getmyVideo()  
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
  getmyVideo: function (needStopRefresh, needBottomRefresh) {
    app.wxRequest(getmyVideoUrl, {
      limit: 10,
      description: this.data.inputvideo, 
      page: this.data.page
    }, 'get').then(res => {
      console.log(res.data)
      if (res.data.errno === 0) {
        let data = res.data.data.items,
        total=res.data.data.total,
        olddata=this.data.myvideoList,
          myvideoList = [], item
        for (var i = 0; i < data.length; i++) {
          item = {}
          item.id = data[i].id
          item.status=statusText[data[i].status]
          item.addTime = data[i].addTime.substring(0, 10)
          item.description = data[i].description
          item.url = data[i].url
          myvideoList.push(item)
        }
        this.setData({
          myvideoList: olddata.concat(myvideoList),
          total:total
        })

      } else {
        util.errorTip('获取失败')
        console.log(res.data.errmsg)
      }
      if (needStopRefresh) {
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
      }
      if (needBottomRefresh) {
        wx.hideLoading();
      }
    })
  },
  
  localUpload:function(){//本地上传
    wx.chooseVideo({
      sourceType: ['album'],
      success(res) {
        console.log(res)
        let tempDuration = res.duration;
        let tempHeight = res.height;
        let tempWidth = res.width;
        let tempSize = res.size;
        let tempFilePath = res.tempFilePath;
        let thumbTempFilePath = res.thumbTempFilePath;
        if (res.duration >30) {
          wx.showToast({
            title: '视频长度不能超过30秒',
            icon: "none",
            duration: 2000
          })
        }else{
          wx.navigateTo({
            url: '/pages/my/myvideo/upload/upload?tempDuration=' + tempDuration
              + '&tempHeight=' + tempHeight
              + '&tempWidth=' + tempWidth
              + '&tempSize=' + tempSize
              + '&tempFilePath=' + tempFilePath
              + '&thumbTempFilePath=' + thumbTempFilePath
          })
        }
      }
    })
  },
  shootUpload: function () {//拍摄视频上传
    wx.chooseVideo({
      sourceType: ['camera'],
      maxDuration: 30,
      camera: 'back',
      success(res) {
        console.log(res)
        let tempDuration = res.duration;
        let tempHeight = res.height;
        let tempWidth = res.width;
        let tempSize = res.size;
        let tempFilePath = res.tempFilePath;
        let thumbTempFilePath = res.thumbTempFilePath;
        if (res.duration > 30) {
          wx.showToast({
            title: '视频长度不能超过30秒',
            icon: "none",
            duration: 2000
          })
        } else {
          wx.navigateTo({
            url: '/pages/my/myvideo/upload/upload?tempDuration=' + tempDuration
              + '&tempHeight=' + tempHeight
              + '&tempWidth=' + tempWidth
              + '&tempSize=' + tempSize
              + '&tempFilePath=' + tempFilePath
              + '&thumbTempFilePath=' + thumbTempFilePath
          })
        }
      }
    })
  },
 choosevideo:function(){
   this.setData({
     maskShow:true
   })
 },
  invisible: function () {
    this.setData({ maskShow: false });
  },
  inputSelect: function (e) {
    this.setData({
      inputvideo: e.detail.value
    })

  },
  clearSelect: function () {
    this.setData({
      inputvideo: ''
    })
    this.search()
  },
  search: function () {
    this.setData({
      myvideoList: []
    })
    this.getmyVideo()
  },

  // 点击cover播放，其它视频结束
  videoPlay: function (e) {
    var curId = e.currentTarget.dataset.id
    if (!this.data.playIndex) {// 没有播放时播放视频
      this.setData({
        playIndex: curId,
        isplay: true
      })
      var videoContext = wx.createVideoContext('video' + curId) //这里对应的视频id
      videoContext.play()
    } else { // 有播放时先将prev暂停，再播放当前点击的current
      var videoContextPrev = wx.createVideoContext('video' + this.data.playIndex)
      if (this.data.playIndex != curId) {
        videoContextPrev.pause()
        this.setData({
          playIndex: curId,
          isplay: true
        })
        var videoContextCurrent = wx.createVideoContext('video' + curId)
        videoContextCurrent.play()
      } else {
        if (this.data.isplay) {
          videoContextPrev.pause()
          this.setData({
            isplay: false
          })
        } else {
          videoContextPrev.play()
          this.setData({
            isplay: true
          })
        }
      }

    }
  },


  myvideodetail: function (e) {
    let id=e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/my/myvideo/myvideodetail/myvideodetail?id='+id,
    })
  },
  /**
       * 页面上拉触底事件的处理函数
       */
  onReachBottom: function () {
    var that = this;
    let page = that.data.page,
    total=that.data.total
    if (((total - (page - 1) * 10) / 10)>page ){
      wx.showLoading({
        title: '玩命加载中',
      })
      that.setData({
        page: page + 1
      })
      this.getmyVideo(false, true)
    }
    
  },
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading() //在标题栏中显示加载
    this.getmyVideo(true, false)
  },
  onShareAppMessage: function () {
    let that = this;
    return {
      title: '乐宝教育365', // 转发后 所显示的title
      path: '/pages/loading/loading'
    }
  }
})