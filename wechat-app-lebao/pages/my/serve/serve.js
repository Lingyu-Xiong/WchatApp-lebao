// pages/my/serve/serve.js
const app = getApp()
const util = require('../../../utils/util.js')
const getVollistUrl = '/biz/trade/voluntary/near/list'
const signUrl = '/biz/trade/voluntary/record/sign'
var QQMapWX = require('../../../utils/qqmap-wx-jssdk.js');
var qqmapsdk;
Page({

  /**
   * 页面的初始数据
   */
  data: { 
    isIphone5: false,
    longitude:'',
    latitude: '',
    volList: [],
    inputschName:'',
    hasLocation:true,
    cansign:false
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
   var that=this 
    // 实例化腾讯地图API核心类
    qqmapsdk = new QQMapWX({
      key: 'WGHBZ-JMNOF-IXEJS-JC7JV-LJ3TQ-YZB5Q' // 必填
    });
   that.getschoolList()
    setTimeout(function () {
     that.getLocation()
    }, 100);
  },

  getLocation: function () {
    var that = this
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        console.log(res)
        let longitude = res.longitude
        let latitude = res.latitude
        that.setData({
          longitude: longitude,
          latitude: latitude,
          hasLocation:true
        })
        that.getVoluntary(longitude, latitude)
      },
      fail: function (res) {
        that.reAuthorize()
      }
    })
  },

  reAuthorize:function(){
    var that=this
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userLocation']) {
          that.setData({
            hasLocation: true
          })
        that.getLocation()
        }else{
          that.setData({
            hasLocation: false
          })
        }
      }
    }) 
  },

  callback: function (res) {
    console.log(res)
    console.log(res.detail.authSetting['scope.userLocation'])
    if (res.detail.authSetting['scope.userLocation']) {
      this.setData({
        hasLocation: true
      })
    }
  },

  getschoolList:function(){
    app.wxRequest(getVollistUrl, {
      limit: 50,
    }, 'get').then(res => {
      console.log(res.data)
      if (res.data.errno === 0) {
        let volList = res.data.data.items
        let item
        let vollist = []
        for (var i = 0; i < volList.length; i++) {
          item = {}
          item.schoolName = volList[i].schoolName
          item.clockAddress = volList[i].clockAddress
          item.id = volList[i].id
          item.schoolId = volList[i].schoolId
          vollist.push(item)
        }
        this.setData({
          volList: vollist,
          cansign:false
        })
      } else {
        util.errorTip(res.data.errmsg)
      }
    })
  },
  getVoluntary:function(curLng,curLat){
    wx.showLoading({
      title: '加载中',
    })
    app.wxRequest(getVollistUrl,{
      curLng: curLng,
      curLat: curLat,
      schName:this.data.inputschName,
      limit: 50,
      sort:'distance',
      order: 'desc',
    }, 'get').then(res => {
      console.log(res.data)
      if (res.data.errno === 0) {
        let volList = res.data.data.items
        let item
        let vollist=[]
        for(var i=0;i<volList.length;i++){
          item={}
          item.distance=parseInt(volList[i].distance)
          item.schoolName = volList[i].schoolName
          item.clockAddress = volList[i].clockAddress
          item.id = volList[i].id
          item.schoolId = volList[i].schoolId
          item.longitude = volList[i].longitude
          item.latitude = volList[i].latitude
          vollist.push(item)
        }       
            this.setData({
              volList:vollist,
              cansign:true
            })
        wx.hideLoading()
      } else {
        wx.hideLoading()
        util.errorTip(res.data.errmsg)
        console.log(res.data.errmsg)
      }
    })
  },
  sign:function(e){
    var that=this
    let signid=e.currentTarget.dataset.id
    let volList=that.data.volList
    let volitem
    for(var i=0;i<volList.length;i++){
      if(signid==volList[i].id){
        volitem=volList[i]
        console.log(volList[i])
      }
    }
    let cansign=that.data.cansign
    if(!cansign){
      util.errorTip('定位中，请稍后再试')
    }else{
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        console.log(res)
        that.setData({
            longitude: res.longitude,
            latitude: res.latitude
        })
      }
    })
    app.wxRequest(signUrl, {
      voluntary:signid,
      school: volitem.schoolId, 
      schName: volitem.schoolName,
      curLongitude: that.data.longitude,
      curLatitude: that.data.latitude, 
      schLongitude: volitem.longitude,  
      schLatitude: volitem.latitude  
    }).then(res => {
      console.log(res.data)
      if (res.data.errno === 0) {
        let msg, integral
        if(res.data.data.status===0){
          integral=res.data.data.integral
          msg='打卡成功，您将获得'+integral+'个宝宝币'
        }else{
          msg='打卡成功，暂无宝宝币'
        }
        wx.showModal({
          title: '提示',
          content: msg,
          showCancel:false,
          success(res) {
            if (res.confirm) {
              wx.navigateTo({
                url: 'volrec/volrec',
              })
            }
          }
        })

      } else if (res.data.errno === 401){
        util.errorTip('请授权位置信息或打开定位')
      }else {
        util.errorTip(res.data.errmsg)
        console.log(res.data.errmsg)
      }
    })
    }
  },
  
  inputSelect: function (e) {
    this.setData({
      inputschName: e.detail.value
    })
    
  },
  clearSelect: function () {
    this.setData({
      inputschName: ''
    })
    this.search()
  },
  search: function (e) {
    this.getVoluntary(this.data.longitude, this.data.latitude)
  },
  volRec: function () {
    wx.navigateTo({
      url: 'volrec/volrec',
    })
  },
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading() //在标题栏中显示加载
    this.onLoad()
    setTimeout(function () {
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    }, 1000);
  },
  back: util.back,
  onShareAppMessage: function () {
    let that = this;
    return {
      title: '乐宝教育365', // 转发后 所显示的title
      path: '/pages/loading/loading'
    }
  }
})