/*
 * @Author: fg
 * @Date: 2022-06-21 16:33:59
 * @LastEditors: fg
 * @LastEditTime: 2024-08-27 14:26:30
 * @Description: 业务工具
 */
document.write(
  `<script type="text/javascript" src="./src/utils/uCommon.js?rand=${Math.random()}"></script>`
);
document.write(
  `<script type="text/javascript" src="./src/utils/time.js?rand=${Math.random()}"></script>`
);
document.write(
  `<script type="text/javascript" src="./src/utils/waterMark.js?rand=${Math.random()}"></script>`
);

var Utils = {
  
  /**
   * @description: 页面请求加载
   * @param {*} pageString 请求页面相对地址
   * @param {*} successCallBack 成功回调
   * @param {*} errorCallBack 失败回调
   * @return {*} 成功时返回相应数据，失败的时候返回失败的问题(异步调用函数，返回值获取为undefined，建议使用promise，版本es5兼容)
   */
  pageLoad: function (pageString, successCallBack, errorCallBack) {
    $.ajax({
      url: pageString,
      success: function (ResponseStr) {
        //加载内容
        if (successCallBack) {
          successCallBack(ResponseStr);
        }
        return ResponseStr;
      },
      //报错时调用
      error: function (__xmlRequest, __textStatus) {
        //__textStatus:success,error,timeout
        //请求完成
        if (errorCallBack) {
          errorCallBack(__xmlRequest, __textStatus);
        }
        return __textStatus;
      },
    });
  },

  pageAppLoad: function (pageString, successCallBack, errorCallBack) {
    $.ajax({
      url: pageString,
      success: function (ResponseStr) {
        //加载内容
        // 储存history
        Utils.handleHistory(pageString);
        $("#App").html("");
        dmData.noVideoFileList = []
        $("#App").html(ResponseStr);
        if (successCallBack) {
          successCallBack();
        }
      },
      //报错时调用
      error: function (__xmlRequest, __textStatus) {
        //__textStatus:success,error,timeout
        //请求完成
        if (errorCallBack) {
          errorCallBack(__xmlRequest, __textStatus);
        }
      },
    });
  },
  /**
   * @description:
   * @param {*} opt
   * @param {*} successCallBack
   * @param {*} errorCallBack
   * @return {*}
   */
  pageConLoad: function (opt, successCallBack, errorCallBack) {
    $.ajax({
      url: opt.path,
      success: function (ResponseStr) {
        //加载内容
        // 储存history
        Utils.handleHistory(opt.path);
        $(opt.domStr).html("");
        $(opt.domStr).html(ResponseStr);
        if (successCallBack) {
          successCallBack();
        }
      },
      //报错时调用
      error: function (__xmlRequest, __textStatus) {
        //__textStatus:success,error,timeout
        //请求完成
        if (errorCallBack) {
          errorCallBack(__xmlRequest, __textStatus);
        }
      },
    });
  },

  handleHistory(strHtml) {
    if (strHtml) {
      // ./views/main/model.html
      let tempArr = strHtml.split("/");
      let res = tempArr[tempArr.length - 1].split(".")[0];
      dmData.systemConfig.history = res;
      return res;
    }
  },

  /**
   * @description: 多文件打包下载
   * @param {*} files 文件数组  {path: string,title: string}
   * @param {*} filename 压缩包文件名
   * @return {*}
   */
  downloadFiles(files, filename) {
    let zip = new JSZip();
    let folder = zip.folder("files");
    Promise.resolve()
      .then(() => {
        return files.reduce((accumulator, item) => {
          return accumulator.then(() =>
            fetch(item.path)
              .then((resp) => resp.blob())
              .then((blob) => folder.file(item.title, blob))
          );
        }, Promise.resolve());
      })
      .then(() => {
        folder
          .generateAsync({ type: "blob" })
          .then((content) => saveAs(content, filename));
      });
  },
};

