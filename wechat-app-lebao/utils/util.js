const imageUrl = 'http://www.lebao108.com/images/'
const formatTime = (date, type) => { //date.replace(/\-/g, "")
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate() + 2
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return typeof(type) === 'undifined' ? [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':') : format(year, month, day, type)
}

const format = (year, month, day, type) => {
  switch (type) {
    case 1:
      return [year, month, day].map(formatNumber).join('')
    case 2:
      return [year, month, day].map(formatNumber).join('-')
    default:
      return [year, month, day].map(formatNumber).join('-')
  }
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
let addDateByDay = function(date, n) {
  date.setDate(date.getDate() + n)
  return date
}

let addDateByMonth = function(date, n) {
  date.setMonth(date.getMonth() + n)
  return date
}

/**
 * 系统错误提示
 */
function errorTip(content, duration) {
  let config = {
    title: content,
    icon: 'none',
    mask: true
  }
  let _duration = 2000
  if (duration) {
    _duration = duration
  }
  if (content.length <= 7) {
    config['image'] = '/images/warning.png'
  }
  wx.showToast(config)
}

function verifyLegal(data, isvalid, notNull, notValid) {
  if (data == "") {
    this.errorTip(notNull)
    return false;
  } else {
    if (isvalid != '') {
      this.errorTip(notValid)
      return false;
    } else {
      return true
    }
  }
}

function jointUrl(url) {
  if (url == null || url == '') {
    //默认图
    return 'http://www.lebao108.com/images/school/indoor_picture/28_1.jpg'
  }
  if (url.substring(0, 4) == 'http') {
    return url
  } else {
    return imageUrl + url
  }
}

function jointAvatar(url) {//用户头像
 if (typeof (url) == 'undefined' || url == '' || url.substring(0, 4) !== 'http') {
    //默认图
   return 'http://www.lebao108.com/images/weixin/user-pic.png'
  } else {
    return url
  }
}

function jointName(nickname,mobile) {//用户昵称
  if (typeof (nickname) == 'undefined' ||nickname == '') {
  return '用户' + mobile
  } else {
    return nickname 
  }
}

function convertTime(str){
  if (str !== "0" && str !== "" && str !== null) {
    return ((Math.floor(str / 60)).toString().length < 2 ? "0" + (Math.floor(str / 60)).toString() :
      (Math.floor(str / 60)).toString()) + ":" + ((str % 60).toString().length < 2 ? "0" + (str % 60).toString() : (str % 60).toString())
  }
  else {
    return ""
  }
}

function back() {
  wx.navigateBack({
    delta: 1,
  })
}


module.exports = {
  format:format,
  formatTime: formatTime,
  errorTip: errorTip,
  verifyLegal: verifyLegal,
  back: back,
  jointUrl: jointUrl,
  jointAvatar: jointAvatar,
  jointName:jointName,
  convertTime:convertTime,
  addDateByDay: addDateByDay,
  addDateByMonth: addDateByMonth
}