var array = [];

// Vue que ce n'est pas un formulaire pour le moment, la touche entree rafraichit la page si cette fonction n'est pas présente -> Là pour tester
var input = document.getElementById("query");
input.addEventListener("keyup", function (event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    document.getElementById("submit_search").click();
  }
});
// ------------------------------------------------

// A chaque clic sur recherche
$("#submit_search").click(function () {
  var elem = document.getElementById("navbar_top");
  if (elem === null) {
    var navbar = document.createElement("nav");
    navbar.id = "navbar_top";
    navbar.className = "navbar navbar-expand-lg navbar-light bg-light";

    var logo = document.createElement("a");
    logo.className = "navbar-brand primary";
    logo.href = "/";
    logo.id = "accueil_bouton";
    logo.innerHTML = "QuChemPedia";
    navbar.append(logo);

    var navbarSupportedContent = document.createElement("div");
    navbarSupportedContent.className = "collapse navbar-collapse";
    navbar.append(navbarSupportedContent);

    document.body.appendChild(navbar);
    var search_bar = document.getElementById("search_form");
    search_bar.className = "form-inline my-2 my-lg-0";

    navbar.append(search_bar);

    var div_nombre_resultat = document.createElement("div");
    div_nombre_resultat.id = "Nombre_Resultat";
    div_nombre_resultat.className = "";
    div_nombre_resultat.style = "text-align:center;";
    document.body.appendChild(div_nombre_resultat);

    var div_container_resultat = document.createElement("div");
    div_container_resultat.id = "container_resultat";
    div_container_resultat.className = "container";
    document.body.appendChild(div_container_resultat);

    var div_resultat = document.createElement("div");
    div_resultat.id = "Affichage_Resultat";
    div_resultat.className = "row";
    div_resultat.style = ";";
    div_container_resultat.appendChild(div_resultat);
  }

  // Pour enlever tout ce qui est présent dans le résultat après une nouvelle recherche
  document.getElementById("Affichage_Resultat").innerHTML = "";
  // ------------------------------------------------
  
  // Même chose pour la pagination
  var elem = document.getElementById("pagination");
  if (elem != null) {
    document.getElementById("pagination").remove();
  }
  // ------------------------------------------------

  // Recherche 
  var query = document.getElementById("query").value;
  var type_recherche = document.getElementById("id_typeQuery").value;
  $.ajax({
    type: "GET",
    url: "http://127.0.0.1:5000/API/recherche",
    data: {
      type: type_recherche,
      q: query,
    },
    success: function (data) {
      document.getElementById("Nombre_Resultat").innerHTML =
        "<h3>" +
        data.length +
        " résultats pour <b>" +
        query +
        "</b></h3><br></br>";

      var Affichage_Resultat = document.getElementById("Affichage_Resultat");

      if (data.length === 0) {
        var no_result = document.createElement("img");
        no_result.src = "/static/confused_scientist.png";
        no_result.alt = "No result";
        no_result.style =
          "margin-left: auto;margin-right: auto;height:300px;display:block;";
        Affichage_Resultat.appendChild(no_result);
      }

      array = [];
      for (var i = 0; i < data.length; i++) {
        var div_result = document.createElement("div");
        div_result.className = "col-lg-4 mb-4 border mt-2";
        div_result.style = "background-color: rgba(245, 245, 245, 0.4);";
        var div_formule = document.createElement("div");
        div_formule.className = "card-header";
        div_formule.innerHTML += "<h3>" + data[i].formule + "</h3> <br>";
        div_formule.style.fontFamily = "Impact, fantasy";
        div_formule.style = "text-align:center";
        div_result.appendChild(div_formule);
        array.push(div_result);
        //Affichage_Resultat.appendChild(div_result);
        var canvas = document.createElement("canvas");
        canvas.setAttribute("id", data[i].formule + i);
        div_formule.appendChild(canvas);

        for (const element in data[i]) {
          var div_element = document.createElement("h5");
          div_element.className = "card-title ";
          div_element.style = "text-align:center;";
          div_element.innerHTML += element + " : " + data[i][element];
          div_result.appendChild(div_element);
        }
      }

      // console.log(array);
      // console.log(array.slice(0, 6));
      // Affichage_Resultat.appendChild(array[0]);

      if (array.length >= 4) {
        var div_pagination = document.createElement("ul");
        div_pagination.className =
          "pagination align-items-center justify-content-center";
        div_pagination.id = "pagination";
        div_pagination.innerHTML +=
          '<li class="page-item"><a class="page-link" id="previous">Previous</a></li>';
        
          if (Math.trunc(array.length/3)%3 == 0)
          {
            taille = Math.trunc(array.length / 3)+1;
          }
          else taille =Math.trunc(array.length/3);
          
        for (var j = 0; j < taille; ++j) {
          //console.log(Math.trunc(array.length / 3) + 1);
          div_pagination.innerHTML +=
            '<li class="page-item"><a class="page-link" id="page' +
            j +
            '">' +
            j +
            "</a></li>";
        }
        div_pagination.innerHTML +=
          '<li class="page-item"><a class="page-link" id="next">Next</a></li>';

        for (var i = 0; i < 3; ++i) {
          Affichage_Resultat.appendChild(array[i]);
          //DRAW CANVAS
          draw_canvas(array[i].childNodes[0].childNodes[3]), "cccccc";
        }

        container_resultat.appendChild(div_pagination);

        for (var i = 0; i < Math.trunc(array.length / 3); ++i) {
          // REVOIR ICI
          var page_result = document.getElementById("page" + i);
          //console.log(page_result);

          page_result.onclick = function () {
            //console.log(parseInt(this.id.slice(4, 100)));
            Affichage_Resultat.innerHTML = "";
            var array_temp = array.slice(
              parseInt(this.id.slice(4, 100)) * 3,
              parseInt(this.id.slice(4, 100)) * 3 + 3
            );
            for (var j = 0; j < array_temp.length; ++j) {
              Affichage_Resultat.appendChild(array_temp[j]);
              //DRAW CANVAS
              draw_canvas(array_temp[j].childNodes[0].childNodes[3], "cccccc");
            }
          };
          //console.log(page_result);
        }
      } else {
        array = array.slice(0, array.length);
        for (var i = 0; i < array.length; ++i) {
          Affichage_Resultat.appendChild(array[i]);
          //DRAW CANVAS
          draw_canvas(array[i].childNodes[0].childNodes[3], "ccccc");
        }
      }
    },
    error: function () {
      // J'affiche un message d'erreur si aucun résultat
      var no_result = document.createElement("h5");
      no_result.innerHTML = "Désolé, aucun résultat";
      no_result.style = "text-align:center;";
      div_resultat.appendChild(no_result);
    },
  });
  // ------------------------------------------------ FIN DE RECHERCHE
});
// ------------------------------------------------

// Pour supprimer l'accueil après la première recherche
$("#submit_search").click(function () {
  var elem = document.getElementById("div_container_accueil");
  if (elem !== null) {
    document.getElementById("div_container_accueil").remove();
  }
});
// ------------------------------------------------
