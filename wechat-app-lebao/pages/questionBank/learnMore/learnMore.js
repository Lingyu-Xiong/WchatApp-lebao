// pages/questionBank/learnMore/learnMore.js
const app = getApp()
const util = require('../../../utils/util.js')
const imageUrl = "https://lebao.oss-cn-beijing.aliyuncs.com/picture/weixin/questionBank"
const questiontUrl = '/biz/trade/question/listWeb'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    categoryList: [{ categoryId: '0', title: '全部' }, { categoryId: '1036034', title: '美术' }, { categoryId: '1036032', title: '音乐' }, { categoryId: '1036037', title: '书法' }, { categoryId: '1036033', title: '舞蹈' }, { categoryId: '1036026', title: '表演' }, { categoryId: '1036028', title: '口才' }, { categoryId: '1036035', title: '主持' }, { categoryId: '1036027', title: '科技' }, { categoryId: '1036038', title: '体育' }, { categoryId: '1036039', title: '课堂知识' }],
    index:0,
    currentTab:0,
    questionList:[],
    searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
    searchLoadingComplete: false,  //“没有数据”的变量，默认false，隐藏  
    isFromSearch: true,   // 用于判断searchSongList数组是不是空数组，默认true，空的数组  
    searchPageNum: 1,   // 设置加载的第几次，默认是第一次  
    callbackcount: 10,      //返回数据的个数  
    categoryId:0,
    totalNum: '',//总记录数
    pageNum:'',//总页数
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let param = {
      page: this.data.searchPageNum,    // 页数
      limit: this.data.callbackcount,    // 每页容量
    }
   this.getList(param)
  },
  getList: function (param){
    //根据类目id获取题目
    app.wxRequest(questiontUrl, param, 'get').then(res => {
      console.log(res)
      if (res.data.errno == 0) {
        //请求成功，封装数据  
        if (res.data.data.total != 0) {
          // 设置分页
          this.data.totalNum = res.data.data.total; 
          if (this.data.totalNum % this.data.callbackcount === 0) {
            this.data.pageNum = parseInt(this.data.totalNum / this.data.callbackcount);
          } else {
            this.data.pageNum = parseInt(this.data.totalNum / this.data.callbackcount) + 1;
          }
          console.log("总页数:" + this.data.pageNum)

          let questionList=[]
          //如果isFromSearch是true从data中取出数据，否则先从原来的数据继续添加  
          this.data.isFromSearch ? questionList = res.data.data.items : questionList = this.data.questionList.concat(res.data.data.items)
          this.setData({
            questionList: questionList,
            searchLoading: true   //把"上拉加载"的变量设为false，显示  
          })
        } else {
          this.setData({
            searchLoadingComplete: true, //把“没有数据”设为true，显示  
            searchLoading: false  //把"上拉加载"的变量设为false，隐藏  
          });
        }
      } else {
        util.errorTip(res.data.errmsg)
      }
    })
  },
  //滚动到底部触发事件  
  searchScrollLower: function () {
    let that = this;
    if (that.data.searchLoading && !that.data.searchLoadingComplete && that.data.searchPageNum <that.data.pageNum) {
      that.setData({
        searchPageNum: that.data.searchPageNum + 1,  //每次触发上拉事件，把searchPageNum+1  
        isFromSearch: false  //触发到上拉事件，把isFromSearch设为为false  
      });
      let param = {}
      if (that.data.categoryId == 0) {
        param = {
          page: that.data.searchPageNum,    // 页数
          limit: that.data.callbackcount,    // 每页容量
        }
      } else {
        param = {
          categoryId: that.data.categoryId,
          page: that.data.searchPageNum,    // 页数
          limit: that.data.callbackcount,    // 每页容量
        }
      }
        that.getList(param);    
    }else{
      that.setData({
        searchLoadingComplete: true,  //每次触发上拉事件，把searchPageNum+1  
        searchLoading: false,
        isFromSearch: false  //触发到上拉事件，把isFromSearch设为为false  
      });
    }
  },  
  //点击切换teb页
  switchNav: function (e) {
    this.setData({
      searchPageNum: 1,   //第一次加载，设置1  
      questionList: [],  //放置返回数据的数组,设为空  
      isFromSearch: true,  //第一次加载，设置true  
      searchLoading: true,  //把"上拉加载"的变量设为true，显示  
      searchLoadingComplete: false //把“没有数据”设为false，隐藏  
    })
    console.log(e)
    if (this.data.currentTab !== e.currentTarget.dataset.current) {
      var categoryId = e.currentTarget.dataset.categoryid
      this.setData({
        currentTab: parseInt(e.currentTarget.dataset.current),
        categoryId: categoryId,
        searchPageNum: 1,   //第一次加载，设置1  
        questionList: [],  //放置返回数据的数组,设为空  
        isFromSearch: true,  //第一次加载，设置true  
        searchLoading: true,  //把"上拉加载"的变量设为true，显示  
        searchLoadingComplete: false //把“没有数据”设为false，隐藏
      })
    }
    let param={}
   
    if (categoryId==0){
      param={
        page: this.data.searchPageNum,    // 页数
        limit: this.data.callbackcount,    // 每页容量
      }
    }else{
      param = {
        categoryId: this.data.categoryId,
        page: this.data.searchPageNum,    // 页数
        limit: this.data.callbackcount,    // 每页容量
      }
    }
    this.getList(param)
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