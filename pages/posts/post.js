var postDatas = require('../../data/data.js')

Page({
  data: {

  },

  onLoad: function (options) {
    // 生命周期函数--监听页面加载
    this.setData({
      post_key: postDatas.postsList
    });
  },

  onPostTap:function(){
    wx.navigateTo({
      url: 'post-detail/post-detail',
      success: function(res){
        // success
      },
      fail: function() {
        // fail
      },
      complete: function() {
        // complete
      }
    })
  }
})