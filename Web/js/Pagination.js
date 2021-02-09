  //////////////////////////////////////////////////////////////////////////
//            Function to set a pagination for the search function          //
//  We give 3 parameters :                                                  //
//  entrie_page : entrie per page                                           //
//  result_length : total result of request                                 //
//  page_number : page user want to display                                 //
//                                                                          //
//  First we get into numPages the total page we need                       //
//  We empty our last pagination then we remove the on_top button           //
//                                                                          //
//  [*]-> active page                                                       //
//  if numPages < 10                                                        //
//  [*][2][3][4][5][6][7][8][9][10]                                         //
//                                                                          //
//  else for first page only display start/end (ex:14 pages)                //
//  [*][2][3][4]...[11][12[13][14][NEXT][+10]                               //
//                                                                          //
//  else for all pages between, only show start/end and around              //
//  [PREVIOUS][1]...[3][4][5][*][7][8][9]...[14][NEXT]                      //
//                                                                          //
//  else same as first page but for last page                               //
//                                                                          //
//  --------------------------------------------------                      //
//  Then clone this pagination for the bottom                               //
//                                                                          //
//  Declaration of function use in Ajax_Request at the end of this file     //
//                                                                          //
  //////////////////////////////////////////////////////////////////////////

/**
 * Function to set a pagination for the search function
 * @param {int} entrie_page 
 * @param {int} result_length 
 * @param {int} page_number 
 */
