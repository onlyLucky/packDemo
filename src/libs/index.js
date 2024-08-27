var libsLogic = {
  plugin: [
    "./src/libs/less-1.7.0.js", //less

    "./src/libs/jquery-3.2.1.min.js", // jquery
    "./src/libs/jquery-ui.min.js",
    "./src/libs/jquery.ui.touch-punch.min.js",
  
    "./src/libs/rem.js", // rem
    
    "./src/libs/lodash_4.17.21.min.js",
  
    "./src/libs/srs/adapter-7.4.0.js", // SRS推流
    "./src/libs/srs/srs.sdk.js",
    "./src/libs/srs/winlin.utility.js",
    "./src/libs/srs/srs.page.js",
    "./src/libs/srs/srs.js",
  ],
  load(){
    var tempStr = CONFIG.isCache?`?rand=${Math.random()}`:''
    // 加载lib
    libsLogic.plugin.map(async item=>{
      await systemLogic.loadScript({src: `${item}${tempStr}`})
    })
  }
}

libsLogic.load();
