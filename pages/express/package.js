// pages/express/package.js
var config = getApp().config;
var pageNum = 1;
var comCodes = [];
var goodsInfo = [{GoodsName:''}];
var goods = [1]
var data = {};
var send = {
  flag: {
    province: 0,
    city: 0,
    area: 0
  },
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
  },
  city: {
    province: '请选择省',
    city: '请选择市',
    area: '请选择区',
    detail: ''
  },
  show: {
    province: 0,
    city: 0,
    area: 0
  }
}
var receive = {
  flag: {
    province: 0,
    city: 0,
    area: 0
  },
  info: {
    name: '',
    mobile: ''
  },
  cityCode: {
    province: '',
    city: ''
  },
  city: {
    province: '请选择省',
    city: '请选择市',
    area: '请选择区',
    detail:''
  },
  show: {
    province: 0,
    city: 0,
    area: 0
  }
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    city: {},
    sender: send,
    receiver: receive,
    comCodes:[],
    goods:goods
  },
  getInfo:function(e){
    var dataNow = e.currentTarget.dataset
    if (dataNow.role == 'send'){
      if(dataNow.name == 'detail'){
        send.city.detail = e.detail.value
      }else if(dataNow.name == 'mobile'){
        send.info.mobile = e.detail.value
      }else if(dataNow.name == 'name'){
        send.info.name = e.detail.value
      }
    }else if(dataNow.role == 'receive'){
      if (dataNow.name == 'detail') {
        receive.city.detail = e.detail.value
      } else if (dataNow.name == 'mobile') {
        receive.info.mobile = e.detail.value
      } else if (dataNow.name == 'name') {
        receive.info.name = e.detail.value
      }
    }
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
  hide:function(e){
    e.show.city = 0
    e.show.area = 0
  },
  getMoreCodes:function(){
    pageNum = pageNum + 1
    this.getComCodes()
  },
  choseCom:function(e){
    send.comDetail = e.currentTarget.dataset
    this.setData({
      sender:send
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
  changeShow: function(e) {
    var dataNow = e.currentTarget.dataset
    if (dataNow.level != 'province' && dataNow.code) {
      this.getCity(dataNow.level, dataNow.code)
    }
    if (dataNow.role == 'send') {
      if (dataNow.level == 'province') {
        send.show.province = 1
        this.hide(receive)
      } else if (dataNow.level == 'city') {
        send.show.city = dataNow.code ? 1 : 0
        this.hide(receive)
      } else if (dataNow.level == 'area') {
        send.show.area = dataNow.code ? 1 : 0
        this.hide(receive)
      }
      this.setData({
        sender: send,
        receiver:receive
      })
    } else if (dataNow.role == 'receive') {
      if (dataNow.level == 'province') {
        receive.show.province = 1
        this.hide(send)
      } else if (dataNow.level == 'city') {
        receive.show.city = dataNow.code ? 1 : 0
        this.hide(send)
      } else if (dataNow.level == 'area') {
        receive.show.area = dataNow.code ? 1 : 0
        this.hide(send)
      }
      this.setData({
        sender:send,
        receiver: receive
      })
    }
  },
  choseCity: function(e) {
    var dataNow = e.currentTarget.dataset
    if (dataNow.role == 'send') {
      if (dataNow.level == 'province') {
        send.cityCode.province = dataNow.city
        send.city.province = dataNow.name
        send.city.city = '请选择市'
        send.city.area = '请选择区'
        send.show.province = 0
      } else if (dataNow.level == 'city') {
        send.cityCode.city = dataNow.city
        send.city.city = dataNow.name
        send.city.area = '请选择区'
        send.show.city = 0
      } else if (dataNow.level == 'area') {
        send.city.area = dataNow.name
        send.show.area = 0
      }
      this.setData({
        sender: send
      })
    } else if (dataNow.role == 'receive') {
      if (dataNow.level == 'province') {
        receive.cityCode.province = dataNow.city
        receive.city.province = dataNow.name
        receive.city.city = '请选择市'
        receive.city.area = '请选择区'
        receive.show.province = 0
      } else if (dataNow.level == 'city') {
        receive.cityCode.city = dataNow.city
        receive.city.city = dataNow.name
        receive.city.area = '请选择区'
        receive.show.city = 0
      } else if (dataNow.level == 'area') {
        receive.city.area = dataNow.name
        receive.show.area = 0
      }
      this.setData({
        receiver: receive
      })
    }
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
  getCity: function(level, e = false) {
    var postData = {};
    if (e) {
      postData.city = e
    }
    wx.request({
      url: config.server+'/api/getCity',
      data: postData,
      header: {
        'Content-Type': 'application/json'
      },
      method: 'POST',
      success: res => {
        if (level == 'province') {
          data.province = []
          data.province = res.data.body.city
          this.setData({
            city: data
          })
        } else if (level == 'city') {
          data.city = []
          data.city = res.data.body.city
          this.setData({
            city: data
          })
        } else if (level == 'area') {
          data.area = []
          data.area = res.data.body.city
          this.setData({
            city: data
          })
        }
      }
    })
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getCity('province');
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