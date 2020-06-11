function connexionAPI() { //Fonction utilisant les promises pour se connecter à l'API
	return (new Promise((resolve) => {
		let request = new XMLHttpRequest(); // Requête correspondant a un objet AJAX
		request.onreadystatechange = function() {
			if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
				resolve(JSON.parse(this.responseText)); // Recupére les données au formant JSON
				console.log("Connexion à l'API réussie");
			} else {
				console.log(`Erreur de connexion à l'API`);
			}
		}
		request.open("GET", 'http://localhost:3000/api/teddies'); // Ouvre une connexion via url de l'API avec GET
		request.send(); // Envoie la requête
	}));
}

window.onload = async function() { // Lance la fonction au chargement de la page
	let response = await connexionAPI(); // Response est l'objet que nous renvoie l'API
	// PAGE INDEX
	if (document.getElementById('liste_des_produits')) {
		let temp = ''; // On déclare une variable temp
		for (let i in response) { // On parcourt chaque ligne de response
			if (i % 3 == 0) { // Si le reste de la divion de i par 3 est nul, alors on crée une nouvelle ligne row de bootstrap (3 produits par ligne)
				temp += '</div><div class="row">' + affichageProduit(response, i); // affichageProduit retourne du code HTML pour l'affichage cards de bootstrap
			} else {
				temp += affichageProduit(response, i);
			}
		}
		document.getElementById('liste_des_produits').innerHTML += temp;
	}
	// PAGE PRODUIT
	if (document.getElementById('produit')) {
		let id = new URL(location.href).searchParams.get('id'); //On récupère l'id dans l'url
		for (let i in response) { //on parcourt notre JSON pour trouver à quel produit correspond l'id
			if (response[i]._id == id) {
				var produit = response[i];
				// On utilise affichagePrdouit(response, i, complement = liste déroulante et un bouton);
				document.getElementById('produit').innerHTML = affichageProduit(response, i, colorsListeHTML(response[i].colors) + '<br><br><input id="bouton" class= "btn btn-success" type="submit" value="Ajouter au panier">');
				document.getElementById('titre').innerHTML = document.getElementById('nom_du_produit').innerHTML = response[i].name;
				break; // sort de la boucle for
			}
		}
		document.getElementById('bouton').addEventListener('click', function(event) { // On écoute le click sur le bouton ajouter au panier
			let clef = 0
			while (localStorage.getItem(clef)) { // On cherche une clef non utilisé
				clef += 1;
			}
			localStorage.setItem(clef, JSON.stringify(produit)); // Ajoute le produit à localStorage
			document.location.href = "panier.html"; // Redirection panier.html
		});
	}
}

