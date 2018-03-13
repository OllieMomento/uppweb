import React, { Component } from 'react';
import ReactDOM from "react-dom";
import axios from 'axios';
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


class Graph extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: {}
        };

    }


    loadCommentsFromServer = () => {
        console.log("loadFromSercer")
        axios.get('http://localhost:3001/api/projects/' + this.props.id)
            .then(res => {
                this.setState({ data: res.data });
                this.loadGraph();
            })
    }

    componentDidMount() {
        this.loadCommentsFromServer();
    }
    updateGraphOnServer(xml) {

        axios.put('http://localhost:3001/api/projects/' + this.props.id, {
            xml: xml
        })
            .then(response => {
                console.log(response);
            })
            .catch(err => {
                console.log(err);
            });
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
            // Creates the graph inside the given container
            var graph = new mxGraph(container);

            // Gets the default parent for inserting new cells. This
            // is normally the first child of the root (ie. layer 0).
            var parent = graph.getDefaultParent();
            // console.log("parent:  " + parent)

            // Adds cells to the model in a single step
            graph.getModel().beginUpdate();


            try {
                var xml = this.state.data.xml;
                console.log(xml)

                //  var text = fs.readFileSync("../../data/xmlProjects/fileio.xml");        


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


            }
            finally {
                // Updates the display
                graph.getModel().endUpdate();
            }

            var button = mxUtils.button('Save Graph', () => {
                var encoder = new mxCodec();
                var node = encoder.encode(graph.getModel());
                var xml = mxUtils.getPrettyXml(node)
                this.updateGraphOnServer(xml)
                console.log(xml)
            });

            document.body.insertBefore(button, container.nextSibling);

        }

    }

    render() {
        console.log("render")
        return (

            <div className="graph-container" ref="divGraph" id="divGraph">
                <p>{this.state.data.name}</p>
            </div>
        );


    }
}

export default Graph;