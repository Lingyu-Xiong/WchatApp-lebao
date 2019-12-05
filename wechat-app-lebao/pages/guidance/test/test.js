const app = getApp()
const util = require('../../../utils/util.js')
const host = app.globalData.host
const imgURL = app.globalData.imageurl
const questionUrl = '/biz/trade/guidance/list'
const uploadUrl = '/res/file/oss/video/user'
const uploaddescUrl='/biz/trade/guidance/makeTest'
const tipsUrl ='/biz/trade/guidance/tips/list'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addimgUrl: imgURL +'/image_upload_pic.png',
    addvideoUrl: imgURL +'/image_upload_video.png',
    categoryId:'',
    selectcon:'',
    piccon:'',
    videocon:'',
    questionList: [],
    itemlist: [{ id: 1, name: '答题' }, { id: 2, name: '图片' }, { id: 3, name: '视频' }],
    currentTab: 0,
    questionList: [],
    fillblankList: [],
    ansid: '',
    answerList: [],
    blankanswerList:[],
    total:'',
    videotempPath:'',
    videoPath:[],
    imgtempArr:[],
    imgPath:[],
    chooseViewShow: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      categoryId:options.id
    })
    this.getquestion(options.id)
    this.gettips(options.id)
  },
  //富文本提示
  gettips:function(id){
    app.wxRequest(tipsUrl, {
      categoryId: id
    }, 'get').then(res => {
      console.log(res.data)
      if (res.data.errno == 0) {
        let data = res.data.data.items,
        selectcon='',piccon='',videocon=''
        for(var i=0;i<data.length;i++){
          switch (data[i].step) {
            case 1:
              selectcon=data[i].description;
            case 2:
              piccon=data[i].description;
            case 3:
              videocon=data[i].description;
       }
        }
        this.setData({
         selectcon:selectcon,
         piccon:piccon,
         videocon:videocon
        })
        
      } else {
        util.errorTip(res.errmsg)
      }
    })
  },
  //题目
  getquestion: function (id) {
    wx.showLoading({
      title: '加载中',
    })
    app.wxRequest(questionUrl, {
      categoryId: id
    }, 'get').then(res => {
      console.log(res.data)
      if (res.data.errno == 0) {
        let data = res.data.data.items
        let total = res.data.data.total
        let questionList = [],fillblankList=[],
          item = {}
        for (var i = 0; i < data.length; i++) {
          item = {}
          if(data[i].type==0){
            item.questionItems = data[i].questionItems
            item.content = data[i].content
            item.id = data[i].id
            questionList.push(item)
          }else{
            item.content = data[i].content
            item.id = data[i].id
            fillblankList.push(item)
          }
         
        }
        this.setData({
          questionList: questionList,
          fillblankList:fillblankList,
          total:total
        })
        wx.hideLoading()
      } else {
        wx.hideLoading()
        util.errorTip(res.errmsg)
      }
    })
  },
  //点击切换tab页
  switchNav: function (e) {
    let current = e.currentTarget.dataset.current
    if (this.data.currentTab !== current) {
      this.setData({
        currentTab: parseInt(e.currentTarget.dataset.current),
      })
    }
  },

  //选择题
  select(e) {
    console.log(e)
    var chosenItemId = e.currentTarget.dataset.ansid//选项id
    var id = e.currentTarget.dataset.quesid//题目id
    var index = e.currentTarget.dataset.index//题目序号
    var item = {
      questionId: id,
      chosenItemId: chosenItemId,
      type:0
    }
    if (this.data.answerList.length == index) {
      //该题答案未写入 
      this.data.answerList.push(item)
      this.data.questionList[index].curId = e.currentTarget.dataset.ansid
      this.setData({
        questionList: this.data.questionList,
      })

    } else if (this.data.answerList.length > index) {
      //修改答案
      this.data.answerList[index].chosenItemId = chosenItemId
      this.data.questionList[index].curId = e.currentTarget.dataset.ansid
      this.setData({
        questionList: this.data.questionList,
      })
    } else {
      wx.showToast({
        title: '请先完成前面的题目!',
        icon: 'none',
        duration: 2000
      })
    }
    console.log(this.data.answerList)
  },
