// pages/express/package.js
var config = getApp().config;
var pageNum = 1;
var comCodes = [];
var goods = [1]
var data = {};
var send = {
  flag: {
    province: 0,
    city: 0,
    area: 0
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
  fillGoods:function(e){
    console.log(e)
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

  expressSub:function(){
    console.log(send)
    console.log(receive)
    console.log()
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