// PAGE PANIER
if (document.getElementById('tableau_panier') && localStorage.length != 0) { // Si le panier est non vide
	document.getElementById('formulaire').style.display = "block"; // Modification du style du formulaire pour le rendre visible
	var prixTotal = 0; // Initialise le prix total à 0
	document.getElementById('tableau_panier').innerHTML = '<table class="table table-bordered"><caption>Liste des produits dans mon panier</caption><thead class="thead-dark"><tr><th class="align-middle invisible-768">Image</th><th class="align-middle">Description</th><th class="align-middle min-larg">Prix</th><th class="align-middle">Supprimer</th></tr></thead><tbody id="corps-tableau"></tbody><tfoot><th colspan="2"></th><th id="prix-total" class="bg-dark text-white" colspan="2">Panier vide</th></tfoot></table>' // On crée un tableau vide
	for (let index = 0; index < localStorage.length; index++) { // On parcours localStorage pour ajouter une ligne du tableau à chaque produit
		localStorageJSON = localStorage.getItem(index);
		objetProduit = localStorageJSON && JSON.parse(localStorageJSON);
		document.getElementById('corps-tableau').innerHTML += "<tr><td class='align-middle invisible-768'><img src='" + objetProduit.imageUrl + "' alt='" + objetProduit.name + "'/></td><td class='align-middle'><div class='font-weight-bold'>" + objetProduit.name + '</div><p class="invisible-768">' + objetProduit.description + "</p></td><td class='align-middle font-weight-bold'>" + affichagePrix(objetProduit.price) + "</td><td class='align-middle'>" + '<button type="button" class="btn btn-danger btn-size" id="bouton-supp-' + index + '">Supprimer</button>' + "</td></tr>";
		prixTotal += objetProduit.price;
		document.getElementById('prix-total').innerHTML = "Prix total : " + affichagePrix(prixTotal);
	};
	// SUPPRIMER UN ARTICLE DANS LE PANIER
	let max = localStorage.length;
	for (let index = 0; index < max; index++) {
		document.getElementById('bouton-supp-' + index).addEventListener('click', function(event) { // Ecoute le click sur les boutons supprimer
			localStorage.removeItem(index); // Supprime le produit du panier
			for (index; index < max; index++) {
				if (localStorage.getItem(index + 1)) {
					localStorage.setItem(index, localStorage.getItem(index + 1))
				} else {
					localStorage.removeItem(index);
				}
				document.location.href = "panier.html"; // Actualise la page
			}
		});
	}
};
// FORMULAIRE
if (document.getElementById('submit-btn')) {
	document.getElementById('submit-btn').addEventListener('click', function(event) {
		let contact = { // Objet contact
			nom: document.getElementById('name').value,
			prenom: document.getElementById('firstname').value,
			email: document.getElementById('email').value,
			adresse: document.getElementById('adresse').value,
			codePostal: document.getElementById('postal').value,
			ville: document.getElementById('city').value,
		};
		let products = []; // Liste id des produits
		for (let index = 0; index < localStorage.length; index++) {
			localStorageJSON = localStorage.getItem(index);
			objetProduit = localStorageJSON && JSON.parse(localStorageJSON);
			products.push(objetProduit._id);
		}
		fetch('http://localhost:3000/api/teddies/order', { // Envoie le formulaire à l'API
			method: 'POST',
			headers: { // Indication que l'on envoie du JSON
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				contact,
				products
			}),
		}).then(response => response.json()).then(response => {
			let orderId = response.orderId;
			//localStorage.setItem("orderId", orderId); // Stocke le numéro de commande renvoyé dans localStorage
			//localStorage.setItem("prixTotal", prixTotal); // Stocke le prix totale dans localStorage
			//document.location.href = "confirmation.html"; // Redirection vers la page confirmation
		}).catch((error) => {
			console.error('Erreur de la connexxion, veuillez réessayer:', error); //Si l'envoie a échoué, la console renvoie une erreur 
		});
	});
};

// PAGE CONFIRMATION
if (document.getElementById('prix-total')) {
	//document.getElementById('prix-total').innerHTML = "Prix total : " + affichagePrix(localStorage.getItem("prixTotal"));
	//localStorage.getItem("orderId");
	//localStorage.clear();
}

function colorsListeHTML(liste) { // liste = [rouge, vert, bleu]
	if (liste.length > 1) { // Si la liste contient plusieurs couleurs alors on crée une liste déroulante
		let listeDeroulante = '<label>Choix des couleurs : <select id="monselect">';
		for (let color in liste) {
			listeDeroulante += '<option value="' + liste[color] + '">' + liste[color] + '</option>';
		}
		return listeDeroulante + '</select></label>'; // Retourne du code HTML d'une liste déroulante
	} else {
		return "Couleur : " + liste; // Retourne du texte (ex : Couleur : Bleu)
	}
}

function affichagePrix(nombre) { // affichagePrix(2001) renvoie "20,01 €"
	let centimes = nombre % 100; // Reste de la divion par 100 pour récupérer les centimes
	let unites = Math.trunc(nombre / 100); // Partie entière de la divion par 100 pour récupérer les unités
	if (centimes < 10) { // Affiche un 0 avant le chiffre des centimes
		return unites + "," + "0" + centimes + " €";
	} else {
		return unites + "," + centimes + " €";
	}
}

function affichageProduit(response, i, complement = "") { // response = objet, i = index, complement = code html pour l'ajout de bouton par ex => retourne du code HTML pour les cards bootstrap
	if (complement === "") { // Pour la page index
		return '<div class="col-12 col-md-4"><div class="card shadow anim-opacity-scale"><img class="card-img-top" src="' + response[i].imageUrl + '" alt="' + response[i].name + '"><div class="card-body"><h2 class="card-title h5">' + response[i].name + '</h2><p class="card-text">' + response[i].description + '</p><p class="card-text font-weight-bold">Prix : ' + affichagePrix(response[i].price) + '</p><a class="stretched-link" href="produit.html?id=' + response[i]._id + '"></a></div></div></div>'
	} else { // Pour la page produit => complement = <button>..."
		return '<div class="col-12 col-lg-8"><div class="card shadow"><img class="card-img-top" src="' + response[i].imageUrl + '" alt="' + response[i].name + '"><div class="card-body"><h2 class="card-title">' + response[i].name + '</h2><p class="card-text">' + response[i].description + '</p><p class="card-text font-weight-bold">Prix : ' + affichagePrix(response[i].price) + '</p>' + complement + '</div></div></div>'
	}
};