/*
 * @Author: fg
 * @Date: 2022-08-31 15:38:46
 * @LastEditors: fg
 * @LastEditTime: 2022-08-31 16:18:33
 * @Description: chat time
 */
function timeChange (timeValue) {
  timeValue = new Date(timeValue).getTime()
  var timeNew = new Date().getTime() // 当前时间
  // console.log('传入的时间', timeValue, timeNew)
  var timeDiffer = timeNew - timeValue // 与当前时间误差
  // console.log('时间差', timeDiffer)
  var returnTime = ''
  if (timeDiffer <= 60000) { // 一分钟内
    returnTime = '刚刚'
  } else if (timeDiffer > 60000 && timeDiffer < 3600000) { // 1小时内
    returnTime = Math.floor(timeDiffer / 60000) + '分钟前'
  } else if (timeDiffer >= 3600000 && timeDiffer < 86400000 && isYestday(timeValue) === false) { // 今日
    returnTime = formatTime(timeValue).substr(11, 5)
  } else if (timeDiffer > 3600000 && isYestday(timeValue) === true) { // 昨天
    returnTime = '昨天' + formatTime(timeValue).substr(11, 5)
  } else if (timeDiffer > 86400000 && isYestday(timeValue) === false && isYear(timeValue) === true) { // 今年
    returnTime = formatTime(timeValue).substr(5, 11)
  } else if (timeDiffer > 86400000 && isYestday(timeValue) === false && isYear(timeValue) === false) { // 不属于今年
    returnTime = formatTime(timeValue).substr(0, 16)
  }
  return returnTime
}
function timeChatChange (timeValue) {
  timeValue = new Date(timeValue).getTime()
  var timeNew = new Date().getTime() // 当前时间
  // console.log('传入的时间', timeValue, timeNew)
  var timeDiffer = timeNew - timeValue // 与当前时间误差
  // console.log('时间差', timeDiffer)
  var returnTime = ''
  if (timeDiffer <= 60000) { // 一分钟内
    returnTime = formatTime(timeValue).substr(11, 5)
  } else if (timeDiffer > 60000 && timeDiffer < 3600000) { // 1小时内
    returnTime = formatTime(timeValue).substr(11, 5)
  } else if (timeDiffer >= 3600000 && timeDiffer < 86400000 && isYestday(timeValue) === false) { // 今日
    returnTime = formatTime(timeValue).substr(11, 5)
  } else if (timeDiffer > 3600000 && isYestday(timeValue) === true) { // 昨天
    returnTime = formatTime(timeValue).substr(5, 11)
  } else if (timeDiffer > 86400000 && isYestday(timeValue) === false && isYear(timeValue) === true) { // 今年
    returnTime = formatTime(timeValue).substr(5, 11)
  } else if (timeDiffer > 86400000 && isYestday(timeValue) === false && isYear(timeValue) === false) { // 不属于今年
    returnTime = formatTime(timeValue).substr(0, 16)
  }
  return returnTime
}

function isYestday (timeValue) { // 是否为昨天
  const date = new Date(timeValue)
  const today = new Date()
  if (date.getFullYear() === today.getFullYear() && date.getMonth() === today.getMonth()) {
    if (date.getDate() - today.getDate() === 1) {
      return true
    } else {
      return false
    }
  } else {
    return false
  }
}

function isYear (timeValue) { // 是否为今年
  const dateyear = new Date(timeValue).getFullYear()
  const toyear = new Date().getFullYear()
  // console.log(dateyear, toyear)
  if (dateyear === toyear) {
    return true
  } else {
    return false
  }
}

function formatTime (date) {
  var t = getTimeArray(date)
    return [t[0], t[1], t[2]].map(formatNumber).join('-') + ' ' + [t[3], t[4], t[5]].map(formatNumber).join(':')
  }
  
function getTimeArray (date) {
  date = new Date(date)
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()
  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()
  return [year, month, day, hour, minute, second].map(formatNumber)
}

// 转化日期 如2018-7-6 -->(2018-07-06)
function formatNumber (n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

