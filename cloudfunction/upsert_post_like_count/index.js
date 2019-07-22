// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'mini-blog'
})

const db = cloud.database()

// 更新文章点赞数
exports.main = async (event, context) => {
  try {
    var posts = await db.collection('box').where({
      _id: event.postId
    }).get()

    if (posts.data.length > 0) {
      await db.collection('box').doc(event.postId).update({
        data: {
          postViews: posts.data[0]['postLikeCount'] + event.likeCount, //点赞数
        }
      })
    }
    return true
  } catch (e) {
    return false
  }
}