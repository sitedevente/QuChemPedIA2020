// Pour utiliser la touche entrée pour effectuer une nouvelle recherche
$(document).on("keydown", function (e) {
  var keyCode = e.which || e.keyCode;
  if (keyCode == 13 && $("#query").val() != "") {
    // enter key code
    search();
    $("#div_container_accueil").remove();
  }
});
// ------------------------------------------------

// Pour afficher un loading pendant la recherche
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

    $("#Nombre_Resultat").append($(div_flex));
  } else {
    var div_flex = document.getElementById("loading");
    $(div_flex).remove();
  }
}

// Pour ajouter un clic -> vers page détail
function add_click() {
  var all_tr = document.querySelectorAll("tr");
  for (let i = 1; i < all_tr.length; ++i) {
    all_tr[i].style.cursor = "pointer";
    all_tr[i].addEventListener("click", function () {
      location.href = "/details/" + all_tr[i].id;
    });
  }
}

// Pour supprimer l'accueil après la première recherche
$("#submit_search").click(function () {
  var elem = document.getElementById("div_container_accueil");
  if (elem !== null) {
    document.getElementById("div_container_accueil").remove();
  }
});
// ------------------------------------------------

function search() {
  // Pour la première recherche, création de la navbar à partir de l'accueil
  if ($("#navbar_top").length === 0) {
    var navbar = document.createElement("nav");
    $(navbar).attr("id", "navbar_top");
    $(navbar).addClass("navbar navbar-expand-lg navbar-light bg-light");

    var logo = document.createElement("a");
    $(logo).attr("id", "accueil_bouton");
    $(logo).attr("href", "index.html");
    $(logo).html("QuChemPedia");
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

    var div_nombre_resultat = document.createElement("div");
    $(div_nombre_resultat).attr("id", "nombre_resultat");
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
    $(".container").css({ width: "auto", height: "auto", display: "table" });
  }

  // Pour enlever tout ce qui est présent dans le résultat après une nouvelle recherche
  $("#affichage_resultat").empty();
  $("#nombre_resultat").empty();

  //Début de loading
  loading(true);

  // Recherche
  var query = $("#query").val();
  var type_recherche = $("#id_typeQuery").val();

  $.ajax({
    type: "GET",
    url: "../js/data_test.json", //Route à changer pour requête sur l'API http://127.0.0.1:5000/API/recherche (Flask api)
    data: {
      type: type_recherche,
      q: query,
    },
    success: function (data_result) {
      var header_result = document.createElement("h3");
      $(header_result).css("text-align", "center");
      $(header_result).css("margin-top", "45px");

      // Création de la Datatable Résultat
      var result = document.createElement("table");
      $(result).attr("id", "table_result");
      $(result).attr("class", "table table-striped table-bordered");
      $(result).html(
        "<thead id='table_header'><tr><th>ID</th><th>Formule</th><th>Inchi</th><th>Smile</th><th>Number heavy atoms</th><th>Charge</th><th>Total Molecular Energy</th><th>Basis set name</th><th>Job type</th><th>Multiplicity</th><th>List thoery</th><th>Solvent</th></tr></thead>"
      );
      $("#affichage_resultat").append(result);

      // Utilisation de DataTable pour afficher nos résultat
      $(document).ready(function () {
        var table = $(result).DataTable({
          data: data_result.data,
          pagingType: "full_numbers",
          // Récupération des données à mettre dans la datatable
          columns: [
            {
              data: "comp_details.general.basis_set_md5",
              title: "ID",
              defaultContent: "<i>No id</i>",
            },
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
                //Récupération du smile pour draw_canvas (smile)
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
        //A la fin de la requête on ajoute le lien vers la page détail, on affiche le smile et on affiche dans l'header le résultat
        // Si l'utilisateur change de page, ou réalise un tri, on diffuse l'information

        //Ajout clic -> page détail
        add_click();

        //Nombre de résultat
        $(header_result).html(
          "Found<b> " + table.data().count() + "</b> for <b>" + query + "</b>"
        );
        var div_nombre_resultat = document.getElementById("nombre_resultat");
        $(div_nombre_resultat).append($(header_result));

        // Aucun résultat
        if (table.data().count() == 0) {
          $("#affichage_resultat").hide();
          var no_result = document.createElement("img");
          $(no_result).attr("src", "../img/confused_scientist.png");
          $(no_result).attr("alt", "No result");
          $(no_result).css({
            "margin-left": "auto",
            "margin-right": "auto",
            height: "300px",
            display: "block",
          });
          $(div_nombre_resultat).append(no_result);
        } else {
          // hide/show pour masquer le datatable quand on à aucun résultat
          $("#affichage_resultat").show();
        }

        // Draw_canvas sur la première page
        draw_canvas();
        //Draw_canvas/add_click quand on va changer de page
        document
          .getElementById("table_result_paginate")
          .addEventListener("click", function () {
            draw_canvas();
            add_click();
          });

        //Draw_canvas/add_click pour le tri
        document
          .getElementById("table_header")
          .addEventListener("click", function () {
            draw_canvas();
            add_click();
          });

        //Fin du loading à l'affichage
        loading(false);
      });
    },
    error: function () {
      // Message si erreur
      var no_result = document.createElement("h5");
      $(no_result).html("Sorry, error in execution.");
      $(no_result).css("text-align", "center");
    },
  });
  // ------------------------------------------------ FIN DE RECHERCHE
}
