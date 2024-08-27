/*
 * @Author: fg
 * @Date: 2022-06-21 18:55:22
 * @LastEditors: fg
 * @LastEditTime: 2024-08-27 14:19:34
 * @Description: 公共utils
 */
var uCommon = {
  /**
   * @description: 字符串中间添加省略号，限制字数展示
   * @param {*} str 需要处理字符串
   * @param {*} start 初始值开始的位置数
   * @param {*} maxLen 展示最长字符串长度
   * @return {*} 字符串处理结果
   */
  handleWorkString: function (str, start, maxLen) {
    if (str.length > maxLen) {
      return str.substring(0, start) + '...' + str.substring(str.length - (maxLen - start), str.length)
    } else {
      return str
    }
  },
  /**
   * @description: pc端触摸滚动处理
   * @param {*} domStr 
   * @return {*}
   */
  scrollHandle: function (domStr) {
    $(document).ready(function () {
      var moveX = 0, moveY = 0, x = 0, y = 0;
      var dragFlag = false
      $(domStr).mousedown(function (e) {

        x = e.pageX;
        y = e.pageY;
        dragFlag = true;
      });
      document.onmousemove = function (e) {
        e.preventDefault();
        moveX = e.pageX;
        moveY = e.pageY;
        var disX = moveX - x;
        var disY = moveY - y;
        var originScrollTop = $(domStr).scrollTop();
        var resDis = 0
        resDis = originScrollTop - disY
        if (Math.abs(disY) > 6) {
          if (dragFlag) {
            $(domStr).scrollTop(resDis * 0.9)
          }
        }

      };
      document.onmouseup = function (e) {
        dragFlag = false;
      };

    });
  },
  /**
   * @description: 加载script
   * @param {*} jsPluginList script 地址
   * @return {*}
   */
  pluginJsLoad: function (jsPluginList) {
    var scriptStr = ''
    jsPluginList.map(item => {
      scriptStr += `<script type="text/javascript" src="${item}?rand=${Math.random()}"><\/script>`
    })
    document.write(scriptStr)
  },
  loadScript(configObj){

  },
  loadStyle(configObj){

  },

  /**
   * @description: 获取地址栏参数
   * @param {*} name 参数名称
   * @return {*} 返回参数值
   */
  getUrlParam: function (name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
  },

  /**
   * @description: 储存单位转换
   * @param {*} bytes 字节
   * @return {*} 转换后的结果
   */
  bytesUnit: function (bytes) {
    if (bytes === 0) return '0 B';
    var k = 1024,
      sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
      i = Math.floor(Math.log(bytes) / Math.log(k));
    return (bytes / Math.pow(k, i)).toFixed(2) + ' ' + sizes[i];
  },

  /* 
  *fun handleExtension 处理文件后缀方法
  *arg str匹配字符串 ext后缀名称 callback处理执行回调函数
  */
  handleExtension(str, ext, callback) {
    let reg = new RegExp('(?:' + ext + ')$')
    if (reg.test(str)) {
      callback()
    }
    return str
  },
  //时间格式
  formatDate(date) {

    var d = new Date(date), month = '' + (d.getMonth() + 1), day = '' + d.getDate(), year = d.getFullYear(), hour = d.getHours(), minute = d.getMinutes(), second = d.getSeconds();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    hour = hour > 9 ? hour : ("0" + hour);
    minute = minute > 9 ? minute : ("0" + minute);
    second = second > 9 ? second : ("0" + second);

    return [year, month, day].join('-') + " " + [hour, minute, second].join(':');
  },
  /**
   * @description: 计算间隔的天数
   * @param {*} start 
   * @param {*} end
   * @return {*}
   */
  minsDiff(start, end) {
    return Math.ceil(Math.abs(start - end) / 60000)
  },
  handleMobileMove(dom, pDom, moveType = 'both') {
    // 参数配置
    var startX = 0;  // 定义手指X轴初始坐标
    var startY = 0;   // 定义手指Y轴初始坐标
    var x = 0;   // 定义 盒子本身距离
    var y = 0;
    var maxX = pDom.offsetWidth - dom.offsetWidth
    var maxY = pDom.offsetHeight - dom.offsetHeight
    var minX = dom.offsetWidth
    var minY = 0
    console.log('maxX,maxY', minY, maxY)
    dom.addEventListener('touchstart', function (e) {
      startX = e.targetTouches[0].pageX // targetTouches 当前在DOM元素上手指有几根  [0] 代表 第一根手指
      startY = e.targetTouches[0].pageY
      x = this.offsetLeft;
      y = this.offsetTop;
    });
    dom.addEventListener('touchmove', function (e) {
      var currentX = e.targetTouches[0].pageX - startX;
      var currentY = e.targetTouches[0].pageY - startY;
      let tempPos = new Object();
      switch (moveType) {
        case 'both':
          tempPos = { x: currentX + x, y: currentY + y }
          break;
        case 'x':
          tempPos = { x: currentX + x }
          break;
        case 'y':
          tempPos = { y: currentY + y }
          break;
        default:
          break;
      }
      for (let key in tempPos) {
        if (key == 'x') {
          if (tempPos[key] > maxX) {
            tempPos[key] = maxX
          }
          if (tempPos[key] <= minX) {
            tempPos[key] = minX
          }
          dom.style.left = tempPos[key] + 'px';
        }
        if (key == 'y') {
          if (tempPos[key] > maxY) {
            tempPos[key] = maxY
          }
          if (tempPos[key] <= minY) {
            tempPos[key] = minY
          }
          dom.style.top = tempPos[key] + 'px';
        }
      }
      console.log()
    });
  },
  getStyle(obj, styleName) {
    if (obj.currentStyle) {
      return obj.currentStyle[styleName];
    } else {
      return getComputedStyle(obj, false)[styleName];
    }
  },
  /* 
  * @description: 摘取除自己外的其它会议室
  */
  getOtherMeetingPlace(roomNo) {
    let list = []
    for (let i = 0; i < dmData.meetingInfo.meetingPlaces.length; i++) {
      if (roomNo != dmData.meetingInfo.meetingPlaces[i].roomNo) {
        list.push(dmData.meetingInfo.meetingPlaces[i].roomNo)
      }
      if (roomNo == null || roomNo == undefined) {
        list.push(dmData.meetingInfo.meetingPlaces[i].roomNo)
      }
    }
    return list
  },
  /**
   * @description:数组去重
   * @return {*}
   */
  unique: function (arr) {
    return Array.from(new Set(arr))
  },
  /**
   * @description: 判断一个字符串是否为有效的JSON字符串
   * @param {*} str JSON字符串
   * @return {*} bool true false
   */
  isJsonString(str) {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  }
}