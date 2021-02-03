  //////////////////////////////////////////////////////////////////////////
//            Function to execute ajax request on search API                //
//  We give 5 parameters :                                                  //
//  page_number : page number to display                                    //
//  entrie_page : entrie per page                                           //
//  query : user input                                                      //
//  query_type : Formula/Inchi/smile                                        //
//  pop_state : If we get the request from history (Keep_History.js)        //
//                                                                          //
//  We first display a loading (Search.js)                                  //
//  and hide the select entrie div                                          //
//  We keep the total result in a variable to use with pageSelect function  //
//  Then the ajax request is send -> SUCCESS :                              //
//  We first call our pagination function (Pagination.js)                   //
//  Then for each element we found with the request on the API -> display   //
//  and add css style                                                       //
//                                                                          //
//  At the end of the request, function to draw smile (Draw_Canvas.js)      //
//  on each canvas present on the page, function to add href                //
//  for details page, call pageSelect                                       //
//  and changePage function (Pagination.js)                                 //
//  end of loading display                                                  //
//  if pop_state is true we push state to keep history                      //
//                                                                          //
//  Ajax request -> ERROR :                                                 //
//  Display an arror message, with img                                      //
//                                                                          //
  //////////////////////////////////////////////////////////////////////////


/**
 * Function to execute ajax request on search API
 * @param {int} page_number 
 * @param {int} entrie_page 
 * @param {string} query 
 * @param {string} query_type 
 * @param {*} pop_state 
 */
