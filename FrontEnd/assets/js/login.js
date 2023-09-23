/* 1. Déclaration des variables globales (RAS) */


/* 2. Récupération des composants HTML */
const form = document.querySelector('form')
const inputEmail = document.querySelector('input[type="email"]')
const inputPassword = document.querySelector('input[type="password"]')

/* 3. Déclaration des fonctions essentielles */
function displayError(errorMessage) {
  // Récupération d'un éventuel message déjà affiché
  let pError = document.querySelector('.error')

  if (pError) {
    // Modifier le message d'erreur s'il existe
    pError.innerText = errorMessage
    pError.classList.add('error-blink'); // Ajoute la classe pour l'effet de clignotement
  } else {
    // Créer le message d'erreur s'il n'existe pas
    pError = document.createElement('p')
    pError.classList.add('error', 'error-blink'); // Ajoute la classe pour l'effet de clignotement
    pError.classList.add('error')
    pError.innerText = errorMessage
    form.appendChild(pError)
  }

  // Retire la classe après un certain temps (par exemple, 3 secondes)
  setTimeout(() => {
    pError.classList.remove('error-blink');
  }, 1500);
}

/* 4. Séquences de chargement */
form.addEventListener('submit', e => {
  e.preventDefault()

  // Récupération des valeurs des champs
  const formData = {
    email: inputEmail.value,
    password: inputPassword.value
  }

  // Validation des données soumises (non vides)
  if (formData.email === '' || formData.password === '') {// Affichage d'une erreur : champs vides

    displayError('⚠ Veuillez saisir correctement les identifiants')
  } else { // Validation des données soumises (email valide)

    var emailRegExp =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/

    if (!emailRegExp.test(formData.email)) { // Affichage d'une erreur : email invalide

      displayError('⚠ Veuillez saisir une adresse e-mail valide')
    } else { // Envoi de la requête de connexion

      fetch('http://localhost:5678/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })
        .then(response => {
          if (response.ok) {
            // On extrait les données de la réponse
            return response.json()

          } else {
            if (response.status === 404) {
              // Affichage d'une erreur : utilisateur non trouvé
              displayError("✖ Cette adresse e-mail n'existe pas !")
              throw new Error('Utilisateur non trouvé')

            } else if (response.status === 401) {
              // Affichage d'une erreur : mot de passe incorrect
              displayError("✖ Votre mot de passe est incorrect !")
              throw new Error('Mot de passe incorrect')

            }
          }
        })
        .then(data => {
          console.log(data)

          // Stockage du token en LocalStorage
          localStorage.setItem('token', data.token)

          // Redirection vers la page d'accueil
          window.location.href = './'
        })
        .catch((error) => {
          // Unique cas où la réponse n'arriverait jamais (backend non connecté)
          console.log(error)
        })
    }
  }
})