function pagination(entrie_page, result_length, page_number) {
  //To get number page needed
  var numPages = Math.ceil(result_length / entrie_page);

  $("#display_pagination").empty();
  $("#on_top").remove();

  //minusTen button
  var div_minus = document.createElement("li");
  $(div_minus).attr("id", "minus_button");
  $(div_minus).addClass("page-item disabled");
  $(div_minus).append('<a class="page-link" href="#" tabindex="-10">-10</a>');
  $("#display_pagination").append(div_minus);

  //--------------------------------------

  //Previous button
  var div_prev = document.createElement("li");
  $(div_prev).attr("id", "prev_button");
  $(div_prev).addClass("page-item disabled");
  $(div_prev).append(
    '<a class="page-link" href="#" tabindex="-1">Previous</a>'
  );
  $("#display_pagination").append(div_prev);
  //--------------------------------------

  //If we have less than 10 pages, then simple display with all 10 pages
  if (numPages < 10) {
    // Page button
    for (let i = 1; i < numPages + 1; ++i) {
      var div_page = document.createElement("li");
      $(div_page).addClass("page-item");
      $(div_page).attr("id", "page" + i);
      $(div_page).append('<a class="page-link" href="#">' + i + "</a>");
      $(div_page).click(function (event) {
        event.preventDefault();
        search(i, entrie_page);
      });
      $("#display_pagination").append(div_page);
    }
  }
  //Else for first pages, we only show the begin and the end
  else if (page_number < 5 && page_number != 4) {
    for (let i = 1; i < 5; ++i) {
      var div_page = document.createElement("li");
      $(div_page).addClass("page-item");
      $(div_page).attr("id", "page" + i);
      $(div_page).append('<a class="page-link" href="#">' + i + "</a>");
      $(div_page).click(function (event) {
        event.preventDefault();
        search(i, entrie_page);
      });
      $("#display_pagination").append(div_page);
    }

    var div_page = document.createElement("li");
    $(div_page).addClass("page-item disabled");
    $(div_page).append('<a class="page-link" href="#">...</a>');

    $("#display_pagination").append(div_page);

    for (let i = numPages - 3; i < numPages + 1; ++i) {
      var div_page = document.createElement("li");
      $(div_page).addClass("page-item");
      $(div_page).attr("id", "page" + i);
      $(div_page).append('<a class="page-link" href="#">' + i + "</a>");
      $(div_page).click(function (event) {
        event.preventDefault();
        search(i, entrie_page);
      });
      $("#display_pagination").append(div_page);
    }
  }
  //Else for all pages between, we show first/last value and some
  else if (
    page_number > numPages - 5 &&
    page_number != numPages - 3 &&
    page_number >= numPages - 3
  ) {
    for (let i = 1; i < 5; ++i) {
      var div_page = document.createElement("li");
      $(div_page).addClass("page-item");
      $(div_page).attr("id", "page" + i);
      $(div_page).append('<a class="page-link" href="#">' + i + "</a>");
      $(div_page).click(function (event) {
        event.preventDefault();
        search(i, entrie_page);
      });
      $("#display_pagination").append(div_page);
    }

    var div_page = document.createElement("li");
    $(div_page).addClass("page-item disabled");
    $(div_page).append('<a class="page-link" href="#">...</a>');

    $("#display_pagination").append(div_page);

    for (let i = numPages - 4; i < numPages + 1; ++i) {
      var div_page = document.createElement("li");
      $(div_page).addClass("page-item");
      $(div_page).attr("id", "page" + i);
      $(div_page).append('<a class="page-link" href="#">' + i + "</a>");
      $(div_page).click(function (event) {
        event.preventDefault();
        search(i, entrie_page);
      });
      $("#display_pagination").append(div_page);
    }
  }
  //For first value limit/last value limit
  else {
    if (page_number != 4) {
      var div_page = document.createElement("li");
      $(div_page).addClass("page-item");
      $(div_page).attr("id", "page" + 1);
      $(div_page).append('<a class="page-link" href="#">' + 1 + "</a>");
      $(div_page).click(function (event) {
        event.preventDefault();
        search(1, entrie_page);
      });
      $("#display_pagination").append(div_page);

      if (page_number != 5) {
        var div_page = document.createElement("li");
        $(div_page).addClass("page-item disabled");
        $(div_page).append('<a class="page-link" href="#">...</a>');

        $("#display_pagination").append(div_page);
      }
    }

    for (let i = page_number - 3; i < page_number + 4; ++i) {
      var div_page = document.createElement("li");
      $(div_page).addClass("page-item");
      $(div_page).attr("id", "page" + i);
      $(div_page).append('<a class="page-link" href="#">' + i + "</a>");
      $(div_page).click(function (event) {
        event.preventDefault();
        search(i, entrie_page);
      });
      $("#display_pagination").append(div_page);
    }

    if (page_number != numPages - 3) {
      if (page_number != numPages - 4) {
        var div_page = document.createElement("li");
        $(div_page).addClass("page-item disabled");
        $(div_page).append('<a class="page-link" href="#">...</a>');

        $("#display_pagination").append(div_page);
      }
      var div_page = document.createElement("li");
      $(div_page).addClass("page-item");
      $(div_page).attr("id", "page" + numPages);
      $(div_page).append('<a class="page-link" href="#">' + numPages + "</a>");
      $(div_page).click(function (event) {
        search(numPages, entrie_page);
      });
      $("#display_pagination").append(div_page);
    }
  }
  //--------------------------------------

  //Next button
  var div_next = document.createElement("li");
  $(div_next).attr("id", "next_button");
  $(div_next).addClass("page-item disabled");
  $(div_next).append('<a class="page-link" href="#" tabindex="+1">Next</a>');
  $("#display_pagination").append(div_next);
  //--------------------------------------

  //plusTen button
  var div_plus = document.createElement("li");
  $(div_plus).attr("id", "plus_button");
  $(div_plus).addClass("page-item disabled");
  $(div_plus).append('<a class="page-link" href="#" tabindex="+10">+10</a>');
  $("#display_pagination").append(div_plus);

  //--------------------------------------

  //Pagination_clone -> bottom
  // remove for each new research done then copy
  // Changing id for each function we call on our button
  $("#display_pagination2").remove();
  var display_pagination_prime_container = document.createElement("div");

  $(display_pagination_prime_container).addClass(
    "container d-flex justify-content-between"
  );
  $(display_pagination_prime_container).attr(
    "id",
    "display_pagination_prime_container"
  );
  // Just adding this div for a proper display
  $(display_pagination_prime_container).append(
    '<div class="p-2 visible" style="width: 50px;"></div>'
  );

  var display_pagination_prime = $("#display_pagination").clone(true, true);
  $(display_pagination_prime).attr("id", "display_pagination2");
  $(display_pagination_prime).addClass("p-2");

  $(display_pagination_prime)
    .children()
    .each(function () {
      if ($(this).attr("id") != undefined) {
        let id = $(this).attr("id").replace("page", "page_clone");
        $(this).attr("id", id);
      }
    });

  $(display_pagination_prime)
    .children()
    .each(function () {
      if ($(this).attr("id") === "prev_button") {
        $(this).attr("id", "prev_button_clone");
      } else {
      }
    });

  $(display_pagination_prime)
    .children()
    .each(function () {
      if ($(this).attr("id") === "next_button") {
        $(this).attr("id", "next_button_clone");
      } else {
      }
    });

  $(display_pagination_prime)
    .children()
    .each(function () {
      if ($(this).attr("id") === "plus_button") {
        $(this).attr("id", "plus_button_clone");
      } else {
      }
    });

  $(display_pagination_prime)
    .children()
    .each(function () {
      if ($(this).attr("id") === "minus_button") {
        $(this).attr("id", "minus_button_clone");
      } else {
      }
    });

  $(display_pagination_prime_container).append($(display_pagination_prime));

  // Adding on_top button
  $(display_pagination_prime_container).append(
    '<button id="on_top" type="button" class="btn btn-primary btn-sm" style="height:30px;margin-top:8px;">Go top</button>'
  );

  //Adding clone pagination at bottom
  $(display_pagination_prime_container).insertAfter($("#display_result"));
}

