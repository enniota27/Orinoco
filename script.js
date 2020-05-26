let request = new XMLHttpRequest();
request.onreadystatechange = function() { // fonction qui sera appelée à chaque fois que l'état de la requête change
    if (this.readyState == XMLHttpRequest.DONE && this.status == 200 && document.getElementById('list') != null) { // vérifie que la requête est terminée et que elle s'est bien déroulée
        var response = JSON.parse(this.responseText); // transofrme le texte JSON de la réponse en objet JS
        var listeId = []; // crée une liste vide qui va contenir l'Id de chaque article
        for (let i in response){ // parcourt l'objet pour récupèrer à chaque article son id, name, price, image, puis on modifie notre DOM
            document.getElementById('list').innerHTML += "<li>" + "<a id='" + response[i]._id + "'" + "href='produit.html'>" + response[i].name + "</a><ul><li>" + affichagePrix(response[i].price) + "</li>" + "<li>" +'<img src="' + response[i].imageUrl + '" alt="' + response[i].name + '"></li>' + "<li>" + response[i].description + "</li></ul></li>";
            listeId.push(response[i]._id); // liste des Id des articles
        }
    }
    for (let i in listeId){ // parcourt la liste des Id
        document.getElementById(listeId[i]).addEventListener('click', function(event) { // écoute les évenements qui contient notre Id, càd nos liens, si il y a click alors on exécute la fonction
            for (let k in response){ // parcourt notre JSON
                if (response[k]._id == listeId[i]) { // quand l'Id de l'évènement est retrouvé dans notre JSON, alors :
                    localStorage.setItem('produit' , JSON.stringify(response[k])); // on y stocke le nom, le price, l'image,.. correspondant à Id de l'évenement
                    break;
                };
            };
      });
    };
    if (document.getElementById('name') != null){
        localStorageJSON = localStorage.getItem('produit');
        objetProduit = localStorageJSON && JSON.parse(localStorageJSON);
        document.getElementById('main').innerHTML = '<h1>' + objetProduit.name + '</h1>' + '<img src="' + objetProduit.imageUrl + '" alt="' + objetProduit.name + '">' + '<p> Prix : ' + affichagePrix(objetProduit.price) + '</p><p> Description : ' +  objetProduit.description + '</p>' + '<label>Choix des couleurs : ' + colorsListeHTML(objetProduit.colors) + '</label><br><br><input id="bouton" type="submit" value="Ajouter au panier">';
        document.getElementById('nom_du_produit').innerHTML = objetProduit.name ;
        document.getElementById('bouton').addEventListener('click', function(event) {
            let i = 1
            while (localStorage.getItem(i)){
                i += 1;
            }
            localStorage.setItem(i,JSON.stringify(objetProduit));
            document.location.href="panier.html";
        });
    }
    if (document.getElementById('corps-tableau') != null){
        let prixTotal = 0;
        for(let index = 1; index<localStorage.length; index++){
            localStorageJSON = localStorage.getItem(index);
            objetProduit = localStorageJSON && JSON.parse(localStorageJSON);
            document.getElementById('corps-tableau').innerHTML += "<tr><td><img src='" + objetProduit.imageUrl + "'/></td><td>" + objetProduit.name + "</td><td>" + objetProduit.description + "</td><td>" + affichagePrix(objetProduit.price) + "</td></tr>";
            prixTotal += objetProduit.price;
            console.log(typeof(objetProduit.price));
            document.getElementById('prix-total').innerHTML = "Prix total : " + affichagePrix(prixTotal);
        };
    };
    
};
request.open("GET", "http://localhost:3000/api/teddies"); // récuperation des données de API
request.send(); // envoie la requête

function colorsListeHTML (liste) {
    let listeDeroulante = '<select id="monselect">';
    for (let color in liste){
        listeDeroulante += '<option value="' + liste[color] + '">' + liste[color] + '</option>';
    }
    return listeDeroulante + '</select>';
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

