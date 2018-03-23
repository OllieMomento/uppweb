import React, { Component } from 'react';
import ReactDOM from "react-dom";
import axios from 'axios';
import {
    mxGraph,
    mxGraphModel,
    mxPerimeter,
    mxPoint,
    mxRectangle,
    mxEditor,
    mxGuide,
    mxGraphHandler,
    mxOutline,
    mxEdgeHandler,
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
    mxEdgeLabelLayout,
    mxLog
} from "mxgraph-js";
import Grid from '../../images/grid.gif'
import Connector from '../../images/connector.gif'


const style = {
    Graph: {
        display: 'flex',
        flexDirection: 'column',
        flexGrow: '1'
    },
    TbCont: {
        display: 'flex',
        flexGrow: '1'
    },
    Container: {
        flexGrow: '1'
    }
};


class Graph extends Component {
    /*
    componentDidMount() {
        this.loadGraph();
        
    }
    */
    readFromXML(graph, parent) {
        console.log("kokottt")
        graph.getModel().beginUpdate();
        try {
            var xml = this.props.project.xml;

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

                    console.log("x" + x)
                    console.log("y" + y)

                    //add vertex
                    vertexes[id] = graph.insertVertex(parent, id, value, x, y, width, height, 'fillColor=pink');
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
            graph.refresh()
            graph.getModel().endUpdate();

            //Need to move othervise the dragging canvas is broken
            graph.moveCells(graph.getChildCells(null, true, true), 1, 0);
        }
    }

    createPopupMenu(graph, menu, cell, evt) {
        if (cell != null) {
            menu.addItem('Cell Item', 'editors/images/image.gif', function () {
                mxUtils.alert('MenuItem1');
            });
        }
        else {
            menu.addItem('No-Cell Item', 'editors/images/image.gif', function () {
                mxUtils.alert('MenuItem2');
            });
        }
        menu.addSeparator();
        menu.addItem('MenuItem3', '../src/images/warning.gif', function () {
            mxUtils.alert('MenuItem3: ' + graph.getSelectionCount() + ' selected');
        });
    }





    loadGraph() {
        console.log("loadGraph")

        // Checks if the browser is supported
        if (!mxClient.isBrowserSupported()) {
            // Displays an error message if the browser is not supported.
            mxUtils.error('Browser is not supported!', 200, false);
        }
        else {


            mxConnectionHandler.prototype.connectImage = new mxImage(Connector, 16, 16);

            var tbContainer = ReactDOM.findDOMNode(this.refs.graphToolbar);


            // Creates new toolbar without event processing
            var toolbar = new mxToolbar(tbContainer);
            toolbar.enabled = false

            // Creates the div for the graph
            var container = ReactDOM.findDOMNode(this.refs.graphContainer);

            container.style.background = "url(" + Grid + ")"

            var model = new mxGraphModel();
            var graph = new mxGraph(container, model);
            graph.dropEnabled = true;



            // Enables new connections in the graph
            graph.setConnectable(true);
            // Enables moving with right click ang drag
            graph.setPanning(true);

            graph.setTooltips(true);
            graph.setMultigraph(false);




            // Does not allow dangling edges
            graph.setAllowDanglingEdges(false);

            // Stops editing on enter or escape keypress
            var keyHandler = new mxKeyHandler(graph);
            var rubberband = new mxRubberband(graph);

            // Installs a popupmenu handler using local function / Right click.
            graph.popupMenuHandler.factoryMethod = (menu, cell, evt) => {
                return this.createPopupMenu(graph, menu, cell, evt);
            };

            // Gets the default parent for inserting new cells. This
            // is normally the first child of the root (ie. layer 0).
            var parent = graph.getDefaultParent();
            // console.log("parent:  " + parent)

            this.readFromXML(graph, parent)

            // Adds cells to the model in a single step
            graph.getModel().beginUpdate();

            var addVertex = function (icon, w, h, style) {
                var vertex = new mxCell(null, new mxGeometry(0, 0, w, h), style);
                vertex.setVertex(true);

                addToolbarItem(graph, toolbar, vertex, icon);
            };
            addVertex('https://jgraph.github.io/mxgraph/javascript/examples/editors/images/rectangle.gif', 100, 40, '');

            graph.getModel().endUpdate();
            //console.log(graph.isSelectionEmpty())

            function addToolbarItem(graph, toolbar, prototype, image) {
                // Function that is executed when the image is dropped on
                // the graph. The cell argument points to the cell under
                // the mousepointer if there is one.
                var funct = function (graph, evt, cell) {
                    graph.stopEditing(false);

                    var pt = graph.getPointForEvent(evt);
                    var vertex = graph.getModel().cloneCell(prototype);
                    vertex.geometry.x = pt.x;
                    vertex.geometry.y = pt.y;

                    graph.setSelectionCells(graph.importCells([vertex], 0, 0, cell));
                }

                // Creates the image which is used as the drag icon (preview)
                var img = toolbar.addMode(null, image, funct);
                mxUtils.makeDraggable(img, graph, funct);
            }



            // Enables guides (vodici cary)
            mxGraphHandler.prototype.guidesEnabled = true;

            // Disable highlight of cells when dragging from toolbar
            graph.setDropEnabled(false);

            // Enables snapping waypoints to terminals
            mxEdgeHandler.prototype.snapToTerminals = true;

            var button = mxUtils.button('Save Graph', () => {
                var encoder = new mxCodec();
                var node = encoder.encode(graph.getModel());
                var xml = mxUtils.getPrettyXml(node)

                this.props.updateGraphOnServer(xml)
                console.log(xml)
            });

            var graphButton = ReactDOM.findDOMNode(this.refs.graphButton);
            graphButton.appendChild(button)

            var outline = document.getElementById('outlineContainer');

            var outln = new mxOutline(graph, outline);
            // container.insertBefore(button, container.nextSibling);

        }


    }

    render() {
        // console.log("render")
        return (

            <div style={style.Graph} className="graph" ref="divGraph" id="divGraph">
                <div className="graph-button" ref="graphButton" id="graphButton" />
                <div className="graph-tbcont" style={style.TbCont}>
                    <div id="outlineContainer"
                        style={{ zIndex: '1', overflow: 'hidden', top: '0px', right: '0px', width: '160px', height: '120px', background: 'transparent', borderStyle: 'solid', borderColor: 'lightgray' }}>
                    </div>
                    <div className="graph-toolbar" ref="graphToolbar" id="graphToolbar" />
                    <div style={style.Container} className="graph-container" ref="graphContainer" id="graphContainer" />
                </div>


            </div>
        );


    }
}

export default Graph;