//To set active page on our two pagination
//To set if next/prev is disabled or not
/**
 * To set active page on our two pagination
 * @param {int} pageid 
 * @param {int} pageid_clone 
 * @param {int} total_result 
 * @param {int} entrie_page 
 */
function pageSelect(pageid, pageid_clone, total_result, entrie_page) {
  var all_li = document.querySelectorAll(".p-2.pagination > li.page-item");
  for (let i = 0; i < all_li.length; ++i) {
    $(all_li[i]).removeClass("active");
  }
  $("#" + String(pageid)).addClass("active");
  $("#" + String(pageid_clone)).addClass("active");
  var page = pageid.replace("page", "");
  page = parseInt(page, 10);
  var total_page = Math.ceil(total_result / entrie_page);

  if (page == 1 && total_result > entrie_page) {
    $("#display_pagination li:nth-child(2)").addClass("disabled");
    $("#display_pagination li:nth-last-child(2)").removeClass("disabled");

    $("#display_pagination2 li:nth-child(2)").addClass("disabled");
    $("#display_pagination2 li:nth-last-child(2)").removeClass("disabled");
  } else if (page == 1 && total_result < entrie_page) {
    $("#display_pagination li:nth-child(2)").addClass("disabled");
    $("#display_pagination li:nth-last-child(2)").addClass("disabled");

    $("#display_pagination2 li:nth-child(2)").addClass("disabled");
    $("#display_pagination2 li:nth-last-child(2)").addClass("disabled");
  } else if (page == total_page) {
    $("#display_pagination li:nth-child(2)").removeClass("disabled");
    $("#display_pagination2 li:nth-child(2)").removeClass("disabled");
    $("#display_pagination li:nth-last-child(2)").addClass("disabled");
    $("#display_pagination2 li:nth-last-child(2)").addClass("disabled");
  } else {
    $("#display_pagination li:nth-child(2)").removeClass("disabled");
    $("#display_pagination li:nth-last-child(2)").removeClass("disabled");

    $("#display_pagination2 li:nth-child(2)").removeClass("disabled");
    $("#display_pagination2 li:nth-last-child(2)").removeClass("disabled");
  }

  if (total_page > 10 && page + 10 <= total_page) {
    $("#display_pagination li:last").removeClass("disabled");
    $("#display_pagination2 li:last").removeClass("disabled");
  }

  if (total_page > 10 && page - 10 >= 1) {
    $("#display_pagination li:first").removeClass("disabled");
    $("#display_pagination2 li:first").removeClass("disabled");
  }
}

