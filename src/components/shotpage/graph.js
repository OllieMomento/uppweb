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
    mxVertexHandler,
    mxStackLayout,
    mxEventSource,
    mxPopupMenu
} from "mxgraph-js";
import Grid from '../../images/grid.gif'
import Connector from '../../images/arrow.svg'
import { FormControl, InputLabel, Select, MenuItem, Button, IconButton } from 'material-ui';
import { Delete, Undo, Redo, AddCircle } from 'material-ui-icons';
import Footer from "../layouts/Footer"
import history from '../../history';
import { isAbsolute } from 'path';
import { RubberBandSelection } from '../../functions/rubberband'
import { mxIconSet, addMouseListeners } from '../../functions/hoverIcons'
import { getSuggestions, renderInput, renderSuggestionsContainer, renderSuggestion, getAssetTypes } from '../../functions/autosuggest'
import Autosuggest from 'react-autosuggest';
import Toolbar from '../shotpage/Toolbar'

import PopUpSelect from '../shotpage/PopUpSelect'
import './graph.css'
import AddAssignee from './addAssignee';



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
        flexGrow: '1',
        minWidth: 0,
        minHeight: 0

    }
};


class Graph extends Component {

    constructor(props) {
        var editor
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
            activePopUp: false,
            selectedAsset: "",
            clientCoord: "",
            assets: [],
            handleAddAssigneeOpen: false,
            clickedCell: "",
            changed: false

        };

    }
    handleWindowOpen = (bool) => {
        console.log(bool)

        this.saveGraph(this.editor)

        this.setState({
            handleAddAssigneeOpen: bool,
        })
    }


    getColors() {
        var colors = ['red', 'green', 'pink', 'yellow']
        return colors;
    }

    getSelectedSeq() {

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

    setStyle(graph, editor) {


        // Automatically handle parallel edges
        var layout = new mxParallelEdgeLayout(graph);
        var layoutMgr = new mxLayoutManager(graph);

        layoutMgr.getLayout = function (cell) {
            if (cell.getChildCount() > 0) {
                return layout;
            }
        };
        layoutMgr.executeLayout(layout, graph.getDefaultParent())

        layout.execute(graph.getDefaultParent());

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


        // graph.alternateEdgeStyle = 'elbow=vertical';

        var styleNode = graph.getStylesheet().getDefaultVertexStyle();
        styleNode[mxConstants.STYLE_FONTSIZE] = '12';
        styleNode[mxConstants.STYLE_FONTSTYLE] = 0;
        styleNode[mxConstants.STYLE_FONTCOLOR] = '#000000';
        styleNode[mxConstants.STYLE_STROKEWIDTH] = 2;
        mxConstants.VERTEX_SELECTION_STROKEWIDTH = 2;


    }

    createShotsVertex(graph) {

        var vertexes = []
        var parent = graph.getDefaultParent();
        var shots = this.props.project.shots
        var shotsSelected = this.props.shots
        console.log(shots)
        console.log(shotsSelected)
        shots.forEach((shot, index) => {
            vertexes[shot.id] = graph.insertVertex(parent, shot.id, shot.name, 950, 50 + index * 150, 100, 50, 'fillColor=#757575;strokeColor=#616161;fontColor=#FAFAFA');

            if (shotsSelected.includes(shot)) {
                vertexes[shot.id].visible = true
            }
            else {
                vertexes[shot.id].visible = false
            }


        })
    }


    readFromXML(graph, parent) {

        graph.getModel().beginUpdate();
        try {

            var assetsXML = this.props.project.assetsXML;
            console.log("PROJECT")
            console.log(this.props.project)

            console.log(assetsXML)

            //Create new vertexes represention shots nodes
            if (assetsXML == '') {
                this.createShotsVertex(graph)
            }
            else {
                var doc = mxUtils.parseXml(assetsXML);
                var codec = new mxCodec(doc);
                var model = codec.decode(doc.documentElement, graph.getModel())
                console.log(model)
                var cells = model.getElementsByTagName("mxCell");

                var cellArr = Array.from(cells);
                console.log("cellArr")
                console.log(cellArr)
                var vertexes = [];
                var vertexesAll = [];

                var shotArray = this.props.shotArray
                console.log("ShotArray")
                console.log(shotArray)
                let index = 0
                let IndexEdge = 0
                var stack = []
                var vertexArray = []

                //add  selected Shots
                var shots = this.props.project.shots
                shots.forEach((shot, index) => {
                    if (shotArray.includes(shot.id.toString())) {
                        vertexes[shot.id] = graph.insertVertex(parent, shot.id, shot.name, 950, 50 + index * 150, 100, 50, 'fillColor=#757575;strokeColor=#616161;fontColor=#FAFAFA');
                        vertexes[shot.id].visible = true

                        

                        stack.push(vertexes[shot.id])
                    } else {
                        vertexes[shot.id] = graph.insertVertex(parent, shot.id, shot.name, 950, 50 + vertexArray.length * 150, 100, 50, 'fillColor=#757575;strokeColor=#616161;fontColor=#FAFAFA');
                        vertexes[shot.id].visible = false
                    }
                })

                for (var i = 0; i < cellArr.length; i++) {
                    let element = cellArr[i]
                    var id = element.getAttribute("id")
                    var value = element.getAttribute("value")
                    var style = element.getAttribute("style")






                    //If element is Vertex/cell
                    if (element.hasAttribute("vertex") && value != null) {

                        var index = this.props.project.assets.map(function (e) { return e.id; }).indexOf(parseInt(id));
                        console.log(index)
                        console.log(this.props.project.assets)
                        if (index != -1) {
                            if (this.props.project.assets[index].status == "done") {
                                style = "fillColor=#A5D6A7;strokeColor=#43A047"
                            }
                            else if (this.props.project.assets[index].status == "inprogress") {
                                style = "fillColor=#FFCC80;strokeColor=#FF8A65"
                            }
                        }

                        console.log(style)


                        var geometry = element.getElementsByTagName("mxGeometry");
                        var x = geometry[0].getAttribute("x")
                        var y = geometry[0].getAttribute("y")
                        var width = geometry[0].getAttribute("width")
                        var height = geometry[0].getAttribute("height")

                        //add shots selected shots vertex
                        if (!value.startsWith("Shot")) {


                            vertexes[id] = graph.insertVertex(parent, id, value, x, y, width, height, style);
                            vertexes[id].visible = false
                        }

                    }

                    // Sequence element > edge
                    if (element.hasAttribute("edge")) {

                        var color = "#212121"
                        var sourceElement = vertexes[element.getAttribute("source")]
                        var targetElement = vertexes[element.getAttribute("target")]

                        graph.insertEdge(parent, id, value, sourceElement, targetElement, 'strokeColor=' + color)

                    }
                }

                //while stack is empty
                console.log("stack")
                console.log(stack)

                while (stack.length !== 0) {


                    var cell = stack.pop()

                    cell.visible = true
                    var inEdges = graph.getModel().getIncomingEdges(cell)

                    


                    inEdges.forEach((edge, index) => {

                        var vertex = edge.source

                        stack.push(vertex)
                    })



                }
                

            }





        } catch (e) {
            console.log(e)
        }
        finally {


            // Updates the display

            graph.getModel().endUpdate();

            //Need to move othervise the dragging canvas is broken
            graph.moveCells(graph.getChildCells(null, true, false), 1, 0);
            graph.moveCells(graph.getChildCells(null, true, false), -1, 0);


            graph.center()
            graph.refresh()

            this.setState({
                readingXMLdone: true,
                changed: false
            })

        }

    }



    addSidebarIcon = (editor, graph, sidebar, label, image) => {
        // Function that is executed when the image is dropped on
        // the graph. The cell argument points to the cell under
        // the mousepointer if there is one.


        var funct = function (graph, evt, cell, x, y) {

            this.popupMenu(evt, x, y)

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

    addVertex(asset) {
        console.log("addVertex")

        var graph = this.editor.graph

        var parent = graph.getDefaultParent();
        var model = graph.getModel();

        var popUp = document.getElementById("popUpMenu")

        var x = this.state.clientCoord.x
        var y = this.state.clientCoord.y


        var v1 = null;

        model.beginUpdate();
        try {
            // NOTE: For non-HTML labels the image must be displayed via the style
            // rather than the label markup, so use 'image=' + image for the style.
            // as follows: v1 = graph.insertVertex(parent, null, label,
            // pt.x, pt.y, 120, 120, 'image=' + image);

            var number = ('0' + this.state.nodesLength + '0').slice(-3)
            var title = asset
            var name = number
            var node = `<div><h4 id="title">${title}</h4><h5 id=assignee>\u0020</h5><h3 id ="name">${name}</h3></div>`

            console.log(typeof node)


            var index = model.nextId
            v1 = graph.insertVertex(parent, null, node, x, y, 100, 75, 'fillColor=#e57373;strokeColor=#d32f2f');


            this.setState({
                nodesLength: this.state.nodesLength + 1
            })

        }
        finally {
            model.endUpdate();
        }

        graph.setSelectionCell(v1);
    }


    saveGraph(editor) {
        var vertexes = [];
        var cells = editor.graph.getModel().cells
        console.log(cells)

        for (var id in cells) {
            let cell = cells[id]
            //cell.visible = true
            console.log(cell)



            // parent nodes and shots
            if (cell.value === undefined || cell.value === null) {

            }

            else if (!cell.value.startsWith("Shot")) {
                var template = document.createElement('template');
                var value = cell.value.trim()
                template.innerHTML = value;
                value = template.content.firstChild;

                var title = value.getElementsByTagName("h4")[0].innerHTML
                var name = value.getElementsByTagName("h3")[0].innerHTML
                var artists = value.getElementsByTagName("h5")[0].dataset.artist
                console.log("VALUE")
                console.log(value)

                var flag = false
                var DBasset
                this.props.project.assets.map(asset => {

                    if (asset.id === parseInt(cell.id)) {

                        flag = true
                        DBasset = asset
                    }
                })
                //already added in DB
                if (flag) {
                    DBasset.name = name,
                        DBasset.typeOf = title
                    DBasset.artists = artists
                    vertexes.push(DBasset)
                    //add new asset in DB
                } else {
                    let asset = {
                        id: parseInt(cell.id),
                        name: name,
                        typeOf: title,
                        desc: "",
                        comments: [],
                        artists: artists,
                        supervisor: this.props.project.supervisor,
                        status: "notstarted",
                        versions: []

                    }

                    vertexes.push(asset)
                }

            }

        }


        console.log(vertexes)

        this.setState({
            assets: vertexes
        })
        var assets = vertexes
        console.log("assets")
        console.log(assets)

        var encoder = new mxCodec();
        var node = encoder.encode(editor.graph.getModel());
        var assetsXML = mxUtils.getPrettyXml(node)
        console.log(node)



        // this.props.updateGraphOnServer(xml, seq, shots)
        this.props.updateGraphAssetsOnServer(assetsXML, assets)

        this.setState({
            changed: false
        })
    }


    loadGraph() {

        console.log("project shots")
        console.log(this.props.project.shots)


        // Checks if the browser is supported
        if (!mxClient.isBrowserSupported()) {
            // Displays an error message if the browser is not supported.
            mxUtils.error('Browser is not supported!', 200, false);
        }
        else {

            mxConstants.MIN_HOTSPOT_SIZE = 20;
            mxConstants.DEFAULT_HOTSPOT = 10;



            mxConnectionHandler.prototype.connectImage = new mxImage(Connector, 20, 20);



            var sidebar = ReactDOM.findDOMNode(this.refs.graphSidebar);
            var toolbar = ReactDOM.findDOMNode(this.refs.graphToolbar);

            // Creates the div for the graph
            var container = ReactDOM.findDOMNode(this.refs.graphContainer);

            container.style.background = "url(" + Grid + ")"

            // Creates a wrapper editor with a graph inside the given container.
            // The editor is used to create certain functionality for the
            // graph, such as the rubberband selection
            this.editor = new mxEditor();
            var graph = this.editor.graph;
            var model = graph.getModel();

            var keyHandler = new mxDefaultKeyHandler(this.editor);
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





            // Disable highlight of cells when dragging from toolbar
            graph.setDropEnabled(false);


            // Optional disabling of sizing
            graph.setCellsResizable(false);

            this.editor.setGraphContainer(container);


            //Set styles
            this.setStyle(graph, this.editor)


            mxConnectionHandler.prototype.insertEdge = (parent, id, value, source, target, style) => {

                var color = "#212121"
                graph.insertEdge(parent, id, value, source, target, 'strokeColor=' + color)
            }

            var keyHandler = new mxDefaultKeyHandler(this.editor);
            keyHandler.bindAction(46, 'delete');
            keyHandler.bindAction(90, 'undo', true);
            keyHandler.bindAction(89, 'redo', true);
            keyHandler.bindAction(88, 'cut', true);
            keyHandler.bindAction(67, 'copy', true);
            keyHandler.bindAction(86, 'paste', true);
            keyHandler.bindAction(107, 'zoomIn');
            keyHandler.bindAction(109, 'zoomOut');


            graph.dblClick = (evt, cell) => {
                console.log(cell)

                //click outside of cell
                if (cell === undefined || cell.value === null) {
                    return
                }


                //Click on asset not shot
                if (!cell.value.includes("Shot")) {

                    if (this.state.changed) {
                        alert("Graph wasn't saved")
                    } else {
                        history.push({
                            pathname: '/projects/' + this.props.project._id + "/asset/" + cell.id,
                            state: { project: this.props.project }
                        })
                    }




                }

                // Disables any default behaviour for the double click
                mxEvent.consume(evt);
            };

            //Hover Icons
            mxIconSet.prototype.destroy = function () {
                if (this.images != null) {
                    for (var i = 0; i < this.images.length; i++) {
                        var img = this.images[i];
                        img.parentNode.removeChild(img);
                    }
                }

                this.images = null;
            };

            mxIconSet.prototype.openWindow = (cell) => {
                console.log("prototype")
                this.handleWindowOpen(true),

                    this.setState({ clickedCell: cell })

            };

            graph.getModel().addListener(mxEvent.CHANGE, (sender, evt) => {
                this.setState({
                    changed: true
                })
            })


            // Gets the default parent for inserting new cells. This
            // is normally the first child of the root (ie. layer 0).
            var parent = graph.getDefaultParent();
            // console.log("parent:  " + parent)




            this.addSidebarIcon(this.editor, graph, sidebar, null,
                'http://icons.iconarchive.com/icons/froyoshark/enkel/128/Telegram-icon.png');


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


            // Enables guides (vodici cary)
            mxGraphHandler.prototype.guidesEnabled = true;

            // Disable highlight of cells when dragging from toolbar
            graph.setDropEnabled(false);

            // Enables snapping waypoints to terminals
            mxEdgeHandler.prototype.snapToTerminals = true;


            //Rubberband selection in functions
            RubberBandSelection(container)

            addMouseListeners(graph)

            //Need to det html from Value
            graph.moveCells(graph.getChildCells(parent, true, false), 1, 0);
            graph.moveCells(graph.getChildCells(parent, true, false), -1, 0);

            this.readFromXML(graph, parent)

        }


    }
    componentDidMount() {
        this.loadGraph()
    }

    popupMenu(evt, x, y) {
        this.setState({ activePopUp: true })
        this.setState({
            clientCoord: {
                x: x,
                y: y
            }
        })

        var clientX = evt.clientX
        var clientY = evt.clientY

        var popUp = document.getElementById("popUpMenu")
        console.log(popUp)
        popUp.style.top = clientY + "px"
        popUp.style.left = clientX + "px"


    }


    setAsset(asset) {
        console.log("setAsset")

        this.setState({ activePopUp: false })
        this.addVertex(asset)
        console.log(asset)
    }





    render() {
        console.log("render")
        var popUp
        if (this.state.activePopUp) {
            popUp = <PopUpSelect setAsset={this.setAsset.bind(this)} />
        }
        else {
            popUp = <div id="popUpMenu"></div>
        }


        return (

            <div style={style.Graph} className="graph" ref="divGraph" id="divGraph">
                <div className="graph-toolbar-edit" id="graph-edit" ref="graphToolbar">
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
                <AddAssignee
                    project={this.props.project}
                    handleWindowOpen={this.handleWindowOpen}
                    open={this.state.handleAddAssigneeOpen}
                    cell={this.state.clickedCell}
                    people={this.props.people}
                    assets={this.state.assets}
                    editor={this.editor}
                />

                <div className="graph-tbcont" style={style.TbCont}>
                    <div className="graph-sidebar" ref="graphSidebar" id="graphSidebar" />
                    <div style={style.Container} className="graph-container" ref="graphContainer" id="graphContainer">
                        {popUp}
                        <div id="editName"></div>
                    </div>
                </div>
            </div>
        );


    }
}

export default Graph;

/*<div id="outlineContainer"
                        style={{ zIndex: '1', overflow: 'hidden', top: '0px', right: '0px', width: '160px', height: '120px', background: 'transparent', borderStyle: 'solid', borderColor: 'lightgray' }}>
                    </div>*/