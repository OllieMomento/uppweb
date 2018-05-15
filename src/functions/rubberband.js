
export function RubberBandSelection(container) {
    //RUBBERBAND SELECTION
    var clientX
    var clientY

    container.addEventListener("mousedown", handleMouseDown, false);

    function handleMouseDown(evt) {
        var selection = document.createElement('div');
        selection.setAttribute('id', "selectionDiv");

        clientX = evt.clientX
        clientY = evt.clientY

        selection.style.position = "fixed"
        selection.style.display = "block"
        selection.style.background = "blue"
        selection.style.top = clientY + "px"
        selection.style.left = clientX + "px"
        selection.style.opacity = 0.2
        selection.style.border = "1px"

        selection.style.zIndex = 1000

        container.addEventListener('mousemove', handleMouseMove, false)
        container.addEventListener('mouseup', handleMouseUp, false)

        container.appendChild(selection)
    }

    function handleMouseMove(evt) {
        var selection = document.getElementById('selectionDiv');

        if (evt.clientX < clientX) {
            selection.style.left = evt.clientX + "px"
            selection.style.width = clientX - evt.clientX + "px"
        }
        else {
            selection.style.left = clientX + "px"
                selection.style.width = evt.clientX - clientX + "px"
        }
        if (evt.clientY < clientY) {
            selection.style.top = evt.clientY + "px"
            selection.style.height = clientY - evt.clientY + "px"
        }
        else {
            selection.style.top = clientY + "px"
            selection.style.height = evt.clientY - clientY + "px"
        }
    }
    function handleMouseUp(evt) {

        var selection = document.getElementById('selectionDiv');
        if(selection != null){
            selection.remove()
        }        
        container.removeEventListener("mousemove", handleMouseMove, false);
    }


}

