let niveau = 1;
let produits;
let produitCourant;
let tempsRestant = calculerTempsRestant();
let chronoTimeout;

// Charger les produits depuis le fichier JSON
fetch('objets.json')
    .then(response => response.json())
    .then(data => {
        produits = data;
        choisirProduitAleatoire();
        actualiserInterface();
        actualiserChrono();
    })
    .catch(error => console.error('Erreur lors du chargement du fichier JSON:', error));

// choisir un produit aléatoirement
function choisirProduitAleatoire() {
    produitCourant = produits[Math.floor(Math.random() * produits.length)];
}


// interface dynamique
function actualiserInterface() {
    document.getElementById('nomProduit').innerHTML = `Produit : ${produitCourant.nom}`;
    document.getElementById('imageProduit').src = produitCourant.image;
    document.getElementById('niveau').innerHTML = niveau;
}

function calculerTempsRestant() {
    return 180 + (niveau - 1) * 45;
}

// déterminer si le prix est bon ou pas
function deviner() {
    const guess = document.getElementById('guessInput').value;

    if (guess == produitCourant.prix) {
        document.getElementById('message').innerHTML = `Félicitations! Vous avez deviné le prix exact du ${produitCourant.nom}!`;
        clearTimeout(chronoTimeout);
        passerAuNiveauSuivant();
    } else if (guess < produitCourant.prix || guess === '') {
        document.getElementById('message').innerHTML = 'Le prix est plus élevé. Essayez encore!';
        tempsRestant -= 10;
    } else {
        document.getElementById('message').innerHTML = 'Le prix est plus bas. Essayez encore!';
        tempsRestant -= 10;
    }
    actualiserChrono();
}

// enchainement de niveau

function passerAuNiveauSuivant() {
    niveau++;
    choisirProduitAleatoire();
    actualiserInterface();
    tempsRestant += 45;
    document.getElementById('guessInput').value = '';
    document.getElementById('guessInput').disabled = false;
    actualiserChrono();
}

// actualisation du chrono
function actualiserChrono() {
    const minutes = Math.floor(tempsRestant / 60);
    const secondes = tempsRestant % 60;
    document.getElementById('chrono').innerHTML = `Temps restant : ${minutes} min ${secondes} sec`;

    if (tempsRestant > 0) {
        tempsRestant--;
        chronoTimeout = setTimeout(actualiserChrono, 1000);
    } else {
        document.getElementById('message').innerHTML = `Désolé, vous avez perdu. Le temps est écoulé pour le niveau ${niveau}!`;
        document.getElementById('guessInput').disabled = true;
        afficherBoutonRecommencer();
    }
}

// recommerncer le jeu
function recommencer() {
    niveau = 1;
    choisirProduitAleatoire();
    actualiserInterface();
    tempsRestant = calculerTempsRestant();
    document.getElementById('niveau').innerHTML = niveau;
    document.getElementById('message').innerHTML = '';
    document.getElementById('guessInput').value = '';
    document.getElementById('guessInput').disabled = false;
    cacherBoutonRecommencer();
    clearTimeout(chronoTimeout);
    actualiserChrono();
}

// cacher ou afficher le bouton recommerncer
function afficherBoutonRecommencer() {
    document.getElementById('boutonRecommencer').classList.remove('hidden');
}

function cacherBoutonRecommencer() {
    document.getElementById('boutonRecommencer').classList.add('hidden');
}

actualiserChrono();