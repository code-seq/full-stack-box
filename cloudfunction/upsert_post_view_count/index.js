// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'mini-blog'
})

const db = cloud.database()

// 更新文章浏览数
exports.main = async(event, context) => {
  try {
    var posts = await db.collection('box').where({
      _id: event.postId
    }).get()

    if (posts.data.length > 0) {
      await db.collection('box').doc(event.postId).update({
        data: {
          postViews: posts.data[0]['postViews'] + event.viewCount, //浏览量
        }
      })
    }
    return true
  } catch (e) {
    return false
  }
}