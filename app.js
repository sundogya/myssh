//app.js
App({
  onLaunch: function () {
    wx.login({
      success:res=>{
        wx.request({
          url: 'https://www.itell.club/api/getOpenId',
          data: {owner:'eShow',code:res.code},
          header: {
            'Content-Type': 'application/json'
          },
          method: 'POST',
          dataType: 'json',
          success: res=>{
            wx.setStorageSync('openId', res.data.body.openid)
          }
        })
      }
    })
  },
  globalData: {
    userInfo: null
  },
  config:{
    pageSize: 12,
    picHost:'https://oss.itell.club/e_show',
    server:'https://www.itell.club',
  }
})