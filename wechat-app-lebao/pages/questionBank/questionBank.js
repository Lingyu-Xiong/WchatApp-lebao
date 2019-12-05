// pages/questionBank/questionBank.js
const app = getApp()
const util = require('../../utils/util.js')
const imageUrl = "https://lebao.oss-cn-beijing.aliyuncs.com/picture/weixin/questionBank"
const questiontUrl = '/biz/trade/question/list'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bannerUrl: imageUrl +'/banner1.png',
    categoryList: [{ categoryId: '1036034', title: '美术挑战', src: imageUrl + '/finearts2.png', src1: imageUrl + '/finearts1.png' }, { categoryId: '1036032', title: '音乐挑战', src: imageUrl + '/music2.png', src1: imageUrl + '/music1.png' }, { categoryId: '1036037', title: '书法挑战', src: imageUrl + '/calligraphy2.png', src1: imageUrl + '/calligraphy1.png' }, { categoryId: '1036033', title: '舞蹈挑战', src: imageUrl + '/dance2.png', src1: imageUrl + '/dance1.png' }, { categoryId: '1036026', title: '表演挑战', src: imageUrl + '/perform2.png', src1: imageUrl + '/perform1.png' }, { categoryId: '1036028', title: '口才挑战', src: imageUrl + '/eloquence2.png', src1: imageUrl + '/eloquence1.png' }, { categoryId: '1036035', title: '主持挑战', src: imageUrl + '/preside2.png', src1: imageUrl + '/preside1.png' }, { categoryId: '1036027', title: '科技挑战', src: imageUrl + '/technology2.png', src1: imageUrl + '/technology1.png' }, { categoryId: '1036038', title: '体育挑战', src: imageUrl + '/sports2.png', src1: imageUrl + '/sports1.png' }, { categoryId: '1036039', title: '课堂知识', src: imageUrl + '/knowledge_wu.png', src1: imageUrl + '/knowledge.png' }],
    rankinguUrl: imageUrl + '/ranking1.png',
    rankingRight: [{ id: '1', text: '涨知识', src: imageUrl + '/zhishi1.png' }, { id: '2', text: '规则', src: imageUrl + '/guize1.png' }],
    buttonUrl: imageUrl + '/button1.png' ,
    categoryId:'',
    title:'',
    fromChallenge:false//是否从挑战页面返回
    


  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.fromChallenge){
      this.data.fromChallenge = options.fromChallenge
    }

  },
select:function(e){
  this.data.fromChallenge=false
  const id = e.currentTarget.dataset.id
  const title = e.currentTarget.dataset.title
  this.setData({
    categoryId:id,
    title: title
  })/*
  wx.navigateTo({
    url: 'challenge/challenge?categoryId=' + id+'&title=' + title,
  })*/
},
  getList:function(){
    //根据类目id获取题目
    var that = this
    app.wxRequest(questiontUrl, { categoryId: this.data.categoryId }, 'get').then(res => {
      console.log(res)
      if (res.data.errno == 0) {
        //请求成功，封装数据        
        let totalNum = res.data.data.total
        if (totalNum > 0) {//有数据
          wx.showModal({
            title: '提示',
            content: '挑战开始后，不能退出哦',
            success: function (res) {
              if (res.confirm) {
                wx.reLaunch({
                  url: 'challenge/challenge?categoryId=' + that.data.categoryId + '&title=' + that.data.title,
                })
               // that.getList()
              } else if (res.cancel) {
                //console.log('用户点击取消')
              }
            }
          })
         
        } else {
          wx.showToast({
            title: '暂无题目!',
            icon: 'none',
            duration: 2000
          })
        }

      } else {
        util.errorTip(res.data.errmsg)
      }
    })
  },
  goToChallenge:function(){
    
    this.getList()
    /*
    wx.showModal({
      title: '提示',
      content: '挑战开始后，不能退出哦',
      success: function (res) {
        if (res.confirm) {
         that.getList()
        } else if (res.cancel) {
          //console.log('用户点击取消')
        }
      }
    })
    */
   
  },
  goToRanking:function(){
     wx.navigateTo({
      url: 'rank/rank',
    })
  },
  goToLearn: function (e) {
     var id=e.currentTarget.dataset.id
     if(id==1){
       wx.navigateTo({
         url: 'learnMore/learnMore',
       })
     }else if(id==2){
       wx.navigateTo({
         url: 'rule/rule',
       })
     }
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
    if(this.data.fromChallenge){
      wx.reLaunch({
        url: '../../homepage/homepage'
      })
    }
    
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