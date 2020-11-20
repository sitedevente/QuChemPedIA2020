// To use enter key
// when the query is not empty on search bar
$(document).on("keydown", function (e) {
  var keyCode = e.which || e.keyCode;
  if (keyCode == 13 && $("#query").val() != "") {
    // enter key code
    search();
    $("#div_container_home").remove();
  }
});
// ------------------------------------------------

// To display a loader during the init of datatable
function loading(isTrue) {
  if (isTrue) {
    var div_flex = document.createElement("div");
    $(div_flex).attr("class", "d-flex justify-content-center");
    $(div_flex).attr("id", "loading");
    $(div_flex).css("margin-top", "30px");

    var spinner = document.createElement("div");
    $(spinner).attr("class", "spinner-border");
    $(spinner).attr("role", "status");
    $(spinner).attr("style", "width: 3rem; height: 3rem;");

    var span_spinner = document.createElement("span");
    $(span_spinner).attr("class", "sr-only");
    $(span_spinner).html("Loading...");

    $(spinner).append($(span_spinner));
    $(div_flex).append($(spinner));

    $("#result_number").append($(div_flex));
  } else {
    var div_flex = document.getElementById("loading");
    $(div_flex).remove();
  }
}

// To add a click to /details/id
function add_click() {
  var all_tr = document.querySelectorAll("tr");
  for (let i = 1; i < all_tr.length; ++i) {
    all_tr[i].style.cursor = "pointer";
    all_tr[i].addEventListener("click", function () {
      location.href = "/details/" + all_tr[i].id;
    });
  }
}

// To remove the home page after first submit
$("#submit_search").click(function () {
  var elem = document.getElementById("div_container_home");
  if (elem !== null) {
    document.getElementById("div_container_home").remove();
  }
});
// ------------------------------------------------

