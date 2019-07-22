// pages/post/post.js
import util from '../../utils/util.js'
import {
  PostModel
} from '../../models/post.js'
const app = getApp();
const {
  $Message
} = require('../../iviewui/base/index');
const request = require('../../utils/request.js');
const {
  $Toast
} = require('../../iviewui/base/index');
const postModel = new PostModel();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    Custom: app.globalData.Custom,
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    TabCur: 1,
    scrollLeft: 0,
    scrollTop: 0,
    linenums: false,
    spinShow: true,
    aflag: true,
    spinShows: '',
    comments: [],
    commentsFlag: true,
    style: app.globalData.highlightStyle,
    userInfo: {},
    userAgent: '',
    scene: 0,
    likeButton: true,
    viewCount:0,
    likeCount:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    //获取场景
    var sceneNum = wx.getLaunchOptionsSync().scene;
    if (sceneNum == 1007 || sceneNum == 1008) {
      // 通过单人聊天会话分享进入 或者是  通过群聊会话分享进入
      // scene记录是否通过这些场景进来的1是，0否
      this.setData({
        scene: 1
      });
    }

    /**
     * 获取用户信息
     */
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.UserInfo,
            hasUserInfo: true
          })
        }
      })
    }

    this.setData({
      postId: options.postId,
    })

    var that = this; //不要漏了这句，很重要
    var postId = options.postId;
    
    //记录浏览次数
    postModel.browsePost(postId, res => {
      console.log('cloudFunctionResult:');
      console.log(res);
      let newPost = { ...this.data.post, postViews: this.data.post.postViews + 1 }
      postModel._updatePostInContainer(postId, newPost);
    }, err => {
      console.log('cloudFunctionError:');
      console.log(err);
    });

    postModel.getPostById_Cloud(postId, res => {
      var newComments = res.comments.map(item => {
        //js正则过滤HTML标签
        let reg = new RegExp(/<[^<>]+>/g);
        item.commentContent = item.commentContent.replace(reg, '');
        return item;
      });

      this.setData({
        post: res,
        postDate: res.postDate,
        postTitle: res.postTitle,
        comments: newComments,
        commentsCount: res.comments.length,
        postThumbnail: res.postThumbnail,
        viewCount:res.postViews,
        likeCount:0
      })

      //动态设置当前页面的标题
      wx.setNavigationBarTitle({
        title: res.postTitle,
      })
    }, err => {
      console.error('failFunPosts', err)
    });

    spinShows: setTimeout(function () {
      that.setData({
        spinShow: !that.data.spinShow,
      });
    }, 2000)

    wx.getSystemInfo({
      success(res) {
        var agentInfo = res.platform + '|' + res.brand + '|' + res.model + '|' + res.system + '|' + res.language;
        that.setData({
          userAgent: agentInfo,
        })
      }
    });

    //获取本地缓存的点赞flag
    try {
      const value = wx.getStorageSync('likeButton' + that.data.postId)
      if (value != null) {
        if (value == "1") {
          that.setData({
            likeButton: true
          });
        } else if (value == "0") {
          that.setData({
            likeButton: false
          });
        }
      }
    } catch (e) {
      console.error("获取本地点赞flag缓存失败：", e);
    }
  },

  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo;
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () { },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () { },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () { },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    let spinShows = this.data.spinShows;
    var that = this;
    clearInterval(spinShows);
    that.setData({
      comments: [],
    });
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this;
    $Message({
      content: '请听博主下回分解...',
      duration: 2
    });
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    var that = this;

    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: this.data.postTitle,
      path: '/pages/post/post?postId=' + this.data.postId,
      imageUrl: app.globalData.URL + this.data.postThumbnail,
    }
  },


  /**
   * return返回上一页
   */
  returnPage() {
    var sceneFlag = this.data.scene;
    if (sceneFlag == 1) {
      wx.reLaunch({
        url: '/pages/index/index',
      })
    } else {
      wx.navigateBack({
        delta: 1,
      })
    }

  },

  /**
   * 评论文本框获取值
   */
  bindKeyInput(e) {
    this.setData({
      inputValue: e.detail.value,
    })
  },

  /**
   * 发送评论
   */
  sendComment() {
    var postId = this.data.postId;
    let inputVal = this.data.inputValue;
    //js正则过滤HTML标签
    let reg = new RegExp(/<[^<>]+>/g);
    inputVal = inputVal.replace(reg, '');
    var comment = {
      commentContent: inputVal,
      commentAuthor: app.globalData.userInfo.nickName,
      commentAuthorEmail: '',
      commentAuthorUrl: app.globalData.userInfo.avatarUrl,
      commentAgent: this.data.userAgent,
      commentParent: '0',
      commentDate: util.formatTime(new Date())
    };

    if (this.data.inputValue != null && this.data.inputValue != '') {
      this.setData({
        inputValue: ''
      });

      postModel.sendComment_Cloud(this.data.postId, comment, res => {
        if (res.result.stats.updated == 1) {
          let tempComments = [...this.data.comments, comment];
          let tempCommentsCount = this.data.commentsCount + 1;
          let tempPost = { ...this.data.post, comments: tempComments, commentsCount: tempCommentsCount };
          this.setData({
            comments: tempComments,
            commentsCount: tempCommentsCount,
            post: tempPost
          });
          postModel._updatePostInContainer(this.data.postId, tempPost);
          $Message({
            content: '评论成功！',
            duration: 2
          });
        }
        console.log(res);
      }, err => {
        console.log('评论失败！');
        console.log(err);
      });
    } else {
      $Message({
        content: '请输入吐槽内容',
        duration: 2
      });
    }
  },

  /**
   * 点赞
   */
  likeButton: function () {
    var postId = this.data.postId;
    let cacheKey = 'post-liked-' + postId;
    let postLiked = postModel._getCache(cacheKey);
    if (postLiked) {
      $Toast({
        content: '您已点过赞了！',
        type: 'success',
        duration: 2
      });
    }
    
    postModel.likePost(postId, res => {
      console.log('cloudFunctionResult:');
      console.log(res);
      let newPost = { ...this.data.post, postViews: this.data.post.postViews + 1 }
      postModel._updatePostInContainer(postId, newPost);
      $Toast({
        content: '点赞成功！',
        type: 'success',
        duration: 2
      });
    }, err => {
      console.log('cloudFunctionError:');
      console.log(err);
    });
  },

  /**
   * 打开蒙版
   */
  showMask() {
    this.setData({
      aflag: false,
    });
    var animation = wx.createAnimation({
      duration: 1000,
      timingFunction: 'ease',
      delay: 0
    });
    animation.opacity(1).translate(wx.getSystemInfoSync().windowWidth, 0).step()
    this.setData({
      ani: animation.export()
    })
  },


  closeMask() {

    var that = this;
    var animation = wx.createAnimation({
      duration: 1000,
      timingFunction: 'ease',
      delay: 0
    });
    animation.opacity(0).translate(-wx.getSystemInfoSync().windowWidth, 0).step()
    that.setData({
      ani: animation.export()
    });

    setTimeout(function () {
      that.setData({
        aflag: true,
      });
    }, 600);
  },

  /**
   * 防止冒泡
   */
  prevent() {
    var self = this;
    wx.setClipboardData({
      data: "vic.l.zhang@outlook.com"
    });

  },

  showModal(e) {
    this.setData({
      modalName: e.currentTarget.dataset.target
    })
  },

  hideModal(e) {
    this.setData({
      modalName: null
    })
  },

  tabSelect(e) {
    console.log(e);
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 60
    })
  }

})