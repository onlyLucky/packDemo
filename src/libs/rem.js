/*
 * @Author: fg
 * @Date: 2022-05-05 14:58:49
 * @LastEditors: fg
 * @LastEditTime: 2022-09-27 15:29:40
 * @Description: rem 适配添加
 */
function resizeRem (num) {
  let currClientWidth, fontValue, originWidth
  // eslint-disable-next-line prefer-const
  num = num?num:1920
  originWidth = num // ui设计稿的宽度，一般750或640
  __resize()

  window.addEventListener('resize', __resize, false)

  function __resize () {
    currClientWidth = document.documentElement.clientWidth
    let temp = originWidth/currClientWidth
    if (currClientWidth >= 1920) {
      currClientWidth = 1920
    }
    if (currClientWidth < 1024) {
      currClientWidth = 1024
    }
    fontValue = ((625 * currClientWidth) / originWidth).toFixed(2)
    document.documentElement.style.fontSize = fontValue + '%'
  } 
}

// export default resizeRem

// 计算方式
/*
假设当前的分辨率为375，设计稿的分辨率750
两者之间的比例为 750/375 = 0.5

下面我们来计算一下1rem 等于多少 px

计算一下当前100% 占有多少 16像素的字（body、html默认字体大小为16px）
100/16 = 6.25

将上面的分辨率比例进行如下计算

0.5 * 625 = 312.5

后面进行百分号拼接（这里也就是进行*100 再添加%，相当于值不变）

所以在375分辨率下 1rem = 312.5%
由此可以得出 312.5% * 16px = 50px
所以 1rem = 50px

*/
