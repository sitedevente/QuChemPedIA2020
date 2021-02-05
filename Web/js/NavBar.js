/**
 * Navigation Bar's Onclick to redirect to results page 
 */
function searchnavbar(){
    var text = document.getElementById("query").value;
    var type = document.getElementById("id_typeQuery").value;
    window.location.href = "?type="+type+"&q="+text+"&page=1&showresult=25";
}