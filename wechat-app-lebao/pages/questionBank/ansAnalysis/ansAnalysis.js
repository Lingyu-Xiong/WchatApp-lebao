// pages/questionBank/ansAnalysis/ansAnalysis.js
const app = getApp()
const util = require('../../../utils/util.js')
const ansSendUrl = '/biz/trade/question/send'
const imageUrl = "https://lebao.oss-cn-beijing.aliyuncs.com/picture/weixin/questionBank"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    buttonUrl: imageUrl + '/button.png',
    cancelUrl:imageUrl+'/cancel.png',
    bg_analysisUrl: imageUrl +'/bg_analysis.png',
    right:'',
    total:'',
    score:'',
    questionList:[],
    analysis:'',
    curQuestion:'',
    curAnswerList:[],
    questionIndex:0,
    hasNext:true,
    hours: '0' + 0,   // 时
    minute: '0' + 0,   // 分
    second: '0' + 0,   // 秒
    chooseSize: false,
    animationData: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let title = options.title
    let answerList = options.answerList
    //设置页面标题
    wx.setNavigationBarTitle({
      title: title
    })
    this.setData({
      hours: options.hours,
      minute:options.minute,
      second:options.second
    })
    //提交答案
    console.log(answerList)
    app.wxRequest(ansSendUrl, answerList).then(res => {
      console.log(res)
      if (res.data.errno == 0) {
        //请求成功，封装数据
        var right = res.data.data.right
        var total = res.data.data.total 
        var score = res.data.data.score
        var questionList = res.data.data.question

        this.setData({
          right:right,
          total:total,
          score:score,
          questionList: questionList    
        })

      } else {
        util.errorTip(res.data.errmsg)
      }
    })
  },
  getNext: function () {
    var that=this
    if (that.data.questionIndex == that.data.total-1){
      that.setData({
        hasNext:false,
        curQuestion: that.data.questionList[that.data.questionIndex].question,
        curAnswerList: that.data.questionList[that.data.questionIndex].questionItems,
        questionIndex: that.data.questionIndex + 1,
        analysis: that.data.questionList[that.data.questionIndex].analysis
      })
     /* wx.showToast({
        title: '没有更多题目了!',
        icon: 'none',
        duration: 2000
      })*/
    }else{
      that.setData({
        curQuestion: that.data.questionList[that.data.questionIndex].question,
        curAnswerList: that.data.questionList[that.data.questionIndex].questionItems,
        questionIndex: that.data.questionIndex + 1,
        analysis: that.data.questionList[that.data.questionIndex].analysis
      })
    }


  },
  goBack:function(){
    wx.navigateTo({
      url: '../questionBank?fromChallenge='+true
    })

  },
  getAnalysis: function (e) {
    var that = this;
    that.setData({
      curQuestion:that.data.questionList[that.data.questionIndex].question,
      curAnswerList: that.data.questionList[that.data.questionIndex].questionItems,
      questionIndex:that.data.questionIndex+1,
      analysis: that.data.questionList[that.data.questionIndex].analysis,
      hasNext:true
    })
    // 用that取代this，防止不必要的情况发生
    
    // 创建一个动画实例
    var animation = wx.createAnimation({
      // 动画持续时间
      duration: 500,
      // 定义动画效果，当前是匀速
      timingFunction: 'linear'
    })
    // 将该变量赋值给当前动画
    that.animation = animation
    // 先在y轴偏移，然后用step()完成一个动画
    animation.translateY(200).step()
    // 用setData改变当前动画
    that.setData({
      // 通过export()方法导出数据
      animationData: animation.export(),
      // 改变view里面的Wx：if
      chooseSize: true
    })
    // 设置setTimeout来改变y轴偏移量，实现有感觉的滑动
    setTimeout(function () {
      animation.translateY(0).step()
      that.setData({
        animationData: animation.export()
      })
    }, 200)
  },
  hideModal: function (e) {
    var that = this;
    that.data.questionIndex=0;
    var animation = wx.createAnimation({
      duration: 1000,
      timingFunction: 'linear'
    })
    that.animation = animation
    animation.translateY(200).step()
    that.setData({
      animationData: animation.export()

    })
    setTimeout(function () {
      animation.translateY(0).step()
      that.setData({
        animationData: animation.export(),
        chooseSize: false
      })
    }, 200)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})