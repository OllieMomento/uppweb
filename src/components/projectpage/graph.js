import React, { Component } from 'react';
import ReactDOM from "react-dom";
import {
    mxEditor,
    mxGraphHandler,
    mxOutline,
    mxEdgeHandler,
    mxParallelEdgeLayout,
    mxConstants,
    mxEdgeStyle,
    mxLayoutManager,
    mxCodec,
    mxClient,
    mxConnectionHandler,
    mxUtils,
    mxEvent,
    mxImage,
    mxDefaultKeyHandler,
    mxRubberband
} from "mxgraph-js";

import Grid from '../../images/grid.gif'
import Connector from '../../images/arrow.svg'
import newNode from '../../images/newNode.png'
import { Button, IconButton } from 'material-ui';
import { Delete, Undo, Redo } from 'material-ui-icons';
import history from '../../history';
import { RubberBandSelection } from '../../functions/rubberband'
import SequenceTool from './SequenceTool';



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
    },
    toolbar: {
        display: 'flex',
        justifyContent: 'space-between'
    },
    seq: {
        display: "flex"
    }
};


class Graph extends Component {

    constructor(props) {
       
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
            shots: [],
            activeSeqName: this.props.project.seq[0].name,
            changed: false
        };

    }


    // Edge and Vertex styles
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
        styleNode[mxConstants.STYLE_FONTSIZE] = '13';
        styleNode[mxConstants.STYLE_FONTSTYLE] = 0;
        styleNode[mxConstants.STYLE_FONTCOLOR] = '#FAFAFA';
        styleNode[mxConstants.STYLE_FILLCOLOR] = '#757575';
        styleNode[mxConstants.STYLE_STROKECOLOR] = '#616161';
        styleNode[mxConstants.STYLE_STROKEWIDTH] = 2;

        mxConstants.VERTEX_SELECTION_STROKEWIDTH = 2;
        mxConstants.OUTLINE_COLOR= '#3f51b5'
        mxConstants.OUTLINE_HANDLE_FILLCOLOR= '#e91e63'
        mxConstants.OUTLINE_HANDLE_STROKECOLOR= '#e91e63'   

    }



    //Read graph form XML 
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
            //console.log(model)
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


                    var sourceElement = vertexes[element.getAttribute("source")]
                    var targetElement = vertexes[element.getAttribute("target")]


                    var doc2 = mxUtils.createXmlDocument();
                    var edge = doc2.createElement('Sequence')
                    edge.setAttribute('seq', index);

                    this.setState({ activeSeq: this.state.seq[index] })
                    graph.insertEdge(parent, id, edge, sourceElement, targetElement, 'strokeColor=' + index)

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
            graph.center()
            
            this.setState({
                readingXMLdone: true,
                changed: false,
                activeSeq: this.props.project.seq[0],
            })
            
        }



    }

    //Sidebar - add new vertex
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
                var index = graph.getChildVertices(graph.getDefaultParent()).length +1
             
                var number = ('0' + index + '0').slice(-3)
                var title = `Shot ${number}`          

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

        //Create the dashed rectange 
        var dragElt = document.createElement('div');
        dragElt.style.border = 'dashed black 1px';
        dragElt.style.width = '100px';
        dragElt.style.height = '50px';

        // Creates the image which is used as the drag icon (preview)
        var ds = mxUtils.makeDraggable(img, graph, funct.bind(this), dragElt, 0, 0, true, true);
        ds.setGuidesEnabled(true);
    };

    //Save graph as XML
    saveGraph(editor) {           

        var encoder = new mxCodec();
        var graph = editor.graph
        var node = encoder.encode(graph.getModel());
  
        var nodes = node.getElementsByTagName("mxCell")
        var cellArr = Array.from(nodes);
        var vertexes = [];

        for (var i = 0; i < cellArr.length; i++) {
            let element = cellArr[i]
            var id = element.getAttribute("id")
            var value = element.getAttribute("value")           


            //If element is Vertex/cell
            if (element.hasAttribute("vertex")) {
                
                let shot = {
                    id: id,
                    name: value,
                    desc: "",
                    comments: [],
                    artists: [],
                    supervisor: this.props.project.supervisor,
                    status: "notstarted"
                }
                vertexes.push(shot)
            }
        }

        this.setState({
            shots: vertexes
        })

        var xml = mxUtils.getPrettyXml(node)       
        var shots = vertexes

        //update graph on server
        this.props.updateGraphOnServer(xml, shots)

        this.setState({
            changed: false
        })


    }

    // opne selected vertexes
    openSelectedShots(editor) {

        var selection = editor.graph.getSelectionCells()
        selection = selection.filter(cell => {
            return cell.isVertex()
        })

        var url = ''
        selection.forEach((cell, index) => {
            if (index < selection.length - 1) {
                url = url + cell.id + '_'
            } else {
                url = url + cell.id
            }
        })

        history.push({
            pathname: '/projects/' + this.props.project._id + '/shots/' + url,
        })

    }

    //handle of active sequences
    handleChangeActiveSeq = (event) => {

        //activeSeq
        var active = this.props.project.seq.filter(seq => {
            return (seq.name === event.target.value)
        })
        this.setState({
            activeSeq: active[0],
            activeSeqName: active[0].name
        });

    }    
    
    setActiveSeq = () => {
        this.setState({
            activeSeq: this.props.project.seq[0],
            activeSeqName: this.props.project.seq[0].name
        });
    }


    // main function of Graph
    loadGraph() {       

        this.setState({ seq: Array.from(this.props.project.seq) })
        this.setState({ activeSeq: this.props.project.seq[0] })


        // Checks if the browser is supported
        if (!mxClient.isBrowserSupported()) {
            // Displays an error message if the browser is not supported.
            mxUtils.error('Browser is not supported!', 200, false);
        }
        else {


            mxConnectionHandler.prototype.connectImage = new mxImage(Connector, 20, 20);

            var sidebar = ReactDOM.findDOMNode(this.refs.graphSidebar);
            //var toolbar = ReactDOM.findDOMNode(this.refs.graphToolbar);

            // Creates the div for the graph
            var container = ReactDOM.findDOMNode(this.refs.graphContainer);

            var outline = ReactDOM.findDOMNode(this.refs.outlineContainer);

            container.style.background = "url(" + Grid + ")"

            // Creates a wrapper editor with a graph inside the given container.
            // The editor is used to create certain functionality for the
            // graph, such as the rubberband selection, but most parts
            // of the UI are custom in this example.

            var graph = this.editor.graph;          

            this.editor.validation = true

            // Disable highlight of cells when dragging from toolbar
            graph.setDropEnabled(false);


            // Optional disabling of sizing
            graph.setCellsResizable(false);

            this.editor.setGraphContainer(container);

            // Disables built-in context menu
            mxEvent.disableContextMenu(container);

            //Set styles
            this.setStyle(graph)

            //If connection, test condition
            mxConnectionHandler.prototype.insertEdge = (parent, id, value, source, target, style) => {               
                
                var encoder = new mxCodec();
                var node = encoder.encode(graph.getModel());
                               
                var color = this.state.activeSeq.color

                var seqs = node.getElementsByTagName("Sequence")
                seqs = Array.from(seqs);

                var edges = seqs.filter(seq => {
                    return seq.getAttribute("seq") === this.state.activeSeq.color
                })
                var flag = true;
                edges.every(edge => {

                    let cell = edge.firstChild
                    cell.source = cell.getAttribute("source")
                    cell.target = cell.getAttribute("target")                   

                    //consition
                    if (cell.source === source.id || cell.target === target.id) {
                        alert("Cannot connect")
                        flag = false
                        return false

                    }
                    return true
                })

                // Connection without problem
                if (flag) {
                    var doc = mxUtils.createXmlDocument();
                    var edge = doc.createElement('Sequence')
                    edge.setAttribute('seq', color);

                    graph.insertEdge(parent, id, edge, source, target, 'strokeColor=' + color)

                }
            }

            //Bind keys
            var keyHandler = new mxDefaultKeyHandler(this.editor);
            keyHandler.bindAction(46, 'delete');
            keyHandler.bindAction(90, 'undo', true);
            keyHandler.bindAction(89, 'redo', true);
            keyHandler.bindAction(88, 'cut', true);
            keyHandler.bindAction(67, 'copy', true);
            keyHandler.bindAction(86, 'paste', true);
            keyHandler.bindAction(107, 'zoomIn');
            keyHandler.bindAction(109, 'zoomOut');           


            // double click on Shot
            graph.dblClick = (evt, cell) => {                          

                if (cell.edge === true) {
                    return
                }

                if (this.state.changed) {
                    alert("Graph wasn't saved")
                }
                else {
                    history.push({
                        pathname: '/projects/' + this.props.project._id + '/shots/' + cell.id,
                        state: { project: this.props.project }
                    })
                }
                // Disables any default behaviour for the double click
                mxEvent.consume(evt);

            };

            graph.getModel().addListener(mxEvent.CHANGE, (sender, evt) => {
                this.setState({
                    changed: true
                })
            })

            // Gets the default parent for inserting new cells. This
            // is normally the first child of the root (ie. layer 0).
            var parent = graph.getDefaultParent();
            
            this.readFromXML(graph, parent)

            this.addSidebarIcon(graph, sidebar, null,
                newNode);


            graph.setHtmlLabels(true);


            // Enables new connections in the graph
            graph.setConnectable(true);
            // Enables moving with right click ang drag
            graph.setPanning(true);

            graph.setTooltips(false);
            // graph.setMultigraph(false);


            // Does not allow dangling edges
            graph.setAllowDanglingEdges(false);

            // Stops editing on enter or escape keypress
            new mxRubberband(graph);

            // Enables guides (vodici cary)
            mxGraphHandler.prototype.guidesEnabled = true;

            // Disable highlight of cells when dragging from toolbar
            graph.setDropEnabled(false);

            // Enables snapping waypoints to terminals
            mxEdgeHandler.prototype.snapToTerminals = true;

        }
        //Rubberband selection in functions
        RubberBandSelection(container)

        new mxOutline(this.editor.graph, outline);

    }
    componentDidMount() {
        this.editor = new mxEditor();
        this.loadGraph()
    }
 

    render() {


        return (

            <div style={style.Graph} className="graph" ref="divGraph" id="divGraph">
                <div className="graph-toolbar" ref="graphToolbar" id="graphToolbar" style={style.toolbar}>
                    <div className="graph-toolbar-edit" id="graph-edit">
                        <Button variant="raised" color="primary" type="submit" style={style.button} onClick={() => this.saveGraph(this.editor)}>
                            Save Graph
                        </Button>
                        <IconButton onClick={() => this.editor.execute("delete")} aria-label="Delete">
                            <Delete />
                        </IconButton>
                        <IconButton onClick={() => this.editor.execute("undo")} aria-label="Delete">
                            <Undo />
                        </IconButton>
                        <IconButton onClick={() => this.editor.execute("redo")} aria-label="Delete">
                            <Redo />
                        </IconButton>
                    </div>
                    <SequenceTool project={this.props.project}
                        activeSeq={this.state.activeSeq}
                        activeSeqName={this.state.activeSeqName}
                        handleChangeActiveSeq={this.handleChangeActiveSeq}
                        setActiveSeq={this.setActiveSeq}
                    />

                    <div className="graph-toolbar-open" id="graph-open">
                        <Button variant="raised" color="primary" type="submit" style={style.button} onClick={() => this.openSelectedShots(this.editor)}>
                            Open selected shots
                        </Button>
                    </div>
                </div>
                <div className="graph-tbcont" style={style.TbCont}>
                    <div className="graph-sidebar" ref="graphSidebar" id="graphSidebar" />
                    <div style={style.Container} className="graph-container" ref="graphContainer" id="graphContainer" />
                </div>
                <div id="outlineContainer" ref="outlineContainer"
                    style={{ position: "absolute", zIndex: '1', overflow: 'hidden', top: '150px', right: '0px', width: '160px', height: '120px', background: 'transparent', borderStyle: 'solid', borderColor: 'lightgray' }}>
                </div>
            </div>
        );
    }
}

export default Graph;
