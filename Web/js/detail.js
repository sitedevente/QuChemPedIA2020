//Initialisation pour les datatables
$(document).ready(function() {
    $('#mull_id').DataTable( {
        "paging":   false,
        "info":     false,
        "searching":   false
    } );
} );

$(document).ready(function() {
    $('#cartesian_id').DataTable( {
        "paging":   false,
        "info":     false,
        "searching":   false
    } );
} );

$(document).ready(function() {
    $('#excitation_id').DataTable( {
        "paging":   false,
        "info":     false,
        "searching":   false
    } );
} );

//Objet XHR ajax permettant de récupérer des données à partir d'une URL
let requestURL = 'http://127.0.0.1:5000/API/detail?id=LeIN1HQBkjVcihM6WgIo';
let request = new XMLHttpRequest();

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
            if (chaine[i] == "e"){
                index = i;
            }
        }

        //On ajoute l'exposant en enlevant le "e"
        let exposant = chaine.substring(index);
        tmp += chaine.substring(0,index) ;
        tmp += exposant.sup();
        return tmp;
    } catch (error) {
        console.error(error);
    }
}

//Fonction pour lire l'état de la requête et si le serveur renvoie le statut 200 OK et l'état Done
//On prends la réponse et on rempli l'HTML avec les informations du Json
request.onreadystatechange = function() {
    if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
        //On parse la réponse du serveur en JSON
        let response = JSON.parse(this.responseText);

        //////////////////////////////////////////////////////
        //Onglet Description avec les informations principales
        //////////////////////////////////////////////////////
        if (response.molecule.formula){
            //On remplit le titre et le grand titre
            document.getElementById("titre").innerHTML = "Formule : "+mol_sub(response.molecule.formula);
            document.getElementById("titre_card").innerHTML = mol_sub(response.molecule.formula)
        }

        if (response.molecule.inchi){
            //Substring pour ne pas prendre le début avec "INCHI="
            document.getElementById("inchi").innerHTML = "Inchi : "+response.molecule.inchi.substring(6);
        }

        if (response.molecule.smi){
            document.getElementById("smiles").innerHTML = "SMILES : "+response.molecule.smi;
        }

        //Partie plus détaillée pour les caractéristiques de la molécule (partie détail de calcul)
        if (response.comp_details.general.package && response.comp_details.general.package_version){
            document.getElementById("software").innerHTML = "Software";
            document.getElementById("softwarebis").innerHTML = response.comp_details.general.package +" ("+response.comp_details.general.package_version+")";
        }

        if (response.comp_details.general.all_unique_theory){
            document.getElementById("computational").innerHTML = "Computational method";
            document.getElementById("computationalbis").innerHTML = response.comp_details.general.all_unique_theory;
        }

        if (response.comp_details.general.functional){
            document.getElementById("functional").innerHTML = "Functional";
            document.getElementById("functionalbis").innerHTML = response.comp_details.general.functional;
        }

        if (response.comp_details.general.basis_set_name){
            document.getElementById("basis").innerHTML = "Basis Set Name";
            document.getElementById("basisbis").innerHTML = response.comp_details.general.basis_set_name;
        }

        if (response.comp_details.general.basis_set_size || response.comp_details.general.basis_set_size == 0){
            document.getElementById("number_basis").innerHTML = "Number of basis set functions";
            document.getElementById("number_basisbis").innerHTML = response.comp_details.general.basis_set_size;
        }

        if (response.comp_details.general.is_closed_shell){
            document.getElementById("shell_calc").innerHTML = "Closed shell calculation";
            document.getElementById("shell_calcbis").innerHTML = response.comp_details.general.is_closed_shell;
        }

        if (response.comp_details.general.integration_grid){
            document.getElementById("integration").innerHTML = "Integration grid";
            document.getElementById("integrationbis").innerHTML = response.comp_details.general.integration_grid;
        }

        if (response.comp_details.general.solvent){
            document.getElementById("solvent").innerHTML = "Solvent";
            document.getElementById("solventbis").innerHTML = response.comp_details.general.solvent;
        }

        if (response.comp_details.general.scf_targets[0][0] || response.comp_details.general.scf_targets[0][0] == 0){
            document.getElementById("convergence").innerHTML = "Requested SCF convergence on RMS density";
            document.getElementById("convergencebis").innerHTML = exposant(response.comp_details.general.scf_targets[0][0]);
        }

        if (response.comp_details.excited_states.nb_et_states || response.comp_details.excited_states.nb_et_states  == 0){
            document.getElementById("nb_excited_state").innerHTML = "Number of excited states";
            document.getElementById("nb_excited_statebis").innerHTML = response.comp_details.excited_states.nb_et_states;
        }

        //Partie plus détaillée pour les caractéristiques de la molécule (partie détail de la molécule)
        if (response.molecule.formula){
            document.getElementById("formule").innerHTML = "Formule";
            document.getElementById("formulebis").innerHTML = mol_sub(response.molecule.formula);
        }

        if (response.molecule.charge || response.molecule.charge == 0){
            document.getElementById("charge").innerHTML = "Charge";
            document.getElementById("chargebis").innerHTML = response.molecule.charge;
        }

        if (response.molecule.multiplicity || response.molecule.multiplicity == 0){
            document.getElementById("spin").innerHTML = "Spin multiplicity";
            document.getElementById("spinbis").innerHTML = response.molecule.multiplicity;
        }

        if (response.molecule.monoisotopic_mass || response.molecule.monoisotopic_mass == 0){
            document.getElementById("monoisotopic").innerHTML = "Monoisotopic mass";
            document.getElementById("monoisotopicbis").innerHTML = response.molecule.monoisotopic_mass;
        }

        if (response.metadata.log_file){
            document.getElementById("logfile").innerHTML = "Original log file";
            document.getElementById("logfilebis").innerHTML = "Download";
        }

        //////////////////////////////////////////////////////
        //Onglet Results avec le détail et l'ajout d'infos
        //////////////////////////////////////////////////////
        if (response.results.wavefunction.total_molecular_energy || response.results.wavefunction.total_molecular_energy == 0){
            document.getElementById("energy").innerHTML = "Total molecular energy";
            document.getElementById("energybis").innerHTML = response.results.wavefunction.total_molecular_energy;
        }

        if (response.results.wavefunction.homo_indexes || response.results.wavefunction.homo_indexes == 0){
            document.getElementById("homo").innerHTML = "HOMO number";
            document.getElementById("homobis").innerHTML = response.results.wavefunction.homo_indexes;
        }

        if (response.results.geometry.nuclear_repulsion_energy_from_xyz || response.results.geometry.nuclear_repulsion_energy_from_xyz == 0){
            document.getElementById("nuclear").innerHTML = "Nuclear repulsion energy in atomic units";
            document.getElementById("nuclearbis").innerHTML = response.results.geometry.nuclear_repulsion_energy_from_xyz;
        }
    }
};

request.open('GET', requestURL);
request.send();

