let request = new XMLHttpRequest();
request.onreadystatechange = function() {
    if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
        var response = JSON.parse(this.responseText);
        let temp = '';
        var listeId = [];
        if (document.getElementById('liste_des_produits') != null ){
            for (let i in response){ 
                listeId.push(response[i]._id);
                if (i%3 ==0){
                    temp += '</div><div class="row">' + affichageProduit(response,i);
                }
                else{
                    temp += affichageProduit(response,i);
                }
            }
            document.getElementById('liste_des_produits').innerHTML += temp;
        }
        if (document.getElementById('produit') != null){
            let id = new URL(location.href).searchParams.get('id');
            for (let i in response){
                if (response[i]._id == id){
                    var produit = response[i];
                    document.getElementById('produit').innerHTML = affichageProduit(response,i, colorsListeHTML(response[i].colors) + '<br><br><input id="bouton" class= "btn btn-success" type="submit" value="Ajouter au panier">');
                    document.getElementById('titre').innerHTML = document.getElementById('nom_du_produit').innerHTML = response[i].name;
                    break;
                }
            }
            document.getElementById('bouton').addEventListener('click', function(event) {
                let k = 0
                while (localStorage.getItem(k)){
                    k += 1;
                }
                localStorage.setItem(k,JSON.stringify(produit));
                document.location.href="panier.html";
            });
        }
}};
    if (document.getElementById('tableau_panier') != null && localStorage.length != 0){
        let prixTotal = 0;
        document.getElementById('tableau_panier').innerHTML =
        '<table class="table table-bordered"><caption>Liste des produits dans mon panier</caption><thead class="thead-dark"><tr><th class="align-middle invisible-768">Image</th><th class="align-middle">Description</th><th class="align-middle min-larg">Prix</th><th class="align-middle">Supprimer</th></tr></thead><tfoot><th colspan="2"></th><th id="prix-total" class="bg-dark text-white" colspan="2">Panier vide</th></tfoot><tbody id="corps-tableau"></tbody></table>'
        for(let index = 0; index<localStorage.length; index++){
            localStorageJSON = localStorage.getItem(index);
            objetProduit = localStorageJSON && JSON.parse(localStorageJSON);
            document.getElementById('corps-tableau').innerHTML += "<tr><td class='align-middle invisible-768'><img src='" + objetProduit.imageUrl + "'/></td><td class='align-middle'><div class='font-weight-bold'>" + objetProduit.name + '</div><p class="invisible-768">' + objetProduit.description + "</p></td><td class='align-middle font-weight-bold'>" + affichagePrix(objetProduit.price) + "</td><td class='align-middle'>" + '<button type="button" class="btn btn-danger" id="bouton-supp-' + index + '">Supprimer</button>' + "</td></tr>";
            prixTotal += objetProduit.price;
            document.getElementById('prix-total').innerHTML = "Prix total : " + affichagePrix(prixTotal);
        };
        document.getElementById('formulaire').style.display = "block";
    };

if (document.getElementById('corps-tableau') != null){
    let max = localStorage.length;
    for (let index = 0; index<max; index++){
        document.getElementById('bouton-supp-' + index).addEventListener('click', function(event) {
            localStorage.removeItem(index);
            for (index; index<max; index++){
                console.log(index);
                if(localStorage.getItem(index+1) != null) {
                    localStorage.setItem(index,localStorage.getItem(index+1))
                }
                else{
                    localStorage.removeItem(index);
                }
                document.location.href="panier.html";
            }
        });
    }
}
    if (document.getElementById('submit-btn') != null){
        document.getElementById('submit-btn').addEventListener('click', function(event) {
            var contact = {
                nom: document.getElementById('name').value,
                prenom: document.getElementById('firstname').value,
                email: document.getElementById('email').value,
                adresse: document.getElementById('adresse').value,
                codePostal: document.getElementById('postal').value,
                ville: document.getElementsByTagName('city').value     
            };
            var tableauId = [];
            for(let index = 0; index<localStorage.length; index++){
                localStorageJSON = localStorage.getItem(index);
                objetProduit = localStorageJSON && JSON.parse(localStorageJSON);
                tableauId.push(objetProduit._id)
            }
            //request.open("POST", "http://localhost:3000/api/teddies");
            //request.setRequestHeader("Content-Type", "application/json");
            //request.send(JSON.stringify());

        });
    };
   
request.open("GET", "http://localhost:3000/api/teddies"); // récuperation des données de API
request.send(); // envoie la requête

function colorsListeHTML (liste) {
    console.log(liste);
    if (liste.length > 1) {
        let listeDeroulante = '<label>Choix des couleurs : <select id="monselect">';
        for (let color in liste){
            listeDeroulante += '<option value="' + liste[color] + '">' + liste[color] + '</option>';
        }
        return listeDeroulante + '</select></label>';
    } 
    else {
        return "Couleur : " + liste;
    } 
}

function affichagePrix(nombre) {
    let centimes = nombre % 100;
    let unites = Math.trunc(nombre/100);
    if (centimes < 10) {
        return unites + "," + "0" + centimes + " €";
    }
    else{
        return unites + "," + centimes + " €";
    }
}

function affichageProduit(response,i,complement="") {
    if (complement == ""){
        return '<div class="col-12 col-md-4"><div class="card shadow anim-opacity-scale"><img class="card-img-top" src="'+ response[i].imageUrl +'" alt="' + response[i].name + '"><div class="card-body"><h5 class="card-title">' + response[i].name + '</h5><p class="card-text">' + response[i].description + '</p><p class="card-text font-weight-bold">Prix : ' + affichagePrix(response[i].price) + '</p><a class="stretched-link" href="produit.html?id=' + response[i]._id + '"></a></div></div></div>'
    }
    else{
        return '<div class="col-12 col-lg-8"><div class="card shadow"><img class="card-img-top" src="'+ response[i].imageUrl +'" alt="' + response[i].name + '"><div class="card-body"><h5 class="card-title">' + response[i].name + '</h5><p class="card-text">' + response[i].description + '</p><p class="card-text font-weight-bold">Prix : ' + affichagePrix(response[i].price) + '</p>' + complement + '</div></div></div>'
    }
};