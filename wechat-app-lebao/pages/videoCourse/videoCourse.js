// pages/videoCourse/videoCourse.js
const app = getApp()
const util = require('../../utils/util.js')
const categoryUrl = '/mall/admin/lebaoCategory/query'
const exhibitionUrl = '/mall/admin/ad/list'
const courseListUrl ='/biz/trade/course/video/list'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    categoryList: [],
    index: 0,
    currentTab: 0,
    inputvideo:'',
    picList: [],
    courseList: [], 
    searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
    searchLoadingComplete: false,  //“没有数据”的变量，默认false，隐藏  
    isFromSearch: true,   // 用于判断searchSongList数组是不是空数组，默认true，空的数组  
    searchPageNum: 1,   // 设置加载的第几次，默认是第一次  
    callbackcount: 10,      //返回数据的个数  
    type: -1,
    totalNum: '',//总记录数
    pageNum: '',//总页数

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
    //请求类目数据
    app.wxRequest(categoryUrl, {
      type: 2,
      limit: 10
    }, 'get').then(data => {
      const res = data.data
      if (res['errno'] == 0) {
        //请求成功，封装数据
        this.getInfo(res['data']['items'])
      } else {
        util.errorTip(res.errmsg)
      }
    })
    //请求广告
    app.wxRequest(exhibitionUrl, {
      position: 5,
      limit: 20
    }, 'get').then(data => {
      const res = data.data
      if (res['errno'] == 0) {
        //请求成功，封装数据

        this.getAd(res['data']['items'])
      } else {
        util.errorTip(res.errmsg)
      }
    })
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
      courseList: []
    })
    let param = {
      name: this.data.inputvideo,
      page: this.data.searchPageNum,    // 页数
      limit: this.data.callbackcount,    // 每页容量
    }
    this.getList(param)
  },
  //获取渲染广告
  getAd: function (data) {
    let picList = [],
      item = {}
    for (var i = 0, len = data.length; i < len; i++) {
      item = {}
      item['src'] = util.jointUrl(data[i]['url']);
      item['id'] = data[i]['param']
      item['type'] = data[i]['linkType']
      picList.push(item)
    }
    this.setData({
      picList: picList,
    })
    console.log('picList', picList)
  },
  adDetails: function (e) {//广告跳转
    const that = this
    const type = e.currentTarget.dataset.type
    console.log('type', type)
    if (type == 0) {//学校详情
      const id = e.currentTarget.dataset.id
      wx.navigateTo({
        url: '/pages/school/details/details?id=' + id,
      })
    } else if (type == 1) {//课程详情
      const courseId = e.currentTarget.dataset.id
      wx.navigateTo({
        url: '/pages/school/details/course/course?schoolId=' + this.data.id + '&courseId=' + courseId +
          '&lat=' + this.data.latitude + '&lng=' + this.data.longitude,
      })
    } else if (type == 2) {//老师详情
      const teacherId = e.currentTarget.dataset.id
      wx.navigateTo({
        url: '/pages/school/details/teacher/teacher?schoolId=' + this.data.id + '&teacherId=' + teacherId,
      })
    }
    else if (type == 5) {//视频课程
      const videoCourseId = e.currentTarget.dataset.id
      wx.navigateTo({
        url: 'courseDetail/courseDetail?id=' + videoCourseId,
      })
    }
  },
  //获取类目信息和核心展示信息
  getInfo: function (data) {
    console.log('types', data)
    let categoryList = [],item = {}
    item['type'] = -1
    item['title'] = '全部'
    categoryList.push(item)
    for (var i = 0, len = data.length; i < len; i++) {
      item = {}
      item['type'] = data[i]['id']
      item['title'] = data[i]['name']
      categoryList.push(item)
      
    }
    this.setData({
      categoryList: categoryList,
    })
  },
  getList: function (param) {
    //根据类目id获取课程
    app.wxRequest(courseListUrl, param, 'get').then(res => {
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

          let courseList = []
          //如果isFromSearch是true从data中取出数据，否则先从原来的数据继续添加  
          this.data.isFromSearch ? courseList = res.data.data.items : courseList = this.data.courseList.concat(res.data.data.items)
          if (this.data.pageNum==1){
            this.setData({
              courseList: courseList,
              searchLoadingComplete: false, //把“没有数据”设为true，显示  
              searchLoading: false  //把"上拉加载"的变量设为false，隐藏  
            });
          }else{
            this.setData({
              courseList: courseList,
              searchLoading: true   //把"上拉加载"的变量设为true，显示  
            })
          }
          console.log(courseList)
        } else {
          this.setData({
            searchLoadingComplete: false, //把“没有数据”设为true，显示  
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
    console.log(11111)
    let that = this;
    if (that.data.searchLoading && !that.data.searchLoadingComplete && that.data.searchPageNum < that.data.pageNum) {
      console.log(222)
      that.setData({
        searchPageNum: that.data.searchPageNum + 1,  //每次触发上拉事件，把searchPageNum+1  
        isFromSearch: false  //触发到上拉事件，把isFromSearch设为为false  
      });
      console.log("searchPageNum:"+that.data.searchPageNum)
      let param = {}
      if (that.data.type == -1) {
        param = {
          page: that.data.searchPageNum,    // 页数
          limit: that.data.callbackcount,    // 每页容量
        }
      } else {
        param = {
          type: that.data.type,
          page: that.data.searchPageNum,    // 页数
          limit: that.data.callbackcount,    // 每页容量
        }
      }
      that.getList(param);
    } else {
      that.setData({
        searchLoadingComplete: true,  //每次触发上拉事件，把searchPageNum+1  
        searchLoading: false,
        isFromSearch: false  //触发到上拉事件，把isFromSearch设为为false  
      });
    }
  },
  //点击切换teb页
  switchNav: function (e) {
    console.log(e)
    if (this.data.currentTab !== e.currentTarget.dataset.current) {
      var type = e.currentTarget.dataset.type
      this.setData({
        currentTab: parseInt(e.currentTarget.dataset.current),
        type: type,
        searchPageNum: 1,   //第一次加载，设置1  
        courseList: [],  //放置返回数据的数组,设为空  
        isFromSearch: true,  //第一次加载，设置true  
        searchLoading: true,  //把"上拉加载"的变量设为true，显示  
        searchLoadingComplete: false //把“没有数据”设为false，隐藏
      })
    }
    let param = {}

    if (type == -1) {
      param = {
        page: this.data.searchPageNum,    // 页数
        limit: this.data.callbackcount,    // 每页容量
      }
    } else {
      param = {
        type: this.data.type,
        page: this.data.searchPageNum,    // 页数
        limit: this.data.callbackcount,    // 每页容量
      }
    }
    this.getList(param)
  },
  goToDetail:function(e){
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: 'courseDetail/courseDetail?id=' + id,
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