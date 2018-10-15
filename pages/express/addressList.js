// pages/express/addressList.js
var config = getApp().config;
var pageNum = 1;
var addList = [];
var role = '';
Page({

  /**
   * Page initial data
   */
  data: {
    addList:addList,
    pageNum:pageNum,
    picHost: config.picHost
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    role = options.role ? options.role : 'receiver'
  },
  choseAdd:function(e){
    var data = e.currentTarget.dataset
    var choseData = addList[data.index][data.indx]
    var postData = {}

    postData.sor = role == 'receiver' ? -1 : 1
    postData.mobile = choseData.tel.replace(/-/g, '')
    postData.name = choseData.name
    postData.areaDetail = choseData.detailInfo
    postData.provinceName = choseData.city[0]
    postData.cityName = choseData.city[1]
    postData.expAreaName = choseData.city[2]
    postData.provinceCode = choseData.code[0]
    postData.cityCode = choseData.code[1]
    postData.areaCode = choseData.code[2]
    postData.addId = choseData.addId

    var pages = getCurrentPages();             //  获取页面栈
    var currPage = pages[pages.length - 1];    // 当前页面
    var prevPage = pages[pages.length - 2];
    var that = this;  // 上一个页面
    prevPage.setData({
      mydata: postData,
    })
    wx.navigateBack({
      delta: 1,
    })
    
  },
  getAddressList:function(){
    wx.request({
      url: config.server + '/api/getUserCityList',
      data: { pageSize: config.pageSize, pageNum: pageNum, uid: wx.getStorageSync('openId') },
      header: { 'Content-Type': 'application/json' },
      method: 'POST',
      dataType: 'json',
      success: res => {
        if(res.data.body.length){
          addList.push(res.data.body)
        }
        this.setData({
          addList: addList
        })
      }
    })
  },
  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function () {

  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow: function () {
    pageNum = 1;
    addList = [];
    this.getAddressList();
  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide: function () {

  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload: function () {

  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh: function () {
    pageNum = 1;
    addList = [];
    this.getAddressList();
  },

  /**
   * Called when page reach bottom
   */
  onReachBottom: function () {
    pageNum += 1;
    this.getAddressList();
  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage: function () {

  }
})