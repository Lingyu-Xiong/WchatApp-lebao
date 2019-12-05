// pages/my/myvideo/myvideodetail/myvideodetail.js
const app = getApp()
const util = require('../../../../utils/util.js')
const getdetailUrl = '/base/user/video/myRead/'
const statusText = ['待审核', '通过', '被拒']
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isIphone5: false,
    currentTab: 0,
    options:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      options: options
    })
    console.log(this.data.options)

  },
  onShow: function () {
    this.getvideodetail(this.data.options)
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
  getvideodetail(options) {
    var that = this
    app.wxRequest(getdetailUrl + options.id, {}, 'get').then(res => {
      console.log(res.data)
      if (res.data.errno === 0) {
        let video = res.data.data[0],
          comments = res.data.data[0].comments,
          likes = res.data.data[0].likes,
          expcomments = [], usercomments = [], userlikes = [],feedback
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

        if (typeof (video.auditFeedback) == 'undefined' || video.auditFeedback ==''){
          feedback=''
        }else{
          feedback = video.auditFeedback
        }

        for (var j = 0; j < likes.length; j++) {
          let item = {}
          item.nickname = util.jointName(likes[j].nickname, likes[j].mobile)
          item.avatar = util.jointAvatar(likes[j].avatar)
          userlikes.push(item)
        }

        let id = video.id,
          addTime = video.addTime.substring(0, 10),
          description = video.description,
          status = statusText[video.status],
          comment = video.comment,
          like = video.like,
          url = video.url
console.log(feedback)
        that.setData({
          id: id,
          addTime: addTime,
          description: description,
          status:status,
          comment: comment,
          like: like,
          url: url,
          expcomments: expcomments,
          usercomments: usercomments,
          userlikes: userlikes,
          feedback:feedback
        })

      } else {
        util.errorTip('获取失败')
        console.log(res.data.errmsg)
      }
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
  onShareAppMessage: function () {
    let that = this;
    return {
      title: '乐宝教育365', // 转发后 所显示的title
      path: '/pages/loading/loading'
    }
  }
})