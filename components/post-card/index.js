// components/post-card/index.js
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    post:Object
  },

  /**
   * 组件的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar
  },

  lifetimes: {
    attached: function (event) {
    }
  },

  pageLifetimes: {
    show() {
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onTap:function(event){
      this.triggerEvent("postCardTap",{
        postId: event.currentTarget.dataset.pid
      },{})
    }
  }
})
