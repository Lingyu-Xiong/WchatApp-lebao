// pages/questionBank/rank/rank.js
const app = getApp()
const util = require('../../../utils/util.js')
const rankListUrl ='/biz/trade/question/rankList'
const imageUrl = "https://lebao.oss-cn-beijing.aliyuncs.com/picture/weixin/questionBank"
const blockHeight = 132
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasMy:false,
    myRank:'',
    myTimes:'',
    myRrightRate:'',
    myAvatar:'',
    myName:'',
    rankByTimes:[],
    rankByRate:[],
    bannerUrl: imageUrl + '/ranking.png',
    noavatar: imageUrl +'/avator.png',
    currentTab: 0,
    index: 0,
    tabbar: [{
      status: -1,
      value: '答题正确率排行',
    },
    {
      status: 0,
      value: '答题次数排行',
    }
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let param={
      rankType: this.data.currentTab 
    }
    this.getList(param)

  },
  getList:function(param){
    //根据次数获取排行榜
    app.wxRequest(rankListUrl, param, 'get').then(res => {
      console.log(res)
      if (res.data.errno == 0) {
        //请求成功，封装数据 
        let list = res.data.data.ranks
        let data = {}
        let dataList = []
        for (var i = 0; i < list.length; i++) {
          data = {}
          data.userName = list[i].userName
          data.avatar = this.data.noavatar
          data.rank = list[i].rank
          data.times = list[i].times
          data.rightRate = this.toPercent(list[i].rightRate)
          if (list[i].avatar) {
            data.avatar = list[i].avatar
          }
          dataList.push(data)
        }
        this.setData({
          rankList: dataList,
          pageHeight: dataList.length * blockHeight
        })
        //自己已答题
       if (res.data.data.myRank) {

          var myRrightRate = this.toPercent(res.data.data.myRank.rightRate)
          var myRank = res.data.data.myRank
          myRank.rightRate = myRrightRate
          this.setData({
            myRank: myRank,
            pageHeight: dataList.length + 1 * blockHeight
          })
        }
      } else {
        util.errorTip(res.data.errmsg)
      }
    })
  },
//点击切换teb页
  switchNav: function(e) {
    if (this.data.currentTab !== e.currentTarget.dataset.current) {
      this.setData({
        currentTab: parseInt(e.currentTarget.dataset.current),
      })
      let param = {
        rankType: this.data.currentTab
      }
      this.getList(param)
    }
  },
  //滑动切换tab页
  bindChange: function (e) {
    this.setData({
      currentTab: e.detail.current
    })
    let param = {
      rankType: this.data.currentTab
    }
    this.getList(param)
  },
  // 转换百分数保留两位小数
  toPercent: function (point){
    var str = Number(point * 100).toFixed(2);
    str+= "%";
    return str;
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