// pages/my/volunteer/volunteer.js
const app = getApp()
const util = require('../../../utils/util.js')
const imgURL = '../../images/my'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgURL: imgURL,
    username: '用户名akl',
    account: '12345678',
    balance: 100.00,
    integral: 100,
    isIphone5: false,
    checked:0,
  },
  getSchool:function(data){

  },
checkIn:function(){
  wx.getLocation({
    type:'wgs84',
    success:function(res){
      var curLat=res.latitude;
      var curLng=res.longitude;
      let data={
        'curLat':curLat,
        'curLng':curLng,
      };
      console.log(data);
      app.wxRequest('/biz/trade/voluntary/near/list',data,'get').then(res=>{
        if (res.data.errno == 0) {
          res.data.items;
          this.data.checked=1;
        } else {
          util.errorTip('获取地址失败')
          console.log(res.data.errmsg)
        }
      })
    }
  })
}
})