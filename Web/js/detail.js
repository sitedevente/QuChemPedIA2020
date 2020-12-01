//////////////////////////////////////
//Initialisation pour les datatables//
//////////////////////////////////////

//Tableaux pour : Calculated energies for the frontier molecular orbitals
$(document).ready(function() {
    $('#calc_id_card').DataTable( {
        "paging":   false,
        "info":     false,
        "searching":   false
    } );
} );

$(document).ready(function() {
    $('#calc_id_tab').DataTable( {
        "paging":   false,
        "info":     false,
        "searching":   false
    } );
} );

//Tableaux pour : Most intense Mulliken atomic charges
$(document).ready(function() {
    $('#mull_id').DataTable( {
        "paging":   false,
        "info":     false,
        "searching":   false
    } );
} );

$(document).ready(function() {
    $('#mull_id_card').DataTable( {
        "paging":   false,
        "info":     false,
        "searching":   false
    } );
} );

//Tableaux pour : Cartesian atomic coordinates
$(document).ready(function() {
    $('#cartesian_id').DataTable( {
        "paging":   false,
        "info":     false,
        "searching":   false
    } );
} );

//Tableaux pour : Calculated mono-electronic excitations
$(document).ready(function() {
    $('#excitation_id').DataTable( {
        "paging":   false,
        "info":     false,
        "searching":   false
    } );
} );

/////////////////////////////////////////////////////////
//Fonctions utiles pour le traitement du Json et autres//
/////////////////////////////////////////////////////////

//Bouton pour switch de vue Card/Tab
let btn = document.getElementById("switchDiplay");
btn.onclick = function() {
    let icone = document.getElementById("icone");
    let icone2 = document.getElementById("icone2");
    if (document.getElementById("diplay-tab").style.display != "none" && document.getElementById("display-404").style.display == "none"){
        icone.style.display = "none";
        icone2.style.display = "block";
        document.getElementById("diplay-tab").style.display = "none";
        document.getElementById("diplay-card").style.display = "block";
    }
    else if (document.getElementById("display-404").style.display == "none") {
        icone.style.display = "block";
        icone2.style.display = "none";
        document.getElementById("diplay-card").style.display = "none";
        document.getElementById("diplay-tab").style.display = "block";
    }
}

//Fonction pour créer une ligne a partir de toutes les colonnes dans un tableau datatable
function createLigne(colonnes){
    let tableau = "<tr>" + colonnes +"</tr>";
    return tableau;
}

//Fonction pour créer une colonne dans un tableau datatable
function createCol(colonne) {
    let col = "<td>" + colonne + "</td>";
    return col;
}

//Fonction pour mettre les indices en html aux formules moléculaires (C6H6)
function mol_sub(molecule){
    let tmp = "";
    for(let i = 0;i<molecule.length;i++){
        //Si le caractère est un chiffre alors on le met en indice
        if (molecule[i].match(/[0-9]/)){
            tmp += molecule[i].sub();
        }
        else {
            tmp += molecule[i];
        }
    }
    return tmp;
}

//Fonction pour mettre les exposants en html sur une expression scientifique (10e-8)
function exposant(chaine){
    try {
        let index;
        let tmp = "";
        chaine = chaine.toString();

        //Récupération de l'index ou se trouve l'exposant "e"
        for(let i = 0;i<chaine.length;i++){
            if (chaine[i].match("e")){
                index = i;
            }
        }

        //On ajoute l'exposant en enlevant le "e"
        let exposant = chaine.substring(index+1);
        tmp += chaine.substring(0,index) ;
        tmp += "×10"
        tmp += exposant.sup();
        return tmp;
    } catch (error) {
        console.error(error);
    }
}

//Récupération de l'url, l'id et construction de l'url de requete
let url = new URL(document.location.href);
let id = url.searchParams.get("id");
let url_api = 'http://127.0.0.1:5000/api/details/';
url_api += id;

//Objet XHR ajax permettant de récupérer des données à partir d'une URL
let requestURL = url_api;
let request = new XMLHttpRequest();

