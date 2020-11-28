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
//---------------------------------------

// To add a click to /details/id
function addClick() {
  var all_li = document.querySelectorAll("#display_result > li");
  for (let i = 0; i < all_li.length; ++i) {
    all_li[i].style.cursor = "pointer";
    all_li[i].addEventListener("click", function () {
      location.href = "/details/" + all_li[i].id;
    });
  }
}
//---------------------------------------

// To block multiple enterkey on submit
function blockSearch() {
  $("#submit_search").prop("disabled", true);
  setTimeout(function () {
    $("#submit_search").prop("disabled", false);
  }, 2000); // 2 second delay
}
//---------------------------------------

// Search function called after each submit
function search(page_number, entrie_page) {
  if ($("#query").val() != "") {
    // First submit, we create navbar
    if ($("#navbar_top").length === 0) {
      //init value for entrie_page -> default 25 entries per page
      entrie_page = 25;

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
      $(search_bar_prime).removeClass("w-100 justofy-content-center");
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
      $(div_result_number).css("display", "flex");
      $(div_result_number).css("justify-content", "center");
      $(div_result_number).css("margin-top", "15px");
      $(document.body).append(div_result_number);

      var div_container_result = document.createElement("div");
      $(div_container_result).attr("id", "container_result");
      $(div_container_result).addClass("container");
      $(document.body).append(div_container_result);

      var div_result = document.createElement("ul");
      $(div_result).attr("id", "display_result");
      $(div_result).addClass("list-group");
      $(div_container_result).append(div_result);

      var div_container_pagination = document.createElement("div");
      $(div_container_pagination).addClass(
        "container d-flex justify-content-between"
      );
      $(div_container_pagination).attr("id", "div_container_pagination");
      $(div_container_pagination).append(
        '<div class="p-2 visible" style="width: 180px;"></div>'
      );

      var div_pagination = document.createElement("ul");
      $(div_pagination).attr("id", "display_pagination");
      $(div_pagination).addClass("p-2 pagination ");
      $(div_container_pagination).append($(div_pagination));

      var div_container_entrie = document.createElement("select");
      $(div_container_entrie).attr("id", "select_entrie");
      $(div_container_entrie).addClass("p-2 custom-select col-12 col-lg-2");
      $(div_container_entrie).append(
        '<option value="25">25 entries/page</option>'
      );
      $(div_container_entrie).append(
        '<option value="50">50 entries/page</option>'
      );
      $(div_container_entrie).append(
        '<option value="100">100 entries/page</option>'
      );
      $(div_container_entrie).change(function () {
        var numentries = $(this).children("option:selected").val();
        search(1, numentries);
      });

      $(div_container_pagination).append($(div_container_entrie));
      $(div_container_pagination).insertBefore($(div_result));

      $(".container").css({ width: "auto", height: "auto", display: "table" });

      // To keep an history -> Only for test
      // window.history.pushState(
      //   "object or string",
      //   "Title",
      //   "/?=" + String(id_typeQuery) + "?=" + String(query)
      // );

      // To remove the index page after first submit
      var elem = document.getElementById("div_container_home");
      if (elem !== null) {
        document.getElementById("div_container_home").remove();
      }
    } else {
      // To remove last result after a new submit
      $("#display_result").empty();
      $("#display_pagination").empty();
      $("#display_pagination_prime_container").remove();
      $("#display_pagination2").empty();
      $("#result_number").empty();
      $("#confused_scientist_img").remove();
      entrie_page = parseInt(
        $("#select_entrie").children("option:selected").val()
      );
    }

    // Sent parameter to ajax request
    query = $("#query").val();
    query_type = $("#id_typeQuery").val();
    ajaxGet(page_number, entrie_page, query, query_type);
    
  }
}
