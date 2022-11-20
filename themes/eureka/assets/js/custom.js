toggle_spoiler = function(id) {
    document.getElementById(id).classList.toggle("visible")
    cont = document.getElementById(`${id}_content`);
    // console.log(cont.style.maxHeight);
    if (cont.style.maxHeight){
        cont.style.maxHeight = null;
    } else {
        cont.style.maxHeight = cont.scrollHeight + "px";
    }
}