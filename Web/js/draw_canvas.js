//DRAW CANVAS

// Draw_canvas -> BESOIN DU SMILE JSON pour dessiner le canvas
// Initialize the drawer to draw to canvas
function draw_canvas() {
  var array_canvas = document.querySelectorAll("canvas");

  array_canvas.forEach(function (element) {
    let smileDrawer = new SmilesDrawer.Drawer({
      width: 250,
      height: 250,
    });

    var input = String($(element).attr("id").replace("_canvas", "")) + "_smile";
    var smile = document.getElementById(input);

    SmilesDrawer.parse(
      $(smile).html(),
      function (tree) {
        smileDrawer.draw(tree, $(element).attr("id"), "light", false);
      },
      function (err) {
        console.log(err);
      }
    );
  });
}