var DMUtil = function () {
  //获取服务器IP地址
  (this.getHost = function () {
    var host = location.host;

    if (host.indexOf(":") > 0) {
      var hostArray = host.split(":");
      host = hostArray[0];
    }
    return host;
  }),
    //获取AJAX数据（同步）
    (this.getAjaxData = function (url, type, data, dataType) {
      var callBackData;
      var ajaxObj = new Object();
      type = type || "get";
      data = data || "";
      dataType = dataType || "json";
      ajaxObj.url = url + "?r=" + Math.random();
      ajaxObj.type = type;
      ajaxObj.data = data;
      ajaxObj.dataType = dataType;
      ajaxObj.async = false;
      ajaxObj.success = function (dataObj) {
        callBackData = dataObj;
      };
      $.ajax(ajaxObj);
      return callBackData;
    }),
    //多事件绑定
    (this.bindEvent = function (obj, callback) {
      $(obj).unbind("click");
      callback =
        callback ||
        function () {
          console.warn("多事件绑定没有传递正确的方法");
        };
      var callbackFunction = this.throttle(callback, 300);
      // $(obj).bind("touchstart", function (e) {
      //     e.preventDefault()
      //     callback()
      // })
      $(obj).bind("click", function (e) {
        e.preventDefault();
        callbackFunction.call(obj); // 修改this指向
      });
    }),
    // 节流
    (this.throttle = function (fn, cycle) {
      var start = Date.now(),
        now,
        timer;
      cycle = cycle || 300;
      fn =
        fn ||
        function () {
          throw new TypeError("未传入需节流的方法");
        };
      return function () {
        var arg = arguments;
        now = Date.now();
        clearTimeout(timer);
        if (now - start >= cycle) {
          fn.apply(this, arg);
          start = now;
        } else {
          timer = setTimeout(
            function () {
              fn.apply(this, arg);
            }.bind(this),
            cycle
          );
        }
      };
    }),
    //=============各种提示框==============
    //顶部消息提示
    (this.topBoxOpen = function (txt, s) {
      //倒计时
      this.setTopBox;
      $(".topBox").addClass("active");
      $(".topBox").find(".topBoxCenter").html("").html(txt);
      //显示方式，有倒计时数时，使用倒计时方式
      clearTimeout(this.setTopBox);
      if (!s) {
        $(".topBoxRight").css("visibility", "visible");
        dm.bindEvent(".topBoxRight", function () {
          topBoxClose();
        });
      } else {
        $(".topBoxRight").css("visibility", "hidden");
        this.setTopBox = setTimeout(function () {
          topBoxClose();
        }, s * 1000);
      }
      //关闭
      function topBoxClose() {
        $(".topBox").removeClass("active");
        $(".topBox").find(".topBoxCenter");
      }
    }),
    //中下方提示
    (this.tsBoxOpen = function (txt) {
      //倒计时
      this.setTsBox;
      $(".tsBox").html("").addClass("active").html(txt);
      //倒计时方式
      clearTimeout(this.setTsBox);
      this.setTsBox = setTimeout(function () {
        $(".tsBox").removeClass("active");
      }, 2500);
    }),
    //中间确认框
    (this.boxDivOpen = function (txt, btn, hide) {
      $("#normalbox").addClass("active");
      $("#normalbox .boxDivTxt").html("").html(txt);
      $("#normalbox .boxDivBtn").html("").html(btn);
      if (hide !== undefined) {
        $("#normalbox .closeTo").show();
      } else {
        $("#normalbox .closeTo").hide();
      }
    }),
    //中间确认框
    (this.boxDivClose = function (txt, btn) {
      $("#normalbox").removeClass("active");
    }),
    //中间确认框
    (this.boxDivOpenSS = function (txt, btn) {
      $("#SSapply").addClass("active");
      $("#SSapply .boxDivTxt").html("").html(txt);
      $("#SSapply .boxDivBtn").html("").html(btn);
    }),
    //中间确认框
    (this.boxDivCloseSS = function (txt, btn) {
      $("#SSapply").removeClass("active");
    }),
    //中间确认框
    (this.boxDivOpenBS = function (txt, btn) {
      $("#BSapply").addClass("active");
      $("#BSapply .boxDivTxt").html("").html(txt);
      $("#BSapply .boxDivBtn").html("").html(btn);
    }),
    //中间确认框
    (this.boxDivCloseBS = function (txt, btn) {
      $("#BSapply").removeClass("active");
    }),
    //中间提示
    (this.tagBoxOpen = function (txt) {
      $(".tagBox").removeClass("pen");
      //倒计时
      this.setTagBox;
      $(".tagBox").html("").addClass("active").html(txt);
      //倒计时方式
      clearTimeout(this.setTagBox);
      this.setTagBox = setTimeout(function () {
        $(".tagBox").removeClass("active");
      }, 1000);
    }),
    //取时间
    (this.meetingTime = function (data, e) {
      if (data != "" && data != null) {
        //取日期
        dayArray = data.split(" ");
        var str = "";
        if (dayArray[0].indexOf("/") >= 0) str = dayArray[0].split("/");
        if (dayArray[0].indexOf("-") >= 0) str = dayArray[0].split("-");
        var localDate = str[0] + "年" + str[1] + "月" + str[2] + "日";
        //区分上下午
        if (dayArray.length > 1) {
          numArray = dayArray[1].split(":");
          if (numArray[0] > 12) {
            txt = "下午";
            num1 = numArray[0] - 12;
          } else {
            txt = "上午";
            num1 = numArray[0];
          }
          //星期
          var weekDay = [
            "星期日",
            "星期一",
            "星期二",
            "星期三",
            "星期四",
            "星期五",
            "星期六",
          ];
          var dateStr = data;
          var myDate = new Date(Date.parse(dateStr.replace(/-/g, "/")));
          switch (e) {
            case 1: //年月日（星期）时分
              return (
                localDate +
                "（" +
                weekDay[myDate.getDay()] +
                "）" +
                txt +
                num1 +
                ":" +
                numArray[1]
              );
              break;
            case 2: //年月日 时分
              return localDate + " " + numArray[0] + ":" + numArray[1];
              break;
            case 3: //时分
              return numArray[0] + ":" + numArray[1];
              break;
            case 4: // y/m/d h:s
              return dayArray[0] + " " + numArray[0] + ":" + numArray[1];
              break;
            case 5: // m/d week
              return (
                str[1] + "月" + str[2] + "日" + " " + weekDay[myDate.getDay()]
              );
              break;
            case 6: // m-d h-m
              return (
                str[1] + "-" + str[2] + " " + numArray[0] + ":" + numArray[1]
              );
              break;
          }
        }
      } else {
        return "-";
      }
    }),
    //聊天时间转换
    (this.timeFunData = function (dateStr) {
      var newstr = dateStr.replace(/-/g, "/");
      var date = new Date(newstr);
      var time_str = date.getTime().toString();
      return time_str.substr(0, 10);
    }),
    //取当前时间
    (this.formatDateTime = function (date) {
      date = date || new Date();
      var y = date.getFullYear();
      var m = date.getMonth() + 1;
      m = m < 10 ? "0" + m : m;
      var d = date.getDate();
      d = d < 10 ? "0" + d : d;
      var h = date.getHours();
      h = h < 10 ? "0" + h : h;
      var minute = date.getMinutes();
      minute = minute < 10 ? "0" + minute : minute;
      var second = date.getSeconds();
      second = second < 10 ? "0" + second : second;
      return y + "/" + m + "/" + d + " " + h + ":" + minute + ":" + second;
    }),
    //验证发送文字内容中的非法字符
    (this.isEmojiCharacter = function (substring) {
      if (substring) {
        var reg = new RegExp("[/.*\\/~#^$@%'/&%*]", "g");
        if (substring.match(reg)) {
          return true;
        }
        for (var i = 0; i < substring.length; i++) {
          var hs = substring.charCodeAt(i);
          if (0xd800 <= hs && hs <= 0xdbff) {
            if (substring.length > 1) {
              var ls = substring.charCodeAt(i + 1);
              var uc = (hs - 0xd800) * 0x400 + (ls - 0xdc00) + 0x10000;
              if (0x1d000 <= uc && uc <= 0x1f77f) {
                return true;
              }
            }
          } else if (substring.length > 1) {
            var ls = substring.charCodeAt(i + 1);
            if (ls == 0x20e3) {
              return true;
            }
          } else {
            if (0x2100 <= hs && hs <= 0x27ff) {
              return true;
            } else if (0x2b05 <= hs && hs <= 0x2b07) {
              return true;
            } else if (0x2934 <= hs && hs <= 0x2935) {
              return true;
            } else if (0x3297 <= hs && hs <= 0x3299) {
              return true;
            } else if (
              hs == 0xa9 ||
              hs == 0xae ||
              hs == 0x303d ||
              hs == 0x3030 ||
              hs == 0x2b55 ||
              hs == 0x2b1c ||
              hs == 0x2b1b ||
              hs == 0x2b50
            ) {
              return true;
            }
          }
        }
      }
    }),
    // 动态修改字体大小
    (this.resetFontSize = function (el, minFontSize, maxFontSize) {
      // 可见区域宽度
      var maxWidth = document.documentElement.clientWidth;
      // 初始化默认大小
      $(el).css({
        "font-size": 12,
        width: "max-content",
      });
      for (i = minFontSize; i < maxFontSize; i++) {
        // console.log($(el).width());
        if ($(el).width() > maxWidth) {
          $(el).css("font-size", i - 2);
          break;
        } else {
          $(el).css("font-size", i);
        }
      }
      $(el).css("width", "100%");
    }),
    //字符串补位
    (this.strPatch = function (t, e) {
      var str = "";
      var tlen = (t + 1).toString().length;
      if (tlen < e) {
        for (var i = 0; i < e - tlen; i++) {
          str = str + "0";
        }
      }
      str = str + (t + 1);
      return str;
    }),
    //取人名后两位
    (this.nameSplite = function (t) {
      if (typeof t == "string") {
        return t.substring(t.length - 2, t.length);
      } else {
        return t;
      }
    }),
    // 取地址传参
    (this.getUrlParam = function (name) {
      var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
      var r = window.location.search.substr(1).match(reg);
      if (r != null) return unescape(r[2]);
      return null;
    });

  //转为PDF路径
  this.convertTOPdf = function (filePath, ext) {
    switch (ext) {
      case "doc":
        {
          dmMethod.nowFileIsDoc = true;
          filePath = filePath.replace(".doc", ".pdf");
        }
        break;
      case "docx":
        {
          dmMethod.nowFileIsDoc = true;
          filePath = filePath.replace(".docx", ".pdf");
        }
        break;
      case "ppt":
        {
          dmMethod.nowFileIsDoc = false;
          filePath = filePath.replace(".ppt", ".pdf");
        }
        break;
      case "pptx":
        {
          dmMethod.nowFileIsDoc = false;
          filePath = filePath.replace(".pptx", ".pdf");
        }
        break;
      case "xls":
        {
          dmMethod.nowFileIsDoc = false;
          filePath = filePath.replace(".xls", ".pdf");
        }
        break;
      case "xlsx":
        {
          dmMethod.nowFileIsDoc = false;
          filePath = filePath.replace(".xlsx", ".pdf");
        }
        break;
      case "ofd":
        {
          dmMethod.nowFileIsDoc = false;
          filePath = filePath.replace(".ofd", ".pdf");
        }
        break;
    }
    return filePath;
  };

  this.getIpLast = function (ip) {
    if (ip) {
      var ipArray = ip.split(".");
      return ipArray[ipArray.length - 1];
    } else {
      return "";
    }
  };
};
var dm = new DMUtil(); //初始化公共方法

//系统类型
var sysType;
if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
  sysType = "ios";
  try {
    app.initialize();
  } catch (e) { }
} else if (/(Android)/i.test(navigator.userAgent)) {
  sysType = "az";
  try {
    app.initialize();
  } catch (e) { }
} else {
  sysType = "win";
}
