// pages/video/video.js
const app = getApp()
const util = require('../../utils/util.js')
const getVideoUrl = '/base/user/video/list'
const likeUrl = '/base/user/video/like'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isIphone5: false,
    videoList: [],
    inputvideo:'',
    maskShow: false,
    mylike:0,
    page:1,
    itemlist: [{ id: 1, name: '精选' }, { id: 2, name: '专家点评' }, { id: 3, name: '排行榜' }],
    currentTab: 0,
    sort:'add_time',
    expert:'',
    playIndex:'',
    isplay:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    this.getVideo()
  },
onShow:function(){
  
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
  getVideo: function (needStopRefresh, needBottomRefresh){
    app.wxRequest(getVideoUrl, {
      limit: 10,
      description: this.data.inputvideo,
      page:this.data.page,
      sort:this.data.sort,
      order:'desc',
      expert:this.data.expert
    }, 'get').then(res => {
      console.log(res.data)
      if (res.data.errno === 0) {
        let data = res.data.data.items,
        olddata=this.data.videoList,
        videoList=[],item,comments
        for(var i=0;i<data.length;i++){
          item={}
          comments=[]
          if (typeof (data[i].comments) == 'undefined' || data[i].comments == '') {//专家评论
            item.comments =''
          } else {
            item.comments = data[i].comments
          }
          if (data[i].comment==0){
            item.comment='评论'
          }else{
            item.comment = data[i].comment
          }
          item.id = data[i].id
          item.nickname=util.jointName(data[i].nickname,data[i].mobile)
          item.avatar=util.jointAvatar(data[i].avatar)
          item.addTime = data[i].addTime.substring(0,10)
          item.description = data[i].description
          item.url = data[i].url
          item.like = data[i].like
          item.doLike=data[i].doLike
          item.visitNum=data[i].visitNum
          videoList.push(item)
        }
        this.setData({
          videoList: olddata.concat(videoList)
        })
        console.log(this.data.videoList)
      } else {
        util.errorTip('获取失败')
        console.log(res.data.errmsg)
      }
      if (needStopRefresh) {
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
      }
      if(needBottomRefresh){
        wx.hideLoading();
      }
    })
  },

  like:function(e){
    let id=e.currentTarget.dataset.id
    let videoList=this.data.videoList
    app.wxRequest(likeUrl, {
      userVideoResId: id
    }, 'get').then(res => {
      console.log(res.data)
      if (res.data.errno === 0) {       
        for(var i=0;i<videoList.length;i++){
          if(id==videoList[i].id){
            if (videoList[i].doLike){
              videoList[i].like-=1
              videoList[i].doLike =0
            }else{
              videoList[i].like += 1
              videoList[i].doLike = 1
            }
          }
        }
       this.setData({
         videoList:videoList
       })
        console.log(this.data.videoList)
      } else {
        util.errorTip('点赞失败')
        console.log(res.data.errmsg)
      }
    })
   
  },
  inputSelect: function (e) {
    this.setData({
      inputvideo: e.detail.value
    })

  },

  localUpload: function () {//本地上传
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
  choosevideo: function () {
    this.setData({
      maskShow: true
    })
  },
  invisible: function () {
    this.setData({ maskShow: false });
  },

  clearSelect: function () {
    this.setData({
      inputvideo: ''
    })
    this.search()
  },
  search:function(){
    this.setData({
      videoList: []
    })
    this.getVideo()
  },

  // 点击cover播放，其它视频结束
  videoPlay: function (e) {
    var curId = e.currentTarget.dataset.id
    if (!this.data.playIndex) {// 没有播放时播放视频
      this.setData({
        playIndex:curId,
        isplay:true
    })
      var videoContext = wx.createVideoContext('video'+curId) //这里对应的视频id
      videoContext.play()
    } else { // 有播放时先将prev暂停，再播放当前点击的current
      var videoContextPrev = wx.createVideoContext('video' +this.data.playIndex)
      if (this.data.playIndex != curId) {
        videoContextPrev.pause()     
      this.setData({
        playIndex: curId,
        isplay:true
      })
        var videoContextCurrent = wx.createVideoContext('video' + curId)
        videoContextCurrent.play()
    }else{
      if(this.data.isplay){
        videoContextPrev.pause()
        this.setData({
          isplay: false
        })
      }else{
        videoContextPrev.play()
        this.setData({
          isplay: true
        })
      }
    }
     
    }
  },

  //点击切换tab页
  switchNav: function (e) {
    let current = e.currentTarget.dataset.current
    if (this.data.currentTab !== current) {
      this.setData({
        currentTab: parseInt(e.currentTarget.dataset.current),
        videoList:[]
      })
      if (current==0){
        this.setData({
          sort:'add_time',
          expert:''
        })
        this.getVideo()
      } else if (current == 1){
        this.setData({
          sort: '',
          expert:1
        })
        this.getVideo()
      }else{
        this.setData({
          sort:"`like`",
          expert:''
        })
        this.getVideo()
      }
    }
  },
  videodetail:function(e){
    let id=e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/video/videodetail/videodetail?id='+id,
    })
  },
  /**
     * 页面上拉触底事件的处理函数
     */
  onReachBottom: function () {
    var that = this;
    let page = that.data.page,
      total = that.data.total
    if (((total - (page - 1) * 10) / 10) > page) {
      wx.showLoading({
        title: '玩命加载中',
      })
      that.setData({
        page: page + 1
      })
      this.getVideo(false, true)
    }
  },

  onPullDownRefresh: function () {
    wx.showNavigationBarLoading() //在标题栏中显示加载
    this.setData({
      videoList: []
    })
    this.getVideo(true,false)
  },
  onShareAppMessage: function () {
    let that = this;
    return {
      title: '乐宝教育365', // 转发后 所显示的title
      path: '/pages/loading/loading'
    }
  }
})