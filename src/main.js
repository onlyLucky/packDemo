// 主入口


var systemLogic = {
  // 加载js 文件
  loadScript(configObj){
    return new Promise((resolve, reject) => {
      var script = document.createElement('script');
      if(configObj.hasOwnProperty("src")){
        script.src = configObj.src;
      }
      script.type = "text/javascript";
      // 监听加载完成
      script.onload = () => {
        resolve();
      };
      // 监听加载错误
      script.onerror = () => {
        reject(new Error(`Script load error for ${url}`));
      };
      document.head.appendChild(script);
    });
  },
  // 初始化加载
  async load(){
    // 加载config
    await systemLogic.loadScript({src: `./public/config.js?rand=${Math.random()}`})

    var tempStr = CONFIG.isCache?`?rand=${Math.random()}`:''
    // 加载样式
    await systemLogic.loadScript({src: `./src/static/styles/index.js${tempStr}`})
    // 加载lib
    await systemLogic.loadScript({src: `./src/libs/index.js${tempStr}`})
    // 加载 工具文件
    await systemLogic.loadScript({src: `./src/utils/index.js${tempStr}`});
    // 加载其他类型文件
    var jsPlugin = [
      "./src/data/index.js",
      "./src/view/index.js",
    ];
    jsPlugin.map(item=>{
      systemLogic.loadScript({src: `${item}${tempStr}`});
    })
  },
}

// 重载
systemLogic.load()