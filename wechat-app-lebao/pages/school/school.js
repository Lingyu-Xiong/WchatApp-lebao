// pages/school/school.js
const app = getApp()
const util = require('../../utils/util.js')
const imageURL = app.globalData.imageUrl
const getUrl = '/mall/admin/school/list'
const exhibitionUrl = '/mall/admin/ad/list'
const categoryUrl = '/mall/admin/category/list'
const data = require("../../utils/area.js")
var QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
var qqmapsdk;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentType: -1,
    contentHeight: '',
    isIphone5: '',
    navbarList: [],
    hotPic:[],
    schoolList: [],
    navText:'全部分类',
    hasSelect1:false,
    hasSelect2: false,
    hasSelect3: false,
    scrollTop:0,
    maskShow: false,
    categoryList: [],
    index: 0,
    currentTab: 0,
    inputValue: '',
    searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
    searchLoadingComplete: false,  //“没有数据”的变量，默认false，隐藏  
    isFromSearch: true,   // 用于判断searchSongList数组是不是空数组，默认true，空的数组  
    searchPageNum: 1,   // 设置加载的第几次，默认是第一次  
    callbackcount: 10,      //返回数据的个数  
    type: -1,//类目为全部
    totalNum: '',//总记录数
    pageNum: '',//总页数
    navicon1:'https://lebao.oss-cn-beijing.aliyuncs.com/picture/weixin/nav-icon1.png',
    navicon2: 'https://lebao.oss-cn-beijing.aliyuncs.com/picture/weixin/nav-icon2.png',
    navicon3: 'https://lebao.oss-cn-beijing.aliyuncs.com/picture/weixin/nav-icon3.png',
    navicon4: 'https://lebao.oss-cn-beijing.aliyuncs.com/picture/weixin/nav-icon4.png',
    //行政区域选择
    area: [],
    provinces: [],
    cities: [],
    countries: [],
    provinceIndex: '',
    cityIndex: '',
    multiIndex: [],
    param: '',
    //位置信息
    hasLocation: true,
    longitude: '',
    latitude: '',
    city:''
  },
  inputSelect: function (e) {
    this.setData({
      inputValue: e.detail.value
    })
  },
  clearSelect: function () {
    this.setData({
      inputValue: ''
    })
    this.search()
  },
  search: function () {
    this.setData({
      courseList: []
    })
    let param = {
      name: this.data.inputValue,
      page: this.data.searchPageNum,    // 页数
      limit: this.data.callbackcount,    // 每页容量
    }
    this.getList(param)
  },
  //获取类目信息和核心展示信息
  getCategory: function(data) {
    let navbarList = [],item = {}
    item['type'] =-1
    item['name'] = '全部'
    navbarList.push(item)
    for (var i = 0, len = data.length; i < len; i++) {
      item = {}
      item['type'] = data[i]['id']
      item['name'] = data[i]['name']
      navbarList.push(item)

    }
    this.setData({
      navbarList: navbarList,
    })
    console.log('navbar', navbarList)
/*    //请求获取第一组数据展示
    getlist.getList(getUrl, currentType, 1, this, 'schoolList')
    for (var i = 0, len = data.length-1 ; i < len; i++) {
      item = {}
      item['name'] = data[i]['name']
      item['type'] = data[i]['id']
      navbarList.push(item)
    }
    this.setData({
      navbarList: navbarList,
      currentType: currentType
    })*/
  },
  getList: function (param) {
    //根据类目id获取课程
    app.wxRequest(getUrl, param, 'get').then(res => {
      console.log(res)
      if (res.data.errno == 0) {
        var navText = ''
        if (param['types']) {
          for (var i = 0; i < this.data.navbarList.length; i++) {
            if (param['types'] == this.data.navbarList[i].type) {
              navText = this.data.navbarList[i].name
              break
            }
          }
        } else {
          navText = '全部分类'
        }
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
          let schoolList = []
          //如果isFromSearch是true从data中取出数据，否则先从原来的数据继续添加  
          this.data.isFromSearch ? schoolList = res.data.data.items : schoolList = this.data.schoolList.concat(res.data.data.items)
          for (var i = 0; i < schoolList.length; i++){
            if (typeof (schoolList[i].logoUrl) == 'undefined') {
              schoolList[i].logoUrl = 'http://www.lebao108.com/images/school/indoor_picture/28_1.jpg' //默认图
            } else {
              schoolList[i].logoUrl = util.jointUrl(schoolList[i].logoUrl)
            }
            for (var j = 0; j < this.data.navbarList.length; j++) {
              if (schoolList[i].type == this.data.navbarList[j].type) {
                schoolList[i].type = this.data.navbarList[j].name
                break
              }
            }
          }
          
          
         console.log(schoolList)
          if (this.data.pageNum == 1) {
            this.setData({
              schoolList: schoolList,
              navText: navText,
              searchLoadingComplete: false, //把“没有数据”设为true，显示  
              searchLoading: false  //把"上拉加载"的变量设为false，隐藏  
            });
          } else {
            this.setData({
              schoolList: schoolList,
              navText: navText,
              searchLoading: true   //把"上拉加载"的变量设为true，显示  
            })
          }
        } else {
          this.setData({
            navText: navText,
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
      console.log("searchPageNum:" + that.data.searchPageNum)
      let param = {}
      if (that.data.type == -1) {
        param = {
          page: that.data.searchPageNum,    // 页数
          limit: that.data.callbackcount,    // 每页容量
        }
      } else {
        param = {
          types: that.data.type,
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
  selectCategory:function(){
    if(this.data.maskShow==false){
      this.setData({
        maskShow: true
      })
    }else{
      this.setData({
        maskShow: false
      })
    }
    
  },
  clearMask:function(){
    this.setData({
      maskShow: false
    })
  },
  mytouchstart: function (e) {
    var type = e.currentTarget.dataset.type
    this.setData({
      touchId: type,
      touch: true
    })
  },
  mylongtap: function (e) {
    var type = e.currentTarget.dataset.type
    this.setData({
      touchId: type,
      touch: true
    })
  },
  mytouchend: function (e) {
    var type = e.currentTarget.dataset.type
    this.setData({
      touchId: type,
      touch: false
    })
  },
  //点击切换teb页
  switchNav: function (e) {
    console.log(e)
      var type = e.currentTarget.dataset.type
      this.setData({
        type: type,
        hasSelect1: true,
        hasSelect2: false,
        hasSelect3: false,
        maskShow:false,
        searchPageNum: 1,   //第一次加载，设置1  
        schoolList: [],  //放置返回数据的数组,设为空  
        isFromSearch: true,  //第一次加载，设置true  
        searchLoading: true,  //把"上拉加载"的变量设为true，显示  
        searchLoadingComplete: false //把“没有数据”设为false，隐藏
      })
    let param = {}
    if (type == -1){
      param ={
        page: this.data.searchPageNum,    // 页数
        limit: this.data.callbackcount,    // 每页容量
      }
      
    }else{
      param = {
        types:type,
        page: this.data.searchPageNum,    // 页数
        limit: this.data.callbackcount,    // 每页容量
      }
    }
    this.getList(param)
    console.log(param)
  },
  inputSelect: function (e) {
    this.setData({
      inputValue: e.detail.value
    })
  },
  clearSelect: function () {
    this.setData({
      inputValue: ''
    })
    this.search()
  },
  search: function () {
    this.setData({
      hasSelect1: false,
      hasSelect2: false,
      hasSelect3: false,
      schoolList: []
    })
    let param = {
      name: this.data.inputValue,
      page: this.data.searchPageNum,    // 页数
      limit: this.data.callbackcount,    // 每页容量
    }
    this.getList(param)
  },
  sortByTime:function(){
    this.setData({
      hasSelect1: false,
      hasSelect2: false,
      hasSelect3: true,
      searchPageNum: 1,   //第一次加载，设置1  
      schoolList: [],  //放置返回数据的数组,设为空  
      isFromSearch: true,  //第一次加载，设置true  
      searchLoading: true,  //把"上拉加载"的变量设为true，显示  
      searchLoadingComplete: false //把“没有数据”设为false，隐藏
    })
    let param = {
      sort: 'update_time',
      page: this.data.searchPageNum,    // 页数
      limit: this.data.callbackcount,    // 每页容量
    }
    this.getList(param)
  },
  goToDetail: function (e) {
    const that = this
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: 'details/details?id=' + id,
    })
  },
  initArea: function () {
    var provinces = [], cities = [], countries = []
    for (var i = 0, len = data.area.length; i < len; i++) {
      provinces.push(data.area[i].name)
    }
    for (var i = 0, len = data.area[0].son.length; i < len; i++) {
      cities.push(data.area[0].son[i].name)
    }
    for (var i = 0, len = data.area[0].son[0].son.length; i < len; i++) {
      countries.push(data.area[0].son[0].son[i].name)
    }
    this.setData({
      area: [provinces, cities, countries],
      provinces: provinces,
      cities: cities,
      countries: countries
      /*multiIndex:[0,0,0]*/
    })
  },

  bindMultiPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      multiIndex: e.detail.value,
      schoolList:[],
      hasSelect1: false,
      hasSelect2: true,
      hasSelect3: false,
    })
    var prov = data.area[e.detail.value[0]].id
    var city = data.area[e.detail.value[0]].son[e.detail.value[1]].id
    var dist = data.area[e.detail.value[0]].son[e.detail.value[1]].son[e.detail.value[2]].id
    this.data.param = {
      prov: prov,
      city: city,
      dist: dist,
    }
    this.getList(this.data.param)
  },
  bindMultiPickerColumnChange: function (e) {

    console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
    switch (e.detail.column) {
      case 0:
        var cities = [], countries = []
        for (var i = 0, len = data.area[e.detail.value].son.length; i < len; i++) {
          cities.push(data.area[e.detail.value].son[i].name)
        }
        for (var i = 0, len = data.area[e.detail.value].son[0].son.length; i < len; i++) {
          countries.push(data.area[e.detail.value].son[0].son[i].name)
        }

        this.setData({
          area: [this.data.provinces, cities, countries],
          cities: cities,
          countries: countries,
          provinceIndex: e.detail.value,
          multiIndex: [e.detail.value, 0, 0]
        })
        break;
      case 1:
        var countries = [], provinceIndex = ''
        if (this.data.provinceIndex) {
          provinceIndex = this.data.provinceIndex
        } else {
          provinceIndex = 0
        }
        for (var i = 0, len = data.area[provinceIndex].son[e.detail.value].son.length; i < len; i++) {
          countries.push(data.area[provinceIndex].son[e.detail.value].son[i].name)
        }

        this.setData({
          area: [this.data.provinces, this.data.cities, countries],
          cityIndex: e.detail.value,
          countries: countries,
          multiIndex: [provinceIndex, e.detail.value, 0]
        })
        break;
      case 2:
        var provinceIndex = '', cityIndex = ''
        if (this.data.provinceIndex) {
          provinceIndex = this.data.provinceIndex
        } else {
          provinceIndex = 0
        }
        if (this.data.cityIndex) {
          cityIndex = this.data.cityIndex
        } else {
          cityIndex = 0
        }
        this.setData({
          area: [this.data.provinces, this.data.cities, this.data.countries],
          multiIndex: [provinceIndex, cityIndex, e.detail.value]
        })
        break;
    }
  },
  getUserLocation: function () {
    let vm = this;
    wx.getSetting({
      success: (res) => {
        console.log(JSON.stringify(res))
        // res.authSetting['scope.userLocation'] == undefined    表示 初始化进入该页面
        // res.authSetting['scope.userLocation'] == false    表示 非初始化进入该页面,且未授权
        // res.authSetting['scope.userLocation'] == true    表示 地理位置授权
        if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) {
          wx.showModal({
            title: '请求授权当前位置',
            content: '需要获取您的地理位置，请确认授权',
            success: function (res) {
              if (res.cancel) {
                wx.showToast({
                  title: '拒绝授权',
                  icon: 'none',
                  duration: 1000
                })
              } else if (res.confirm) {
                wx.openSetting({
                  success: function (dataAu) {
                    if (dataAu.authSetting["scope.userLocation"] == true) {
                      wx.showToast({
                        title: '授权成功',
                        icon: 'success',
                        duration: 1000
                      })
                      //再次授权，调用wx.getLocation的API
                      vm.getLocation();
                    } else {
                      wx.showToast({
                        title: '授权失败',
                        icon: 'none',
                        duration: 1000
                      })
                    }
                  }
                })
              }
            }
          })
        } else if (res.authSetting['scope.userLocation'] == undefined) {
          //调用wx.getLocation的API
          vm.getLocation();
        }
        else {
          //调用wx.getLocation的API
          vm.getLocation();
        }
      }
    })
  },
  getLocation: function () {
    var that = this
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        console.log(res)
        let longitude = res.longitude
        let latitude = res.latitude
        that.getLocal(latitude, longitude)
        that.setData({
          longitude: longitude,
          latitude: latitude,
          hasLocation: true
        })
        //that.getVoluntary(longitude, latitude)
      },
      fail: function (res) {
        that.reAuthorize()
      }
    })
  },

  // 获取当前地理位置
  getLocal: function (latitude, longitude) {
    let vm = this;
    qqmapsdk.reverseGeocoder({
      location: {
        latitude: latitude,
        longitude: longitude
      },
      success: function (res) {
        // console.log(JSON.stringify(res));
        let province = res.result.ad_info.province
        let city = res.result.ad_info.city
        console.log(city)
        vm.setData({
          //province: province,
          city: city,
          latitude: latitude,
          longitude: longitude
        })

      },
      fail: function (res) {
        console.log(res);
      },
      complete: function (res) {
        // console.log(res);
      }
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let param={},currentType = app.globalData.schoolType
    this.setData({
      schoolList: [],
      hasSelect1:false,
      hasSelect2:false,
      hasSelect3:false
    })
    if (currentType && currentType!==-1){
      param = {
        types: currentType,
        page: this.data.searchPageNum,    // 页数
        limit: this.data.callbackcount,    // 每页容量
      }
    }else{
      param = {
        page: this.data.searchPageNum,    // 页数
        limit: this.data.callbackcount,    // 每页容量
      }
    }
    
    //请求学校类目数据
    app.wxRequest(categoryUrl, {
      type: 1,
      limit: 20
    }, 'get').then(data => {
      const res = data.data
      if (res['errno'] == 0) {
        //请求成功，封装数据
        this.getCategory(res['data']['items'])
        this.getList(param)
      } else {
        util.errorTip(res.errmsg)
      }
    })
    this.initArea()
    // 实例化腾讯地图API核心类
    qqmapsdk = new QQMapWX({
      key: 'WGHBZ-JMNOF-IXEJS-JC7JV-LJ3TQ-YZB5Q' // 必填
    });
    this.getUserLocation()
    /*console.log(options)
    const that = this
    let contentHeight = 0
    if (app.globalData.isIphone5) {
      contentHeight = app.globalData.sysH - 104
    } else {
      contentHeight = app.globalData.sysH - 100
    }
    let currentType = app.globalData.schoolType
    that.setData({
      isIphone5: app.globalData.isIphone5,
      contentHeight: contentHeight,
      currentType: currentType
    })
    console.log('currentType', that.data.currentType)
   
    //请求广告
    app.wxRequest(exhibitionUrl, {
      position: 1,
      limit: 20
    }, 'get').then(data => {
      const res = data.data
      if (res['errno'] == 0) {
        //请求成功，封装数据
        this.getAd(res['data']['items'])
      } else {
        util.errorTip(res.errmsg)
      }
    })*/
  },
/*
  changeType: function(e) {
    const that = this
    const type = e.currentTarget.dataset.type
    that.setData({
      currentType: type,
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    app.globalData.schoolType = 0
  },
  /*search: function() {
    wx.navigateTo({
      url: '/pages/search/search?page=school',
    })
  },*/

  /*adDetails: function (e) {//广告跳转
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
  },*/
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    var self = this;
    setTimeout(() => {
      // 模拟请求数据，并渲染
      var arr = self.data.dataList,
        max = Math.max(...arr);
      for (var i = max + 1; i <= max + 3; ++i) {
        arr.unshift(i);
      }
      self.setData({
        dataList: arr
      });
      // 数据成功后，停止下拉刷新
      wx.stopPullDownRefresh();
    }, 1000);
  },
  onReachBottom: function() {
    var arr = this.data.dataList,
      max = Math.max(...arr);
    if (this.data.count < 3) {
      for (var i = max + 1; i <= max + 5; ++i) {
        arr.push(i);
      }
      this.setData({
        dataList: arr,
        count: ++this.data.count
      });
    } else {
      util.errorTip('没有更多数据了！')
    }
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },
  // 获取滚动条当前位置
  scroll: function (e) {
    console.log(e)
  },

  goTop: function (e) {  // 一键回到顶部
    let _top=this.data.scrollTop;
    if(_top==1){
      _top=0
    }else{
      _top=1
    }
    this.setData({
      scrollTop: _top
    });
  },
  goMiniprogram: function (e) {
    wx.navigateToMiniProgram({
      appId: 'wx0aeac8991ae4cd33',
      path: '',
      extraData: {
        openid: app.globalData.openid
      },
      envVersion: 'release',
      success(res) {
        console.log('打开成功')// 打开成功
      }
    })
  },
  swiperChange: function (e) {
    this.setData({
      currentTab: e.detail.current
    })
  },

  onShareAppMessage: function () {
    let that = this;
    return {
      title: '乐宝教育365', // 转发后 所显示的title
      path: '/pages/loading/loading'
    }
  }
})