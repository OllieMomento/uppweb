import React, { Component } from 'react';
import ReactDOM from "react-dom";
import axios from 'axios';
import {
    mxGraph,
    mxGraphModel,
    mxPanningHandler,
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
    mxLog,
    mxDefaultKeyHandler
} from "mxgraph-js";
import Grid from '../../images/grid.gif'
import Connector from '../../images/connector.gif'
import { FormControl, InputLabel, Select, MenuItem } from 'material-ui';
import { Router, Route, Link, withRouter} from "react-router-dom";
import Footer from "../layouts/Footer"
import history from '../../history';


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

    constructor(props) {
        console.log("constructor")
        super(props);
        this.state = {
            adj: [],
            edges: [],
            nodes: [],
            seq: [],
            activeSeq: "",
            redirect: false,
            selectCell: ""
        };

    }
    getColors() {
        var colors = ['red', 'green', 'pink', 'yellow']
        return colors;
    }

    getColor(index) {
        var colors = this.getColors()
        return colors[index]
    }

    getIndex(color) {
        var colors = this.getColors()
        return colors.indexOf(color)
    }
    getIndexFromStyle(style) {
        var color = style.replace('strokeColor=', '');
        return this.getIndex(color)
    }

    deleteSelection(selection) {
        selection.forEach(el => {

            //Edge
            if (el.edge === true) {
                var index = this.getIndexFromStyle(el.style)
                var newSeq = this.state.seq[index]
                newSeq.edge = newSeq.edge.filter(edge => {
                    return (edge.source != el.source.id && edge.target != el.target.id)
                })
                var newSeqs = this.state.seq
                newSeqs[index] = newSeq
                this.setState({ seq: newSeqs })
            }
            //Vertex
            else {
                var newSeqs = []
                this.state.seq.forEach((seq) => {

                    var edge = seq.edge.filter(edge => {
                        return (el.id != edge.source && el.id != edge.target)
                    })
                    seq.edge = edge
                    newSeqs.push(seq)

                })
                this.setState({ seq: newSeqs })


            }
        })

    }

    readFromXML(graph, parent) {

        // Changes the default style for edges "in-place" and assigns
        // an alternate edge style which is applied in mxGraph.flip
        // when the user double clicks on the adjustment control point
        // of the edge. The ElbowConnector edge style switches to TopToBottom
        // if the horizontal style is true.
        var style = graph.getStylesheet().getDefaultEdgeStyle();
        style[mxConstants.STYLE_ROUNDED] = true;
        style[mxConstants.STYLE_EDGE] = mxEdgeStyle.ElbowConnector;
        style['strokeWidth'] = 2

        graph.alternateEdgeStyle = 'elbow=vertical';

        // Automatically handle parallel edges
        var layout = new mxParallelEdgeLayout(graph);
        var layoutMgr = new mxLayoutManager(graph);

        layoutMgr.getLayout = function (cell) {
            if (cell.getChildCount() > 0) {
                return layout;
            }
        };

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
                var style = element.getAttribute("style")


                console.log(element)
                //If element is Vertex/cell
                if (element.hasAttribute("vertex")) {


                    var geometry = element.getElementsByTagName("mxGeometry");
                    var x = geometry[0].getAttribute("x")
                    var y = geometry[0].getAttribute("y")
                    var width = geometry[0].getAttribute("width")
                    var height = geometry[0].getAttribute("height")

                    //add vertex
                    vertexes[id] = graph.insertVertex(parent, id, value, x, y, width, height, style);
                }
            }


            this.state.seq.map((seq, index) => {

                seq.edge.map(edge => {
                    var sourceElement = vertexes[edge.source];
                    var targetElement = vertexes[edge.target];

                    var color = this.getColor(index)
                    this.setState({ activeSeq: this.state.seq[index] })
                    console.log(this.state.activeSeq.name)
                    graph.insertEdge(parent, id, value, sourceElement, targetElement, 'strokeColor=' + color)



                })
                console.log(seq)
            })






        } catch (e) {
            console.log(e)
        }
        finally {

            // Updates the display
            graph.refresh()
            graph.getModel().endUpdate();

            //Need to move othervise the dragging canvas is broken
            graph.moveCells(graph.getChildCells(null, true, true), 1, 0);
            graph.moveCells(graph.getChildCells(null, true, true), -1, 0);
        }
    }

    addSidebarIcon(graph, sidebar, label, image) {
        // Function that is executed when the image is dropped on
        // the graph. The cell argument points to the cell under
        // the mousepointer if there is one.
        var funct = function (graph, evt, cell, x, y) {
            var parent = graph.getDefaultParent();
            var model = graph.getModel();

            var v1 = null;

            model.beginUpdate();
            try {
                // NOTE: For non-HTML labels the image must be displayed via the style
                // rather than the label markup, so use 'image=' + image for the style.
                // as follows: v1 = graph.insertVertex(parent, null, label,
                // pt.x, pt.y, 120, 120, 'image=' + image);

                v1 = graph.insertVertex(parent, null, (this.state.nodes.length), x, y, 100, 50);
                this.state.nodes.push(this.state.nodes.length + 1)


            }
            finally {
                model.endUpdate();
            }

            graph.setSelectionCell(v1);
        }

        // Creates the image which is used as the sidebar icon (drag source)
        var img = document.createElement('img');
        img.setAttribute('src', image);
        img.style.width = '48px';
        img.style.height = '48px';
        img.title = 'Drag this to the diagram to create a new vertex';
        sidebar.appendChild(img);

        var dragElt = document.createElement('div');
        dragElt.style.border = 'dashed black 1px';
        dragElt.style.width = '100px';
        dragElt.style.height = '50px';

        // Creates the image which is used as the drag icon (preview)
        var ds = mxUtils.makeDraggable(img, graph, funct.bind(this), dragElt, 0, 0, true, true);
        ds.setGuidesEnabled(true);
    };

    addToolbarButton(editor, toolbar, action, label, image, isTransparent) {
        var button = document.createElement('button');
        button.setAttribute("id", action + "Button");
        button.style.fontSize = '10';
        if (image != null) {
            var img = document.createElement('img');
            img.setAttribute('src', image);
            img.style.width = '16px';
            img.style.height = '16px';
            img.style.verticalAlign = 'middle';
            img.style.marginRight = '2px';
            button.appendChild(img);
        }
        if (isTransparent) {
            button.style.background = 'transparent';
            button.style.color = '#FFFFFF';
            button.style.border = 'none';
        }

        mxEvent.addListener(button, 'click', (evt) => {
            if (action === "delete") {
                var selected = editor.graph.getSelectionCells()
                this.deleteSelection(selected)
            }
            editor.execute(action);
        });
        mxUtils.write(button, label);
        toolbar.appendChild(button);
    };



    loadGraph() {

        this.setState({ seq: this.props.project.seq })
        this.setState({ activeSeq: this.props.project.seq[0] })

        // Checks if the browser is supported
        if (!mxClient.isBrowserSupported()) {
            // Displays an error message if the browser is not supported.
            mxUtils.error('Browser is not supported!', 200, false);
        }
        else {


            mxConnectionHandler.prototype.connectImage = new mxImage(Connector, 16, 16);

            var sidebar = ReactDOM.findDOMNode(this.refs.graphSidebar);
            var toolbar = ReactDOM.findDOMNode(this.refs.graphToolbar);

            // Creates the div for the graph
            var container = ReactDOM.findDOMNode(this.refs.graphContainer);

            container.style.background = "url(" + Grid + ")"

            // Creates a wrapper editor with a graph inside the given container.
            // The editor is used to create certain functionality for the
            // graph, such as the rubberband selection, but most parts
            // of the UI are custom in this example.
            var editor = new mxEditor();
            var graph = editor.graph;
            var model = graph.getModel();

            editor.validation = true

            // Disable highlight of cells when dragging from toolbar
            graph.setDropEnabled(false);

            editor.setGraphContainer(container);

            var keyHandler = new mxKeyHandler(graph);
            keyHandler.bindKey(46, (evt) => {
                if (graph.isEnabled()) {

                    var selected = editor.graph.getSelectionCells()
                    this.deleteSelection(selected)

                    graph.removeCells();
                }
            });

            // Disables built-in context menu
            mxEvent.disableContextMenu(container);

            mxConnectionHandler.prototype.insertEdge = (parent, id, value, source, target, style) => {

                let flag = true;
                this.state.activeSeq.edge.map(edge => {
                    if (edge.source == source.id) {
                        alert(source.name + "is already a source node" + this.state.activeSeq.name)
                        flag = false
                    }
                })
                var index = this.state.seq.map(function (e) { return e.name; }).indexOf(this.state.activeSeq.name);

                if (flag) {
                    var color = this.getColor(index)
                    console.log(index)

                    graph.insertEdge(parent, id, value, source, target, 'strokeColor=' + color)

                    this.state.seq[index].edge.push({
                        source: source.id,
                        target: target.id,
                    })

                }
            }
            

            graph.dblClick = (evt, cell) => {               

                history.push('/projects/'+this.props.project._id+'/'+cell.id);

                // Disables any default behaviour for the double click
                mxEvent.consume(evt);
            };






            // Gets the default parent for inserting new cells. This
            // is normally the first child of the root (ie. layer 0).
            var parent = graph.getDefaultParent();
            // console.log("parent:  " + parent)

            this.readFromXML(graph, parent)


            this.addSidebarIcon(graph, sidebar, 'Website', 'http://icons.iconarchive.com/icons/froyoshark/enkel/128/Telegram-icon.png');
            this.addToolbarButton(editor, toolbar, 'delete', 'Delete', 'images/delete2.png')


            // Enables new connections in the graph
            graph.setConnectable(true);
            // Enables moving with right click ang drag
            graph.setPanning(true);

            graph.setTooltips(true);
            // graph.setMultigraph(false);








            // Does not allow dangling edges
            graph.setAllowDanglingEdges(false);

            // Stops editing on enter or escape keypress
            var rubberband = new mxRubberband(graph);

            // Enables guides (vodici cary)
            mxGraphHandler.prototype.guidesEnabled = true;

            // Disable highlight of cells when dragging from toolbar
            graph.setDropEnabled(false);

            // Enables snapping waypoints to terminals
            mxEdgeHandler.prototype.snapToTerminals = true;

            var button = mxUtils.button('Save Graph', () => {
                var encoder = new mxCodec();
                var node = encoder.encode(graph.getModel());
                console.log(node)
                var xml = mxUtils.getPrettyXml(node)
                var seq = this.state.seq

                this.props.updateGraphOnServer(xml, seq)

            });
            toolbar.appendChild(button)



            this.state.seq.map((seq, index) => {
                var button = mxUtils.button(seq.name, () => {
                    this.setState({ activeSeq: seq })
                })
                toolbar.appendChild(button)
            })
        }

    }

    render() {      
        

        return (

            <div style={style.Graph} className="graph" ref="divGraph" id="divGraph">
                <div className="graph-toolbar" ref="graphToolbar" id="graphToolbar" />

                <div className="graph-tbcont" style={style.TbCont}>
                    <div className="graph-sidebar" ref="graphSidebar" id="graphSidebar" />
                    <div style={style.Container} className="graph-container" ref="graphContainer" id="graphContainer" />
                </div>
            </div>
        );


    }
}

export default Graph;

/*<div id="outlineContainer"
                        style={{ zIndex: '1', overflow: 'hidden', top: '0px', right: '0px', width: '160px', height: '120px', background: 'transparent', borderStyle: 'solid', borderColor: 'lightgray' }}>
                    </div>*/