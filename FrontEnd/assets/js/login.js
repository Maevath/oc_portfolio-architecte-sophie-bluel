// Déclaration des variables
let email = "";
let password = "";

// Sélection des éléments HTML
const inputEmail = document.querySelector('input[type="email"]');
const inputPassword = document.querySelector('input[type="password"]');
const form = document.querySelector("form");

// Écouteur d'événement pour le champs de e-mail
inputEmail.addEventListener("input", (e) => {
    email = e.target.value; // MàJ la variable email
});

inputPassword.addEventListener("input", (e) => {
    password = e.target.value;
});

// Écouteur d'événement pour le soumission du formulaire
form.addEventListener("submit", (e) => {
    e.preventDefault(); // Empêche la soumission du formulaire par défaut
    // Vérification de la valeur des champs
    if (email !== "") {
        if (password !== "") {
            const formData = {
                email: form.email.value,
                password: form.password.value,
            };

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
                        const pError = document.createElement('p')
                        pError.innerText = 'Les indentifiant son invalide'
                        pError.classList.add('error')
                        form.appendChild(pError)
                        throw new Error('Identifiants invalides');
                    }
                })

                // Si des données sont renvoyées, stockez le token dans sessionStorage
                .then((data) => {
                    if (data) {
                        sessionStorage.setItem("token", data.token);
                        // Redirigez l'utilisateur
                        window.location.href = "index.html";
                    }
                })
                .catch((error) => {
                    console.error(error);
                });

            // Si les champs sont vide : message d'erreur
        } else {
            const pError = document.createElement('p')
            pError.innerText = 'Veuillez saisir votre mot de passe'
            pError.classList.add('error')
            form.appendChild(pError)
        }
    } else {
        const pError = document.createElement('p')
        pError.innerText = 'Veuillez saisir votre email'
        pError.classList.add('error')
        form.appendChild(pError)
    }
});
