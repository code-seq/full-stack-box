//index.js
import {
  PostModel
} from '../../models/post.js'
const jinrishici = require('../../utils/jinrishici.js');
const {
  $Message
} = require('../../iviewui/base/index');
const request = require('../../utils/request.js');
const postModel = new PostModel();
const app = getApp();


Page({
  /**
   * 页面的初始数据
   */
  data: {
    spinShow: true,
    Num: 5,
    pageNum: 0,
    Flag: 0,
    loadMore: false,
    loadMores: false,
    blogName: app.globalData.blogName,
    scrollTop: 0,
    nav: true,
  },

  /**
   * 下拉刷新
   */
  onPullDownRefresh() {
    postModel.getAllRecommendedPost_Cloud(res => {
      var posts_list = [];
      var count = res.length;
      if (count < 5) {
        for (var i = 0; i < count; i++) {
          posts_list.push(res[i]);
        }
      } else {
        for (var i = 0; i < 5; i++) {
          posts_list.push(res[i]);
        }
      };
      this.setData({
        spinShow: false,
        //res代表success函数的事件对，data是固定的，stories是是上面json数据中stories
        posts: posts_list,
        //加载更多数据归零
        pageNum: 0,
        Flag: 0,
        loadMores: false,
      });
    }, err => {
      console.error('failFunRefreshPosts', err)
    })

    jinrishici.load(result => {
      // 下面是处理逻辑示例
      console.log(result);
      this.setData({
        "jinrishici": result.data.content,
        shici: result.data.origin.content,
      })
      //关闭下拉刷新
      wx.stopPullDownRefresh();
    })

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function() {
    postModel.getAllRecommendedPost_Cloud(res => {
      var posts_list = [];
      var count = res.count;
      if (count < 5) {
        for (var i = 0; i < count; i++) {
          posts_list.push(res[i]);
        }
      } else {
        for (var i = 0; i < 5; i++) {
          posts_list.push(res[i]);
        }
      }
      this.setData({
        spinShow: false,
        posts: posts_list,
        posts_list: res,
        total: res.length,
      })

      //淡入动画效果
      this.showPost();
      this.setData({
        resultData: res,
      })
    }, err => {
      console.error('failFunPosts', err)
    })

    jinrishici.load(result => {
      // 下面是处理逻辑示例
      console.log(result);
      this.setData({
        "jinrishici": result.data.content,
        shici: result.data.origin.content,
      })
    });
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    return {
      title: app.globalData.blogName
    }
  },

  /**
   * 加载更多
   */
  onReachBottom: function() {

    var that = this;
    var pageNums = that.data.pageNum + 1;
    console.log('加载更多' + pageNums);
    var posts_list = [];
    var total = that.data.total;
    var a = total % 5;
    // var b = (total / 5).toFixed(0);
    var b = Math.floor(total / 5);
    var c = parseInt(total / 5);
    console.log(a + "|" + b + "|" + c);
    var Num = 5;
    var flag = 0;
    var flag1 = 0;
    var count = that.data.total;
    if (count < 5) {
      flag1 = 1;
    }
    if (that.data.Flag == 0) {
      if (that.data.pageNum < (b - 1) || a == 0) {
        if (a == 0 && pageNums == (c - 1)) {
          flag = 1;
        }
        for (var i = 0; i < 5; i++) {
          posts_list.push(that.data.posts_list[i + (Num * pageNums)]);
        }

      } else {
        for (var i = 0; i < a; i++) {
          posts_list.push(that.data.posts_list[i + (Num * pageNums)]);
        }
        flag = 1;
      }
    }
    console.log(posts_list);

    that.setData({
      loadMore: true,
    });

    console.log(that.data.Flag);
    if (that.data.Flag == 0) {
      if (flag1 == 1) {
        setTimeout(function() {
          that.setData({
            loadMore: false,
            loadMores: true,
          });
          $Message({
            content: '已加载所有精选，更多请点左上角盒子。',
            duration: 2
          });
        }, 200);
      } else {
        setTimeout(function() {
          that.setData({
            pageNum: pageNums,
            posts: that.data.posts.concat(posts_list),
            Flag: flag,
            loadMore: false,
          });
        }, 200);
      }
    } else {
      setTimeout(function() {
        that.setData({
          loadMore: false,
          loadMores: true,
        });
        $Message({
          content: '已加载所有精选，更多请点左上角盒子',
          duration: 2
        });
      }, 200);
    }

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {},

  showMask() {
    this.setData({
      modalName: 'bottomModal',
    });
  },

  /**
   * Post淡入效果
   */
  showPost() {
    var animation = wx.createAnimation({
      duration: 2000,
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
  },

  /**
   * 监听屏幕滚动 判断上下滚动
   */
  onPageScroll: function(event) {
    var that = this;
    if (event.scrollTop > 120) {
      that.setData({
        nav: false
      });
    } else {
      that.setData({
        nav: true
      });
    }
  }
})