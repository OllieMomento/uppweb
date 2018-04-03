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
    mxDefaultKeyHandler,
    mxVertexHandler
} from "mxgraph-js";
import Grid from '../../images/grid.gif'
import Connector from '../../images/connector.gif'
import { FormControl, InputLabel, Select, MenuItem } from 'material-ui';
import { Router, Route, Link, withRouter } from "react-router-dom";
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
            seq: this.props.project.seq,
            activeSeq: this.props.project.seq[0],
            redirect: false,
            selectCell: "",
            readingXMLdone: false,
            nodesLength: 1,
            shots:[]
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

    setStyle(graph) {
        // Changes the default style for edges "in-place" and assigns
        // an alternate edge style which is applied in mxGraph.flip
        // when the user double clicks on the adjustment control point
        // of the edge. The ElbowConnector edge style switches to TopToBottom
        // if the horizontal style is true.
        var styleEdge = graph.getStylesheet().getDefaultEdgeStyle();
        styleEdge[mxConstants.STYLE_ROUNDED] = true;
        styleEdge[mxConstants.STYLE_EDGE] = mxEdgeStyle.ElbowConnector;
        styleEdge['strokeWidth'] = 2
        styleEdge[mxConstants.STYLE_NOLABEL] = true

        graph.alternateEdgeStyle = 'elbow=vertical';

        var styleNode = graph.getStylesheet().getDefaultVertexStyle();
        styleNode[mxConstants.STYLE_FONTSIZE] = '12';
        styleNode[mxConstants.STYLE_FONTSTYLE] = 0;
        styleNode[mxConstants.STYLE_FONTCOLOR] = '#000000';

        
    }



    readFromXML(graph, parent) {

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
            console.log(model)
            var cells = model.getElementsByTagName("mxCell");

            var cellArr = Array.from(cells);
            var vertexes = [];

            for (var i = 0; i < cellArr.length; i++) {
                let element = cellArr[i]
                var id = element.getAttribute("id")
                var value = element.getAttribute("value")
                var style = element.getAttribute("style")


                //If element is Vertex/cell
                if (element.hasAttribute("vertex")) {


                    var geometry = element.getElementsByTagName("mxGeometry");
                    var x = geometry[0].getAttribute("x")
                    var y = geometry[0].getAttribute("y")
                    var width = geometry[0].getAttribute("width")
                    var height = geometry[0].getAttribute("height")

                    //add vertex
                    vertexes[id] = graph.insertVertex(parent, id, value, x, y, width, height, style);
                    this.setState({
                        nodesLength: this.state.nodesLength + 1
                    })
                }
                // Sequence element > edge
                else if (element.hasAttribute("edge")) {
                    var parentNode = element.parentNode

                    var index = parentNode.getAttribute("seq")
                    var color = this.getColor(index)

                    var sourceElement = vertexes[element.getAttribute("source")]
                    var targetElement = vertexes[element.getAttribute("target")]

                    console.log(color)
                    var doc = mxUtils.createXmlDocument();
                    var edge = doc.createElement('Sequence')
                    edge.setAttribute('seq', index);

                    this.setState({ activeSeq: this.state.seq[index] })
                    graph.insertEdge(parent, id, edge, sourceElement, targetElement, 'strokeColor=' + color)

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
            graph.moveCells(graph.getChildCells(null, true, true), -1, 0);

            this.setState({ readingXMLdone: true })
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
                
                var number = ('0' + this.state.nodesLength + '0').slice(-3)
                var title = `Shot ${number}`


                var index = model.nextId
                v1 = graph.insertVertex(parent, null, title, x, y, 100, 50);
                
                this.setState({
                    nodesLength: this.state.nodesLength + 1
                })




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
            editor.execute(action);
        });
        mxUtils.write(button, label);
        toolbar.appendChild(button);
    };



    loadGraph() {



        console.log("project")
        console.log(this.props.project.seq)

        console.log(typeof this.props.project.seq)

        this.setState({ seq: Array.from(this.props.project.seq) })
        this.setState({ activeSeq: this.props.project.seq[0] })

        console.log(this.state.seq)

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


            // Optional disabling of sizing
            graph.setCellsResizable(false);

            editor.setGraphContainer(container);

            // Disables built-in context menu
            mxEvent.disableContextMenu(container);

            //Set styles
            this.setStyle(graph)

            mxConnectionHandler.prototype.insertEdge = (parent, id, value, source, target, style) => {

                var index = this.state.seq.map(function (e) { return e.name; }).indexOf(this.state.activeSeq.name);

                //var sequence = graph.getModel().getElementsByTagName("Sequence");
                var encoder = new mxCodec();
                var node = encoder.encode(graph.getModel());
                //console.log(node)
                var activeSeq = this.state.activeSeq.id
                console.log(activeSeq)
                var seqs = node.getElementsByTagName("Sequence")
                seqs = Array.from(seqs);

                var edges = seqs.filter(seq => {
                    return seq.getAttribute("seq") == this.state.activeSeq.id
                })
                var flag = true;
                edges.every(edge => {

                    let cell = edge.firstChild
                    cell.source = cell.getAttribute("source")
                    cell.target = cell.getAttribute("target")

                    if (cell.source == source.id || cell.target == target.id || cell.source == target.id) {
                        alert("Cannot connect")
                        flag = false
                        return false

                    }
                    return true
                })

                if (flag) {
                    var color = this.getColor(index)
                    var doc = mxUtils.createXmlDocument();
                    var edge = doc.createElement('Sequence')
                    edge.setAttribute('seq', index);

                    graph.insertEdge(parent, id, edge, source, target, 'strokeColor=' + color)

                }
            }

            var keyHandler = new mxDefaultKeyHandler(editor);
            keyHandler.bindAction(46, 'delete');
            keyHandler.bindAction(90, 'undo', true);
            keyHandler.bindAction(89, 'redo', true);
            keyHandler.bindAction(88, 'cut', true);
            keyHandler.bindAction(67, 'copy', true);
            keyHandler.bindAction(86, 'paste', true);
            keyHandler.bindAction(107, 'zoomIn');
            keyHandler.bindAction(109, 'zoomOut');

            // Disables built-in context menu
            mxEvent.disableContextMenu(container);


            graph.dblClick = (evt, cell) => {

                // history.push('/projects/' + this.props.project._id + '/' + cell.id);
                
                if(cell.edge === true){
                    return
                }
 
                history.push({
                    pathname: '/projects/' + this.props.project._id + '/' + cell.id + '/',
                    state: { project: this.props.project }
                })
                

                // Disables any default behaviour for the double click
                mxEvent.consume(evt);
            };







            // Gets the default parent for inserting new cells. This
            // is normally the first child of the root (ie. layer 0).
            var parent = graph.getDefaultParent();
            // console.log("parent:  " + parent)

            this.readFromXML(graph, parent)





            this.addSidebarIcon(graph, sidebar, null,

                'http://icons.iconarchive.com/icons/froyoshark/enkel/128/Telegram-icon.png');
            this.addToolbarButton(editor, toolbar, 'delete', 'Delete', 'images/delete2.png')

            graph.setHtmlLabels(true);


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
                var nodes = node.getElementsByTagName("mxCell")
                var cellArr = Array.from(nodes);
                var vertexes = [];
    
                for (var i = 0; i < cellArr.length; i++) {
                    let element = cellArr[i]
                    var id = element.getAttribute("id")
                    var value = element.getAttribute("value")
                    var style = element.getAttribute("style")
                    console.log(element)                        
    
                    //If element is Vertex/cell
                    if (element.hasAttribute("vertex")) {
                        let shot = {
                            id: id,
                            name: value,
                            desc: "",
                            comments:[],
                            artists:[],
                            supervisor:this.props.project.supervisor,
                            status:"notstarted"
        
                        }
                        vertexes.push(shot)
                        
                    }
                }
                this.setState({
                    shots: vertexes
                })
                console.log(this.state.shots)


                var xml = mxUtils.getPrettyXml(node)
                var seq = this.state.seq
                var shots = this.state.shots

                this.props.updateGraphOnServer(xml, seq, shots)

            });
            toolbar.appendChild(button)



            this.state.seq.map((seq, index) => {
                var button = mxUtils.button(seq.name, () => {
                    this.setState({ activeSeq: seq })
                })
                toolbar.appendChild(button)
            })

            var button = mxUtils.button('Open selected shots', () => {
                var selection = graph.getSelectionCells()
                selection = selection.filter( cell => {
                    return cell.isVertex()
                })
                console.log(selection)
                var url = ''
                selection.forEach( (cell)=>{
                    url = url + cell.id + '/'
                   
                })
                console.log(url)
            

                history.push({
                    pathname: '/projects/' + this.props.project._id + '/' + url,                   
                })                
            })
            toolbar.appendChild(button)
        }

    }
    componentDidMount() {
        this.loadGraph()
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