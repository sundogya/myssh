// pages/express/package.js
var config = getApp().config;
var pageNum = 1;
var comCodes = [];
var goodsInfo = [{GoodsName:''}];
var goods = [1]
var data = {};
var send = {
  addId:'',
  flag:0,
  info:{
    name:'',
    mobile:''
  },
  comDetail:{
    code:'SF',
    name:'顺丰速运'
  },
  cityCode: {
    province: '',
    city: '',
    area:''
  },
  city: {
    province: '请选择省',
    city: '请选择市',
    area: '请选择区',
    detail: ''
  },
}
var receive = {
  addId:'',
  flag: 0,
  info: {
    name: '',
    mobile: ''
  },
  cityCode: {
    province: '',
    city: '',
    area:''
  },
  city: {
    province: '请选择省',
    city: '请选择市',
    area: '请选择区',
    detail:''
  },
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sender: send,
    receiver: receive,
    comCodes:[],
    goods:goods,
    comFlag:0
  },
  showCom:function(){
    this.setData({
      comFlag:1
    })
  },
  addressList: function (e) {
    wx.navigateTo({
      url: '/pages/express/addressList?role=' + e.currentTarget.dataset.role,
    })
  },
  fillGoods:function(e){
    var dataNow = e.currentTarget.dataset
    if (!goodsInfo[dataNow.index]){
      goodsInfo[dataNow.index] = {}
    }
    if(dataNow.name == 'GoodsName'){
      goodsInfo[dataNow.index].GoodsName = e.detail.value
    } else if (dataNow.name == 'GoodsWeight'){
      goodsInfo[dataNow.index].GoodsWeight = e.detail.value
    }else if(dataNow.name == 'Goodsquantity'){
      goodsInfo[dataNow.index].Goodsquantity = e.detail.value
    }
  },
  choseCom:function(e){
    send.comDetail = e.currentTarget.dataset
    this.setData({
      sender:send,
      comFlag:0
    })
  },
  addGoods:function(){
    goods = goods.map(function(e){
      return 0
    })
    goods.push(1)
    this.setData({
      goods:goods
    })
  },
  getComCodes:function(){
    var postData = {}
    postData.pageNum = pageNum
    postData.pageSize = config.pageSize
    wx.request({
      url: config.server +'/api/getSendComCodes',
      data: postData,
      header: {
        'Content-Type': 'application/json'
      },
      method: 'POST',
      success: res => {
        if(res.data.body.length){
          comCodes.push(res.data.body)
        }
        this.setData({
          comCodes:comCodes
        })
      }
    })
  },
  getMoreCodes: function () {
    pageNum = pageNum + 1
    this.getComCodes()
  },
  expressSubmit:function(){
    var postData = {}
    var pattern = /^1[3456789]\d{9}$/
    var flag = 1
    postData.uid = wx.getStorageSync('openId')
    postData.comCode = send.comDetail.code
    postData.comName = send.comDetail.name
    postData.commodity = goodsInfo
    postData.sender = {}
    postData.receiver = {}
    if (send.cityCode.province && send.cityCode.city && send.city.area !='请选择区'){
      postData.sender.provinceName = send.city.province
      postData.sender.provinceCode = send.cityCode.province
      postData.sender.cityName = send.city.city
      postData.sender.cityCode = send.cityCode.city
      postData.sender.expAreaName = send.city.area
      postData.sender.addId = send.addId
    }else{
      flag = 0
      wx.showModal({
        title: '城市选择错误',
        content: '请正确选择寄件人地址，这样我们可以更加合理的安排快递人员与您联系',
        showCancel: false,
        confirmText: '我知道啦',
        confirmColor: '#5cae1f',
      })
    }
    if(flag){
      if (send.info.name && pattern.test(send.info.mobile) && send.city.detail) {
        postData.sender.name = send.info.name
        postData.sender.mobile = send.info.mobile
        postData.sender.areaDetail = send.city.detail
      } else {
        wx.showModal({
          title: '未正确填写寄件人联系方式',
          content: '请正确填写寄件人联系方式，这样我们的快递小哥才能正常联系到您哟',
          showCancel: false,
          confirmText: '我知道啦',
          confirmColor: '#5cae1f',
        })
      }
    }
    if(flag){
      if (receive.cityCode.province && receive.cityCode.city && receive.city.area != '请选择区'){
        postData.receiver.provinceName = receive.city.province
        postData.receiver.provinceCode = receive.cityCode.province
        postData.receiver.cityName = receive.city.city
        postData.receiver.cityCode = receive.cityCode.city
        postData.receiver.expAreaName = receive.city.area
        postData.receiver.addId = receive.addId
      }else{
        flag = 0
        wx.showModal({
          title: '城市选择错误',
          content: '请正确选择收件人地址，这样对方才能正常收货哟',
          showCancel: false,
          confirmText: '我知道啦',
          confirmColor: '#5cae1f',
        })
      }
    }
    if(flag){
      if (receive.info.name && pattern.test(receive.info.mobile) && receive.city.detail) {
        postData.receiver.name = receive.info.name
        postData.receiver.mobile = receive.info.mobile
        postData.receiver.areaDetail = receive.city.detail
      } else {
        console.log(receive)
        flag = 0
        wx.showModal({
          title: '未正确填写收件人联系方式',
          content: '请正确填写收件人联系方式，这样我们的快递小哥才能正常联系到您哟',
          showCancel: false,
          confirmText: '我知道啦',
          confirmColor: '#5cae1f',
        })
      }
    }
    if(flag){
      console.log(postData)
      wx.request({
        url: config.server +'/api/expressPage',
        data: postData,
        header: {
          'Content-Type': 'application/json'
        },
        method: 'POST',
        dataType: 'json',
        responseType: 'text',
        success: res => {
          if(res.data.errorCode == -1){
            wx.showModal({
              title: '操作失败',
              content: '当前下单人数较多，请稍后重试',
              showCancel: false,
              confirmText: '我知道啦',
              confirmColor: '#5cae1f',
            })
          }else if(res.data.errorCode == 0){
            wx.showModal({
              title: '下单成功',
              content: '您已下单成功，稍后会有工作人员与您联系，您的订单号为' + res.data.LogisticCode + '，快递公司名称为'+res.data.comName+',您可以在我的里面查看您的快递信息',
              showCancel: false,
              confirmText: '我知道啦',
              confirmColor: '#5cae1f',
              success:res=>{
                wx.redirectTo({url: '/pages/index/index'})
              }
            })
          }
        }
      })
    }

  },
  toFillAddress:function(e){
    var nowInfo = e.currentTarget.dataset
    wx.navigateTo({
      url: '/pages/express/address?role='+nowInfo.role+'&addId='+nowInfo.addid
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getComCodes();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var addressData = {}
    var bakAddress = this.data.mydata
    if (this.data.mydata){
      addressData = this.data.mydata.sor == 1 ? send:receive

      addressData.flag = 1
      addressData.addId = bakAddress.addId
      addressData.city.province = bakAddress.provinceName
      addressData.city.city = bakAddress.cityName
      addressData.city.area = bakAddress.expAreaName
      addressData.city.detail = bakAddress.areaDetail
      addressData.cityCode.province = bakAddress.provinceCode
      addressData.cityCode.city = bakAddress.cityCode
      addressData.cityCode.area = bakAddress.areaCode
      addressData.info.name = bakAddress.name
      addressData.info.mobile = bakAddress.mobile
      
      this.setData({
        sender:send,
        receiver:receive
      })
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})