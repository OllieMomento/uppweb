import React, { Component } from 'react';
import ReactDOM from "react-dom";
//import fs from "file-system";
import fetch from 'node-fetch';
//import fs from 'mz/fs';
import projects from './../../data/xmlProjects/1.json';
import jsonfile from 'jsonfile';

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

    loadGraph() {
        var container = ReactDOM.findDOMNode(this.refs.divGraph);




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
                /*
                for (let index = 0; index < 5; index++) {
                    graph.insertVertex(parent, null, (index + ' hello'), 20*index, 20*index, 80*index, 30*index, 'fillColor=pink');
                    
                }*/



            }
            finally {
                // Updates the display
                graph.getModel().endUpdate();
            }

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

            //const fs = require('fs');
            console.log(projects.projects[2].xml)
            projects.projects.push({ "id": 3, "xml": xml })
            console.log(projects)

            var file = '/tmp/data.json'
            var obj = { name: 'JP' }

            jsonfile.writeFile(file, obj, function (err) {
                console.error(err)
            })



            /*

            var json = JSON.stringify(projects);


            //var file = '1.json'
            
            jsonfile.writeFile(file, json, function (err) {
                console.error(err)
            })
            //const data = import('./../../data/xmlProjects/' + this.props.id + '.xml')
            //console.log(data);
*/

        }

    }


    render() {
        return (
            <div className="graph-container" ref="divGraph" id="divGraph" />
        );


    }
}

export default Test;