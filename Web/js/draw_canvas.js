//DRAW CANVAS

// Draw_canvas -> BESOIN DU SMILE JSON pour dessiner le canvas
// Initialize the drawer to draw to canvas
function draw_canvas(where_put,smile) {
let smilesDrawer = new SmilesDrawer.Drawer({
  width: 250,
  height: 250,
});
// Clean the input (remove unrecognized characters, such as spaces and tabs) and parse it
SmilesDrawer.parse(smile, function (tree) {
  // Draw to the canvas with id data[i].formule
  smilesDrawer.draw(tree, where_put, "light", false);
});
}
