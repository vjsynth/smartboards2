// make the paper scope global, by injecting it into window:
paper.install(window);

var is_selecting_with_multitouch = false;

// Only executed our code once the DOM is ready.
$(document).ready(function() {

    // Create an empty project and a view for the canvas
    var canvas = document.getElementById('myCanvas');
    paper.setup(canvas);

    // bind touch handlers for multi-touch pen drawing
    // see: https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Touch_events
    canvas.addEventListener("touchstart",  handle_touch_start_cursor,  false);
    canvas.addEventListener("touchend",    handle_touch_end_cursor,    false);
    canvas.addEventListener("touchcancel", handle_touch_end_cursor,    false);
    canvas.addEventListener("touchleave",  handle_touch_end_cursor,    false);
    canvas.addEventListener("touchmove",   handle_touch_move_cursor,   false);
});

function handle_touch_start_cursor(evt) {
    if (edit_mode != "SELECTING") return;

    var hitTest_result = project.hitTest(currentTouches[0]);

    if (!hitTest_result){

        project.deselectAll();
        remove_selection_rects();
        selection_start_pt = currentTouches[0];
        is_selecting_with_multitouch = true;

    } else if (hitTest_result.item.selected) {

        set_edit_mode("TRANSFORMING");
        is_transforming_with_multitouch = true;
        selected_group.grab_pt = selected_group.position.subtract(currentTouches[0]);

    } else if (hitTest_result.item) {

        project.deselectAll(); 
        hitTest_result.item.selected = true;
        remove_selection_rects();         
        make_selection_group();

        set_edit_mode("TRANSFORMING");
        is_transforming_with_multitouch = true;
        selected_group.grab_pt = selected_group.position.subtract(currentTouches[0]);

    }
}

function handle_touch_move_cursor(evt) {
    evt.preventDefault();

    if (edit_mode != "SELECTING" || !is_selecting_with_multitouch) return;

    draw_selection_in_progress_rect(selection_start_pt, currentTouches[0]);

    items =  select_items_in_rect();

    project.deselectAll();
    for (var i=0; i<items.length; i++){
        items[i].selected = true;
    }

}

function handle_touch_end_cursor(evt) {
    evt.preventDefault();

    if (edit_mode != "SELECTING" || !is_selecting_with_multitouch) return;

    if (selection_in_progress_rect) selection_in_progress_rect.remove();

    remove_selection_rects();

    make_selection_group();

    project.deselectAll();
    selected_group.selected = true;

    is_selecting_with_multitouch = (currentTouches[0]!=null);
}