//Fonction pour lire l'état de la requête et si le serveur renvoie le statut 200 OK et l'état Done
//On prends la réponse et on rempli l'HTML avec les informations du Json
request.onreadystatechange = function() {
    //Si la réponse serveur n'est pas correcte on affiche une 404
    if(this.status == 404){
        document.getElementById("display-404").style.display = "block";
        document.getElementById("diplay-tab").style.display = "none";
        document.getElementById("diplay-card").style.display = "none";
    }

    if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
        //On parse la réponse du serveur en JSON
        let response = JSON.parse(this.responseText);

        /////////////////////////////////////////////
        //Fonction pour draw sur le canvas le smile//
        /////////////////////////////////////////////
        // function draw_canvas() {
        //     let input = response.data.molecule.smi;
        //     let options = {
        //         width: 150,
        //         height: 150,
        //     };

        //     // Initialize the drawer to draw to canvas
        //     let smilesDrawer = new SmilesDrawer.Drawer(options);

        //     SmilesDrawer.parse(input.value, function(tree) {
        //         // Draw to the canvas
        //         smilesDrawer.draw(tree, "canvas", "light", false);
        //     });
        // }
        // window.onload = draw_canvas();

        ////////////////////////////////////////////////////////
        //Onglet Description avec les informations principales//
        ////////////////////////////////////////////////////////

        //Affichage de l'id de la molécule
        if (response.data.id){
            //On remplit l'id de la molécule
            document.getElementById("mol_id").innerHTML = "Molecule Id : "+ response.data.id;
            document.getElementById("mol_id_card").innerHTML = "Molecule Id : "+ response.data.id;
        }

        if (response.data.molecule.formula){
            //On remplit le titre et le grand titre
            document.getElementById("titre").innerHTML = "Formule : "+mol_sub(response.data.molecule.formula);
            document.getElementById("titre_card").innerHTML = mol_sub(response.data.molecule.formula);
            document.getElementById("titre_cardbis").innerHTML = mol_sub(response.data.molecule.formula);
        }

        if (response.data.molecule.inchi){
            //Substring pour ne pas prendre le début avec "INCHI="
            document.getElementById("inchi").innerHTML = "<acronym title='International Chemical Identifier' style='text-decoration: none'>Inchi :</acronym>" + " " + response.data.molecule.inchi.substring(6);
            document.getElementById("inchi_card").innerHTML = "<acronym title='International Chemical Identifier' style='text-decoration: none'>Inchi :</acronym>";
            document.getElementById("inchibis_card").innerHTML = response.data.molecule.inchi.substring(6);
        }
        else{
            document.getElementById("inchi").style.display = "none";
            document.getElementById("inchi_card").style.display = "none";
            document.getElementById("inchibis_card").style.display = "none";
        }

        if (response.data.molecule.smi){
            document.getElementById("smiles").innerHTML = "<acronym title='Simplified Molecular-Input Line-Entry System' style='text-decoration: none'>SMILES :</acronym>" + " " + response.data.molecule.smi;
            document.getElementById("smiles_card").innerHTML = "<acronym title='Simplified Molecular-Input Line-Entry System' style='text-decoration: none'>SMILES :</acronym>";
            document.getElementById("smilesbis_card").innerHTML = response.data.molecule.smi;
        }
        else{
            document.getElementById("smiles").style.display = "none";
            document.getElementById("smiles_card").style.display = "none";
            document.getElementById("smilesbis_card").style.display = "none";
        }

        //Partie plus détaillée pour les caractéristiques de la molécule (partie détail de calcul)
        if (!response.data.comp_details.general){
            document.getElementById("display-comp-detail").style.display = "none";
        }

        if (response.data.comp_details.general.package && response.data.comp_details.general.package_version){
            document.getElementById("software").innerHTML = "Software";
            document.getElementById("softwarebis").innerHTML = response.data.comp_details.general.package +" ("+response.data.comp_details.general.package_version+")";
            document.getElementById("software_card").innerHTML = "Software";
            document.getElementById("softwarebis_card").innerHTML = response.data.comp_details.general.package +" ("+response.data.comp_details.general.package_version+")";
        }
        else{
            document.getElementById("software").style.display = "none";
            document.getElementById("softwarebis").style.display = "none";
            document.getElementById("software_card").style.display = "none";
            document.getElementById("softwarebis_card").style.display = "none";
        }

        if (response.data.comp_details.general.all_unique_theory){
            document.getElementById("computational").innerHTML = "Computational method";
            document.getElementById("computationalbis").innerHTML = response.data.comp_details.general.all_unique_theory;
            document.getElementById("computational_card").innerHTML = "Computational method";
            document.getElementById("computationalbis_card").innerHTML = response.data.comp_details.general.all_unique_theory;
        }

        if (response.data.comp_details.general.functional){
            document.getElementById("functional").innerHTML = "Functional";
            document.getElementById("functionalbis").innerHTML = response.data.comp_details.general.functional;
            document.getElementById("functional_card").innerHTML = "Functional";
            document.getElementById("functionalbis_card").innerHTML = response.data.comp_details.general.functional;
        }

        if (response.data.comp_details.general.basis_set_name){
            document.getElementById("basis").innerHTML = "Basis Set Name";
            document.getElementById("basisbis").innerHTML = response.data.comp_details.general.basis_set_name;
            document.getElementById("basis_card").innerHTML = "Basis Set Name";
            document.getElementById("basisbis_card").innerHTML = response.data.comp_details.general.basis_set_name;
        }

        if (response.data.comp_details.general.basis_set_size || response.data.comp_details.general.basis_set_size == 0){
            document.getElementById("number_basis").innerHTML = "Number of basis set functions";
            document.getElementById("number_basisbis").innerHTML = response.data.comp_details.general.basis_set_size;
            document.getElementById("number_basis_card").innerHTML = "Number of basis set functions";
            document.getElementById("number_basisbis_card").innerHTML = response.data.comp_details.general.basis_set_size;
        }

        if (response.data.comp_details.general.is_closed_shell){
            document.getElementById("shell_calc").innerHTML = "Closed shell calculation";
            document.getElementById("shell_calcbis").innerHTML = response.data.comp_details.general.is_closed_shell;
            document.getElementById("shell_calc_card").innerHTML = "Closed shell calculation";
            document.getElementById("shell_calcbis_card").innerHTML = response.data.comp_details.general.is_closed_shell;
        }

        if (response.data.comp_details.general.integration_grid){
            document.getElementById("integration").innerHTML = "Integration grid";
            document.getElementById("integrationbis").innerHTML = response.data.comp_details.general.integration_grid;
            document.getElementById("integration_card").innerHTML = "Integration grid";
            document.getElementById("integrationbis_card").innerHTML = response.data.comp_details.general.integration_grid;
        }

        if (response.data.comp_details.general.solvent){
            document.getElementById("solvent").innerHTML = "Solvent";
            document.getElementById("solventbis").innerHTML = response.data.comp_details.general.solvent;
            document.getElementById("solvent_card").innerHTML = "Solvent";
            document.getElementById("solventbis_card").innerHTML = response.data.comp_details.general.solvent;
        }

        if (response.data.comp_details.general.scf_targets[0][0] || response.data.comp_details.general.scf_targets[0][0] == 0){
            document.getElementById("convergence").innerHTML = "Requested SCF convergence on RMS density";
            document.getElementById("convergencebis").innerHTML = exposant(response.data.comp_details.general.scf_targets[0][0]);
            document.getElementById("convergence_card").innerHTML = "Requested SCF convergence on RMS density";
            document.getElementById("convergencebis_card").innerHTML = exposant(response.data.comp_details.general.scf_targets[0][0]);
        }

        if (response.data.comp_details.excited_states.nb_et_states || response.data.comp_details.excited_states.nb_et_states  == 0){
            document.getElementById("nb_excited_state").innerHTML = "Number of excited states";
            document.getElementById("nb_excited_statebis").innerHTML = response.data.comp_details.excited_states.nb_et_states;
            document.getElementById("nb_excited_state_card").innerHTML = "Number of excited states";
            document.getElementById("nb_excited_statebis_card").innerHTML = response.data.comp_details.excited_states.nb_et_states;
        }

        //Partie plus détaillée pour les caractéristiques de la molécule (partie détail de la molécule)
        if (response.data.molecule.formula){
            document.getElementById("formule").innerHTML = "Formule";
            document.getElementById("formulebis").innerHTML = mol_sub(response.data.molecule.formula);
            document.getElementById("formule_card").innerHTML = "Formule";
            document.getElementById("formulebis_card").innerHTML = mol_sub(response.data.molecule.formula);
        }

        if (response.data.molecule.charge || response.data.molecule.charge == 0){
            document.getElementById("charge").innerHTML = "Charge";
            document.getElementById("chargebis").innerHTML = response.data.molecule.charge;
            document.getElementById("charge_card").innerHTML = "Charge";
            document.getElementById("chargebis_card").innerHTML = response.data.molecule.charge;
        }

        if (response.data.molecule.multiplicity || response.data.molecule.multiplicity == 0){
            document.getElementById("spin").innerHTML = "Spin multiplicity";
            document.getElementById("spinbis").innerHTML = response.data.molecule.multiplicity;
            document.getElementById("spin_card").innerHTML = "Spin multiplicity";
            document.getElementById("spinbis_card").innerHTML = response.data.molecule.multiplicity;
        }

        if (response.data.molecule.monoisotopic_mass || response.data.molecule.monoisotopic_mass == 0){
            document.getElementById("monoisotopic").innerHTML = "Monoisotopic mass";
            document.getElementById("monoisotopicbis").innerHTML = response.data.molecule.monoisotopic_mass;
            document.getElementById("monoisotopic_card").innerHTML = "Monoisotopic mass";
            document.getElementById("monoisotopicbis_card").innerHTML = response.data.molecule.monoisotopic_mass;
        }

        //Possibilité de télécharger les informations de la molécule
        if (response.data.metadata.log_file){
            document.getElementById("logfile").innerHTML = "Original log file";
            let logbtn = document.getElementById("logfilebis");
            logbtn.innerHTML = "Download";
            logbtn.setAttribute("href","https://google.fr");

            document.getElementById("logfile_card").innerHTML = "Original log file";
            let logbtn2 = document.getElementById("logfilebis_card");
            logbtn2.innerHTML = "Download";
            logbtn2.setAttribute("href","https://google.fr");
        }

        //////////////////////////////////////////////////////
        //Onglet Results avec le détail et l'ajout d'infos
        //////////////////////////////////////////////////////
        if (response.data.results.wavefunction.total_molecular_energy || response.data.results.wavefunction.total_molecular_energy == 0){
            document.getElementById("energy").innerHTML = "Total molecular energy";
            document.getElementById("energybis").innerHTML = response.data.results.wavefunction.total_molecular_energy;
            document.getElementById("energy_card").innerHTML = "Total molecular energy";
            document.getElementById("energybis_card").innerHTML = response.data.results.wavefunction.total_molecular_energy;
        }

        //Si plusieurs Homos dans l'index on les liste et les affiche
        if (response.data.results.wavefunction.homo_indexes || response.data.results.wavefunction.homo_indexes == 0){
            let homo_indexes = response.data.results.wavefunction.homo_indexes;
            let homos = "";
            for(let j=0;j<homo_indexes.length;j++){
                homos += (homo_indexes[j]+1);
                if(j!=(homo_indexes.length-1))
                    homos +=", ";
            }
            document.getElementById("homo").innerHTML = "HOMO number";
            document.getElementById("homobis").innerHTML = homos;
            document.getElementById("homo_card").innerHTML = "HOMO number";
            document.getElementById("homobis_card").innerHTML = homos;
        }

        //Remplissage du tableau des HOMOS
        if(response.data.results.wavefunction.MO_energies && response.data.results.wavefunction.MO_energies.length>0){
            let homo_indexes = response.data.results.wavefunction.homo_indexes;
            let MO_energies = response.data.results.wavefunction.MO_energies;
            let ligne = "";
            for(let j=0;j<homo_indexes.length;j++){
                if (homo_indexes[j] <= 0) {
                    ligne += createLigne(createCol(N/A) + createCol(MO_energies[j][homo_indexes[j]].toFixed(2)) + createCol(MO_energies[j][homo_indexes[j]+1].toFixed(2)) + createCol(N/A));
                } else {
                    ligne += createLigne(createCol(MO_energies[j][homo_indexes[j] - 1].toFixed(2)) + createCol(MO_energies[j][homo_indexes[j]].toFixed(2)) + createCol(MO_energies[j][homo_indexes[j] + 1].toFixed(2)) + createCol(MO_energies[j][homo_indexes[j] + 2].toFixed(2)));
                }
            }
            document.getElementById("calc_table_tab").innerHTML = ligne;
        }
        else{
            document.getElementById("calculated_energies").style.display = "none";
        }

        //Remplissage du tableau Mulliken atomic
        if (response.data.wavefunction.Mulliken_partial_charges && response.data.wavefunction.Mulliken_partial_charges.length>0) {
            let Mulliken_partial_charges = response.data.results.wavefunction.Mulliken_partial_charges;

            let atoms_Z = response.data.molecule.atoms_Z;
            var atom_z = new Array();
            for (var j = 0; j < atoms_Z.length; j++)
                atom_z[j] = atoms_Z[j];

            var indices = new Array();
            for (var j = 0; j < Mulliken_partial_charges.length; j++)
                indices[j] = j;

            var mulliken_partial_charges = new Array();
            for (var j = 0; j < Mulliken_partial_charges.length; j++)
                mulliken_partial_charges[j] = Mulliken_partial_charges[j];

            //trier le tableau des enérgies
            for (var j = 0; j < mulliken_partial_charges.length; j++) {
                for (var h = j; h < (mulliken_partial_charges.length - 1); h++) {
                    if (mulliken_partial_charges[h] < mulliken_partial_charges[j]) {
                        var temp = mulliken_partial_charges[h];
                        var temp0 = indices[h];
                        var temp1 = atom_z[h];

                        mulliken_partial_charges[h] = mulliken_partial_charges[j];
                        indices[h] = indices[j];
                        atom_z[h] = atom_z[j];
                        mulliken_partial_charges[j] = temp;
                        indices[j] = temp0;
                        atom_z[j] = temp1;
                    }
                }
            }

            //clacule de la moyenne
            var sum = 0;
            for (var j = 0; j < mulliken_partial_charges.length; j++)
                sum += mulliken_partial_charges[j];
            var moyenne = sum / mulliken_partial_charges.length;
            //calcule de l'écart type
            sum = 0;
            for (var j = 0; j < mulliken_partial_charges.length; j++) {
                var inter = mulliken_partial_charges[j] - moyenne;
                sum += Math.pow(inter, 2);
            }
            var std = Math.sqrt(sum / mulliken_partial_charges.length);

            html += "<div class=\"container subWavefunction\" align=center><b>Most intense Mulliken atomic charges</b>";
            html += "<div class=\"container subWavefunction\" align=center><b>mean = " + moyenne.toFixed(3) + " e, std = " + std.toFixed(3) + " </b>";

            html += "<table class=\"tab3Cols\" id=\"tableMulliken_partial_charges\">";
            html += "<tr class=\"ligneSoulignee\"><td>Atom</td><td>number</td><td>Mulliken partial charges</td><td></td></tr>";
            var thres_max = moyenne + std;
            var thres_min = moyenne - std;
            for (var j = 0; j < mulliken_partial_charges.length; j++) {
                if (mulliken_partial_charges.length < 5)
                    html += "<tr><td>" + Symbol[atom_z[j] - 1] + "</td><td>" + indices[j] + "</td><td>" + mulliken_partial_charges[j].toFixed(3) + "</td></tr>";
                else if ((mulliken_partial_charges[j] > thres_max) || (mulliken_partial_charges[j] < thres_min))
                    html += "<tr><td>" + Symbol[atom_z[j] - 1] + "</td><td>" + indices[j] + "</td><td>" + mulliken_partial_charges[j].toFixed(3) + "</td></tr>";
            }
            html += "</table></div>";


        }

        if (response.data.results.geometry.nuclear_repulsion_energy_from_xyz || response.data.results.geometry.nuclear_repulsion_energy_from_xyz == 0){
            document.getElementById("nuclear").innerHTML = "Nuclear repulsion energy in atomic units";
            document.getElementById("nuclearbis").innerHTML = response.data.results.geometry.nuclear_repulsion_energy_from_xyz;
        }
    }
};

request.open('GET', requestURL);
request.send();