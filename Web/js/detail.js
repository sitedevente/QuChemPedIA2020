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


///////////////////////////////////////////////
//Fonctions utiles pour le traitement du Json//
///////////////////////////////////////////////

//Bouton pour switch de vue Card/Tab
let btn = document.getElementById("switchDiplay");
btn.onclick = function() {
    if (document.getElementById("diplay-tab").style.display != "none"){
        document.getElementById("diplay-tab").style.display = "none";
        document.getElementById("diplay-card").style.display = "block";
    }
    else{
        document.getElementById("diplay-card").style.display = "none";
        document.getElementById("diplay-tab").style.display = "block";
    }
}

//Fonction pour créer une ligne a partir de toutes les colonnes
function createLigne(colonnes){
    let tableau = "<tr>" + colonnes +"</tr>";
    return tableau;
}

//Fonction pour créer une colone
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

//Objet XHR ajax permettant de récupérer des données à partir d'une URL
let requestURL = 'http://127.0.0.1:5000/api/details/M_FO7HUBkjVcihM6acbJ';
let request = new XMLHttpRequest();

//Fonction pour lire l'état de la requête et si le serveur renvoie le statut 200 OK et l'état Done
//On prends la réponse et on rempli l'HTML avec les informations du Json
request.onreadystatechange = function() {
    if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
        //On parse la réponse du serveur en JSON
        let response = JSON.parse(this.responseText);

        ////////////////////////////////////////////////////////
        //Onglet Description avec les informations principales//
        ////////////////////////////////////////////////////////
        if (response.comp_details.general.basis_set_md5){
            //On remplit l'id de la molécule
            document.getElementById("mol_id").innerHTML = "Molecule Id : "+ response.id;
            document.getElementById("mol_id_card").innerHTML = "Molecule Id : "+ response.id;
        }

        if (response.molecule.formula){
            //On remplit le titre et le grand titre
            document.getElementById("titre").innerHTML = "Formule : "+mol_sub(response.molecule.formula);
            document.getElementById("titre_card").innerHTML = mol_sub(response.molecule.formula);
            document.getElementById("titre_cardbis").innerHTML = mol_sub(response.molecule.formula);
        }

        if (response.molecule.inchi){
            //Substring pour ne pas prendre le début avec "INCHI="
            document.getElementById("inchi").innerHTML = "<acronym title='International Chemical Identifier' style='text-decoration: none'>Inchi :</acronym>" + " " + response.molecule.inchi.substring(6);
            document.getElementById("inchi_card").innerHTML = "<acronym title='International Chemical Identifier' style='text-decoration: none'>Inchi :</acronym>";
            document.getElementById("inchibis_card").innerHTML = response.molecule.inchi.substring(6);
        }

        if (response.molecule.smi){
            document.getElementById("smiles").innerHTML = "<acronym title='Simplified Molecular-Input Line-Entry System' style='text-decoration: none'>SMILES :</acronym>" + " " + response.molecule.smi;
            document.getElementById("smiles_card").innerHTML = "<acronym title='Simplified Molecular-Input Line-Entry System' style='text-decoration: none'>SMILES :</acronym>";
            document.getElementById("smilesbis_card").innerHTML = response.molecule.smi;
        }

        //Partie plus détaillée pour les caractéristiques de la molécule (partie détail de calcul)
        if (response.comp_details.general.package && response.comp_details.general.package_version){
            document.getElementById("software").innerHTML = "Software";
            document.getElementById("softwarebis").innerHTML = response.comp_details.general.package +" ("+response.comp_details.general.package_version+")";
            document.getElementById("software_card").innerHTML = "Software";
            document.getElementById("softwarebis_card").innerHTML = response.comp_details.general.package +" ("+response.comp_details.general.package_version+")";
        }

        if (response.comp_details.general.all_unique_theory){
            document.getElementById("computational").innerHTML = "Computational method";
            document.getElementById("computationalbis").innerHTML = response.comp_details.general.all_unique_theory;
            document.getElementById("computational_card").innerHTML = "Computational method";
            document.getElementById("computationalbis_card").innerHTML = response.comp_details.general.all_unique_theory;
        }

        if (response.comp_details.general.functional){
            document.getElementById("functional").innerHTML = "Functional";
            document.getElementById("functionalbis").innerHTML = response.comp_details.general.functional;
            document.getElementById("functional_card").innerHTML = "Functional";
            document.getElementById("functionalbis_card").innerHTML = response.comp_details.general.functional;
        }

        if (response.comp_details.general.basis_set_name){
            document.getElementById("basis").innerHTML = "Basis Set Name";
            document.getElementById("basisbis").innerHTML = response.comp_details.general.basis_set_name;
            document.getElementById("basis_card").innerHTML = "Basis Set Name";
            document.getElementById("basisbis_card").innerHTML = response.comp_details.general.basis_set_name;
        }

        if (response.comp_details.general.basis_set_size || response.comp_details.general.basis_set_size == 0){
            document.getElementById("number_basis").innerHTML = "Number of basis set functions";
            document.getElementById("number_basisbis").innerHTML = response.comp_details.general.basis_set_size;
            document.getElementById("number_basis_card").innerHTML = "Number of basis set functions";
            document.getElementById("number_basisbis_card").innerHTML = response.comp_details.general.basis_set_size;
        }

        if (response.comp_details.general.is_closed_shell){
            document.getElementById("shell_calc").innerHTML = "Closed shell calculation";
            document.getElementById("shell_calcbis").innerHTML = response.comp_details.general.is_closed_shell;
            document.getElementById("shell_calc_card").innerHTML = "Closed shell calculation";
            document.getElementById("shell_calcbis_card").innerHTML = response.comp_details.general.is_closed_shell;
        }

        if (response.comp_details.general.integration_grid){
            document.getElementById("integration").innerHTML = "Integration grid";
            document.getElementById("integrationbis").innerHTML = response.comp_details.general.integration_grid;
            document.getElementById("integration_card").innerHTML = "Integration grid";
            document.getElementById("integrationbis_card").innerHTML = response.comp_details.general.integration_grid;
        }

        if (response.comp_details.general.solvent){
            document.getElementById("solvent").innerHTML = "Solvent";
            document.getElementById("solventbis").innerHTML = response.comp_details.general.solvent;
            document.getElementById("solvent_card").innerHTML = "Solvent";
            document.getElementById("solventbis_card").innerHTML = response.comp_details.general.solvent;
        }

        if (response.comp_details.general.scf_targets[0][0] || response.comp_details.general.scf_targets[0][0] == 0){
            document.getElementById("convergence").innerHTML = "Requested SCF convergence on RMS density";
            document.getElementById("convergencebis").innerHTML = exposant(response.comp_details.general.scf_targets[0][0]);
            document.getElementById("convergence_card").innerHTML = "Requested SCF convergence on RMS density";
            document.getElementById("convergencebis_card").innerHTML = exposant(response.comp_details.general.scf_targets[0][0]);
        }

        if (response.comp_details.excited_states.nb_et_states || response.comp_details.excited_states.nb_et_states  == 0){
            document.getElementById("nb_excited_state").innerHTML = "Number of excited states";
            document.getElementById("nb_excited_statebis").innerHTML = response.comp_details.excited_states.nb_et_states;
            document.getElementById("nb_excited_state_card").innerHTML = "Number of excited states";
            document.getElementById("nb_excited_statebis_card").innerHTML = response.comp_details.excited_states.nb_et_states;
        }

        //Partie plus détaillée pour les caractéristiques de la molécule (partie détail de la molécule)
        if (response.molecule.formula){
            document.getElementById("formule").innerHTML = "Formule";
            document.getElementById("formulebis").innerHTML = mol_sub(response.molecule.formula);
            document.getElementById("formule_card").innerHTML = "Formule";
            document.getElementById("formulebis_card").innerHTML = mol_sub(response.molecule.formula);
        }

        if (response.molecule.charge || response.molecule.charge == 0){
            document.getElementById("charge").innerHTML = "Charge";
            document.getElementById("chargebis").innerHTML = response.molecule.charge;
            document.getElementById("charge_card").innerHTML = "Charge";
            document.getElementById("chargebis_card").innerHTML = response.molecule.charge;
        }

        if (response.molecule.multiplicity || response.molecule.multiplicity == 0){
            document.getElementById("spin").innerHTML = "Spin multiplicity";
            document.getElementById("spinbis").innerHTML = response.molecule.multiplicity;
            document.getElementById("spin_card").innerHTML = "Spin multiplicity";
            document.getElementById("spinbis_card").innerHTML = response.molecule.multiplicity;
        }

        if (response.molecule.monoisotopic_mass || response.molecule.monoisotopic_mass == 0){
            document.getElementById("monoisotopic").innerHTML = "Monoisotopic mass";
            document.getElementById("monoisotopicbis").innerHTML = response.molecule.monoisotopic_mass;
            document.getElementById("monoisotopic_card").innerHTML = "Monoisotopic mass";
            document.getElementById("monoisotopicbis_card").innerHTML = response.molecule.monoisotopic_mass;
        }

        //Possibilité de télécharger les informations de la molécule
        if (response.metadata.log_file){
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
        if (response.results.wavefunction.total_molecular_energy || response.results.wavefunction.total_molecular_energy == 0){
            document.getElementById("energy").innerHTML = "Total molecular energy";
            document.getElementById("energybis").innerHTML = response.results.wavefunction.total_molecular_energy;
            document.getElementById("energy_card").innerHTML = "Total molecular energy";
            document.getElementById("energybis_card").innerHTML = response.results.wavefunction.total_molecular_energy;
        }

        //Si plusieurs Homos dans l'index on les liste et les affiche
        if (response.results.wavefunction.homo_indexes || response.results.wavefunction.homo_indexes == 0){
            let homo_indexes = response.results.wavefunction.homo_indexes;
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
        if(response.results.wavefunction.MO_energies && response.results.wavefunction.MO_energies.length>0){
            let homo_indexes = response.results.wavefunction.homo_indexes;
            let MO_energies = response.results.wavefunction.MO_energies;
            let ligne = "";
            for(let j=0;j<homo_indexes.length;j++){
                if (homo_indexes[j] <= 0) {
                    ligne += createLigne(createCol(N/A) + createCol(MO_energies[j][homo_indexes[j]].toFixed(2)) + createCol(MO_energies[j][homo_indexes[j]+1].toFixed(2)) + createCol(N/A));
                } else {
                    ligne += createLigne(createCol(MO_energies[j][homo_indexes[j] - 1].toFixed(2)) + createCol(MO_energies[j][homo_indexes[j]].toFixed(2)) + createCol([j][homo_indexes[j] + 1].toFixed(2)) + createCol([j][homo_indexes[j] + 2].toFixed(2)));
                }
            }
            document.getElementById("calc_table_tab").innerHTML = ligne;
        }

        //Remplissage du tableau Mulliken atomic
        /*if (response.results.wavefunction.Mulliken_partial_charges && response.results.wavefunction.Mulliken_partial_charges.length>0){
            let Mulliken_partial_charges = response.results.wavefunction.Mulliken_partial_charges;

            var atoms_Z = results.molecule.atoms_Z;
            var atom_z = new Array();
            for(var j=0;j<atoms_Z.length;j++)
                atom_z[j]=atoms_Z[j];

            var indices = new Array();
            for(var j=0;j<Mulliken_partial_charges.length;j++)
                indices[j]=j;

            var mulliken_partial_charges = new Array();
            for(var j=0;j<Mulliken_partial_charges.length;j++)
                mulliken_partial_charges[j]=Mulliken_partial_charges[j];

            //trier le tableau des enérgies
            for(var j=0;j<mulliken_partial_charges.length;j++){
                for(var h=j;h<(mulliken_partial_charges.length -1);h++){
                    if(mulliken_partial_charges[h]<mulliken_partial_charges[j]){
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
            for(var j=0;j<mulliken_partial_charges.length;j++)
                sum += mulliken_partial_charges[j];
            var moyenne = sum/mulliken_partial_charges.length;
            //calcule de l'écart type
            sum = 0;
            for(var j=0;j<mulliken_partial_charges.length;j++){
                var inter = mulliken_partial_charges[j] - moyenne;
                sum += Math.pow(inter, 2);
            }
            var std =  Math.sqrt(sum/mulliken_partial_charges.length);

            html += "<div class=\"container subWavefunction\" align=center><b>Most intense Mulliken atomic charges</b>";
            html += "<div class=\"container subWavefunction\" align=center><b>mean = "+moyenne.toFixed(3)+" e, std = "+std.toFixed(3)+" </b>";

            html += "<table class=\"tab3Cols\" id=\"tableMulliken_partial_charges\">";
            html += "<tr class=\"ligneSoulignee\"><td>Atom</td><td>number</td><td>Mulliken partial charges</td><td></td></tr>";
            var thres_max = moyenne + std;
            var thres_min = moyenne - std;
            for(var j=0;j<mulliken_partial_charges.length;j++){
                if(mulliken_partial_charges.length < 5 )
                    html += "<tr><td>"+Symbol[atom_z[j]-1]+"</td><td>"+indices[j]+"</td><td>"+mulliken_partial_charges[j].toFixed(3)+"</td></tr>";
                else if( (mulliken_partial_charges[j] > thres_max) || (mulliken_partial_charges[j] < thres_min))
                    html += "<tr><td>"+Symbol[atom_z[j]-1]+"</td><td>"+indices[j]+"</td><td>"+mulliken_partial_charges[j].toFixed(3)+"</td></tr>";
            }
            html += "</table></div>";


        }*/


        if (response.results.geometry.nuclear_repulsion_energy_from_xyz || response.results.geometry.nuclear_repulsion_energy_from_xyz == 0){
            document.getElementById("nuclear").innerHTML = "Nuclear repulsion energy in atomic units";
            document.getElementById("nuclearbis").innerHTML = response.results.geometry.nuclear_repulsion_energy_from_xyz;
        }
    }
};

request.open('GET', requestURL);
request.send();