//////////////////////////////////////
//Initialisation pour les datatables//
//////////////////////////////////////

var API_URL = "https://quchempedia.univ-angers.fr/api/";

//Fonction qui initialise les tables apres le chargement du script
/**
 * Function that load the tables
 */
function chargeTable(){
    //Tableaux pour : Calculated energies for the frontier molecular orbitals
    $(document).ready(function() {
        $('#calc_id_card').DataTable( {
            "paging":   false,
            "info":     false,
            "searching":   false,
            "ordering": false,
        } );
    } );

    $(document).ready(function() {
        $('#calc_id_tab').DataTable( {
            "paging":   false,
            "info":     false,
            "searching":   false,
            "ordering": false,
        } );
    } );

    //Tableaux pour : Most intense Mulliken atomic charges
    $(document).ready(function() {
        $('#mull_id').DataTable( {
            "paging":   false,
            "info":     false,
            "searching":   false,
            "ordering": false,
        } );
    } );

    $(document).ready(function() {
        $('#mull_id_card').DataTable( {
            "paging":   false,
            "info":     false,
            "searching":   false,
            "ordering": false,
        } );
    } );

    //Tableaux pour : Geometry optimization convergence criteria
    $(document).ready(function() {
        $('#opti_id').DataTable( {
            "paging":   false,
            "info":     false,
            "searching":   false,
            "ordering": false,
        } );
    } );

    $(document).ready(function() {
        $('#opti_id_card').DataTable( {
            "paging":   false,
            "info":     false,
            "searching":   false,
            "ordering": false,
        } );
    } );

    //Tableaux pour : Cartesian atomic coordinates
    $(document).ready(function() {
        $('#cartesian_id').DataTable( {
            "paging":   false,
            "info":     false,
            "searching":   false,
            "ordering": false,
        } );
    } );

    $(document).ready(function() {
        $('#cartesian_id_card').DataTable( {
            "paging":   false,
            "info":     false,
            "searching":   false,
            "ordering": false,
        } );
    } );

    //Tableaux pour : Table of the most intense molecular vibrations
    $(document).ready(function() {
        $('#vibration_id').DataTable( {
            "paging":   false,
            "info":     false,
            "searching":   false,
            "ordering": false,
        } );
    } );

    $(document).ready(function() {
        $('#vibration_id_table').DataTable( {
            "paging":   false,
            "info":     false,
            "searching":   false,
            "ordering": false,
        } );
    } );

    //Tableaux pour : Calculated mono-electronic excitations
    $(document).ready(function() {
        $('#excitation_id_card').DataTable( {
            "paging":   false,
            "info":     false,
            "searching":   false,
            "ordering": false,
        } );
    } );
}

//Une fois les scripts chargés on initialise les tables
window.onload = chargeTable();

/////////////////////////////////////////////////////////
//Fonctions utiles pour le traitement du Json et autres//
/////////////////////////////////////////////////////////

//Fonction pour créer une ligne a partir de toutes les colonnes dans un tableau datatable
/**
 * Function to create a line from all the columns in a datatable
 * @param {string} colonnes 
 */
function createLigne(colonnes){
    let tableau = "<tr>" + colonnes +"</tr>";
    return tableau;
}

//Fonction pour créer une colonne dans un tableau datatable
/**
 * Function to create a line from all the columns in a datatable
 * @param {string} colonne
 */
function createCol(colonne) {
    let col = "<td>" + colonne + "</td>";
    return col;
}

//Fonction pour mettre les indices en html aux formules moléculaires (C6H6)
/**
 * Function to put the index in html to formulas
 * @param {*} molecule 
 */
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
/**
 * Function tu put the exponent in html on a scientific expression
 * @param {*} chaine 
 */
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

///////////////////////////////////////////////////////////////////////////
//Creation de la requête et traitement de la réponse pour remplir la page//
///////////////////////////////////////////////////////////////////////////

//Récupération de l'url, l'id et construction de l'url de requete
let url = new URL(document.location.href);
let id = url.searchParams.get("id");
let url_api = API_URL+'details/';
url_api += id;

//Objet XHR ajax permettant de récupérer des données à partir d'une URL
let requestURL = url_api;
let request = new XMLHttpRequest();

