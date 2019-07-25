import {cloneDeep} from 'lodash'
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
          allowDrop: true, 
          "draggingTool.dragsLink": true, 
          "draggingTool.isGridSnapEnabled": true, 
          "linkingTool.isUnconnectedLinkValid": true, 
          "linkingTool.portGravity": 20, 
          "relinkingTool.isUnconnectedLinkValid": true, 
          "relinkingTool.portGravity": 20, 
          "relinkingTool.fromHandleArchetype": 
            objGo(go.Shape, "Diamond", {
              segmentIndex: 0,
              cursor: "pointer",
              desiredSize: new go.Size(8, 8),
              fill: "tomato",
              stroke: "darkred"
            }),
          "relinkingTool.toHandleArchetype": 
            objGo(go.Shape, "Diamond", {
              segmentIndex: -1,
              cursor: "pointer",
              desiredSize: new go.Size(8, 8),
              fill: "darkred",
              stroke: "tomato"
            }),
          "linkReshapingTool.handleArchetype": 
            objGo(go.Shape, "Diamond", {
              desiredSize: new go.Size(7, 7),
              fill: "lightblue",
              stroke: "deepskyblue"
            }),
          // rotatingTool: objGo(TopRotatingTool), 
          "rotatingTool.snapAngleMultiple": 15, 
          "rotatingTool.snapAngleEpsilon": 15, 
          // "undoManager.isEnabled": true, 
          "toolManager.mouseWheelBehavior": go.ToolManager.WheelZoom, 
          // "clickCreatingTool.archetypeNodeData": { text: "new node" }, 
          "commandHandler.copiesTree": false, 
        });
        that.myDiagram.commandHandler.doKeyDown = function() {
          var e = that.myDiagram.lastInput;
          var control = e.control || e.meta;
          var key = e.key;
          if (control && (key === 'C' || key === 'V')) return;
          // if (key === 'Del' || key === 'Backspace') return;
          go.CommandHandler.prototype.doKeyDown.call(this);
        };

      function makePort(name, spot, output, input) {     
        return objGo(go.Shape, "Circle",
          {
            fill: null,  
            stroke: null,   
            desiredSize: new go.Size(8, 8), 
            alignment: spot,  
            alignmentFocus: spot,  
            portId: name,  
            fromSpot: spot, toSpot: spot,  
            fromLinkable: output, toLinkable: input,  
            cursor: "pointer" 
          });
      }
      that.myDiagram.addDiagramListener("SelectionDeleted", function(e) {
        e.subject.each(function(n){
            that.delete(n.data)
       });
      })  
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
      that.myDiagram.nodeTemplate =  
        objGo(go.Node, "Spot",
          { locationSpot: go.Spot.Center },
          new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
          { selectable: true, selectionAdornmentTemplate: nodeSelectionAdornmentTemplate },
          { resizable: true, resizeObjectName: "PANEL", resizeAdornmentTemplate: nodeResizeAdornmentTemplate },
          { rotatable: true, rotateAdornmentTemplate: nodeRotateAdornmentTemplate },
          new go.Binding("angle").makeTwoWay(),
          objGo(go.Panel, "Auto",
            { name: "PANEL" },
            new go.Binding("desiredSize", "size", go.Size.parse).makeTwoWay(go.Size.stringify),
            objGo(go.Shape, "Rectangle",  
              {
                portId: "", 
                fromLinkable: true, toLinkable: true, cursor: "pointer",
                fill: "white",  
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
          makePort("T", go.Spot.Top, false, true),
          makePort("L", go.Spot.Left, true, true),
          makePort("R", go.Spot.Right, true, true),
          makePort("B", go.Spot.Bottom, true, false),
          { 
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
            "key": { readOnly: true, show: Inspector.showIfPresent },
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
      that.setKey()

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
            curve:  go.Link.Orthogonal,  //    go.Link.Bezier 连接的曲线  go.Link.JumpOver,
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
            objGo(go.TextBlock, ' ',
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
                objGo(go.Shape,  // 链接路径形状
                  { isPanelMain: true, strokeWidth: 2 }),
                objGo(go.Shape,  // 箭头
                  { toArrow: "Standard", stroke: null })
              ),
            model: new go.GraphLinksModel([  // 指定调色板的内容
              { text: "text", figure: "Circle", fill: "#00AD5F", width: 60, height: 60 ,key:'saf'},
              { text: "text", figure: "Database", fill: "lightgray", width: 60, height: 60 ,key:'fa'},
              { text: "text", figure: "Diamond", fill: "lightskyblue", width: 60, height: 60 },
              { text: "text", figure: "TriangleRight", fill: "#00AD5F", width: 60, height: 60 },
              { text: "text", figure: "TriangleDown", fill: "#00AD5F", width: 60, height: 60 },
              { text: "text", figure: "TriangleLeft", fill: "#00AD5F", width: 60, height: 60 },
              { text: "text", figure: "TriangleUp", fill: "#00AD5F", width: 60, height: 60 },
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
  clear(){
    this.myDiagram.nodes.each(n=>{
      n.findLinksConnected().each((link)=>{ 
        if(!link) return
        this.myDiagram.model.removeLinkData(link.data)
        ;});
      this.myDiagram.model.removeNodeData(n.data); 
    })
  }
  saveSub(){
    if(!this.checkRule()) return 
    var name = prompt('请输入子流程名称')
    if(name != '' && name != null){
        let data = cloneDeep(this.save())
        let key = this.uuid()
        data.nodeDataArray.forEach((item,index)=>{
          if( item.group) return
            item.group = key
        })
        data.nodeDataArray.push({key,text:name,isGroup:true})
        
        let dragData = {
          "nodeDataArray":data.nodeDataArray,
          "linkDataArray":data.linkDataArray,
          "name":name,
        }
        this.clear()
        return dragData
      }else{
        alert('必须输入流程名')
        return false
      }   
  }
  loadSub(data){
    let flag = true
    let groupArr = data.nodeDataArray.filter(item=>item.isGroup)
    this.myDiagram.nodes.each((n)=>{
      if(!flag) return 
      if(n.data.isGroup){
        if(groupArr.length > 0 && groupArr.some(item=>item.key == n.data.key)){
          flag = false
        }
      }
    })
    if(!flag){
      alert('已存在子流程，加载失败')
      return false
    }
    data.nodeDataArray.forEach(item=>{
      this.myDiagram.model.addNodeData(item)
    })
    data.linkDataArray.forEach(item=>{
      this.myDiagram.model.addLinkData(item);
    })
  }
  setKey(){
    let that = this
    this.myDiagram.addDiagramListener('ExternalObjectsDropped',function(e){
      e.subject.each(function(n){
        that.myDiagram.model.setDataProperty(n.data, 'key', that.uuid() )
        that.setForm(n.data)
     });
     
    })  
  }
  setForm(data){}
  delete(data){}
  checkRule(){
    try{
      let {nodes,links} = this.getData()
      this.linkNone(links)
      this.onlyOne(nodes,links)
      this.mustIfElse(links)
      return true
    }catch(err){
      return false
    }
  }
  linkNone(links){
    links.forEach(item=>{
      if(item.from && item.to){
        return true
      }else{
        alert('连线有错误')
        throw new Error('连线有错误')
      }
    })
  }
  getData(){
    let nodesArr = []
    this.myDiagram.nodes.each(({data})=>{
      if(data.isGroup) return
      nodesArr.push(data)
    })
    let linksArr = []
    this.myDiagram.links.each(({data})=>{
      linksArr.push(data)
    })
    return {
      nodes:nodesArr,
      links:linksArr
    }
   
  }
  onlyOne(nodes,links){
    let that = this
    let onlyOne = []
    let isOnly = true
    nodes.forEach(node=>{
      isOnly = true
      links.forEach(link=>{
        if(node.key == link.to){
          that.target.$store.commit('setParents',{father:link.from,son:link.to})
          isOnly = false
        }
      })
      if(isOnly){
        onlyOne.push(node)
      }
    })
    if(onlyOne.length == 1){
      return true
    }else if(onlyOne.length < 1){
      alert('你没有开始项')
      throw new Error('你没有开始项')
    }else if(onlyOne.length > 1){
      alert('你有两个以上的开始项')
      throw new Error('你有两个以上的开始项')
    }
  }
  mustIfElse(links){
    let twoUp = [];
    let one = {}
    links.forEach(item=>{
      if(one[item.from] && !twoUp.includes(item.from)){
        twoUp.push(item.from)
      }else{
        one[item.from] = 1
      }
    })
    twoUp.forEach(id=>{
      links.forEach(link=>{
        if(id == link.from && (!link.text || !link.text.trim())){
            alert('你必须在多分支添加条件')
            throw new Error('你必须在多分支添加条件')
        }
      })
    })
  }

  


}
export default FlowChart
