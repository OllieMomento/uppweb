import React, { Component } from 'react';
import ReactDOM from "react-dom";
import {
    mxGraph,
    mxParallelEdgeLayout,
    mxConstants,
    mxEdgeStyle,
    mxLayoutManager,
    mxCell,
    mxGeometry,
    mxRubberband,
    mxDragSource,
    mxKeyHandler,
    mxCodec,
    mxClient,
    mxConnectionHandler,
    mxUtils,
    mxToolbar,
    mxEvent,
    mxImage,
    mxFastOrganicLayout,
    mxCellTracker,
    mxObjectCodec,
    mxCodecRegistry,
    mxLog
} from "mxgraph-js";

class CustomData {
    constructor(value) {
        this.value = value;
    }
}

class Test extends Component {

    constructor(props) {
        super(props);
        this.state = {

        };
        var codec = new mxObjectCodec(new CustomData());
    }


    componentDidMount() {
        this.componentDidUpdate()
    }

    componentDidUpdate() {
        this.loadGraph()
    }

    read(graph, filename) {
        var req = mxUtils.load(filename);
        var root = req.getDocumentElement();
        var dec = new mxCodec(root.ownerDocument);
        console.log(filename)
        console.log(dec)

        dec.decode(root, graph.getModel());
    }

    encode(enc, obj) {
        console.log("encode method");
        var node = enc.document.createElement('CustomData');
        mxUtils.setTextContent(node, JSON.stringify(obj));

        return node;
    };


    loadGraph() {
        var container = ReactDOM.findDOMNode(this.refs.divGraph);
        console.log(container);
        // Checks if the browser is supported

        // Program starts here. Creates a sample graph in the
        // DOM node with the specified ID. This function is invoked
        // from the onLoad event handler of the document (see below).

        // Checks if the browser is supported
        if (!mxClient.isBrowserSupported()) {
            // Displays an error message if the browser is not supported.
            mxUtils.error('Browser is not supported!', 200, false);
        }
        else {
            // Creates the graph inside the given container
            var graph = new mxGraph(container);





            // Gets the default parent for inserting new cells. This
            // is normally the first child of the root (ie. layer 0).
            var parent = graph.getDefaultParent();
            console.log("parent:  " + parent)

            // Adds cells to the model in a single step
            graph.getModel().beginUpdate();


            try {
                /*
                for (let index = 0; index < 5; index++) {
                    graph.insertVertex(parent, null, (index + ' hello'), 20*index, 20*index, 80*index, 30*index, 'fillColor=pink');
                    
                }*/
                /*
                                var v1 = graph.insertVertex(parent, null, 'Hello,', 20, 20, 80, 30);
                                //v1.data = new CustomData('v1');
                                var v2 = graph.insertVertex(parent, null, 'World!', 200, 150, 80, 30);
                                //v2.data = new CustomData('v2');
                                var e1 = graph.insertEdge(parent, null, '', v1, v2);
                
                                var enc = new mxCodec();
                                var cells = graph.getModel();
                                var xmlString = mxUtils.getPrettyXml(enc.encode(cells));
                                console.log(xmlString);*/


                var xmlString = `<mxGraphModel>
               <root>
                 <mxCell id="0"/>
                 <mxCell id="1" parent="0"/>
                 <mxCell id="2" value="Hello," vertex="1" parent="1">
                   <mxGeometry x="20" y="20" width="80" height="30" as="geometry"/>
                 </mxCell>
                 <mxCell id="3" value="World!" vertex="1" parent="1">
                   <mxGeometry x="200" y="150" width="80" height="30" as="geometry"/>
                 </mxCell>
                 <mxCell id="4" value="" edge="1" parent="1" source="2" target="3">
                   <mxGeometry relative="1" as="geometry"/>
                 </mxCell>
               </root>
             </mxGraphModel>`




            }
            finally {
                // Updates the display
                graph.getModel().endUpdate();
            }

            var doc = mxUtils.parseXml(xmlString);
            //console.log(doc)
            var codec = new mxCodec(doc);
            //console.log(codec)
            var tmp = codec.decode(doc.documentElement, graph.getModel());
            //console.log(tmp)

            var cell = tmp.firstChild;
            //console.log(cell)

            /*
            var elt = doc.documentElement.firstChild;
            var str = JSON.stringify(elt, null, 4);
            console.log("elt: " + str)

            while (elt != null) {
                var cell = codec.decode(elt);
      
                //graph.insertVertex(parent, null, (index + ' hello'), 20*index, 20*index, 80*index, 30*index, 'fillColor=pink');
                elt = elt.nextSibling;
            }*/

            //graph.addCells(cells);
            //console.log(str)

            var xml = `
            <mxGraphModel>
                <root>
                    <mxCell id="0"/>
                    <mxCell id="1" parent="0"/>
                    <mxCell id="2" value="Hello," vertex="1" parent="1">
                        <mxGeometry x="20" y="20" width="80" height="30" as="geometry"/>
                    </mxCell>
                    <mxCell id="3" value="World!" vertex="1" parent="1">
                        <mxGeometry x="200" y="150" width="80" height="30" as="geometry"/>
                    </mxCell>
                    <mxCell id="4" value="" edge="1" parent="1" source="2" target="3">
                        <mxGeometry relative="1" as="geometry"/>
                    </mxCell>
                </root>
            </mxGraphModel>`
            var doc = mxUtils.parseXml(xml);
            var codec = new mxCodec(doc);
            var model = codec.decode(doc.documentElement, graph.getModel())
            var cells = model.getElementsByTagName("mxCell");
            var cellArr = Array.from(cells);
            var vertexes = [];
            console.log(cellArr)

            for (var i = 0; i < cellArr.length; i++) { 
                let element = cellArr[i]      
                var id = element.getAttribute("id")  
                var value = element.getAttribute("value")    

                //If element is Vertex/cell
                if(element.hasAttribute("vertex")){                    
                    
                    var geometry = element.getElementsByTagName("mxGeometry");
                    var x = geometry[0].getAttribute("x")
                    var y = geometry[0].getAttribute("y")
                    var width = geometry[0].getAttribute("width")
                    var height = geometry[0].getAttribute("height")

                    //add vertex
                    vertexes[i] = graph.insertVertex(parent, id, value, x, y, width, height, 'fillColor=pink');
                }
                //If element is Edge
                else if(element.hasAttribute("edge")){
                    var source = element.getAttribute("source")
                    var target = element.getAttribute("target")

                    var sourceElement = vertexes[source];
                    var targetElement = vertexes[target];
                    
                    //add Edge
                    graph.insertEdge(parent, id, value, sourceElement, targetElement)

                }
                
                
            }
/*
            while (elt != null) {
                cell = codec.decode(elt);
                console.log(cell);
                elt = elt.nextSibling;
            }*/

        }

    }


    render() {
        return (
            <div className="graph-container" ref="divGraph" id="divGraph" />
        );


    }
}

export default Test;