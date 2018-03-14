import React, { Component } from 'react';
import ReactDOM from "react-dom";
import axios from 'axios';
import {
    mxGraph,
    mxGraphModel,
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


class Graph extends Component {
    /*
    componentDidMount() {
        this.loadGraph();
        
    }
    */
    readFromXML(graph, parent) {
        try {
            var xml = this.props.project.xml;
            console.log(xml)     


            var doc = mxUtils.parseXml(xml);
            var codec = new mxCodec(doc);
            var model = codec.decode(doc.documentElement, graph.getModel())
            var cells = model.getElementsByTagName("mxCell");
            var cellArr = Array.from(cells);
            var vertexes = [];
            //console.log(cellArr)

            for (var i = 0; i < cellArr.length; i++) {
                let element = cellArr[i]
                var id = element.getAttribute("id")
                var value = element.getAttribute("value")

                //If element is Vertex/cell
                if (element.hasAttribute("vertex")) {

                    var geometry = element.getElementsByTagName("mxGeometry");
                    var x = geometry[0].getAttribute("x")
                    var y = geometry[0].getAttribute("y")
                    var width = geometry[0].getAttribute("width")
                    var height = geometry[0].getAttribute("height")

                    //add vertex
                    vertexes[i] = graph.insertVertex(parent, id, value, x, y, width, height, 'fillColor=pink');
                }
                //If element is Edge
                else if (element.hasAttribute("edge")) {
                    var source = element.getAttribute("source")
                    var target = element.getAttribute("target")

                    var sourceElement = vertexes[source];
                    var targetElement = vertexes[target];

                    //add Edge
                    graph.insertEdge(parent, id, value, sourceElement, targetElement)

                }

            }


        } catch (e) {
            console.log(e)
        }
        finally {
            // Updates the display
            graph.getModel().endUpdate();
        }
    }





    loadGraph() {
        var container = ReactDOM.findDOMNode(this.refs.divGraph);
        console.log("loadGraph")


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



            //mxConnectionHandler.prototype.connectImage = new mxImage('images/connector.gif', 16, 16);

            // Creates the div for the toolbar
            var tbContainer = ReactDOM.findDOMNode(this.refs.graphToolbar);
            /*
            tbContainer.style.position = 'absolute';
            tbContainer.style.overflow = 'hidden';
            tbContainer.style.padding = '2px';
            tbContainer.style.left = '0px';
            tbContainer.style.top = '0px';
            tbContainer.style.width = '24px';
            tbContainer.style.bottom = '0px';
            */


            // Creates new toolbar without event processing
            var toolbar = new mxToolbar(tbContainer);
            toolbar.enabled = false

            // Creates the div for the graph
            var container = ReactDOM.findDOMNode(this.refs.graphContainer);
            /*
            container.style.position = 'absolute';
            container.style.overflow = 'hidden';
            container.style.left = '24px';
            container.style.top = '0px';
            container.style.right = '0px';
            container.style.bottom = '0px';
            container.style.background = 'url("editors/images/grid.gif")';
            */


            var model = new mxGraphModel();
            var graph = new mxGraph(container, model);

            // Enables new connections in the graph
            graph.setConnectable(true);
            graph.setMultigraph(false);

            // Stops editing on enter or escape keypress
            var keyHandler = new mxKeyHandler(graph);
            var rubberband = new mxRubberband(graph);

            // Gets the default parent for inserting new cells. This
            // is normally the first child of the root (ie. layer 0).
            var parent = graph.getDefaultParent();
            // console.log("parent:  " + parent)

            // Adds cells to the model in a single step
            graph.getModel().beginUpdate();

            var addVertex = function (icon, w, h, style) {
                var vertex = new mxCell(null, new mxGeometry(0, 0, w, h), style);
                vertex.setVertex(true);

                var img = addToolbarItem(graph, toolbar, vertex, icon);
                img.enabled = true;

                graph.getSelectionModel().addListener(mxEvent.CHANGE, function () {
                    var tmp = graph.isSelectionEmpty();
                    mxUtils.setOpacity(img, (tmp) ? 100 : 20);
                    img.enabled = tmp;
                });
            };
            addVertex('https://jgraph.github.io/mxgraph/javascript/examples/editors/images/rectangle.gif', 100, 40, '');

            //console.log(graph.isSelectionEmpty())

            function addToolbarItem(graph, toolbar, prototype, image) {
                // Function that is executed when the image is dropped on
                // the graph. The cell argument points to the cell under
                // the mousepointer if there is one.
                var funct = function (graph, evt, cell, x, y) {
                    graph.stopEditing(false);

                    var vertex = graph.getModel().cloneCell(prototype);
                    vertex.geometry.x = x;
                    vertex.geometry.y = y;

                    graph.addCell(vertex);
                    graph.setSelectionCell(vertex);
                }

                // Creates the image which is used as the drag icon (preview)
                var img = toolbar.addMode(null, image, function (evt, cell) {
                    var pt = this.graph.getPointForEvent(evt);
                    funct(graph, evt, cell, pt.x, pt.y);
                });

                // Disables dragging if element is disabled. This is a workaround
                // for wrong event order in IE. Following is a dummy listener that
                // is invoked as the last listener in IE.
                mxEvent.addListener(img, 'mousedown', function (evt) {
                    // do nothing
                });

                // This listener is always called first before any other listener
                // in all browsers.
                mxEvent.addListener(img, 'mousedown', function (evt) {
                    if (img.enabled == false) {
                        mxEvent.consume(evt);
                    }
                });

                mxUtils.makeDraggable(img, graph, funct);

                return img;
            }

            this.readFromXML(graph, parent)


            var button = mxUtils.button('Save Graph', () => {
                var encoder = new mxCodec();
                var node = encoder.encode(graph.getModel());
                var xml = mxUtils.getPrettyXml(node)
                this.props.updateGraphOnServer(xml)
                console.log(xml)
            });

            var graphButton = ReactDOM.findDOMNode(this.refs.graphButton);
            graphButton.appendChild(button)

            // container.insertBefore(button, container.nextSibling);

        }

    }

    render() {
        console.log("render")
        return (

            <div className="graph" ref="divGraph" id="divGraph">
                <div className="graph-button" ref="graphButton" id="graphButton" />
                <div className="graph-container" ref="graphContainer" id="graphContainer" />

                <div className="graph-toolbar" ref="graphToolbar" id="graphToolbar" />

            </div>
        );


    }
}

export default Graph;