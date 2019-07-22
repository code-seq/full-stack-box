import {
  HTTP
} from '../utils/http.js'
import util from '../utils/util.js'
const app = getApp();
const db = wx.cloud.database({
  env: 'full-stack-box-dev'
})
const _ = db.command;

export class PostModel extends HTTP {

  getAllRecommendedPost_Cloud(successCallback, failCallback) {
    db.collection('todos').doc('my-todo-id')
    let cacheKey = 'post-collection-home';
    let postCollection = this._getCache(cacheKey);
    if (!postCollection) {
      db.collection('box').where({
        isRecommended: true
      }).get().then(res => {
        this._setCache(cacheKey, res.data);
        this._updateCacheContainer(res.data);
        successCallback(res.data);
      }, err => {
        failCallback(err);
      })
    } else {
      successCallback(postCollection);
    }
  }

  getPostById_Cloud(postId, successCallback, failCallback) {
    let post = this._getPostFromContainer(postId)
    if (!post) {
      db.collection('box').where({
        _id: postId
      }).get().then(res => {
        this._updateCacheContainer([res.data[0]]);
        successCallback(res.data[0]);
      }, err => {
        failCallback(err);
      })
    } else {
      successCallback(post);
    }
  }

  getPostsByCategory_Cloud(category, successCallback, failCallback) {
    let cacheKey = 'post-collection-category-' + category;
    let postCategoryCollection = this._getCache(cacheKey);
    if (!postCategoryCollection) {
      db.collection('box').where({
        category: category
      }).get().then(res => {
        res.data.length > 0 && this._setCache(cacheKey, res.data);
        this._updateCacheContainer(res.data);
        successCallback(res.data);
      }, err => {
        failCallback(err);
      })
    } else {
      successCallback(postCategoryCollection);
    }
  }

  browsePost(postId, successCallback, failCallback) {
    let that = this;
    let cacheKey = 'post-viewed-' + postId;
    let postViewed = this._getCache(cacheKey);
    if (!postViewed) {
      wx.cloud.callFunction({
        // 云函数名称
        name: 'upsert_post_view_count',
        // 传给云函数的参数
        data: {
          postId: postId,
          viewCount: 1
        },
        success(res) {
          that._setCache(cacheKey, true);
          successCallback(res);
        },
        fail(err) {
          failCallback(err);
        }
      })
    }
  }

  likePost(postId, successCallback, failCallback) {
    let that = this;
    let cacheKey = 'post-liked-' + postId;
    let postLiked = this._getCache(cacheKey);
    if (!postLiked) {
      wx.cloud.callFunction({
        // 云函数名称
        name: 'upsert_post_like_count',
        // 传给云函数的参数
        data: {
          postId: postId,
          likeCount: 1
        },
        success(res) {
          that._setCache(cacheKey, true);
          successCallback(res);
        },
        fail(err) {
          failCallback(err);
        }
      })
    }
  }

  sendComment_Cloud(postId, comment, successCallback, failCallback) {
    postId = postId + '';
    wx.cloud.callFunction({
      // 云函数名称
      name: 'insert_post_comment',
      // 传给云函数的参数
      data: {
        postId: postId,
        comment: comment
      },
      success(res) {
        console.log("cloudResult:", res)
        successCallback(res);
      },
      fail(err) {
        failCallback(err);
      }
    })
  }

  _updateCacheContainer(collection) {
    if (!(collection instanceof Array)) return;
    let cacheKey = 'post-collection-container';
    let container = this._getCache(cacheKey);
    if (container && collection.length > 0) {
      let union = container.concat(collection.filter(v => {
        let flag = true;
        container.forEach((value, index, arr) => {
          if (value._id == v._id) flag = false;
        });
        return flag;
      }));
      this._setCache(cacheKey, union);
    } else if (!container) {
      this._setCache(cacheKey, collection);
    }
  }

  _getPostFromContainer(postId) {
    let post = null;
    let cacheKey = 'post-collection-container';
    let container = this._getCache(cacheKey);
    if (container) {
      for (let i = 0; i < container.length; i++) {
        if (container[i]._id == postId) {
          post = container[i];
          break;
        }
      }
    }
    return post;
  }

  _updatePostInContainer(postId, newPost) {
    let cacheKey = 'post-collection-container';
    let container = this._getCache(cacheKey);
    if (container) {
      for (let i = 0; i < container.length; i++) {
        if (container[i]._id == postId) {
          container[i] = newPost;
          break;
        }
      }
      this._setCache(cacheKey, container);
    }
  }

  _setCache(key, value) {
    wx.setStorageSync(key, value);
  }

  _getCache(key) {
    let cacheKay = 'date-flag';
    let dateFlag = wx.getStorageSync(cacheKay);
    if (dateFlag) {
      let today = new Date();
      if (today.getDate() != new Date(dateFlag).getDate() ||
        today.getMonth() != new Date(dateFlag).getMonth()) {
        wx.clearStorageSync();
        wx.setStorageSync(cacheKay, util.formatTime(new Date()));
      }
    } else {
      wx.setStorageSync(cacheKay, util.formatTime(new Date()));
    }
    return wx.getStorageSync(key);
  }

}