//填空题
  textinput: function (e) {
    let id=e.currentTarget.dataset.id
    let blankanswerList = this.data.blankanswerList
    for (var i = 0; i < blankanswerList.length; i++) {
      if ( blankanswerList[i].questionId==id) {
        blankanswerList.splice(i, 1)
      }
    }
    let text = {
      questionId: id,
      answerText: e.detail.value,
      type: 1
    }
    blankanswerList.push(text)
    this.setData({
      blankanswerList: blankanswerList
    })
console.log(this.data.blankanswerList)
  },

  //本地上传图片
  chooseimg: function () {
    var that = this
    wx.chooseImage({
      count: 9,
      sizeType: ['original', 'compressed'],
      sourceType: ['album'],
      success(res) {
        console.log(res)
        if (res.tempFilePaths.count == 0) {
          return;
        }
        //上传图片
        var imgArrNow = that.data.imgtempArr;
        imgArrNow = imgArrNow.concat(res.tempFilePaths);
        that.setData({
          imgtempArr: imgArrNow
        })
        that.chooseViewShow();
      }
    })
  },
 //删除图片
  deleteImv: function (e) {
    var imgtempArr = this.data.imgtempArr;
    var itemIndex = e.currentTarget.dataset.id;
    imgtempArr.splice(itemIndex, 1);
    this.setData({
      imgtempArr: imgtempArr
    })
    //判断是否隐藏选择图片
    this.chooseViewShow();
  },
  /** 是否隐藏图片选择 */
  chooseViewShow: function () {
    if (this.data.imgtempArr.length >= 9) {
      this.setData({
        chooseViewShow: false
      })
    } else {
      this.setData({
        chooseViewShow: true
      })
    }
  },

  /** 显示图片 */
  showImage: function (e) {
    var imgtempArr = this.data.imgtempArr;
    var itemIndex = e.currentTarget.dataset.id;
    wx.previewImage({
      current: imgtempArr[itemIndex], // 当前显示图片的http链接
      urls: imgtempArr // 需要预览的图片http链接列表
    })
  },

//本地上传视频
  choosevideo: function () {
    var that=this
    wx.chooseVideo({
      sourceType: ['album'],
      success(res) {
        console.log(res)
        let tempDuration = res.duration;
        let tempHeight = res.height;
        let tempWidth = res.width;
        let tempSize = res.size;
        let tempFilePath = res.tempFilePath;
        let thumbTempFilePath = res.thumbTempFilePath;
        if (res.duration > 300) {
          wx.showToast({
            title: '视频长度不能超过5分钟',
            icon: "none",
            duration: 2000
          })
        } else {
          that.setData({
            videotempPath: tempFilePath,
          })
        }
      }
    })
  },
  videodel:function(){
    this.setData({
      videotempPath: '',
    })
  },

  quesNext:function(){
    this.setData({
      currentTab:1
    })
  },
  picNext:function(){
    this.setData({
      currentTab: 2
    })
  },
  upload:function(){
    var that=this
    let answerList= that.data.answerList,
      picUrls = that.data.imgtempArr,
      videoUrls = that.data.videotempPath
      console.log(answerList,picUrls,videoUrls)
    if (answerList.length==0) {
      wx.showModal({
        title: '提示',
        content: '请先完成客观题',
        showCancel: false,
        confirmColor: '#25aab1',
        success(res) {
          if (res.confirm) {
          }
        }
      })
      return
    }
    if (picUrls.length==0) {
      wx.showModal({
        title: '提示',
        content: '请先上传图片',
        showCancel: false,
        confirmColor: '#25aab1',
        success(res) {
          if (res.confirm) {
          }
        }
      })
      return
    }
    if (videoUrls.length==0) {
      wx.showModal({
        title: '提示',
        content: '请先上传视频',
        showCancel: false,
        confirmColor: '#25aab1',
        success(res) {
          if (res.confirm) {
          }
        }
      })
      return
    }
    setTimeout(function () {
      wx.showLoading({
        title: '上传中...',
      })
      that.uploadimg() 
    }, 50);   
  },

  uploadimg: function () {
    let imgtempArr = this.data.imgtempArr,
      urlList = []
    for (var i = 0; i < imgtempArr.length; i++) {
      app.wxUploadFile(uploadUrl, imgtempArr[i], 'file', {}).then(res => {
        console.log(res)
        let data = JSON.parse(res.data)
        if (data.errno === 0) {
          let url = data.data[0]
          urlList.push(url)
        }else{
          util.errorTip('上传失败')
        }
      })
    }
    this.uploadvideo()
    this.setData({
      imgPath: urlList
    })
    console.log('imgPath',this.data.imgPath)
  },

  uploadvideo:function(){
    let videotempPath = this.data.videotempPath
    app.wxUploadFile(uploadUrl, videotempPath, 'file', {}).then(res => {
      console.log(res)
      let data = JSON.parse(res.data)
      if (data.errno === 0) {
        let url = data.data
        this.setData({
          videoPath: url
        })
        console.log('videoPath', this.data.videoPath)
        this.uploadDesc()
      } else {
        util.errorTip('上传失败')
      }
    })
  },

  uploadDesc:function(){
    let chosenQuestionAndItems = this.data.answerList.concat(this.data.blankanswerList),
      picUrls = this.data.imgPath,
      videoUrls = this.data.videoPath,
      categoryId = this.data.categoryId  
    app.wxRequest(uploaddescUrl, {
      picUrls:picUrls,
      videoUrls:videoUrls,
      categoryId:categoryId,
      chosenQuestionAndItems: chosenQuestionAndItems
      }).then(res => {
        console.log(res.data)
        if (res.data.errno == 0) {
          wx.hideLoading()
          wx.showModal({
            title: '成功',
            content: '您的材料已上传成功，请等待短信通知',
            showCancel: false,
            confirmColor:'#25aab1',
            success(res) {
              if (res.confirm) {
                wx.navigateBack({
                  delta: 1
                })
              } 
            }
          })       
        } else {
          util.errorTip(res.errmsg)
        }
      })
  },
})