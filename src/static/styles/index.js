var styleLogic = {
  plugin: [
    {href: "./src/static/styles/normalize.min.css"},
    {href: "./src/static/styles/pages/index.less",rel: "stylesheet/less"},
    {href: "./src/static/styles/jquery-ui.min.css"},
  ],
  loadStyle(styleObj){
    var style = document.createElement("link");
    if(styleObj.hasOwnProperty("href")){
      style.href = styleObj.href;
    }
    style.rel = styleObj.hasOwnProperty("rel")?styleObj.rel:"stylesheet";
    style.type = styleObj.hasOwnProperty("type")?styleObj.type:"text/css";
    document.head.appendChild(style)
  },
  load(){
    var tempStr = CONFIG.isCache?`?rand=${Math.random()}`:''
    styleLogic.plugin.map(item=>{
      item.href = item.href+tempStr
      styleLogic.loadStyle(item)
    })
  }
}

styleLogic.load();