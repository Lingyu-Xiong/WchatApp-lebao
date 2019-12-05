// pages/confirmOrder/addstudent/addstudentdetail/addstudentdetail.js
const app = getApp()
const util = require('../../../../utils/util.js')
const addUrl = '/base/user/favorStu/add'
const schList = '/mall/admin/pub/school/list'
const data = require("../../../../utils/area.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    courseinfo: '',
    isIphone5: false,
    name:'',
    grade:'',
    birthday:'',
    gender:'',
    relation:'',
    relationindex:'',
    schoolid: '',
    schindex: '',
    mobile:'',
    sex:[{name:'男',value:1},{name:'女',value:0}],
    array: ['父亲', '母亲', '爷爷', '奶奶', '外公', '外婆', '姐姐', '哥哥', '本人', '同学'],
    schList: [],
    //行政区域选择
    area: [],
    provinces: [],
    cities: [],
    countries: [],
    provinceIndex: '',
    cityIndex: '',
    multiIndex: [],
    param: ''
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let courseinfo = JSON.parse(options.courseinfoStr)
    this.setData({
      courseinfo: courseinfo,
      isIphone5: app.globalData.isIphone5
    })
    this.initArea()
    /*app.wxRequest(schList, {}, 'get').then(res => {
      console.log(res.data)
      if (res.data.errno == 0) {
        //请求成功
        let schlist = res.data.data.items
        let schoolList = []
        for (var i = 0; i < schlist.length; i++) {
          let item = {}
          item.id = schlist[i].id
          item.name = schlist[i].name
          schoolList.push(item)
        }
        console.log(schoolList)
        this.setData({
          schList: schoolList
        })

      } else {
        util.errorTip(res.errmsg)
      }
    })*/
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
  getname:function(e){
    this.setData({
      name:e.detail.value
    })
  },
  getgrade: function (e) {
    this.setData({
      grade: e.detail.value
    })
  },
  getmobile:function(e){
    this.setData({
      mobile: e.detail.value
    })
  },
  bindDateChange(e) {
    this.setData({
      birthday: e.detail.value
    })
  },
  bindrelaChange(e){
    this.setData({
      relation: this.data.array[e.detail.value],
      relationindex:e.detail.value
    })
  },
  bindschChange(e) {

    if (this.data.schList.length != 0) {
      var schoolid = this.data.schList[e.detail.value].id
      this.setData({
        schindex: e.detail.value,
        schoolid: schoolid
      })
      console.log(this.data.schoolid)
    }
  },
  radioChange(e) {
    this.setData({
      gender: e.detail.value
    })
    console.log(this.data.gender)
  },
adddetailcon:function(){
  if(!this.data.name){
    util.errorTip('请输入姓名')
    return
  }
  if (!this.data.gender) {
    util.errorTip('请选择性别')
    return
  }
  if (!this.data.schoolid) {
    util.errorTip('请选择学校')
    return
  }
  if (!this.data.grade) {
    util.errorTip('请输入年级')
    return
  }
  if (!this.data.birthday) {
    util.errorTip('请输入生日')
    return
  }
  if (!this.data.relationindex) {
    util.errorTip('请选择关系')
    return
  }
  if (!this.data.mobile) {
    util.errorTip('请输入手机')
    return
  }
  if (!/^((13[0-9])|(14[5,7,9])|(15[^4])|(16[6])|(17[0,1,2,3,5,6,7,8])|(18[0-9])|(19[8,9]))\d{8}$/.test(this.data.mobile)){
    util.errorTip('请输入正确的号码')
    return
  }
  app.wxRequest(addUrl, {//添加学生
    name: this.data.name,
    gender:parseInt(this.data.gender),
    schoolId: parseInt(this.data.schoolid),
    grade: parseInt(this.data.grade),
    birthday:this.data.birthday,
    relation: parseInt(this.data.relationindex),
    mobile:this.data.mobile
  }, ).then(res => {
    console.log(res.data)
    if (res.data.errno == 0) {
      //请求成功
      wx.showToast({
        title: '添加成功！',
        icon: 'success'
      })
    } else {
      util.errorTip(res.errmsg)
    }
  })
  let courseinfo = this.data.courseinfo
  let courseinfoStr = JSON.stringify(courseinfo)
  wx.redirectTo({
    url: '/pages/confirmOrder/addstudent/addstudent?courseinfoStr=' + courseinfoStr
  })
},
  getSchools: function (url) {
    this.setData({
      schList: []
    })
    app.wxRequest(url, this.data.param, 'get').then(res => {
      console.log(res.data)
      if (res.data.errno == 0) {
        //请求成功

        let schlist = res.data.data.items
        if (schlist.length == 0) {

        } else {
          let schoolList = []
          for (var i = 0; i < schlist.length; i++) {
            let item = {}
            item.id = schlist[i].id
            item.name = schlist[i].name
            schoolList.push(item)
          }
          console.log(schoolList)
          this.setData({
            schList: schoolList
          })
        }


      } else {
        util.errorTip(res.errmsg)
      }
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
      multiIndex: e.detail.value
    })
    var prov = data.area[e.detail.value[0]].id
    var city = data.area[e.detail.value[0]].son[e.detail.value[1]].id
    var dist = data.area[e.detail.value[0]].son[e.detail.value[1]].son[e.detail.value[2]].id
    this.data.param = {
      prov: prov,
      city: city,
      dist: dist
    }
    this.getSchools(schList)
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
})