//Fonction pour lire l'état de la requête et si le serveur renvoie le statut 200 OK et l'état Done
//On prends la réponse et on rempli l'HTML avec les informations du Json
/**
 * Function to read the request state and if the server returns the status 200 OK and state Done
 */
request.onreadystatechange = function() {
    //Si la réponse serveur n'est pas correcte on affiche une 404
    if(this.status == 404){
        document.getElementById("display-404").style.display = "block";
        document.getElementById("diplay-tab").style.display = "none";
        document.getElementById("diplay-card").style.display = "none";
    }

    //Si la réponse es OK (200) et l'état de la requête a DONE on remplit la page web
    if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
        //On parse la réponse du serveur en JSON
        let response = JSON.parse(this.responseText);

        //Liste des Molécules pour l'affichage dans les Tableaux
        let Symbol = ["H","He","Li","Be","B","C","N","O","F","Ne","Na","Mg","Al","Si","P","S","Cl","Ar","K","Ca","Sc",
                      "Ti","V","Cr","Mn","Fe","Co","Ni","Cu","Zn","Ga","Ge","As","Se","Br","Kr","Rb","Sr","Y","Zr","Nb",
                      "Mo","Tc","Ru","Rh","Pd","Ag","Cd","In","Sn","Sb","Te","I","Xe","Cs","Ba","La","Ce","Pr","Nd","Pm",
                      "Sm","Eu","Gd","Tb","Dy","Ho","Er","Tm","Yb","Lu","Hf","Ta","W","Re","Os","Ir","Pt","Au","Hg","Tl",
                      "Pb","Bi","Po","At","Rn","Fr","Ra","Ac","Th","Pa","U","Np","Pu","Am","Cm","Bk","Cf","Es","Fm","Md",
                      "No","Lr","Rf","Db","Sg","Bh","Hs","Mt","Ds","Rg","Cn","Uut","Uuq","Uup","Uuh","Uus","Uuo"];

        /////////////////////////////////////////////
        //Fonction pour draw sur le canvas le smile//
        /////////////////////////////////////////////
        //Génération du dessin du smile
        //Une fois le script pour dessiner les smiles chargé on exécute la fonction pour draw
        /**
         * To generate a drawing of the SMILES
         * @param {*} opt 
         * @param {*} id 
         */
        function draw_canvas(opt, id) {
            if (response.data.molecule.smi) {
                let input = response.data.molecule.can;
                let options = opt;

                // Initialize the drawer to draw to canvas
                let smilesDrawer = new SmilesDrawer.Drawer(options);

                //Bug d'affichage dans le mode impression
                SmilesDrawer.parse(input, function (tree) {
                        smilesDrawer.draw(tree, id, "light", false);
                    }, function (err) {
                        console.log(err);
                    }
                );
            }
        }

        //Dessin sur le premier canvas
        let options = {
            width: 282,
            height: 282,
        };
        window.onload = draw_canvas(options,"smile");

        //Bouton pour changer d'affichage Card/Tab
        let btn = document.getElementById("switchDiplay");
        btn.onclick = function() {
            let icon = document.getElementById("icone");
            let icon2 = document.getElementById("icone2");
            if (document.getElementById("diplay-tab").style.display != "none" && document.getElementById("display-404").style.display == "none"){
                icon.style.display = "none";
                icon2.style.display = "block";

                document.getElementById("diplay-tab").style.display = "none";
                document.getElementById("diplay-card").style.display = "block";

                let options = {
                    width: 250,
                    height: 250,
                };
                window.onload = draw_canvas(options,"smile_card");
            }
            else if (document.getElementById("display-404").style.display == "none") {
                icone.style.display = "block";
                icone2.style.display = "none";

                document.getElementById("diplay-card").style.display = "none";
                document.getElementById("diplay-tab").style.display = "block";
            }
        }

        ////////////////////////////////////////////////////////
        //Onglet Description avec les informations principales//
        ////////////////////////////////////////////////////////

        

        //Champ Formule
        if (response.data.molecule.formula){
            //On remplit le titre
            document.getElementById("titre").innerHTML = "Formule : "+mol_sub(response.data.molecule.formula);
        }

        //Champ IUPAC
        if(response.data.molecule.iupac){
            document.getElementById("iupac").innerHTML = "<acronym title='International Union of Pure and Applied Chemistry' style='text-decoration: none'>IUPAC :</acronym>" + " "+ response.data.molecule.iupac;
            document.getElementById("iupac_card").innerHTML = response.data.molecule.iupac;
        }
        else{
            document.getElementById("iupac_display").style.display = "none";
            document.getElementById("iupac_display2").style.display = "none";
        }

        //Champ INCHI
        if (response.data.molecule.inchi){
            //Substring pour ne pas prendre le début avec "INCHI="
            document.getElementById("inchi").innerHTML = "<acronym title='International Chemical Identifier' style='text-decoration: none'>Inchi :</acronym>" + " " + response.data.molecule.inchi.substring(6);
            document.getElementById("inchi_card").innerHTML = response.data.molecule.inchi.substring(6);
        }
        else{
            document.getElementById("inchi_display").style.display = "none";
            document.getElementById("inchi_display2").style.display = "none";
        }

        //Champ SMILES
        if (response.data.molecule.smi){
            document.getElementById("smiles").innerHTML = "<acronym title='Simplified Molecular-Input Line-Entry System' style='text-decoration: none'>SMILES :</acronym>" + " " + response.data.molecule.smi;
            document.getElementById("smiles_card").innerHTML = response.data.molecule.smi;
        }
        else{
            document.getElementById("smiles_display").style.display = "none";
            document.getElementById("smiles_display2").style.display = "none";
        }

        //Partie Computation Detail pour les caractéristiques de la molécule (partie détail de calcul)
        if (!response.data.comp_details.general){
            document.getElementById("display-comp-detail").style.display = "none";
        }

        //Champ Software
        if (response.data.comp_details.general.package && response.data.comp_details.general.package_version){
            document.getElementById("software").innerHTML = response.data.comp_details.general.package +" ("+response.data.comp_details.general.package_version+")";
            document.getElementById("software_card").innerHTML = response.data.comp_details.general.package +" ("+response.data.comp_details.general.package_version+")";
        }
        else{
            document.getElementById("diplay_software").style.display = "none";
            document.getElementById("diplay_software2").style.display = "none";
        }

        //Champ Computational method
        if (response.data.comp_details.general.last_theory){
            document.getElementById("computational").innerHTML = response.data.comp_details.general.last_theory;
            document.getElementById("computational_card").innerHTML = response.data.comp_details.general.last_theory;
        }
        else{
            document.getElementById("comp_display").style.display = "none";
            document.getElementById("comp_display2").style.display = "none";
        }

        //Champ Functional
        if (response.data.comp_details.general.functional){
            document.getElementById("functional").innerHTML = response.data.comp_details.general.functional;
            document.getElementById("functional_card").innerHTML = response.data.comp_details.general.functional;
        }
        else{
            document.getElementById("func_display").style.display = "none";
            document.getElementById("func_display2").style.display = "none";
        }

        //Champ Basis set name
        if (response.data.comp_details.general.basis_set_name){
            document.getElementById("basis").innerHTML = response.data.comp_details.general.basis_set_name;
            document.getElementById("basis_card").innerHTML = response.data.comp_details.general.basis_set_name;
        }
        else{
            document.getElementById("basis_display").style.display = "none";
            document.getElementById("basis_display2").style.display = "none";
        }

        //Champ Number of basis set functions
        if (response.data.comp_details.general.basis_set_size || response.data.comp_details.general.basis_set_size == 0){
            document.getElementById("number_basis").innerHTML = response.data.comp_details.general.basis_set_size;
            document.getElementById("number_basis_card").innerHTML = response.data.comp_details.general.basis_set_size;
        }
        else{
            document.getElementById("nb_basis_display").style.display = "none";
            document.getElementById("nb_basis_display2").style.display = "none";
        }

        //Champ Closed shell calculation
        if (response.data.comp_details.general.is_closed_shell){
            document.getElementById("shell_calc").innerHTML = response.data.comp_details.general.is_closed_shell;
            document.getElementById("shell_calc_card").innerHTML = response.data.comp_details.general.is_closed_shell;
        }
        else{
            document.getElementById("shell_display").style.display = "none";
            document.getElementById("shell_display2").style.display = "none";
        }

        //Champ Integration grid
        if (response.data.comp_details.general.integration_grid){
            document.getElementById("integration").innerHTML = response.data.comp_details.general.integration_grid;
            document.getElementById("integration_card").innerHTML = response.data.comp_details.general.integration_grid;
        }
        else{
            document.getElementById("integration_display").style.display = "none";
            document.getElementById("integration_display2").style.display = "none";
        }

        //Champ Solvent
        if (response.data.comp_details.general.solvent){
            document.getElementById("solvent").innerHTML = response.data.comp_details.general.solvent;
            document.getElementById("solvent_card").innerHTML = response.data.comp_details.general.solvent;
        }
        else{
            document.getElementById("solvent_display").style.display = "none";
            document.getElementById("solvent_display2").style.display = "none";
        }

        //Champs Request SCF Convergence
        if (response.data.comp_details.general.scf_targets || response.data.comp_details.general.scf_targets.length == 0){
            let val = response.data.comp_details.general.scf_targets[response.data.comp_details.general.scf_targets.length-1];
            document.getElementById("convergence").innerHTML = exposant(val[0]);
            document.getElementById("convergence_card").innerHTML = exposant(val[0]);

            document.getElementById("convergence_max").innerHTML = val[1];
            document.getElementById("convergence_max_card").innerHTML = val[1];

            document.getElementById("convergence_energie").innerHTML = val[2];
            document.getElementById("convergence_energie_card").innerHTML = val[2];
        }
        else{
            document.getElementById("convergence_display").style.display = "none";
            document.getElementById("convergence_display2").style.display = "none";

            document.getElementById("convergence_max_display").style.display = "none";
            document.getElementById("convergence_max_display2").style.display = "none";

            document.getElementById("convergence_energie_display").style.display = "none";
            document.getElementById("convergence_energie_display2").style.display = "none";
        }

        //Champ Temperature
        if(response.data.comp_details.freq.temperature || response.data.comp_details.freq.temperature  == 0){
            document.getElementById("temperature").innerHTML = response.data.comp_details.freq.temperature ;
            document.getElementById("temperature_card").innerHTML = response.data.comp_details.freq.temperature ;
        }
        else{
            document.getElementById("temperature_display").style.display = "none";
            document.getElementById("temperature_display2").style.display = "none";
        }

        //Champ Anaharmonicity
        if(response.data.comp_details.freq.anharmonicity != null){
            document.getElementById("anharmonicity").innerHTML = response.data.comp_details.freq.anharmonicity;
            document.getElementById("anharmonicity_card").innerHTML = response.data.comp_details.freq.anharmonicity;
        }
        else{
            document.getElementById("anharmonicity_display").style.display = "none";
            document.getElementById("anharmonicity_display2").style.display = "none";
        }

        //Champ Number of excited states
        if (response.data.comp_details.excited_states.nb_et_states || response.data.comp_details.excited_states.nb_et_states  == 0){
            document.getElementById("nb_excited_state").innerHTML = response.data.comp_details.excited_states.nb_et_states;
            document.getElementById("nb_excited_state_card").innerHTML = response.data.comp_details.excited_states.nb_et_states;
        }
        else{
            document.getElementById("nb_excited_display").style.display = "none";
            document.getElementById("nb_excited_display2").style.display = "none";
        }

        //Partie plus détaillée pour les caractéristiques de la molécule (partie détail de la molécule en affichage normal)
        if (response.data.molecule.formula){
            document.getElementById("formule").innerHTML = mol_sub(response.data.molecule.formula);
            document.getElementById("formule_card").innerHTML = mol_sub(response.data.molecule.formula);
        }

        //Champ Charge
        if (response.data.molecule.charge || response.data.molecule.charge == 0){
            document.getElementById("charge").innerHTML = response.data.molecule.charge;
            document.getElementById("charge_card").innerHTML = response.data.molecule.charge;
        }
        else{
            document.getElementById("charge_display").style.display = "none";
            document.getElementById("charge_display2").style.display = "none";
        }

        //Champ Spin multiplicity
        if (response.data.molecule.multiplicity || response.data.molecule.multiplicity == 0){
            document.getElementById("spin").innerHTML = response.data.molecule.multiplicity;
            document.getElementById("spin_card").innerHTML = response.data.molecule.multiplicity;
        }
        else{
            document.getElementById("spin_display").style.display = "none";
            document.getElementById("spin_display2").style.display = "none";
        }

        //Champ Monoisotopic mass
        if (response.data.molecule.monoisotopic_mass || response.data.molecule.monoisotopic_mass == 0){
            document.getElementById("monoisotopic").innerHTML = response.data.molecule.monoisotopic_mass;
            document.getElementById("monoisotopic_card").innerHTML = response.data.molecule.monoisotopic_mass;
        }
        else{
            document.getElementById("monoisotopic_display").style.display = "none";
            document.getElementById("monoisotopic_display2").style.display = "none";
        }

        //Bouton pour de télécharger les informations de la molécule
        if (response.data.metadata.log_file){
            //récupération de l'id et du nom du fichier de log
            let id = response.id;
            let path = id.split('');
            let name = response.data.metadata.log_file;
            let lien = "data_dir/";

            //On sépare chaque lettre de l'id par un / pour obtenir le path ou se trouve le logfile
            for(let i = 0;i<path.length;i++){
                lien += path[i]+"/";
            }
            lien += name;

            let logbtn = document.getElementById("logfile");
            logbtn.setAttribute("href",lien);

            let logbtn2 = document.getElementById("logfile_card");
            logbtn2.setAttribute("href",lien);
        }
        else{
            document.getElementById("log_display").style.display = "none";
            document.getElementById("log_display2").style.display = "none";
        }

        ////////////////////////////////////////////////////
        //Onglet Results avec le détail et l'ajout d'infos//
        ////////////////////////////////////////////////////

        //Partie WAVEFONCTION
        if(!response.data.results.wavefunction || response.data.results.wavefunction == undefined){
            document.getElementById("v-pills-wavefunction").style.display = "none";
            document.getElementById("v-pills-wavefunction-tab").style.display = "none";
            document.getElementById("wavefunction_display").style.display = "none";
        }

        //Champ Total Molecular energy
        if (response.data.results.wavefunction.total_molecular_energy || response.data.results.wavefunction.total_molecular_energy == 0){
            document.getElementById("energy").innerHTML = response.data.results.wavefunction.total_molecular_energy;
            document.getElementById("energy_card").innerHTML = response.data.results.wavefunction.total_molecular_energy;
        }
        else{
            document.getElementById("energy_display").style.display = "none";
            document.getElementById("energy_display2").style.display = "none";
        }

        //Champ HOMO number
        //Si plusieurs Homos dans l'index on les liste et les affiche
        if (response.data.results.wavefunction.homo_indexes || response.data.results.wavefunction.homo_indexes == 0){
            let homo_indexes = response.data.results.wavefunction.homo_indexes;
            let homos = "";
            for(let j=0;j<homo_indexes.length;j++){
                homos += (homo_indexes[j]+1);
                if(j!=(homo_indexes.length-1))
                    homos +=", ";
            }
            document.getElementById("homo").innerHTML = homos;
            document.getElementById("homo_card").innerHTML = homos;
        }
        else {
            document.getElementById("homo_display").style.display = "none";
            document.getElementById("homo_display2").style.display = "none";
        }

        //Remplissage du tableau des HOMOS
        if(response.data.results.wavefunction.MO_energies && response.data.results.wavefunction.MO_energies.length>0){
            let homo_indexes = response.data.results.wavefunction.homo_indexes;
            let MO_energies = response.data.results.wavefunction.MO_energies;
            let ligne = "";
            for(let j=0;j<homo_indexes.length;j++){
                if (homo_indexes[j] <= 0) {
                    ligne += createLigne(createCol("N/A") +
					 createCol(MO_energies[j][homo_indexes[j]].toFixed(2)) +
					 createCol(MO_energies[j][homo_indexes[j]+1].toFixed(2)) +
					 createCol("N/A"));
                } else {
                    ligne += createLigne(createCol(MO_energies[j][homo_indexes[j] - 1].toFixed(2)) +
					 createCol(MO_energies[j][homo_indexes[j]].toFixed(2)) +
					 createCol(MO_energies[j][homo_indexes[j] + 1].toFixed(2)) +
					 createCol(MO_energies[j][homo_indexes[j] + 2].toFixed(2)));
                    //ligne += createLigne(
		    //createCol(MO_energies[j][3].toFixed(2)) +
		    //createCol(MO_energies[j][4].toFixed(2)) +
		    //createCol(MO_energies[j][5].toFixed(2)) +
		    //createCol(MO_energies[j][6].toFixed(2)));
                }
            }
            document.getElementById("calc_table_tab").innerHTML = ligne;
            document.getElementById("calc_table_card").innerHTML = ligne;
        }
        else{
            document.getElementById("calculated_energies").style.display = "none";
            document.getElementById("calculated_energies2").style.display = "none";
        }

        //Remplissage du tableau Mulliken atomic
        if (response.data.results.wavefunction.Mulliken_partial_charges && response.data.results.wavefunction.Mulliken_partial_charges.length>0) {
            let Mulliken_partial_charges = response.data.results.wavefunction.Mulliken_partial_charges;

            //On reprends les différents champs du tableau (Atome, indices et charges partielles)
            let atoms_Z = response.data.molecule.atoms_Z;
            let atom_z = new Array();
            for (let j = 0; j < atoms_Z.length; j++){
                atom_z[j] = atoms_Z[j];
            }

            let indices = new Array();
            for (let j = 0; j < Mulliken_partial_charges.length; j++){
                indices[j] = j;
            }

            let mulliken_partial_charges = new Array();
            for (let j = 0; j < Mulliken_partial_charges.length; j++) {
                mulliken_partial_charges[j] = Mulliken_partial_charges[j];
            }

            //Tri des energies dans le tableau
            for (let j = 0; j < mulliken_partial_charges.length; j++) {
                for (let h = j; h < (mulliken_partial_charges.length - 1); h++) {
                    if (mulliken_partial_charges[h] < mulliken_partial_charges[j]) {
                        let temp = mulliken_partial_charges[h];
                        let temp0 = indices[h];
                        let temp1 = atom_z[h];

                        mulliken_partial_charges[h] = mulliken_partial_charges[j];
                        indices[h] = indices[j];
                        atom_z[h] = atom_z[j];
                        mulliken_partial_charges[j] = temp;
                        indices[j] = temp0;
                        atom_z[j] = temp1;
                    }
                }
            }

            //Calcul de la moyenne
            let sum = 0;
            for (let j = 0; j < mulliken_partial_charges.length; j++){
                sum += mulliken_partial_charges[j];
            }

            let moyenne = sum / mulliken_partial_charges.length;

            //calcule de l'écart type
            sum = 0;
            for (let j = 0; j < mulliken_partial_charges.length; j++) {
                let inter = mulliken_partial_charges[j] - moyenne;
                sum += Math.pow(inter, 2);
            }
            let std = Math.sqrt(sum / mulliken_partial_charges.length);

            //remplissage de la moyenne
            document.getElementById("moyenne").innerHTML = "Mean = " + moyenne.toFixed(3) + " , Standard Deviation(std) = " + std.toFixed(3);
            document.getElementById("moyenne_card").innerHTML = "Mean = " + moyenne.toFixed(3) + " , Standard Deviation(std) = " + std.toFixed(3);

            //remplissage du tableau
            let html = "";
            let thres_max = moyenne + std;
            let thres_min = moyenne - std;
            for (let j = 0; j < mulliken_partial_charges.length; j++) {
                if (mulliken_partial_charges.length < 5){
                    html +=  createLigne(createCol(Symbol[atom_z[j] - 1]) + createCol(indices[j]) + createCol(mulliken_partial_charges[j].toFixed(3)));
                }
                else if ((mulliken_partial_charges[j] > thres_max) || (mulliken_partial_charges[j] < thres_min)) {
                    html += createLigne(createCol(Symbol[atom_z[j] - 1]) + createCol(indices[j]) + createCol(mulliken_partial_charges[j].toFixed(3)));
                }
            }

            document.getElementById("mulliken_table").innerHTML = html;
            document.getElementById("mulliken_table_card").innerHTML = html;
        }
        else{
            document.getElementById("mulliken_charges").style.display = "none";
            document.getElementById("mulliken_charges_card").style.display = "none";
        }

        //Partie GEOMETRY
        if(!response.data.results.geometry || response.data.results.geometry == undefined){
            document.getElementById("v-pills-geometry").style.display = "none";
            document.getElementById("v-pills-geometry-tab").style.display = "none";
            document.getElementById("geometry_display").style.display = "none";
        }

        //Champ Nuclear repulsion energy in atomic units
        if (response.data.results.geometry.nuclear_repulsion_energy_from_xyz){
            document.getElementById("nuclear").innerHTML = response.data.results.geometry.nuclear_repulsion_energy_from_xyz;
            document.getElementById("nuclear_card").innerHTML = response.data.results.geometry.nuclear_repulsion_energy_from_xyz;
        }
        else{
            document.getElementById("nuclear_display").style.display = "none";
            document.getElementById("nuclear_display2").style.display = "none";
        }

	// geometric convergence criteria
        if(response.data.comp_details.geometry.geometric_targets){
            let geometric_targets = response.data.comp_details.geometry.geometric_targets;
            let geometric_values = response.data.results.geometry.geometric_values[response.data.results.geometry.geometric_values.length - 1];
	    if(response.data.comp_details.general.package &&
	       (response.data.comp_details.general.package=="Gaussian")){
                let titreLines = ["Maximum Force","RMS Force","Maximum Displacement","RMS Displacement"];
	    } else {
		let titreLines = ["Crit. 1","Crit. 2","Crit. 3","Crit. 4"]
	    }
            let html = "";

            for(let i=0;i<geometric_targets.length && i< titreLines.length;i++){
                html += createLigne(createCol(titreLines[i]) +
				    createCol(geometric_values[i].toFixed(6)) +
				    createCol(geometric_targets[i].toFixed(6)));
            }

            document.getElementById("opti_table").innerHTML = html;
            document.getElementById("opti_table_card").innerHTML = html;
            }
        else{
            document.getElementById("geometry_opti").style.display = "none";
            document.getElementById("geometry_opti_card").style.display = "none";
        }
    }


        //Remplissage du tableau de coordonnées cartésiennes
        if(response.data.results.geometry.elements_3D_coords_converged){
            let elements_3D_coords_converged = response.data.results.geometry.elements_3D_coords_converged;
            let atoms_Z = response.data.molecule.atoms_Z;
            let html = "";

            for(let i=0;i<elements_3D_coords_converged.length;i+=3){
                html += createLigne(createCol(Symbol[atoms_Z[i/3]-1]) + createCol(elements_3D_coords_converged[i].toFixed(4)) + createCol(elements_3D_coords_converged[i+1].toFixed(4)) + createCol(elements_3D_coords_converged[i+2].toFixed(4)));
            }

            document.getElementById("cartesian_table").innerHTML = html;
            document.getElementById("cartesian_table_card").innerHTML = html;
        }
        else{
            document.getElementById("cartesian_tab").style.display = "none";
            document.getElementById("cartesian_card").style.display = "none";
        }

        //Partie THERMOCHEMISTRY
        if(!response.data.results.freq || response.data.results.freq.length == undefined){
            document.getElementById("v-pills-thermochemistry").style.display = "none";
            document.getElementById("v-pills-thermochemistry-tab").style.display = "none";
            document.getElementById("thermochemistry_display").style.display = "none";
        }

        //Champ Sum of electronic and zero-point energy
        if(response.data.results.freq.zero_point_energy){
            document.getElementById("zero_point_value").innerHTML = response.data.results.freq.zero_point_energy;
            document.getElementById("zero_point_value_card").innerHTML = response.data.results.freq.zero_point_energy;
        }
        else{
            document.getElementById("zero_point").style.display = "none";
            document.getElementById("zero_point_card").style.display = "none";
        }

        //Champ Sum of electronic and thermal
        if(response.data.results.freq.electronic_thermal_energy){
            document.getElementById("elec_energie_value").innerHTML = response.data.results.freq.electronic_thermal_energy;
            document.getElementById("elec_energie_value_card").innerHTML = response.data.results.freq.electronic_thermal_energy;
        }
        else{
            document.getElementById("elec_energie").style.display = "none";
            document.getElementById("elec_energie_card").style.display = "none";
        }

        //Champ Entropy
        if(response.data.results.freq.entropy){
            document.getElementById("entropy_value").innerHTML = response.data.results.freq.entropy;
            document.getElementById("entropy_value_card").innerHTML = response.data.results.freq.entropy;
        }
        else{
            document.getElementById("entropy").style.display = "none";
            document.getElementById("entropy_card").style.display = "none";
        }

        //Champ Enthalpy
        if(response.data.results.freq.enthalpy){
            document.getElementById("enthalpy_value").innerHTML = response.data.results.freq.enthalpy;
            document.getElementById("enthalpy_value_card").innerHTML = response.data.results.freq.enthalpy;
        }
        else{
            document.getElementById("enthalpy").style.display = "none";
            document.getElementById("enthalpy_card").style.display = "none";
        }

        //Champ Gibbs free energy
        if(response.data.results.freq.free_energy){
            document.getElementById("free_energy_value").innerHTML = response.data.results.freq.free_energy;
            document.getElementById("free_energy_value_card").innerHTML = response.data.results.freq.free_energy;
        }
        else{
            document.getElementById("free_energy").style.display = "none";
            document.getElementById("free_energy_card").style.display = "none";
        }

        //Remplissage du tableau des vibrations
        if(response.data.results.freq.vibrational_int){
            let vibrational_freq = response.data.results.freq.vibrational_freq;
            let vibrational_int = response.data.results.freq.vibrational_int;
            let vibrational_sym = response.data.results.freq.vibrational_sym;
            let html = "";
            let nbRes = 0;

            for(let i=0;i<vibrational_int.length;i++){
                if(vibrational_int.length < 5){
		    if (!vibrational_sym) {
			html +=  createLigne(createCol(vibrational_freq[i]) +
					     createCol(vibrational_int[i]) +
					     createCol("N/A"));
		    } else {
			html +=  createLigne(createCol(vibrational_freq[i]) +
					     createCol(vibrational_int[i]) +
					     createCol(vibrational_sym[i]));
		    }
                    nbRes++;
                } else if(vibrational_int[i] > 20){
		    if (!vibrational_sym) {
			html += createLigne(createCol(Math.round(vibrational_freq[i])) +
					    createCol(Math.round(vibrational_int[i])) +
					    createCol("N/A"));
		    } else {
			html += createLigne(createCol(Math.round(vibrational_freq[i])) +
					    createCol(Math.round(vibrational_int[i])) +
					    createCol(vibrational_sym[i]));
		    }
                    nbRes++;
                }
            }
            document.getElementById("vibration_table").innerHTML = html;
            document.getElementById("vibration_table_card").innerHTML = html;
        }
        else{
            document.getElementById("vibration_tab").style.display = "none";
            document.getElementById("vibration_tab_card").style.display = "none";
        }

        //Partie sur les EXCITED STATES
        if( (! response.data.results.excited_states.et_energies) ||
	    (response.data.results.excited_states.et_energies == {})){
            document.getElementById("v-pills-states").style.display = "none";
            document.getElementById("v-pills-states-tab").style.display = "none";
            document.getElementById("excitation_card").style.display = "none";
        }

        //Remplissage du tableau des états excités
        if(response.data.results.excited_states.et_energies) {
            let et_energies = response.data.results.excited_states.et_energies;
            let inde = new Array();
            let html = "";

            for (let i = 0; i < et_energies.length; i++) {
                inde[i] = i + 1;
            }

            let et_sym = response.data.results.excited_states.et_sym;
            let et_oscs = response.data.results.excited_states.et_oscs;
            let et_rot = response.data.results.excited_states.et_rot;

            for (let i = 0; i < et_energies.length; i++) {
                let nm = 10000000 / et_energies[i];

                if (et_rot) {
                    html += createLigne(createCol(inde[i]) +
					createCol(Math.round(et_energies[i])) +
					createCol(Math.round(nm)) +
					createCol(et_sym[i]) +
					createCol(et_oscs[i].toFixed(4)) +
					createCol(et_rot[i].toFixed(4)));
                } else {
                    html += createLigne(createCol(inde[i]) +
					createCol(Math.round(et_energies[i])) +
					createCol(Math.round(nm)) +
					createCol(et_sym[i]) +
					createCol(et_oscs[i].toFixed(4)) +
					createCol("Unknown"));
                }
            }
            document.getElementById("excitation_table").innerHTML = html;
            document.getElementById("excitation_table_card").innerHTML = html;
        } else {
            document.getElementById("excitation_display").style.display = "none";
            document.getElementById("excitation_display_card").style.display = "none";
        }
    }
};

//Envoi de la requête avec la méthode GET
request.open('GET', requestURL);
request.send();
