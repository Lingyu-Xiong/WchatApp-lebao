// pages/news/newsdetail/newsdetail.js
const app = getApp()
const util = require('../../../utils/util.js')
const getdetail = '/mall/admin/topic/read'
const readcountUrl ='/mall/admin/topic/visit/'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isIphone5: false,
    title:'',
    updateTime: '',
    content:'',
    readCount:'',
    nodata:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.setData({
      isIphone5: app.globalData.isIphone5,
    })
    let id = parseInt(options.id)
    app.wxRequest(getdetail , { id:id},'get').then(res => {
      console.log(res.data)
      if (res.data.errno === 0) {
        let data = res.data.data,
          title, updateTime, content,readCount
        if (typeof (data) == 'undefined'){
          this.setData({
            nodata:true
          })
        }else{
         content = data.content.toString().replace(/\<img/gi,'<img style="max-width:100%;height:auto;margin-bottom:0"')
         title=data.title
        updateTime = data.updateTime.substring(0,10)
          readCount = data.visitNum
        this.setData({
          title:title,
          updateTime:updateTime,
          content:content,
          readCount:readCount,
        })
        }
      } else {
        util.errorTip('获取失败')
        console.log(res.data.errmsg)
      }
    })

    this.readCount(id)

  },

 readCount:function(id){
   app.wxRequest(readcountUrl+id, {}, 'get').then(res => {
     console.log(res.data)
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