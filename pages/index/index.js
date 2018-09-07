const config = getApp().config
var pageNum = 1
var comCode = 'SF'
Page({
  data: {
    comCodes:[],
    comName:'顺丰速运',
    flag:0,
    originNum:'',
    traces:[],
    picHost:config.picHost
  },
  toExpress:function(){
    wx.redirectTo({url: '/pages/express/package'})
  },
  scanCode:function(){
    wx.scanCode({
      onlyFromCamera: true,
      success: res => {
        this.setData({
          originNum:res.result
        })
        console.log(res)
      }
    })
  },
  getComs:function(){
    pageNum = 1
    this.getCodes()
    this.setData({
      flag:1
    })
  },
  selectCode:function(e){
    var data = e.currentTarget.dataset
    comCode = data.code
    this.setData({
      comName:data.name,
      flag:0
    })
    if(this.data.originNum){
      this.expressTrace()
    }
  },
  getExpress:function(){
    this.expressTrace()
  },
  expressTrace:function(){
    var expressNum = this.data.originNum
    wx.request({
      url: config.server +'/api/getExpressInfo',
      data: { 'comCode': comCode, 'expressNum': expressNum},
      header: { 'Content-Type': 'application/json'},
      method: 'POST',
      success: res=> {
        console.log(res)
        this.setData({
          traces:res.data.body.Traces
        })
      },
    })
  },
  getNumber:function(e){
    console.log(e.detail.value)
    this.setData({
      originNum:e.detail.value
    })
  },
  getCodes:function(){
    var oldComCodes = this.data.comCodes
    wx.request({
      url: config.server + '/api/getComCodes',
      data: { pageSize: config.pageSize, pageNum: pageNum },
      header: { 'Content-Type': 'application/json' },
      method: 'POST',
      dataType: 'json',
      success: res => {
        oldComCodes.push(res.data.body)
        this.setData({
          comCodes: oldComCodes
        })
      }
    })
  },
  getMoreCodes:function(){
    pageNum += 1
    this.getCodes() 
  },
  onLoad: function () {
    this.getCodes()
  }
})
