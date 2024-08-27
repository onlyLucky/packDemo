/**
 使用方法：
 waterMark.init({
    textArr:['文本加水印']
 })
 */
 var waterMark = {
  /**
   * 配置参数，均可重置
   * textArr必填
   */
  settings: {
      textArr: ['waterMark'], // 需要展示的文字，多行就多个元素【必填】
      font: "18px '微软雅黑'",// 字体样式
      fillStyle: 'rgba(170,170,170,0.4)', // 描边样式
      maxWidth: 200, // 文字水平时最大宽度
      minWidth: 120, // 文字水平时最小宽度
      lineHeight: 24, // 文字行高
      deg: -45, // 旋转的角度 0至-90之间
      marginRight: 150, // 每个水印的右间隔
      marginBottom: 50, // 每个水印的下间隔
      left: 20, // 整体背景距左边的距离
      top: 20, // 整体背景距上边的距离
      dom: '',//mask塞到那个dom里面
      maskDivId: 'maskImgDiv',//mask div dom的class名称
  },
  init: function (options) {
      var _this = this;
      _this.settings = Object.assign(_this.settings, options || {});
      _this.settings.minWidth = Math.min(_this.settings.maxWidth, _this.settings.minWidth); // 重置最小宽度
      var textArr = _this.settings.textArr;
      if (Object.prototype.toString.call(textArr) !== '[object Array]') {
          throw Error('水印文本必须放在数组中')
      }
      // 清除之前的水印
      if(document.getElementById(_this.settings.maskDivId)){
        document.getElementById(_this.settings.maskDivId).remove()
      }
      // 动态创建隐藏的canvas
      var c = _this._createCanvas();

      // 绘制canvas内容
      _this._draw(c, _this.settings);

      // 把canvas内容转为图片并绘制
      _this._convertCanvasToImage(c)
  },
  // 动态创建canvas
  _createCanvas: function () {
      var c = document.createElement('canvas');
      c.style.display = 'none';
      document.body.appendChild(c);
      return c;
  },
  _draw: function (c, settings) {
      var _this = this;
      var ctx = c.getContext("2d");

      // 切割超过最大宽度的文本并获取最大宽度
      var textArr = settings.textArr || [];
      var wordBreakTextArr = [];
      var maxWidthArr = [];
      textArr.forEach(function (text) {
          var result = _this._breakLinesForCanvas(ctx, text + '', settings.maxWidth, settings.font);
          wordBreakTextArr = wordBreakTextArr.concat(result.textArr);
          maxWidthArr.push(result.maxWidth);
      })
      maxWidthArr.sort(function (a, b) {
          return b - a;
      });

      // 根据需要切割结果，动态改变canvas的宽和高
      var maxWidth = Math.max(maxWidthArr[0], _this.settings.minWidth);
      var lineHeight = settings.lineHeight;
      var height = wordBreakTextArr.length * lineHeight;
      var degToPI = Math.PI * settings.deg / 180;
      var absDeg = Math.abs(degToPI);
      // 根据旋转后的矩形计算最小画布的宽高
      var hSinDeg = height * Math.sin(absDeg);
      var hCosDeg = height * Math.cos(absDeg);
      var wSinDeg = maxWidth * Math.sin(absDeg);
      var wCosDeg = maxWidth * Math.cos(absDeg);

      c.width = parseInt(hSinDeg + wCosDeg + settings.marginRight);
      c.height = parseInt(wSinDeg + hCosDeg + settings.marginBottom);

      // 宽高重置后，样式也需重置
      ctx.font = settings.font;
      ctx.fillStyle = settings.fillStyle;
      ctx.textBaseline = 'hanging' // 默认是alphabetic,需改基准线为贴着线的方式

      // 移动并旋转画布
      ctx.translate(0, wSinDeg);
      ctx.rotate(degToPI);

      // 绘制文本
      wordBreakTextArr.forEach(function (text, index) {
          ctx.fillText(text, 0, lineHeight * index);
      });
  },
  // 将绘制好的canvas转成图片
  _convertCanvasToImage: function (canvas) {
      var _this = this;
      var imgData = canvas.toDataURL("image/png");

      var divMask = document.createElement('div');
      divMask.style.cssText = 'position:fixed; left:0; top:0; right:0; bottom:0; z-index:9999; pointer-events:none;'
      divMask.style.backgroundImage = 'url(' + imgData + ')';
      divMask.style.backgroundPosition = _this.settings.left + 'px ' + _this.settings.top + 'px';
      divMask.id = _this.settings.maskDivId
      if(_this.settings.dom){
        _this.settings.dom.appendChild(divMask)
      }else{
        document.body.appendChild(divMask);
      }
      
  },
  // 寻找切换断点
  _findBreakPoint: function (text, width, context) {
      var min = 0;
      var max = text.length - 1;
      while (min <= max) {
          var middle = Math.floor((min + max) / 2);
          var middleWidth = context.measureText(text.substr(0, middle)).width;
          var oneCharWiderThanMiddleWidth = context.measureText(text.substr(0, middle + 1)).width;
          if (middleWidth <= width && oneCharWiderThanMiddleWidth > width) {
              return middle;
          }
          if (middleWidth < width) {
              min = middle + 1;
          } else {
              max = middle - 1;
          }
      }

      return -1;
  },
  // 根据最大宽度切割文字
  _breakLinesForCanvas: function (context, text, width, font) {
      var result = [];
      var maxWidth = 0; // 计算最大宽度
      if (font) {
          context.font = font;
      }
      var breakPoint = this._findBreakPoint(text, width, context);
      while (breakPoint !== -1) {
          result.push(text.substr(0, breakPoint));
          text = text.substr(breakPoint);
          maxWidth = width;
          breakPoint = this._findBreakPoint(text, width, context);
      }

      if (text) {
          result.push(text);
          var lastTextWidth = context.measureText(text).width;
          maxWidth = maxWidth !== 0 ? maxWidth : lastTextWidth;
      }

      return {
          textArr: result,
          maxWidth: maxWidth
      };
  }
}
