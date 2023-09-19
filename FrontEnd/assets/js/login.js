// Sélection des éléments HTML
const inputEmail = document.querySelector('input[type="email"]');
const inputPassword = document.querySelector('input[type="password"]');
const form = document.querySelector("form");
let errorDisplay = null;  // Variable pour stocker l'affichage de l'erreur

// Fonction pour afficher le message d'erreur
function displayError(errorMessage) {
    // Supprime le message d'erreur précédent s'il existe
    if (errorDisplay) {
        errorDisplay.remove();
        errorDisplay = null;
    }

    const pError = document.createElement('p');
    pError.innerText = errorMessage;
    pError.classList.add('error');
    form.appendChild(pError);
    errorDisplay = pError;
}

// Écouteur d'événement pour le soumission du formulaire
form.addEventListener("submit", (e) => {
    e.preventDefault(); // Empêche la soumission du formulaire par défaut

    // Récupération des valeurs des champs
    const formData = {
        email: inputEmail.value,
        password: inputPassword.value
    };

    // Vérification de la valeur des champs
    if (formData.email === "" || formData.password === "") {
        displayError('⚠ Veuillez saisir correctement les identifiants');
        return;  // Stopper l'exécution si les champs sont vides
    }

    // Envoi d'une requête POST vers l'URL
    fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
    })
        .then((response) => {
            // Vérification de la réponse HTTP
            if (response.ok) {
                return response.json();
            } else {
                displayError('✖ Les identifiants sont invalides');
                throw new Error('Identifiants invalides');
            }
        })

        // Si des données sont renvoyées, stocke le token dans sessionStorage
        .then((data) => {
            if (data) {
                sessionStorage.setItem("token", data.token);
                // Redirige l'utilisateur sur la home page
                window.location.href = "index.html";
            }
        })
        .catch((error) => {
            console.error('Une erreur s\'est produite', error);
        });
});