// Search function called after each submit
function search() {
  // First submit, we add a navbar
  if ($("#navbar_top").length === 0) {
    var navbar = document.createElement("nav");
    $(navbar).attr("id", "navbar_top");
    $(navbar).addClass("navbar navbar-expand-lg navbar-light bg-light");

    var logo = document.createElement("a");
    $(logo).attr("id", "home_button");
    $(logo).attr("href", "index.html");
    $(logo).html("QuChemPedIA");
    $(logo).addClass("navbar-brand primary");
    $(navbar).append(logo);

    var navbarSupportedContent = document.createElement("div");
    $(navbarSupportedContent).addClass("collapse navbar-collapse");
    $(navbar).append(navbarSupportedContent);

    $(document.body).append(navbar);

    var search_bar = document.getElementById("search_form");
    var search_bar_prime = search_bar.cloneNode(true);
    $(search_bar).addClass("form-inline my-2 my-lg-0");
    $(navbar).append($(search_bar_prime));

    var button_submit = document.getElementById("submit_search");
    $(button_submit)
      .removeClass(
        "mt-1 mb-1 mt-lg-0 btn btn-info default-primary-color col-12 col-lg-2"
      )
      .addClass("btn btn-primary mt-lg-0  my-2 my-sm-0");

    var div_result_number = document.createElement("div");
    $(div_result_number).attr("id", "result_number");
    $(div_result_number).addClass("");
    $(div_result_number).css("text-align", "center");
    $(document.body).append(div_result_number);

    var div_container_result = document.createElement("div");
    $(div_container_result).attr("id", "container_result");
    $(div_container_result).addClass("container");
    $(document.body).append(div_container_result);

    var div_result = document.createElement("div");
    $(div_result).attr("id", "display_result");
    $(div_result).addClass("container");
    $(div_container_result).append(div_result);
    $(".container").css({ width: "auto", height: "auto", display: "table" });
  }

  // To remove last result after a new submit
  $("#display_result").empty();
  $("#result_number").empty();

  //Loading() display
  loading(true);

  // Search informations
  var query = $("#query").val();
  var type_recherche = $("#id_typeQuery").val();

  $.ajax({
    type: "GET",
    url: "../js/data_test.json", //Change URL to use with  search API http://127.0.0.1:5000/API/recherche (Flask api)
    data: {
      type: type_recherche,
      q: query,
    },
    success: function (data_result) {
      var header_result = document.createElement("h3");
      $(header_result).css("text-align", "center");
      $(header_result).css("margin-top", "45px");

      // Datatable init
      // For each variables you want to diplay add them in <thead>
      var result = document.createElement("table");
      $(result).attr("id", "table_result");
      $(result).attr("class", "table table-striped table-bordered");
      $(result).html(
        "<thead id='table_header'><tr><th>Formule</th><th>Inchi</th><th>Smile</th><th>Number heavy atoms</th><th>Charge</th><th>Total Molecular Energy</th><th>Basis set name</th><th>Job type</th><th>Multiplicity</th><th>List thoery</th><th>Solvent</th></tr></thead>"
      );
      $("#display_result").append(result);

      // Datatable init
      // document.ready -> to let the script load successfully
      // data -> json data
      // https://datatables.net/reference/option/
      $(document).ready(function () {
        var table = $(result).DataTable({
          data: data_result.data,
          pagingType: "full_numbers",
          lengthMenu: [ 25, 50, 100 ],
          // get data from json file
          columns: [
            
            {
              data: "molecule.formula",
              defaultContent: "No formule",
              fnCreatedCell: function (nTd, sData, oData, iRow, iCol) {
                $(nTd).html(
                  "<a href='/details/" +
                    oData.comp_details.general.basis_set_md5 +
                    "'>" +
                    oData.molecule.formula +
                    "</a>"
                );
              },
            },
            { data: "molecule.inchi", defaultContent: "<i>No inchi</i>" },
            {
              data: "molecule.smi",
              defaultContent: "<i>No smiles</i>",
              fnCreatedCell: function (nTd, sData, oData, iRow, iCol) {
                //Canvas to display smi with draw_canvas
                $(nTd).html("");
                var canvas = document.createElement("canvas");
                $(canvas).attr(
                  "id",
                  oData.comp_details.general.basis_set_md5 + "_canvas"
                );
                $(canvas).css("width", 250);
                $(canvas).css("height", 250);

                var smile = document.createElement("div");
                $(smile).attr(
                  "id",
                  oData.comp_details.general.basis_set_md5 + "_smile"
                );
                $(smile).html(String(oData.molecule.smi));
                $(nTd).append(canvas);
                $(nTd).append(smile);
                $(smile).hide();
              },
            },
            {
              data: "molecule.nb_heavy_atoms",
              defaultContent: "<i>No heavy atoms</i>",
              className: "text-center",
            },
            {
              data: "molecule.charge",
              defaultContent: "<i>No charge</i>",
              className: "text-center",
            },
            {
              data: "results.wavefunction.total_molecular_energy",
              defaultContent: "<i>No total molecular energy</i>",
            },
            {
              data: "comp_details.general.basis_set_name",
              defaultContent: "<i>No basis set name</i>",
              className: "text-center",
            },
            {
              data: "comp_details.general.job_type",
              defaultContent: "<i>No job type</i>",
              className: "text-center",
            },
            {
              data: "molecule.multiplicity",
              defaultContent: "<i>No multiplicity</i>",
              className: "text-center",
            },
            {
              data: "comp_details.general.list_theory",
              defaultContent: "<i>No list theory</i>",
              className: "text-center",
            },
            {
              data: "comp_details.general.solvent",
              defaultContent: "<i>No solvent</i>",
              className: "text-center",
            },
          ],
          // Callback at the end
          fnRowCallback: function (
            nRow,
            aData,
            iDisplayIndex,
            iDisplayIndexFull
          ) {
            // Add ID for each row
            var id = aData.comp_details.general.basis_set_md5;
            $(nRow).attr("id", id);
            return nRow;
          },
        });
        //When request end : add click,draw_canvas then add eventlistener when user change page/sort -> to keep clic,canvas

        //Clic -> details/id
        add_click();
        // Draw_canvas for first page result
        draw_canvas();

        //Result number
        $(header_result).html(
          "Found<b> " + table.data().count() + "</b> for <b>" + query + "</b>"
        );
        var div_result_number = document.getElementById("result_number");
        $(div_result_number).append($(header_result));

        // No result
        if (table.data().count() == 0) {
          $("#display_result").hide();
          var no_result = document.createElement("img");
          $(no_result).attr("src", "../img/confused_scientist.png");
          $(no_result).attr("alt", "No result");
          $(no_result).css({
            "margin-left": "auto",
            "margin-right": "auto",
            height: "300px",
            display: "block",
          });
          $(div_result_number).append(no_result);
        } else {
          // show/hide to display or not the datatble when result/no result 
          $("#display_result").show();
        }

        
        //Draw_canvas/add_click when we switch page
        document
          .getElementById("table_result_paginate")
          .addEventListener("click", function () {
            draw_canvas();
            add_click();
          });

        //Draw_canvas/add_click when we use sort
        document
          .getElementById("table_header")
          .addEventListener("click", function () {
            draw_canvas();
            add_click();
          });

        //Loading() no display
        loading(false);
      });
    },
    error: function () {
      // If we catch an error
      var no_result = document.createElement("h5");
      $(no_result).html("Sorry, error in execution.");
      $(no_result).css("text-align", "center");
    },
  });
  // ------------------------------------------------ END SEARCH FUNCTION
}
