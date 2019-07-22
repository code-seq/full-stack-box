// pages/box-details/box-details.js
import {
  PostModel
} from '../../models/post.js'
const postModel = new PostModel();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    spinShow: true,
    title: "",
    category: "",
    posts: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      title: options.title,
      category: options.category
    });

    postModel.getPostsByCategory_Cloud(this.data.category, res => {
      this.setData({
        spinShow: false,
        posts: res
      });
      this.showPost();
    }, err => {
      console.log("errMsg:" + err);
    });
  },

  //自定义事件
  onPostCardTap: function (event){
    let postId = event.detail.postId;
    wx.navigateTo({
      url: '../post/post?postId=' + postId,
    })
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

  },

  /**
   * Post淡入效果
   */
  showPost() {
    var animation = wx.createAnimation({
      duration: 5000,
      timingFunction: 'ease',
      delay: 0
    });
    animation.opacity(1).step();
    this.setData({
      anp: animation.export()
    })
  },

  /**
   * Post淡出效果
   */
  closePost() {
    console.log("closePost");
    var animation = wx.createAnimation({
      duration: 2000,
      timingFunction: 'ease',
      delay: 0
    });
    animation.opacity(0).step();
    this.setData({
      anp: animation.export()
    })
  }
})