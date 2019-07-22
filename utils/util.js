const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const getTimeHourDiff = dateStr => {
  let time = new Date(dateStr);
  let time_diff = new Date().getTime() - time; //时间差的毫秒数 
  var leave1 = time_diff % (24 * 3600 * 1000);
  var hours = Math.floor(leave1 / (3600 * 1000));
  return hours;
}

module.exports = {
  formatTime: formatTime,
  getTimeHourDiff: getTimeHourDiff
}