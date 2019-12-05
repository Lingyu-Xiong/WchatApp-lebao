// pages/questionBank/challenge/challenge.js
const app = getApp()
const util = require('../../../utils/util.js')
const questiontUrl = '/biz/trade/question/list'
const imageUrl = "https://lebao.oss-cn-beijing.aliyuncs.com/picture/weixin/questionBank"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title:'',
    categoryId:'',
    timeUrl: imageUrl + '/time.png',
    questionList:[],
    hours: '0' + 0,   // 时
    minute: '0' + 0,   // 分
    second: '0' + 0,   // 秒
    buttonUrl: imageUrl + '/button.png',
    ansid:'',
    answerList:[],
    hasDoneNum:'',
    totalNum:''

  },
  select(e) {
    console.log(e)
    var chosenItemId = e.currentTarget.dataset.ansid//选项id
    var id = e.currentTarget.dataset.quesid//题目id
    var index = e.currentTarget.dataset.index//题目序号
    var item={
      id:id,
      chosenItemId: chosenItemId
    }
    if (this.data.answerList.length==index){
      //该题答案未写入 
     this.data.answerList.push(item)
     this.data.questionList[index].curId = e.currentTarget.dataset.ansid
      this.setData({
        questionList: this.data.questionList,
        hasDoneNum: this.data.answerList.length
      })

    } else if (this.data.answerList.length> index){
      //修改答案
    this.data.answerList[index].chosenItemId = chosenItemId
      this.data.questionList[index].curId = e.currentTarget.dataset.ansid
      this.setData({
        questionList: this.data.questionList,
        hasDoneNum: this.data.answerList.length
      })
    }else{
      wx.showToast({
        title: '请先完成前面的题目!',
        icon: 'none',
        duration: 2000
      })
    }
    
    
    console.log(this.data.answerList)
  },
  submitAns:function(){
    if(this.data.hasDoneNum<this.data.totalNum){
      wx.showToast({
        title: '请完成所有题目之后提交!',
        icon: 'none',
        duration: 2000
      })
    }else {
      wx.reLaunch({
        url: '../ansAnalysis/ansAnalysis?answerList=' + JSON.stringify(this.data.answerList) + '&title=' + this.data.title + '&hours=' + this.data.hours + '&minute=' + this.data.minute + '&second=' + this.data.second
      })
    }
    
  },
  // 计时器
  setInterval: function () {
    const that = this
    var second = that.data.second
    var minute = that.data.minute
    var hours = that.data.hours
    setInterval(function () {  // 设置定时器
      second++
      if (second >= 60) {
        second = 0  //  大于等于60秒归零
        minute++
        if (minute >= 60) {
          minute = 0  //  大于等于60分归零
          hours++
          if (hours < 10) {
            // 少于10补零
            that.setData({
              hours: '0' + hours
            })
          } else {
            that.setData({
              hours: hours
            })
          }
        }
        if (minute < 10) {
          // 少于10补零
          that.setData({
            minute: '0' + minute
          })
        } else {
          that.setData({
            minute: minute
          })
        }
      }
      if (second < 10) {
        // 少于10补零
        that.setData({
          second: '0' + second
        })
      } else {
        that.setData({
          second: second
        })
      }
    }, 1000)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.title=options.title
    this.setData({
      categoryId: options.categoryId
      })
  //设置页面标题
    wx.setNavigationBarTitle({
      title: this.data.title
    })
    // 调用函数
    this.setInterval()
  //根据类目id获取题目
    app.wxRequest(questiontUrl, { categoryId: this.data.categoryId}, 'get').then(res => {
      console.log(res)
      if (res.data.errno == 0) {
        //请求成功，封装数据
        var questionList = res.data.data.items
        var totalNum=res.data.data.total        
        this.setData({
          questionList: questionList,
          totalNum: totalNum,
          hasDoneNum:0
        })
       
      } else {
        util.errorTip(res.data.errmsg)
      }
    })
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