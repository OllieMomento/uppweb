
import {
    mxUtils,
    mxEvent,
    mxRectangle,    

} from "mxgraph-js";

import Delete from '../images/delete.svg'
import Duplicate from '../images/copy.svg'
import Edit from '../images/edit.svg'
import AddAssignee from '../images/addPerson.svg'


export function mxIconSet(state) {
    this.images = [];
    var graph = state.view.graph;

    // Duplicate
    var img = mxUtils.createImage(Duplicate);
    img.setAttribute('title', 'Duplicate');
    img.style.position = 'absolute';
    img.style.cursor = 'pointer';
    img.style.width = '20px';
    img.style.height = '20px';
    img.style.left = (state.x + state.width) + 'px';
    img.style.top = (state.y + state.height) + 'px';

    mxEvent.addGestureListeners(img,
        mxUtils.bind(this, function (evt) {
            var s = graph.gridSize;
            graph.setSelectionCells(graph.moveCells([state.cell], s, s, true));
            mxEvent.consume(evt);
            this.destroy();
        })
    );

    state.view.graph.container.appendChild(img);
    this.images.push(img);

    // Delete
    img = mxUtils.createImage(Delete);

    img.setAttribute('title', 'Delete');
    img.style.position = 'absolute';
    img.style.cursor = 'pointer';
    img.style.width = '20px';
    img.style.height = '20px';
    img.style.left = (state.x + state.width) + 'px';
    img.style.top = (state.y - 20) + 'px';
    img.style.fill = "red"

    mxEvent.addGestureListeners(img,
        mxUtils.bind(this, function (evt) {
            // Disables dragging the image
            mxEvent.consume(evt);
        })
    );

    mxEvent.addListener(img, 'click',
        mxUtils.bind(this, function (evt) {
            graph.removeCells([state.cell]);
            mxEvent.consume(evt);
            this.destroy();
        })
    );

    state.view.graph.container.appendChild(img);
    this.images.push(img);

    // Add Assignee
    img = mxUtils.createImage(AddAssignee);
    img.setAttribute('title', 'Add Assignee');
    img.style.position = 'absolute';
    img.style.cursor = 'pointer';
    img.style.width = '20px';
    img.style.height = '20px';
    img.style.left = (state.x - 20) + 'px';
    img.style.top = (state.y - 20) + 'px';

    mxEvent.addGestureListeners(img,
        mxUtils.bind(this, function (evt) {
            // Disables dragging the image
            mxEvent.consume(evt);
        })
    );

    mxEvent.addListener(img, 'click',
        mxUtils.bind(this, function (evt) {
            this.openWindow(state.cell)      
        })
    );

    state.view.graph.container.appendChild(img);
    this.images.push(img);

    // Edit
    img = mxUtils.createImage(Edit);
    img.setAttribute('title', 'Edit');
    img.style.position = 'absolute';
    img.style.cursor = 'pointer';
    img.style.width = '20px';
    img.style.height = '20px';
    img.style.left = (state.x - 20) + 'px';
    img.style.top = (state.y + state.height) + 'px';

    mxEvent.addGestureListeners(img,
        mxUtils.bind(this, function (evt) {
            // Disables dragging the image
            mxEvent.consume(evt);
        })
    );

    mxEvent.addListener(img, 'click',
        mxUtils.bind(this, function (evt) {

            var x = state.x
            var y = state.y

            var origin = mxUtils.getOffset(graph.container);
            

            var div = document.querySelector("#editName")
            div.style.position = "fixed"
            div.style.display = "block"
            div.style.top = y + origin.y + "px"
            div.style.left = x + origin.x + 1 + "px"
            div.style.paddingTop = "3em"
            div.style.height = "100px"
            div.style.width = "100px"
            div.style.zIndex = 1009


            var value = state.cell.getValue()
            
            var template = document.createElement('template');
            value = value.trim(); // Never return a text node of whitespace as the result
            template.innerHTML = value;
            value = template.content.firstChild;
           

            var nameEl = value.querySelector("#name")


            var input = document.createElement("input");
            input.setAttribute("id", "inputPop");
            input.setAttribute("type", "text");

            input.setAttribute("value", nameEl.textContent);


            input.style.width = "99%"
            input.style.padding = "5px 5px"
            input.style.boxSizing = "border-box"
            input.setAttribute("autofocus", "autofocus");
            input.setAttribute("onfocus", "this.select()");
            div.appendChild(input)

            div.addEventListener('keypress', (e) => {
                var key = e.which || e.keyCode;
                if (key === 13) { // 13 is enter                    

                    nameEl.textContent = input.value                   

                    div.style.display = "none"
                    state.cell.setValue('<div>' + value.innerHTML + '</div>')                   


                    div.removeEventListener("keypress", e)                    

                    graph.refresh()
                    if (div.childNodes.length > 0) {
                        div.removeChild(div.childNodes[0])
                    }
                    // 
                }
            });


            //graph.refresh()
            mxEvent.consume(evt);
            this.destroy();
        })
    );

    state.view.graph.container.appendChild(img);
    this.images.push(img);
};

export function addMouseListeners(graph) {

    var iconTolerance = 25;

    // Shows icons if the mouse is over a cell
    graph.addMouseListener(
        {
            currentState: null,
            currentIconSet: null,
            mouseDown: function (sender, me) {
                // Hides icons on mouse down
                if (this.currentState != null) {
                    this.dragLeave(me.getEvent(), this.currentState);
                    this.currentState = null;
                }
            },
            mouseMove: function (sender, me) {
                if (this.currentState !== null && (me.getState() === this.currentState ||
                    me.getState() == null)) {
                    var tol = iconTolerance;
                    var tmp = new mxRectangle(me.getGraphX() - tol,
                        me.getGraphY() - tol, 2 * tol, 2 * tol);

                    if (mxUtils.intersects(tmp, this.currentState)) {
                        return;
                    }
                }

                tmp = graph.view.getState(me.getCell());

                // Ignores everything but vertices
                if (graph.isMouseDown || (tmp != null && !graph.getModel().isVertex(tmp.cell))) {
                    tmp = null;
                }

                if (tmp !== this.currentState) {
                    if (this.currentState != null) {
                        this.dragLeave(me.getEvent(), this.currentState);
                    }

                    this.currentState = tmp;

                    if (this.currentState != null) {
                        this.dragEnter(me.getEvent(), this.currentState);
                    }
                }
            },
            mouseUp: function (sender, me) { },
            dragEnter: function (evt, state) {             
                if(state.cell.value.startsWith("Shot")){
                    return
                }
                if (this.currentIconSet == null) {
                    this.currentIconSet = new mxIconSet(state);
                }
            },
            dragLeave: function (evt, state) {
                if (this.currentIconSet != null) {
                    this.currentIconSet.destroy();
                    this.currentIconSet = null;
                }
            }
        });
}