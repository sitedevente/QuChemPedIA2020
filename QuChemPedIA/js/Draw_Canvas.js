//DRAW CANVAS

/**
 * Initialize the drawer to draw to canvas
 */
function drawCanvas() {
  var array_canvas = document.querySelectorAll("canvas");

  array_canvas.forEach(function (element) {
    let smileDrawer = new SmilesDrawer.Drawer({
      width: 150,
      height: 150,
    });

    // Smile value is display in hidden div : '"smi_value"_smile' and as html :"smi_value"
    var input = String($(element).attr("id").replace("_canvas", "")) + "_smile";
    var smile = document.getElementById(input);

    SmilesDrawer.parse(
      $(smile).html(),
      function (tree) {
        smileDrawer.draw(tree, $(element).attr("id"), "light", false);
      },
      function (err) {
        //console.log(err); // Display error if needed
      }
    );
  });
}
