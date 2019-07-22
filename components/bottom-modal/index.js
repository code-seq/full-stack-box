Component({
  /**
   * 组件的一些选项
   */
  options: {
    addGlobalClass: true,
  },
  /**
   * 组件的对外属性
   */
  properties: {
    modalName: {
      type: String,
      default: ''
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    elements: [{
        title: '前端',
        name: 'Front',
        color: 'green',
        icon: 'newsfill'
      },
      {
        title: '后端',
        name: 'Back',
        color: 'green',
        icon: 'colorlens'
      },
      {
        title: '移动端',
        name: 'Mobile',
        color: 'green',
        icon: 'btn'
      },
      {
        title: '容器',
        name: 'Docker',
        color: 'green',
        icon: 'icon'
      },
      {
        title: '英语',
        name: 'English ',
        color: 'green',
        icon: 'font'
      },
      {
        title: '杂录',
        name: 'Essay',
        color: 'green',
        icon: 'tagfill'
      },
    ],
    gridCol: 3,
    skin: false
  },
  /**
   * 组件的方法列表
   */
  methods: {
    hideModal(e) {
      this.setData({
        modalName: null
      })
    }
  }
})