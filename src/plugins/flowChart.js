class FlowChart {
  constructor(options) {
    if (!options.myDiagramDiv) throw new Error('画布node节点必须传入')
    if (!options.myPaletteDiv) throw new Error('模板node必须传入')
    this.selectNode = options.selectNode || null
    this.myDiagramDiv = options.myDiagramDiv
    this.myPaletteDiv = options.myPaletteDiv
    this.target = options.vue
    this.myDiagram = ''
    this.myPalette = ''
    this.init()
  }
  init() {
    var that = this
    function basic(){
      var objGo = go.GraphObject.make; // 创建画布
      that.myDiagram = objGo(go.Diagram, that.myDiagramDiv, // 画布绑定的Div的ID 初始化画布
        {
          grid: objGo(go.Panel, "Grid", //创造模型节点  网格  interval 间距
            objGo(go.Shape, "LineH", {
              stroke: "lightgray",
              strokeWidth: 0.5
            }),
            objGo(go.Shape, "LineH", {
              stroke: "gray",
              strokeWidth: 0.5,
              interval: 10
            }),
            objGo(go.Shape, "LineV", {
              stroke: "lightgray",
              strokeWidth: 0.5
            }),
            objGo(go.Shape, "LineV", {
              stroke: "gray",
              strokeWidth: 0.5,
              interval: 10
            })
          ),
          allowDrop: true, // 允许从模型节点拖拽过来
          "draggingTool.dragsLink": true, //拖拽链接
          "draggingTool.isGridSnapEnabled": true, //是否启用网格快照
          "linkingTool.isUnconnectedLinkValid": true, //未连接的链接是否有效
          "linkingTool.portGravity": 20, // 港重力
          "relinkingTool.isUnconnectedLinkValid": true, // 未连接的链接是否有效
          "relinkingTool.portGravity": 20, // 港重力
          "relinkingTool.fromHandleArchetype": //从处理原型
            objGo(go.Shape, "Diamond", {
              segmentIndex: 0,
              cursor: "pointer",
              desiredSize: new go.Size(8, 8),
              fill: "tomato",
              stroke: "darkred"
            }),
          "relinkingTool.toHandleArchetype": // to --from
            objGo(go.Shape, "Diamond", {
              segmentIndex: -1,
              cursor: "pointer",
              desiredSize: new go.Size(8, 8),
              fill: "darkred",
              stroke: "tomato"
            }),
          "linkReshapingTool.handleArchetype": //  handle
            objGo(go.Shape, "Diamond", {
              desiredSize: new go.Size(7, 7),
              fill: "lightblue",
              stroke: "deepskyblue"
            }),
          // rotatingTool: objGo(TopRotatingTool), // 旋转工具
          "rotatingTool.snapAngleMultiple": 15, //提前角多
          "rotatingTool.snapAngleEpsilon": 15, //斜角
          "undoManager.isEnabled": true, // 撤销功能 ctrl + z
          "toolManager.mouseWheelBehavior": go.ToolManager.WheelZoom, //滚轮放大缩小
          "clickCreatingTool.archetypeNodeData": { text: "new node" }, //支持双击点击创建一个新节点
          "commandHandler.copiesTree": true, //允许使用ctrl+c、ctrl+v复制粘贴
        });
  
      // --------------------------------------------------------------------------------------------------
      // 定义用于创建通常透明的"端口"的函数
      //"name"用作GraphObject。portId,"spot"用于控制链接如何连接
      //以及端口在节点上的位置,以及boolean"output"和"input"参数
      //控制用户是否可以从端口或到端口绘制链接
      function makePort(name, spot, output, input) {     //连接线的小端口
        //端口基本上只是一个透明的小正方形  
        return objGo(go.Shape, "Circle",
          {
            fill: null,  // 默认情况下看不到;设置为半透明灰色的showSmallPorts,定义如下  背景颜色
            stroke: null,   //边框颜色
            desiredSize: new go.Size(8, 8),  //大小
            alignment: spot,  // 对齐主形状上的端口
            alignmentFocus: spot,  // 对齐主形状上的形状端口
            portId: name,  // 将此对象声明为"port"
            fromSpot: spot, toSpot: spot,  // 声明此端口上链接可能连接的位置
            fromLinkable: output, toLinkable: input,  // 声明用户是否可以从这里绘制链接
            cursor: "pointer"  // 显示不同的光标以指示潜在的链接点
          });
      }
  
      //节点选择装饰模板
      var nodeSelectionAdornmentTemplate =
        objGo(go.Adornment, "Auto",
          objGo(go.Shape, { fill: null, stroke: "deepskyblue", strokeWidth: 1.5, strokeDashArray: [4, 2] }),
          objGo(go.Placeholder)
        );
  
      //节点大小调整装饰模板
      var nodeResizeAdornmentTemplate =
        objGo(go.Adornment, "Spot",
          { locationSpot: go.Spot.Right },
          objGo(go.Placeholder),
          objGo(go.Shape, { alignment: go.Spot.TopLeft, cursor: "nw-resize", desiredSize: new go.Size(6, 6), fill: "lightblue", stroke: "deepskyblue" }),
          objGo(go.Shape, { alignment: go.Spot.Top, cursor: "n-resize", desiredSize: new go.Size(6, 6), fill: "lightblue", stroke: "deepskyblue" }),
          objGo(go.Shape, { alignment: go.Spot.TopRight, cursor: "ne-resize", desiredSize: new go.Size(6, 6), fill: "lightblue", stroke: "deepskyblue" }),
  
          objGo(go.Shape, { alignment: go.Spot.Left, cursor: "w-resize", desiredSize: new go.Size(6, 6), fill: "lightblue", stroke: "deepskyblue" }),
          objGo(go.Shape, { alignment: go.Spot.Right, cursor: "e-resize", desiredSize: new go.Size(6, 6), fill: "lightblue", stroke: "deepskyblue" }),
  
          objGo(go.Shape, { alignment: go.Spot.BottomLeft, cursor: "se-resize", desiredSize: new go.Size(6, 6), fill: "lightblue", stroke: "deepskyblue" }),
          objGo(go.Shape, { alignment: go.Spot.Bottom, cursor: "s-resize", desiredSize: new go.Size(6, 6), fill: "lightblue", stroke: "deepskyblue" }),
          objGo(go.Shape, { alignment: go.Spot.BottomRight, cursor: "sw-resize", desiredSize: new go.Size(6, 6), fill: "lightblue", stroke: "deepskyblue" })
        );
  
  
      //节点旋转装饰模板
      var nodeRotateAdornmentTemplate =
        objGo(go.Adornment,
          { locationSpot: go.Spot.Center, locationObjectName: "CIRCLE" },
          objGo(go.Shape, "Circle", { name: "CIRCLE", cursor: "pointer", desiredSize: new go.Size(7, 7), fill: "lightblue", stroke: "deepskyblue" }),
          objGo(go.Shape, { geometryString: "M3.5 7 L3.5 30", isGeometryPositioned: true, stroke: "deepskyblue", strokeWidth: 1.5, strokeDashArray: [4, 2] })
        );
     
      //节点模板
      that.myDiagram.nodeTemplate =    //定义个简单的模板节点  Spot
        objGo(go.Node, "Spot",
          { locationSpot: go.Spot.Center },
          new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),   //根据对关系图的更改来更新一些数据属性是很常见的。例如,当用户更改部分时。通过拖动节点,可以使用TwoWay绑定自动保持节点的模型数据同步。
          { selectable: true, selectionAdornmentTemplate: nodeSelectionAdornmentTemplate },
          { resizable: true, resizeObjectName: "PANEL", resizeAdornmentTemplate: nodeResizeAdornmentTemplate },
          { rotatable: true, rotateAdornmentTemplate: nodeRotateAdornmentTemplate },
          new go.Binding("angle").makeTwoWay(),
          // 主对象是一个用形状包围文本块的面板
          objGo(go.Panel, "Auto",
            { name: "PANEL" },
            new go.Binding("desiredSize", "size", go.Size.parse).makeTwoWay(go.Size.stringify),
            objGo(go.Shape, "Rectangle",  // 默认图
              {
                portId: "", // 默认端口:如果链接数据上没有点,则使用最近的端口
                fromLinkable: true, toLinkable: true, cursor: "pointer",
                fill: "white",  // 默认的颜色
                strokeWidth: 2,
              },
              new go.Binding("figure"),
              new go.Binding("fill")),
              new go.Binding('width'),
              new go.Binding('height'),
            objGo(go.TextBlock,
              {
                font: "bold 11pt Helvetica, Arial, sans-serif",
                margin: 8,
                maxSize: new go.Size(160, NaN),
                wrap: go.TextBlock.WrapFit,
                editable: true
              },
              new go.Binding("text").makeTwoWay())
          ),
          // 四个命名的小港口,每边一个:
          makePort("T", go.Spot.Top, false, true),
          makePort("L", go.Spot.Left, true, true),
          makePort("R", go.Spot.Right, true, true),
          makePort("B", go.Spot.Bottom, true, false),
          { // 处理鼠标进入/离开事件来显示/隐藏端口
            mouseEnter: function (e, node) { showSmallPorts(node, true); },
            mouseLeave: function (e, node) { showSmallPorts(node, false); },
            doubleClick: function (e, obj) { that.showMessage(obj.part.data); },
          }
        );
  
      function showSmallPorts(node, show) {     //控制鼠标移入移出的连接点的显示隐藏
        node.ports.each(function (port) {
          if (port.portId !== "") {  // 不要更改默认端口,这是一个大的形状
            port.fill = show ? "rgba(0,0,0,.3)" : null;
          }
        });
      }
      var inspector = new Inspector(that.selectNode, that.myDiagram,
        {
          properties: {
            // key would be automatically added for nodes, but we want to declare it read-only also:
            "key": { readOnly: true, show: Inspector.showIfPresent },
            // fill and stroke would be automatically added for nodes, but we want to declare it a color also:
            "fill": { show: Inspector.showIfPresent, type: 'color' },
            "stroke": { show: Inspector.showIfPresent, type: 'color' },
            'loc': { show: Inspector.showIfPresent },
            'width': { show: Inspector.showIfPresent },
            'height': { show: Inspector.showIfPresent },
          }
        });
      // that.myDiagram.addDiagramListener("ChangedSelection", function(diagramEvent) {
      //       console.log(diagramEvent)
  
      //     });
    
      that.myDiagram.addDiagramListener('ExternalObjectsDropped',function(e){
          e.subject.each(function(n){
            // n.data.key = that.uuid()
            that.myDiagram.model.setDataProperty(n.data, 'key', that.uuid() )
         });
      })  

      var linkSelectionAdornmentTemplate =
        objGo(go.Adornment, "Link",
          objGo(go.Shape,
            { isPanelMain: true, fill: null, stroke: "deepskyblue", strokeWidth: 0 })  // 使用选择对象的笔画宽度
        );
     
      //链接模板
      that.myDiagram.linkTemplate =
        objGo(go.Link,  // 整个链接面板
          { selectable: true, selectionAdornmentTemplate: linkSelectionAdornmentTemplate },
          { relinkableFrom: true, relinkableTo: true, reshapable: true },
          {
            routing: go.Link.AvoidsNodes,
            curve: go.Link.JumpOver, //    go.Link.Bezier 连接的曲线
            corner: 5,
            toShortLength: 4,
          },
          //makeTwoWay 通常希望model根据拖动时动态更改数据
          new go.Binding("points").makeTwoWay(),
          objGo(go.Shape,  // 链接路径形状
            { isPanelMain: true, strokeWidth: 2 }),
          objGo(go.Shape,  // 箭头
            { toArrow: "Standard", stroke: null }),
          objGo(go.Panel, "Auto",
            new go.Binding("visible", "isSelected").ofObject(),
            objGo(go.Shape, "RoundedRectangle",  // 链接的形状
              { fill: "#F8F8F8", stroke: null }),
            objGo(go.TextBlock, 'write here',
              {
                textAlign: "center",
                font: "10pt helvetica, arial, sans-serif",
                stroke: "#919191",
                margin: 2,
                minSize: new go.Size(10, NaN),
                editable: true
              },
              new go.Binding("text").makeTwoWay())
          ),
          {
  
            click: function (e, obj) { that.showLink(obj.part.data); },
  
          }
        );
  
      // load();  //   从JSON文本加载初始关系图
      // let nodeDataArrayKey = []
      // let nodeDataArray = []
      // function random(a, b) {
      //   return Math.round(Math.random() * (b - a) + a)
      // }
      // function randomColor() {
      //   return `rgb(${random(0, 255)},${random(0, 255)},${random(0, 255)})`
      // }
      // go.Shape.getFigureGenerators().toArray().forEach(item => {
      //   nodeDataArrayKey.push(item.key)
      // })
      // Array.from(new Set(nodeDataArrayKey)).forEach(item => {
      //   nodeDataArray.push({ text: 'text', figure: item, width: 60, height: 60, fill: randomColor() })
      // })
  
      // 初始化页面左侧的调色板   是myDiagram 的一个扩展类
      that.myPalette =
        objGo(go.Palette, that.myPaletteDiv,  // 必须命名或引用DIV HTML元素吗
          {
            layout: objGo(go.GridLayout, { alignment: go.GridLayout.Location }),
            maxSelectionCount: 1,
            nodeTemplateMap: that.myDiagram.nodeTemplateMap,  // 如果你想要调色板显示与你的主图相同的数据完全相同的节点,你可以让它共享主图的模板
            // nodeTemplateMap:paletteTepplateMap,
            linkTemplate: // 在这个调色板中简化链接模板
              objGo(go.Link,
                { // 因为GridLayout。对齐是位置,节点有locationSpot == Spot.Center,
                  // 要以相同的方式排列链接,我们必须假装链接具有相同的位置点
                  locationSpot: go.Spot.Center,
                  selectionAdornmentTemplate:
                    objGo(go.Adornment, "Link",
                      { locationSpot: go.Spot.Center },
                      objGo(go.Shape,
                        { isPanelMain: true, fill: null, stroke: "deepskyblue", strokeWidth: 0 }),
                      objGo(go.Shape,  // 箭头
                        { toArrow: "Standard", stroke: null })
                    )
                },
                {
                  routing: go.Link.AvoidsNodes,
                  curve: go.Link.JumpOver,
                  corner: 5,
                  toShortLength: 4
                },
                new go.Binding("points"),
                //new go.Binding([origin], [target], [filter = Func]) 这是 gojs 中的数据绑定, 使用该方法实//现了模板与真实数据之间的传
                // 递该方法能在任意构造器中使用
                // origin: 该构造器中的属性名
                // target: 需要绑定到数据集中的属性名
                // filter: 过滤函数
                objGo(go.Shape,  // 链接路径形状
                  { isPanelMain: true, strokeWidth: 2 }),
                objGo(go.Shape,  // 箭头
                  { toArrow: "Standard", stroke: null })
              ),
            model: new go.GraphLinksModel([  // 指定调色板的内容
              { text: "text", figure: "Circle", fill: "#00AD5F", width: 60, height: 60 ,key:'saf'},
              { text: "text", figure: "Database", fill: "lightgray", width: 60, height: 60 ,key:'fa'},
              { text: "text", figure: "Diamond", fill: "lightskyblue", width: 60, height: 60 },
              // { text: "text", figure: "Circle", fill: "#CE0620", width: 60, height: 60 },
              // { text: "text", figure: "RoundedRectangle", fill: "lightyellow", width: 60, height: 60 },
              // { text: "text", figure: "Rectangle", fill: "#00AD5F", width: 60, height: 60 }, 
              // { text: "text", figure: "Ellipse", fill: "#00AD5F", width: 60, height: 60 },
              { text: "text", figure: "TriangleRight", fill: "#00AD5F", width: 60, height: 60 },
              { text: "text", figure: "TriangleDown", fill: "#00AD5F", width: 60, height: 60 },
              { text: "text", figure: "TriangleLeft", fill: "#00AD5F", width: 60, height: 60 },
              { text: "text", figure: "TriangleUp", fill: "#00AD5F", width: 60, height: 60 },
              // { text: "text", figure: "MinusLine", fill: "#00AD5F", width: 60, height: 60 },
              // { text: "text", figure: "PlusLine", fill: "#00AD5F", width: 60, height: 60 },
              // { text: "text", figure: "XLine", fill: "#00AD5F", width: 60, height: 60 },
              // { text: "text", figure: "Hexagon", fill: "#00AD5F", width: 60, height: 60 },
              // ...nodeDataArray
            ], [
                // 调色板还有一个断开连接的链接,用户可以拖放该链接
                // { points: new go.List(go.Point).addAll([new go.Point(0, 0), new go.Point(30, 0), new go.Point(30, 40), new go.Point(60, 40)]) }
              ])
          });
      
    }
      
    basic()
    function TopRotatingTool() {
      go.RotatingTool.call(this);
    }
    go.Diagram.inherit(TopRotatingTool, go.RotatingTool);
    TopRotatingTool.prototype.updateAdornments = function (part) {
      go.RotatingTool.prototype.updateAdornments.call(this, part);
      var adornment = part.findAdornment("Rotating");
      if (adornment !== null) {
        adornment.location = part.rotateObject.getDocumentPoint(new go.Spot(0.5, 0, 0, -30));  // 上面中间最高
      }
    };

    /** @override */
    TopRotatingTool.prototype.rotate = function (newangle) {
      go.RotatingTool.prototype.rotate.call(this, newangle + 90);
    };
    // --------------------------------------------------------------


    
  // 显示用户可以编辑的JSON格式的图表模型
  // function save() {   //储存
  //   saveDiagramProperties();  // 在写JSON之前先做这个
  //   document.getElementById("mySavedModel").value = myDiagram.model.toJson();
  //   myDiagram.isModified = false;
  // }
  // function load() {   //加载
  //   myDiagram.model = go.Model.fromJson(document.getElementById("mySavedModel").value ) ;   //创建模型数据 每一个数据都代表相应的元素,并且将模型绑定在画布上
  //   loadDiagramProperties();  // 按照模型来做。模型数据已经进入内存
  // }

  // function saveDiagramProperties() {   //储存流程信息到json
  //   myDiagram.model.modelData.position = go.Point.stringify(myDiagram.position);
  // }
  // function loadDiagramProperties(e) {     // 根据信息加载流程图
  //   // set Diagram.initialPosition, not Diagram.position, to handle initialization side-effects
  //   var pos = myDiagram.model.modelData.position;
  //   if (pos) myDiagram.initialPosition = go.Point.parse(pos);
  // }




    // function expt(){
    //   var name = prompt('请输入子流程名称')
    //   var oc = document.querySelector('#myDiagramDiv').children[0]
    //   var srcSource = oc.toDataURL('image/jpg');  //图片类型 base64
    //   let div = document.createElement('div')
    //   saveDiagramProperties();  // 在写JSON之前先做这个
    //   let data = JSON.parse(myDiagram.model.toJson())
    //   let dragData = {
    //     "nodeDataArray":data.nodeDataArray,
    //     "linkDataArray":data.linkDataArray
    //   }
    //   div.dataJson = dragData ;
    //   div.dataName = name
    //   div.draggable = true
    //   div.style.cssText='width:60px;height:60px;border:1px solid green;margin:5px;background-image:url('+srcSource+');background-size:100% 100%;float:left'
    //   document.querySelector('.pic').appendChild(div)
    // }
    // var dragImg = document.querySelector('.pic')
    // dragImg.addEventListener('dblclick',function(eve){
    //   let target = eve.target || eve.srcElement
    //   if(target.nodeName  !== 'DIV') return
    //   saveDiagramProperties();  // 在写JSON之前先做这个
    //   freshData = JSON.parse(myDiagram.model.toJson())
    //   let keyArr = [],maxKey
    //   freshData.nodeDataArray.forEach(item => {
    //         keyArr.push(item.key)
    //   });
    //   if(keyArr.length == 0 || Math.max.apply(null,keyArr) < 0){
    //     maxKey = 1
    //   }else {
    //     maxKey = Math.max.apply(null,keyArr) 
    //   }
    // let group = target.dataJson ,groupName = target.dataName
    // let groupKey = maxKey++
    //   group.nodeDataArray.forEach((item,index)=>{
    //     if(!item.group){
    //       let key= maxKey++
    //       group.linkDataArray.forEach((value,i)=>{
    //         if(item.key == value.from){
    //           value.from = key
    //         }
    //         if(item.key == value.to){
    //           value.to = key
    //         }
    //       })
    //       item.key = key
    //       item.group = groupKey
    //     }
    //   })
    //   group.nodeDataArray.push({
    //     key:groupKey,text:groupName,isGroup:true
    //   })
      
    //   group.nodeDataArray.forEach(item=>{
    //     myDiagram.model.addNodeData(item)
    //   })
    //   group.linkDataArray.forEach(item=>{
    //     myDiagram.model.addLinkData(item);
    //   })
    // })
  }
  showMessage(data) {}
  showLink(data) {}
  save(){
    this.myDiagram.model.modelData.position = go.Point.stringify(this.myDiagram.position);
    let json = JSON.parse(this.myDiagram.model.toJson());
    return json
  }
  uuid(){
      var s = [];
      var hexDigits = "0123456789abcdef";
      for (var i = 0; i < 36; i++) {
          s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1); // 0X10  16进制  表示 16
      }
      s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
      s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
      s[8] = s[13] = s[18] = s[23] = "-";
    
      var uuid = s.join("");
      let time = Date.parse(new Date()).toString()
      return uuid+time;
  }

}
export default FlowChart
