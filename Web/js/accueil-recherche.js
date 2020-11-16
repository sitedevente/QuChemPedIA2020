// Pour utiliser la touche entrée pour effectuer une nouvelle recherche
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
  // Pour la première recherche, création de la navbar
  if ($("#navbar_top").length === 0) {
    var navbar = document.createElement("nav");
    $(navbar).attr("id", "navbar_top");
    $(navbar).addClass("navbar navbar-expand-lg navbar-light bg-light");

    var logo = document.createElement("a");
    $(logo).attr("id", "accueil_bouton");
    $(logo).attr("href", "/");
    $(logo).html("QuChemPedia");
    $(logo).addClass("navbar-brand primary");
    $(navbar).append(logo);

    var navbarSupportedContent = document.createElement("div");
    $(navbarSupportedContent).addClass("collapse navbar-collapse");
    $(navbar).append(navbarSupportedContent);

    $(document.body).append(navbar);

    var search_bar = document.getElementById("search_form");
    $(search_bar).addClass("form-inline my-2 my-lg-0");
    $(navbar).append(search_bar);

    var button_submit = document.getElementById("submit_search");
    $(button_submit)
      .removeClass(
        "mt-1 mb-1 mt-lg-0 btn btn-info default-primary-color col-12 col-lg-2"
      )
      .addClass("btn btn-primary mt-lg-0  my-2 my-sm-0");

    var div_nombre_resultat = document.createElement("div");
    $(div_nombre_resultat).attr("id", "Nombre_Resultat");
    $(div_nombre_resultat).addClass("");
    $(div_nombre_resultat).css("text-align", "center");
    $(document.body).append(div_nombre_resultat);

    var div_container_resultat = document.createElement("div");
    $(div_container_resultat).attr("id", "container_resultat");
    $(div_container_resultat).addClass("container");
    $(document.body).append(div_container_resultat);

    var div_resultat = document.createElement("div");
    $(div_resultat).attr("id", "affichage_resultat");
    $(div_resultat).addClass("container");
    $(div_container_resultat).append(div_resultat);
  }

  // Pour enlever tout ce qui est présent dans le résultat après une nouvelle recherche
  $("#affichage_resultat").html("");

  // Recherche
  var query = $("#query").val();
  var type_recherche = $("#id_typeQuery").val();
  $.ajax({
    type: "GET",
    url:
      "http://127.0.0.1/ProjetM1M2/Quchempedia/QuChemPedIA2020/Web/js/data_test.json",
    data: {
      type: type_recherche,
      q: query,
    },
    success: function (data_result) {
      $("#Nombre_Resultat").html(
        "<h3>" +
          data_result.length +
          " résultats pour <b>" +
          query +
          "</b></h3><br></br>"
      );

      var Affichage_Resultat = $("#affichage_resultat");

      // Aucun résultat
      if (data_result.length === 0) {
        var no_result = document.createElement("img");
        $(no_result).attr("src", "/static/confused_scientist.png");
        $(no_result).attr("alt", "No result");
        $(no_result).css({
          "margin-left": "auto",
          "margin-right": "auto",
          height: "300px",
          display: "block",
        });
        Affichage_Resultat.append(no_result);
      }
      // Résultat
      else {
        var result = document.createElement("table");
        $(result).attr("id", "table_result");
        $(result).html(
          "<thead><tr><th>Smiles</th><th>Formule</th><th>ID</th><th>Inchi</th><th>Total Molecular Energy</th><th>Heavy Atoms number</th><th>Multiplicity</th></tr></thead>"
        );
        Affichage_Resultat.append(result);

        // Utilisation de DataTable pour afficher nos résultat
        $(document).ready(function () {
          $(result).DataTable({
            data: data_result.data,

            columns: [
              {
                data: "smiles",
                fnCreatedCell: function (nTd, sData, oData, iRow, iCol) {
                  //DRAW CANVAS pour draw_smile
                  $(nTd).html("");
                  var canvas = document.createElement("canvas");
                  $(canvas).attr("id", oData.id + "_canvas");
                  $(canvas).css("width", 250);
                  $(canvas).css("height", 250);

                  var smile = document.createElement("div");
                  $(smile).attr("id", oData.id + "_smile");
                  $(smile).html(String(oData.smiles));
                  $(nTd).append(canvas);
                  $(nTd).append(smile);
                  $(smile).hide();
                },
              },
              {
                data: "formule",
                fnCreatedCell: function (nTd, sData, oData, iRow, iCol) {
                  $(nTd).html(
                    "<a href='/details/" +
                      oData.id +
                      "'>" +
                      oData.formule +
                      "</a>"
                  );
                },
              },
              { data: "id" },
              { data: "inchi" },
              { data: "total_molecular_energy" },
              { data: "nb_heavy_atoms", className: "text-center" },
              { data: "multiplicity", className: "text-center" },
            ],
            // Pour executer un callback une fois que les données sont ajoutées
            fnRowCallback: function (
              nRow,
              aData,
              iDisplayIndex,
              iDisplayIndexFull
            ) {
              // Ajout d'un ID pour chaque résultat
              var id = aData.id;
              $(nRow).attr("id", id);
              return nRow;
            },
          });
          // Draw_canvas sur la première page
          draw_canvas();
          //Draw_canvas quand on va changer de page
          document
            .getElementById("table_result_paginate")
            .addEventListener("click", function () {
              draw_canvas();
            });
        });
      }
    },
    error: function () {
      // J'affiche un message d'erreur si aucun résultat
      var no_result = document.createElement("h5");
      $(no_result).html("Désolé, aucun résultat");
      $(no_result).css("text-align", "center");
      $(div_resultat).append(no_result);
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
