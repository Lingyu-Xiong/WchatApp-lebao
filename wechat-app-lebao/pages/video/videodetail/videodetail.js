// pages/my/myvideo/myvideo.js
const app = getApp()
const util = require('../../../utils/util.js')
const getdetailUrl = '/base/user/video/read/'
const commentUrl = '/base/user/video/comment'
const likeUrl ='/base/user/video/like'
const readcountUrl ='/base/user/video/visit/'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isIphone5: false,
    currentTab: 0,
    inputBoxShow:false,
    sendValid:false,
    id:'',
    options:'',
    desc:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      options:options
    })
    console.log(this.data.options)
   
  },
onShow:function(){
  this.getvideodetail(this.data.options)
  this.readCount(this.data.options)
},


  getvideodetail(options) {
    var that = this
    app.wxRequest(getdetailUrl + options.id, {}, 'get').then(res => {
      console.log(res.data)
      if (res.data.errno === 0) {
        let video = res.data.data.items[0],
          comments = res.data.data.items[0].comments,
          likes = res.data.data.items[0].likes,
          expcomments = [], usercomments = [], userlikes = []
        console.log(comments, likes)
        if (typeof (comments) == 'undefined' || comments == []) {
          expcomments = []
          usercomments = []
        } else {
          for (var i = 0; i < comments.length; i++) {
            if (comments[i].type == 1) {//expcomments
              expcomments.push(comments[i])
            } else {//usercomments
              let item = {}
              item.comment = comments[i].comment
              item.nickname = util.jointName(comments[i].nickname, comments[i].mobile)
              item.avatar = util.jointAvatar(comments[i].avatar)
              usercomments.push(item)
            }
          }
        }

        for (var j = 0; j < likes.length; j++) {
          let item = {}
          item.nickname = util.jointName(likes[j].nickname, likes[j].mobile)
          item.avatar = util.jointAvatar(likes[j].avatar)
          userlikes.push(item)
        }

        let id = video.id,
          nickname = util.jointName(video.nickname, video.mobile),
          avatar = util.jointAvatar(video.avatar),
          addTime = video.addTime.substring(0, 10),
          description = video.description,
          comment = video.comment,
          like = video.like,
          doLike=video.doLike,
          url = video.url

        that.setData({
          id: id,
          nickname: nickname,
          avatar: avatar,
          addTime: addTime,
          description: description,
          comment: comment,
          like: like,
          doLike:doLike,
          url: url,
          expcomments: expcomments,
          usercomments: usercomments,
          userlikes: userlikes
        })

      } else {
        util.errorTip('获取失败')
        console.log(res.data.errmsg)
      }
    })
  },

  readCount(options) {
    var that = this
    app.wxRequest(readcountUrl + options.id, {}, 'get').then(res => {
      console.log(res.data)
    })
  },


  //点击切换teb页
  switchNav: function (e) {
    if (this.data.currentTab !== e.currentTarget.dataset.current) {
      this.setData({
        currentTab: parseInt(e.currentTarget.dataset.current),
      })
    }
  },

  like: function (e) {
    let id =e.currentTarget.dataset.id
    let mylike = this.data.mylike
    app.wxRequest(likeUrl, {
      userVideoResId: id
    }, 'get').then(res => {
      console.log(res.data)
      if (res.data.errno === 0) {
        this.onShow(this.data.options)
        //改变前一页点赞量
        let pages = getCurrentPages();
        let prevPage = pages[pages.length - 2];
        let videoList = prevPage.data.videoList
        for (var i = 0; i < videoList.length; i++) {
          if (id == videoList[i].id) {
            if (videoList[i].doLike) {
              videoList[i].like -= 1
              videoList[i].doLike = 0
            } else {
              videoList[i].like += 1
              videoList[i].doLike = 1
            }
          }
        }
        prevPage.setData({
          videoList: videoList
        })
     
      } else {
        util.errorTip('点赞失败')
        console.log(res.data.errmsg)
      }
    })
  },
  //点击弹起评论框
  showInputBox: function () {
    this.setData({ inputBoxShow: true });
  },
  invisible: function() {
    this.setData({ inputBoxShow: false });
},
textinput:function(e){
  console.log(e.detail.value)
  if(e.detail.value.length!==0){
    this.setData({
      sendValid:true,
      desc:e.detail.value
    })
  }else{
    this.setData({
      sendValid: false,
      desc: e.detail.value
    })
  }
},
send:function(){
  let sendValid=this.data.sendValid
  let id=this.data.options.id
  let comment=this.data.desc
  if(sendValid){
    app.wxRequest(commentUrl, {
      userVideoId: id,
      comment: comment,
      type: 0 
    }).then(res => {
      console.log(res.data)
      if (res.data.errno === 0) {
        this.onShow(this.data.options)
        this.setData({ inputBoxShow: false });
      } else {
        util.errorTip('评论失败')
        console.log(res.data.errmsg)
      }
    })
    
  }
  

},

  onShareAppMessage: function () {
    let that = this;
    return {
      title: '乐宝教育365', // 转发后 所显示的title
      path: '/pages/loading/loading'
    }
  }
})