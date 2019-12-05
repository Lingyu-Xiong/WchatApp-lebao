const app = getApp()
const util = require('util.js')

function getList(url, types, page, that, listName, limit) {
  let _limit = 100
  if (typeof(limit) !== 'undefined') {
    _limit = limit
  }
  let param = {}
  param['page'] = page
  param['limit'] = _limit
  if (types != 0) {
    param['types'] = types
  } else {
    param['limit'] = 100
  }
  app.wxRequest(url, param, 'get').then(res => {
    if (res.statusCode == 200) {
      console.log('schoollist',res.data)
      if (res.data.errno == 0) {
        let data = {}
        let list = []
        let schoolList = res.data.data.items
        for (var i = 0; i < schoolList.length; i++) {
          data = {}
          data.name = schoolList[i].name
          data.id = schoolList[i].id
          if (typeof(schoolList[i].indoorPicUrl) == 'undefined') {
            data.src = 'http://www.lebao108.com/images/school/indoor_picture/28_1.jpg' //默认图
          } else {
            data.src = util.jointUrl(schoolList[i].indoorPicUrl)
          }
          data.logoUrl = util.jointUrl(schoolList[i].logoUrl)
          data.place = schoolList[i].address
          list.push(data)
        }
        that.setData({
          [listName]: list
        })
      } else {
        util.errorTip('获取失败')
        console.log(res.data.errmsg)
      }
    } else {
      util.errorTip('请求失败')
      console.log(res.errmsg)
    }
  })
}

function getGoodsList(url, types, page, that, listName, limit) {
  let _limit = 100
  if (typeof(limit) !== 'undefined') {
    _limit = limit
  }
  let param = {}
  if (types == 7) {
    param = {
      page: page,
      limit: _limit
    }
  } else {
    param = {
      types: types,
      page: page,
      limit: _limit
    }
  }
  app.wxRequest(url, param, 'get').then(res => {
    if (res.statusCode == 200) {
      console.log('goodslist', res.data)
      if (res.data.errno == 0) {
        let data = {}
        let list = []
        let schoolList = res.data.data.items
        let gallery
        for (var i = 0; i < schoolList.length; i++) {
          data = {}
          data.name = schoolList[i].name
          data.id = schoolList[i].id
          data.logoUrl = util.jointUrl(schoolList[i].logoUrl)
          list.push(data)
        }
        that.setData({
          [listName]: list
        })
      } else {
        util.errorTip('获取失败')
        console.log(res.data.errmsg)
      }
    } else {
      util.errorTip('请求失败')
      console.log(res.errmsg)
    }
  })
}
module.exports = {
  getList: getList,
  getGoodsList: getGoodsList
}