function ajaxGet(page_number, entrie_page, query, query_type, pop_state) {
  //Show loading during request
  loading(true);
  $("#select_entrie").hide();
  // To keep the information about how much result we have for pageSelect function
  var total_result = 0;

  //Ajax request on
  // Query -> input value
  // Query_type -> Formula/smi/Inchi
  // page, showresult -> Page and entrie on this page
  $.ajax({
    type: "GET",
    url: "http://127.0.0.1:5000/api/search",
    data: {
      type: query_type,
      q: query,
      page: page_number,
      showresult: entrie_page,
    },
    success: function (data) {
      $("#result_number").html(
        "<h1>Found " +
          data.total +
          " for " +
          query +
          " (" +
          query_type +
          ")</h1><br></br>"
      );
      total_result = data.total;

      //Pagination
      pagination(entrie_page, data.total, page_number);
      // Add on_top function to scroll top
      $("#on_top").click(function () {
        $("html, body").animate(
          {
            scrollTop: $("#navbar_top").offset().top,
          },
          "fast"
        );
      });

      // Create each result as list-group-item
      // Adding new cursor on mouseover and CSS transf
      for (var i = 0; i < data.data.length; i++) {
        var div_row_result = document.createElement("li");
        $(div_row_result).addClass("list-group-item");
        $(div_row_result).attr("id", data.data[i].id);
        $(div_row_result).css("display", "flex");
        $(div_row_result).css("width", "1000px");
        $(div_row_result).css("height", "150px");
        $(div_row_result).css("white-space", "nowrap");
        $(div_row_result)
          .mouseover(function () {
            $(this).css("cursor", "pointer");
            $(this).css("transform", "scale(1.02)");
            $(this).css("transition", "transform 0.2 ease");
          })
          .mouseout(function () {
            $(this).css("cursor", "none");
            $(this).css("transform", "scale(1.00)");
            $(this).css("transition", "transform 0.2 ease");
          });

        var div_col_smile = document.createElement("div");
        $(div_col_smile).addClass("col-lg-3");

        var div_col_infos = document.createElement("div");
        $(div_col_infos).addClass("col-lg-8");

        //Smile
        var div_container_row = document.createElement("div");
        $(div_container_row).addClass("container row");

        var canvas = document.createElement("canvas");
        $(canvas).attr("id", data.data[i].id + "_canvas");
        $(canvas).css("width", 150);
        $(canvas).css("height", 150);

        var smile = document.createElement("div");
        $(smile).attr("id", data.data[i].id + "_smile");
        $(smile).html(String(data.data[i].smi));
        $(div_container_row).append(canvas);
        $(div_container_row).append(smile);
        $(smile).hide();
        $(div_col_smile).append(div_container_row);
        //---------------------------------------------------------------------------------------------
        //---------------------------------------------------------------------------------------------

        //Show Inchi, only if we search for it -> Display on top
        if (query_type === "inchi") {
          $(div_row_result).css("height", "160px");
          var div_container_row = document.createElement("div");
          $(div_container_row).addClass("container row");
          var div_col = document.createElement("div");
          $(div_col).addClass("col-lg-6");
          if (data.data[i].solvent != undefined) {
            $(div_col).append(
              "<span class='text-primary'>Inchi : </span>" +
                data.data[i].inchi +
                "<br>"
            );
          } else
            $(div_col).append(
              "<span class='text-muted'>Inchi : </span> No inchi<br>"
            );
          $(div_container_row).append(div_col);
          $(div_col_infos).append(div_container_row);
        }

		if (query_type === "smi") {
          $(div_row_result).css("height", "160px");
          var div_container_row = document.createElement("div");
          $(div_container_row).addClass("container row");
          var div_col = document.createElement("div");
          $(div_col).addClass("col-lg-6");
          if (data.data[i].solvent != undefined) {
            $(div_col).append(
              "<span class='text-primary'>Smile : </span>" +
                data.data[i].smi +
                "<br>"
            );
          } else
            $(div_col).append(
              "<span class='text-muted'>Inchi : </span> No Smile<br>"
            );
          $(div_container_row).append(div_col);
          $(div_col_infos).append(div_container_row);
        }
        //---------------------------------------------------------------------------------------------
        //---------------------------------------------------------------------------------------------

        //Formula
        var div_container_row = document.createElement("div");
        $(div_container_row).addClass("container row");
        var div_col = document.createElement("div");
        $(div_col).addClass("col-lg-6");
        if (data.data[i].formula != undefined) {
          $(div_col).append(
            "<span class='text-primary'>Formula : </span>" +
              data.data[i].formula +
              "<br>"
          );
        } else
          $(div_col).append(
            "<span class='text-primary'>Formula : </span> No formula<br>"
          );
        $(div_container_row).append(div_col);
        $(div_col_infos).append(div_container_row);
        //---------------------------------------------------------------------------------------------
        //---------------------------------------------------------------------------------------------

        //Job type, nb heavy atoms
        var div_container_row = document.createElement("div");
        $(div_container_row).addClass("container row");
        var div_col = document.createElement("div");
        $(div_col).addClass("col-lg-6");
        if (data.data[i].job_type != undefined) {
          $(div_col).append(
            "<span class='text-primary'>Job Type : </span>" +
              data.data[i].job_type
                .replaceAll('"', "")
                .replaceAll("[", "")
                .replaceAll("]", "") +
              "<br>"
          );
        } else
          $(div_col).append(
            "<span class='text-primary'>Job Type : </span> No job type <br>"
          );
        $(div_container_row).append(div_col);

        var div_col = document.createElement("div");
        $(div_col).addClass("col-lg-6");
        if (data.data[i].nb_heavy_atoms != undefined) {
          $(div_col).append(
            "<span class='text-muted'>Number heavy atoms : </span>" +
              data.data[i].nb_heavy_atoms +
              "<br>"
          );
        } else
          $(div_col).append(
            "<span class='text-muted'>Number heavy atoms : </span> No number heavy atoms<br>"
          );
        $(div_container_row).append(div_col);
        $(div_col_infos).append(div_container_row);
        //---------------------------------------------------------------------------------------------
        //---------------------------------------------------------------------------------------------

        //Charge, basis set name
        var div_container_row = document.createElement("div");
        $(div_container_row).addClass("container row");
        var div_col = document.createElement("div");
        $(div_col).addClass("col-lg-6");
        if (data.data[i].charge != undefined) {
          $(div_col).append(
            "<span class='text-muted'>Charge : </span>" +
              data.data[i].charge +
              "<br>"
          );
        } else
          $(div_col).append(
            "<span class='text-muted'>Charge : </span> No charge<br>"
          );
        $(div_container_row).append(div_col);

        var div_col = document.createElement("div");
        $(div_col).addClass("col-lg-6");
        if (data.data[i].basis_set_name != undefined) {
          $(div_col).append(
            "<span class='text-muted'>Basis set name : </span> " +
              data.data[i].charge +
              "<br>"
          );
        } else
          $(div_col).append(
            "<span class='text-muted'>Basis set name : </span> No basis set name<br>"
          );
        $(div_container_row).append(div_col);
        $(div_col_infos).append(div_container_row);
        //---------------------------------------------------------------------------------------------
        //---------------------------------------------------------------------------------------------

        //Multiplicity, list theory
        var div_container_row = document.createElement("div");
        $(div_container_row).addClass("container row");
        var div_col = document.createElement("div");
        $(div_col).addClass("col-lg-6");
        if (data.data[i].multiplicity != undefined) {
          $(div_col).append(
            "<span class='text-muted'>Multiplicity : </span> " +
              data.data[i].multiplicity +
              "<br>"
          );
        } else
          $(div_col).append(
            "<span class='text-muted'>Multiplicity : </span> No multiplicity<br>"
          );
        $(div_container_row).append(div_col);

        var div_col = document.createElement("div");
        $(div_col).addClass("col-lg-6");
        if (data.data[i].list_theory != undefined) {
          $(div_col).append(
            "<span class='text-muted'>List Theory : </span>" +
              data.data[i].list_theory
                .replaceAll('"', "")
                .replaceAll("[", "")
                .replaceAll("]", "")
          );
        } else
          $(div_col).append(
            "<span class='text-muted'>List Theory : </span> No list theory<br>"
          );
        $(div_container_row).append(div_col);
        $(div_col_infos).append(div_container_row);
        //---------------------------------------------------------------------------------------------
        //---------------------------------------------------------------------------------------------

        //Solvent, total molecular energy
        var div_container_row = document.createElement("div");
        $(div_container_row).addClass("container row");
        var div_col = document.createElement("div");
        $(div_col).addClass("col-lg-6");
        if (data.data[i].solvent != undefined) {
          $(div_col).append(
            "<span class='text-muted'>Solvent : </span>" +
              data.data[i].solvent +
              "<br>"
          );
        } else
          $(div_col).append(
            "<span class='text-muted'>Solvent : </span> No solvent<br>"
          );
        $(div_container_row).append(div_col);

        var div_col = document.createElement("div");
        $(div_col).addClass("col-lg-6");
        if (data.data[i].total_molecular_energy != undefined) {
          $(div_col).append(
            "<span class='text-muted'>Ending energy : </span>" +
              data.data[i].total_molecular_energy +
              "<br>"
          );
        } else
          $(div_col).append(
            "<span class='text-muted'>Ending energy : </span> No ending energy<br>"
          );
        $(div_container_row).append(div_col);
        $(div_col_infos).append(div_container_row);
        //---------------------------------------------------------------------------------------------
        //---------------------------------------------------------------------------------------------

        $(div_row_result).append($(div_col_smile));
        $(div_row_result).append($(div_col_infos));
        $("#display_result").append($(div_row_result));
      }
      //Draw smile
      drawCanvas();
      //Add ref to detail page
      addClick();
      //Show entrie select, hide durring request execution
      $("#select_entrie").show();
      //Adding to 2 pagination -> active page
      pageSelect(
        "page" + page_number,
        "page_clone" + page_number,
        total_result,
        entrie_page
      );
      //When we change page
      changePage(page_number, entrie_page);
      //Loading display hide
      loading(false);
      //To keep history, we push state
      if (!pop_state) {
        window.history.pushState(
          {
            url:
              "http://127.0.0.1/QuChemPedIA/html/"+
              "?type=" +
              $("#id_typeQuery").val() +
              "&q=" +
              $("#query").val() +
              "&page=" +
              page_number +
              "&showresult=" +
              entrie_page +
              "#" +
              "",
            accueil: false,
            id: id + 1,
          },
          "search" + $("#id_typeQuery").val() + $("#query").val() + page_number,
          "/QuChemPedIA/html/?type=" +
            $("#id_typeQuery").val() +
            "&q=" +
            $("#query").val() +
            "&page=" +
            page_number +
            "&showresult=" +
            entrie_page +
            "#"
        );
        id++;
      }
    },
    //When error 404 -> no result or error in search
    error: function (xhr, ajaxOptions, thrownError) {
      if (xhr.status == 404) {
        var no_result = document.createElement("img");
        $(no_result).attr("src", "../img/confused_scientist.png");
        $(no_result).attr("alt", "No result");
        $(no_result).attr("id", "confused_scientist_img");
        $(no_result).css({
          "margin-left": "auto",
          "margin-right": "auto",
          height: "300px",
          display: "block",
        });

        $("#result_number").html(
          "<h2>We couldn't find any molecule matching your search.</h2>"
        );
        $("#container_result").append(no_result);
        loading(false);
      }
    },
  });
}
