// When user want to use URL to display the result on onload
window.onload = function () {
  searchURL();
};

//Add listener when user click on back/forward button of nav
//We push state in ajax_request line 297
// !! If the URL change, change it line 297 !!
window.addEventListener("popstate", function (e) {
  e.preventDefault();
  if (e.state != null) {
      //When we go back on index -> Problem
      // We loose all last research, we just keep the first
      if ($("#navbar_top").length === 0) {

        let new_url = new URL(e.state.url);
        let type = new_url.searchParams.get("type");
        let q = new_url.searchParams.get("q");
        let page = parseInt(new_url.searchParams.get("page"), 10);
        let entrie = parseInt(new_url.searchParams.get("showresult"), 10);
        $("#query").val(q);
        $("#id_typeQuery").val(type).change();
        search(page,entrie);blockSearch();return false;
      }
      //Else for other case, when we access new page, make a new search
      else {
      let new_url = new URL(e.state.url);
      let type = new_url.searchParams.get("type");
      let q = new_url.searchParams.get("q");
      let page = parseInt(new_url.searchParams.get("page"), 10);
      let entrie = parseInt(new_url.searchParams.get("showresult"), 10);
      ajaxGet(page, entrie, q, type,true);

      $("#query").val(q);
      $("#id_typeQuery").val(type).change();
      //Like a classic search, we remove current result
      $("#display_result").empty();
      $("#display_pagination").empty();
      $("#display_pagination_prime_container").remove();
      $("#display_pagination2").empty();
      $("#result_number").empty();
      $("#confused_scientist_img").remove();
      //---------------------------------------
      }
    }
    //Else show index
 else {
    window.history.go("index.html");
  }
});
