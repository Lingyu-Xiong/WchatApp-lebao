//app.js
const host = 'https://www.lebao108.cn'
const imageURL = 'https://www.lebao108.com/images/weixin'
const imageUrl = 'http://www.lebao108.cn/images/'
const imageurl ='https://lebao.oss-cn-beijing.aliyuncs.com/picture/weixin'
let session = ''
const util = require('/utils/util.js')
App({
  onLaunch: function() {
    //获取版本更新实例，判断是否有版本更新
    console.log('launch')
    const updateManager = wx.getUpdateManager()
    updateManager.onCheckForUpdate(function(res) {
      // 请求完新版本信息的回调
      if (res.hasUpdate) {
        //发现有新版本，清空所有缓存
        wx.clearStorage()
      }
    })

    //获取缓存信息
    const openid = wx.getStorageSync('openid') || ''

    if (openid != '') {
      //用户缓存的身份信息存在
      this.globalData.openid = openid
      this.getUserInfo()
      console.log('openid存在',this.globalData.openid)
      return
    }

    const that = this

    // 用户当前无身份信息，登陆获取
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        if (res.code) {
          //发起网络请求
          that.wxRequest('/base/user/auth/wxmini/openid', {
            code: res.code
          }, 'get').then(res => {
            console.log('无身份信息')
            if (res.statusCode == 200) {
              let data = JSON.parse(res.data.data)
              let openid = data.openid
              wx.setStorageSync('openid', openid)
              that.globalData.openid = openid
              that.getUserInfo()
              that.getMyInfo()
            } else {
              util.errorTip(res.msg)
              setTimeout(() => {
                wx.reLaunch({
                  url: '/pages/loading/loading'
                })
              }, 3000)
            }
          })
        } else {
          util.errorTip('登陆小程序失败！')
          setTimeout(() => {
            wx.reLaunch({
              url: 'login'
            })
          }, 3000)
        }
      }
    })
  },

  getMyInfo: function() {
    const that = this
    this.wxRequest('/base/user/account/info/my', {}, 'get', true)
      .then(data => {
        that.globalData.myInfo = data.data
      })
  },

  //获取并同步用户信息
  getUserInfo: function() {
    // 获取用户信息
    wx.openSetting({
      success: res => {
        if (res) {
          if (res.authSetting['scope.userInfo']) {
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
            wx.getUserInfo({
              success: res => {
                // 可以将 res 发送给后台解码出 unionId
                this.globalData.userInfo = res.userInfo
                console.log('this.globalData.userInfo', this.globalData.userInfo)
                //异步请求同步用户信息
                this._perfectUserInfo()
                // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                // 所以此处加入 callback 以防止这种情况
                if (this.userInfoReadyCallback) {
                  this.userInfoReadyCallback(res)
                }
              }
            })
          }
        }

      }
    })
  },
  
  globalData: {
    host: host,
    openid:'',
    imageURL: imageURL,
    imageUrl: imageUrl,
    imageurl:imageurl,
    session: session,
    myInfo: null,
    requestTime: {},
    userInfo: null,
    isIphoneX: false,
    isIphone5: false,
    sysH: 1080, //系统屏幕高度
    sysW: 720, //系统屏幕宽度,
    schoolType: 0,
    storeType: 0,
    schoolType:0,
    value:0
  },
  //全局请求通用处理类
  wxRequest: function(url, params, method, removeLoading, allowRepeat) {
    let _method = 'post'
    if (typeof(method) !== 'undefined') {
      _method = method
    }

    let _removeLoading = true
    if (typeof(removeLoading) !== 'undefined') {
      _removeLoading = removeLoading
    }

    //防止重复提交，相同请求间隔时间不能小于1000毫秒
    if (typeof(allowRepeat) !== 'undefined' && !allowRepeat) {
      const nowTime = new Date().getTime();
      if (this.globalData.requestTime[url] && (nowTime - this.globalData.requestTime[url]) < 1000) {
        return
      }
      this.globalData.requestTime[url] = nowTime
    }

    return new Promise((resolve, reject) => {
      //loading是否展示
      let loadingStatus = 1
      /* 
       * 定时器在500毫秒后执行时，会判断loadingStatus状态，
       * 如果loadingStatus还是初始值1（没有被改变过），就显示loading提示。
       * 如果loadingStatus不是1，说明网络请求已返回（此时loadingStatus的值应该是0）。
       */
      if (!_removeLoading) {
        setTimeout(() => {
          if (loadingStatus === 1) {
            wx.showLoading({
              title: '加载中...',
              mask: true
            })
          }
        }, 500)
      }
      wx.request({
        url: host + url,
        data: params,
        method: _method,
        header: {
          'content-type': 'application/json',
          'Accept': 'application/json',
          'X-Litemall-Admin-Token': this.globalData.session
        },
        dataType: 'json',
        success: res => {
          if (res.statusCode === 200) {
            if (res.data.errorno == 501) {
              this.wxRequest('/base/user/auth/login/openid/wxmini', {
                openid: this.globalData.openid
              }, 'get').then(data => {
                if (data.statusCode == 200) {
                  if (data.data.errno == 0) {
                    let session = data.data.data
                    wx.setStorageSync('session', session)
                    this.globalData.session = session
                    //登陆成功，获取身份信息
                    this.getMyInfo()
                  } else if (data.data.errno == '605') {
                    wx.redirectTo({
                      url: '/pages/login/register/register',
                    })
                  }
                } else {
                  util.errorTip('请求失败')
                }
              })
            } else {
              resolve(res)
            }
          } else {
            util.errorTip('请求出错：' + res.statusCode)
            reject(res.statusCode)
          }
        },
        error: error => {
          reject(error)
        },
        complete: () => {
          // 请求完成，关掉loading，改变loadingSataus的值
          wx.hideLoading()
          loadingStatus = 0
        }
      });
    }).catch(msg => {
      console.error(msg)
    })
  },
  //全局上传文件通用处理类
  wxUploadFile: function (url, filePath, name, formData,removeLoading, allowRepeat) {
    let _removeLoading = true
    if (typeof (removeLoading) !== 'undefined') {
      _removeLoading = removeLoading
    }

    //防止重复提交，相同请求间隔时间不能小于1000毫秒
    if (typeof (allowRepeat) !== 'undefined' && !allowRepeat) {
      const nowTime = new Date().getTime();
      if (this.globalData.requestTime[url] && (nowTime - this.globalData.requestTime[url]) < 1000) {
        return
      }
      this.globalData.requestTime[url] = nowTime
    }

    return new Promise((resolve, reject) => {
      //loading是否展示
      let loadingStatus = 1
      /* 
       * 定时器在500毫秒后执行时，会判断loadingStatus状态，
       * 如果loadingStatus还是初始值1（没有被改变过），就显示loading提示。
       * 如果loadingStatus不是1，说明网络请求已返回（此时loadingStatus的值应该是0）。
       */
      if (!_removeLoading) {
        setTimeout(() => {
          if (loadingStatus === 1) {
            wx.showLoading({
              title: '加载中...',
              mask: true
            })
          }
        }, 500)
      }
      wx.uploadFile({
        url: host+url,
        filePath: filePath,
        name: name,
        formData: formData,
        header: {
          'content-type': 'multipart/form-data',
          'X-Litemall-Admin-Token': this.globalData.session
        },
        success: res => {
          if (res.statusCode === 200) {
              resolve(res)
          } else {
            util.errorTip('请求出错：' + res.statusCode)
            reject(res.statusCode)
          }
        },
        error: error => {
          reject(error)
        },
        complete: () => {
          // 请求完成，关掉loading，改变loadingSataus的值
          wx.hideLoading()
          loadingStatus = 0
        }
      });
    }).catch(msg => {
      console.error(msg)
    })
  },
  onShow: function(options) {
    console.log(options)
    const systemInfo = wx.getSystemInfoSync()
    if (systemInfo.model.search('iPhone X') != -1) {
      this.globalData.isIphoneX = true
    } else if (systemInfo.model.search('iPhone 5') != -1) {
      this.globalData.isIphone5 = true
    }
    this.globalData.sysH = systemInfo.windowHeight
    this.globalData.sysW = systemInfo.windowWidth
   
     
  }
  
  
})