// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'mini-blog'
})

const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  let postId = event.postId + '';
  let comment = event.comment;

  var result = db.collection('box').doc(postId).update({
    data: {
      comments: _.push([comment])
    }
  })
  return result;
}