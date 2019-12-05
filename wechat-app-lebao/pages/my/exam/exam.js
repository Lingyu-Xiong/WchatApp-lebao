// pages/news/news.js
const app = getApp()
const util = require('../../../utils/util.js')
const getmyapplyUrl = '/biz/trade/exam/record/list/my'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isIphone5: false,
    myapplyList: [],
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    app.wxRequest(getmyapplyUrl, {
      limit: 20,
      sort: "update_time",
      order: "desc",
    }, 'get').then(res => {
      console.log(res.data)
      if (res.data.errno === 0) {
        let data = res.data.data.items
        let item = {}, myapplyList = []
        for (var i = 0; i < data.length; i++) {
          item = {}
          item.id = data[i].id
          item.examId=data[i].examId
          item.payPrice=data[i].payPrice
          item.examName = data[i].examName
          item.addTime = data[i].addTime
          item.status=data[i].status
          myapplyList.push(item)
        }
        this.setData({
          myapplyList: myapplyList
        })

      } else {
        util.errorTip('获取失败')
        console.log(res.data.errmsg)
      }
    })

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
payagain:function(e){
let id=e.currentTarget.dataset.id, 
    myapplyList=this.data.myapplyList,
    applyinfo={}
  console.log(id)
  for(var i=0;i<myapplyList.length;i++){
    if(id==myapplyList[i].id){
      applyinfo=myapplyList[i]
    }
  }
  let applyinfoStr = JSON.stringify(applyinfo)
  console.log(applyinfoStr)
  wx.showModal({
    title: '提示',
    content: '确定支付该订单？',
    success(res) {
      if (res.confirm) {
        wx.redirectTo({
          url: '/pages/examReg/pay/pay?applyinfoStr=' + applyinfoStr,
        })
      }
    }
  })
},
  examdetail:function(e){
  console.log(1)
  let id = e.currentTarget.dataset.id
  wx.navigateTo({
    url: '/pages/examReg/examinfo/examinfo?id=' + id,
  })
}
  
})