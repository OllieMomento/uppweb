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
    mxCellTracker
} from "mxgraph-js";


class Test extends Component {

    constructor(props) {
        super(props);
        this.state = {

        };
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
                               var v1 = graph.insertVertex(parent, null, 'Hello,', 20, 20, 80, 30, 'fillColor=pink');
                               var v2 = graph.insertVertex(parent, null, 'World!', 200, 150, 80, 30, 'fillColor=blue');
                               var v3 = graph.insertVertex(parent, null, 'World!', 20, 150, 80, 30, 'fillColor=red');
                               var e1 = graph.insertEdge(parent, null, 'Connect', v1, v2, 'perimeterSpacing=4;strokeWidth=4;labelBackgroundColor=white;fontStyle=1');
               
               */
                //var  cell = <mxCell id="2" value="Hello," vertex="1"/>


                var xml = '<root><mxCell id="2" value="Hello," vertex="1"><mxGeometry x="20" y="20" width="80" height="30" as="geometry"/></mxCell><mxCell id="3" value="World!" vertex="1"><mxGeometry x="200" y="150" width="80" height="30" as="geometry"/></mxCell><mxCell id="4" value="" edge="1" source="2" target="3"><mxGeometry relative="1" as="geometry"/></mxCell></root>';
                var doc = mxUtils.parseXml(xml);
                var codec = new mxCodec(doc);
                var elt = doc.documentElement.firstChild;

                var cells = [];

                while (elt != null) {
                    console.log(elt)
                    cells.push(codec.decode(elt));
                    elt = elt.nextSibling;
                }


                console.log("graph:  " + graph)
                graph.addCell(cells);
                console.log(cells);



                /*
                               var encoder = new mxCodec();
                               var node = encoder.encode(graph.getModel());
                               mxUtils.popup(mxUtils.getPrettyXml(node), true);
                               */

                // Loads the mxGraph file format (XML file)                
                //this.read(graph, '../../data/xmlProjects/fileio.xml');

            }
            finally {
                // Updates the display
                graph.getModel().endUpdate();
            }

        }


    }



    render() {
        return (
            <div className="graph-container" ref="divGraph" id="divGraph" />
        );


    }
}

export default Test;