//
// Function for each button
//

//prevPage function -> go page -1
/**
 * Pagination - To go to page - 1
 * @param {int} current_page 
 * @param {int} entrie_page 
 */
function prevPage(current_page, entrie_page) {
  search(parseInt(current_page, 10) - 1, entrie_page);
}

//nextPage function -> go page +1
/**
 * Pagination - To go to page + 1
 * @param {int} current_page 
 * @param {int} entrie_page 
 */
function nextPage(current_page, entrie_page) {
  search(parseInt(current_page, 10) + 1, entrie_page);
}

//plusTen function -> go page+10
/**
 * Pagination - To go to page + 10
 * @param {int} current_page 
 * @param {int} entrie_page 
 */
function plusTen(current_page, entrie_page) {
  search(current_page + 10, entrie_page);
}
//minusTen function -> go page-10
/**
 * Pagination - To go to page - 10
 * @param {int} current_page 
 * @param {int} entrie_page 
 */
function minusTen(current_page, entrie_page) {
  search(current_page - 10, entrie_page);
}

//To add function for each button
/**
 * Add onclick for each button
 * @param {int} current_page 
 * @param {int} entrie_page 
 */
function addClicfunction(current_page, entrie_page) {
  $("#next_button").click(function (event) {
    event.preventDefault();
    nextPage(current_page, entrie_page);
  });

  $("#next_button_clone").click(function (event) {
    event.preventDefault();
    nextPage(current_page, entrie_page);
  });

  $("#prev_button").click(function (event) {
    event.preventDefault();
    prevPage(current_page, entrie_page);
  });

  $("#prev_button_clone").click(function (event) {
    event.preventDefault();
    prevPage(current_page, entrie_page);
  });

  $("#plus_button").click(function (event) {
    event.preventDefault();
    plusTen(current_page, entrie_page);
  });

  $("#plus_button_clone").click(function (event) {
    event.preventDefault();
    plusTen(current_page, entrie_page);
  });

  $("#minus_button").click(function (event) {
    event.preventDefault();
    minusTen(current_page, entrie_page);
  });

  $("#minus_button_clone").click(function (event) {
    event.preventDefault();
    minusTen(current_page, entrie_page);
  });
}

//When we change page -> to check if a buton is disabled or not
// if disabled -> no_function
// else -> add next/prev/plus/minus function
/**
 * When we change page -> Check if a button is disabled <br>
 * If disabled -> no_function <br>
 * else -> add next/prev/plus/minus function
 * @param {int} current_page 
 * @param {int} entrie_page 
 */
function changePage(current_page, entrie_page) {
  addClicfunction(current_page, entrie_page);
  if ($("#next_button").attr("class") != "page-item disabled") {
    $("#next_button").show();

    $("#next_button_clone").show();
  } else {
    $("#next_button").hide();
    $("#next_button_clone").hide();
  }

  if ($("#prev_button").attr("class") != "page-item disabled") {
    $("#prev_button").show();
    $("#prev_button_clone").show();
  } else {
    $("#prev_button").hide();
    $("#prev_button_clone").hide();
  }

  if ($("#plus_button").attr("class") != "page-item disabled") {
    $("#plus_button").show();

    $("#plus_button_clone").show();
  } else {
    $("#plus_button").hide();
    $("#plus_button_clone").hide();
  }

  if ($("#minus_button").attr("class") != "page-item disabled") {
    $("#minus_button").show();

    $("#minus_button_clone").show();
  } else {
    $("#minus_button").hide();
    $("#minus_button").hide();
    $("#minus_button_clone").hide();
  }
}
