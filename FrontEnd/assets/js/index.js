/***** 1. Déclaration des variables globales *****/

let works
let categories
let galleryCreated = false // Suivie indicateur création galerie
let optionsCreated = false // Suivie indicateur création options

const token = localStorage.getItem('token')// stock le token d'authentification récupéré du localStorage.


/***** 2. Récupération des composants HTML *****/

const galleryContainer = document.querySelector('.gallery') // Galerie home page
const categoriesContainer = document.querySelector('.categories')

/////// Affichage éditeur:
const editingElements = document.querySelectorAll('.editing') // Barre de l'éditeur
const editButtons = document.querySelectorAll('.edit') // btn "modifié"

/////// Header section projet :
const titleHeader = document.querySelector('.title-header')
const titleProjets = document.querySelector('.title-projets')

/////// Affichage des modales :
const modalOverlay = document.querySelector('.modal-opacite')//bg opacité 
const modal = document.querySelector('.modal')
const back = document.querySelector('.back')
const closeButtons = document.querySelectorAll('.close')

/////// Gestion de la galerie :
const galleryShift = document.querySelector('.gallery-shift')// Galerie modale

/////// Ajout d'un Travail : 
const addGallery = document.querySelector('.add-gallery')
const addPhoto = document.querySelector('.add-photo')
const btnAdd = document.querySelector('.btn-add')
const previewImage = document.getElementById('selected-image')
const formAdd = document.getElementById('formAdd')
const fileInput = formAdd.querySelector('[name="file"]')
const btnFichier = formAdd.querySelector('.button-fichier')
const btnValid = document.querySelector('.btn-valid');
const titleInput = formAdd.querySelector('#title');


/*****  3. Déclaration des fonctions essentielles *****/

/////// Affichage des Travaux sur la page d'accueil :
function createWorks(works) {
  galleryContainer.innerHTML = ''// supprime la galerie (MàJ)
  works.forEach(work => {
    //Création les élément figure et img
    const figureContainer = document.createElement('figure')
    const imageElement = document.createElement('img')
    const titleElement = document.createElement('figcaption')

    //Définition de la propriété src et alt sur l'élément <img>
    imageElement.src = work.imageUrl
    imageElement.alt = work.title

    //Définition du titre dans l'élément <figcaption>
    titleElement.innerHTML = work.title

    // Structuration de l'élément
    figureContainer.appendChild(imageElement)
    galleryContainer.appendChild(figureContainer)
    figureContainer.appendChild(titleElement)
    figureContainer.setAttribute('data-id', work.categoryId)
  })
}

/////// Affichage des Catégories sur la page d'accueil :
function createCategories(categories) {
  // Ajout du filtre pour afficher les travaux de toutes les catégories
  categories.unshift({ id: 0, name: 'Tous' })

  // Boucle sur les catégories
  categories.forEach(categorie => {
    // Création des boutons et ajout sur la page
    const btnCategory = document.createElement('button')
    btnCategory.classList.add('categorie-btn')
    if (parseInt(categorie.id) === 0) {
      btnCategory.classList.add('active')
    }
    btnCategory.dataset.id = categorie.id
    btnCategory.innerHTML = categorie.name
    categoriesContainer.appendChild(btnCategory)

    // Clic sur un filtre de Catégorie
    btnCategory.addEventListener('click', event => {
      // Désactivation visuelle des autres boutons
      categoriesContainer.querySelectorAll('.categorie-btn').forEach(button => {
        button.classList.remove('active')
      })

      // Activation visuelle du bouton
      event.target.classList.add('active')

      // Récupération de la catégorie sélectionnée
      const categoryId = event.target.dataset.id

      if (parseInt(categoryId) === 0) {
        // On affiche tous les Travaux
        galleryContainer.querySelectorAll('figure').forEach(figure => {
          figure.style.display = 'block'
        })
      } else {
        // On affiche les Travaux correspondant à l'id de la catégorie
        galleryContainer.querySelectorAll('figure').forEach(figure => {
          if (figure.dataset.id === categoryId) {
            figure.style.display = 'block'
          } else {
            figure.style.display = 'none'
          }
        })
      }
    })
  })
}

/////// Affichage de la Modal :
editButtons.forEach(editButton => { // Gestion de la galerie (&suppr des travaux)
  editButton.addEventListener('click', e => {
    galleryShift.innerHTML = ''// supprime la galerie (MàJ)

    works.forEach(work => {// Eléments de la galerie dans la modal
      //Création des éléments de la galerie
      const iconContainer = document.createElement('div')
      const imageContainer = document.createElement('div')
      const imgGallery = document.createElement('img')
      const arrowsIcon = document.createElement('i')
      const trashIcon = document.createElement('i')
      const btnEditer = document.createElement('p')

      // Structuration de l'élément
      galleryShift.appendChild(imageContainer)
      imageContainer.appendChild(imgGallery)
      imageContainer.appendChild(iconContainer)
      imageContainer.appendChild(btnEditer)
      iconContainer.appendChild(arrowsIcon)
      iconContainer.appendChild(trashIcon)

      // Configuration visuels des éléments
      imageContainer.classList.add('image-container')
      iconContainer.classList.add('icons')
      arrowsIcon.classList.add('fas', 'fa-arrows-up-down-left-right')
      trashIcon.classList.add('fas', 'fa-trash-can')
      btnEditer.textContent = 'éditer'

      // Affichage de la modal
      modalOverlay.style.display = 'block'
      modal.style.display = 'block'
      addGallery.style.display = 'block'
      addPhoto.style.display = 'none'

      imgGallery.src = work.imageUrl // Définit la source de l'image
      imgGallery.alt = work.title // Définit le texte alternatif 
      imgGallery.setAttribute('data-image-id', work.id) // Stocker l'ID dans l'attribut data-image-id  

      // Suppr du travail
      trashIcon.addEventListener('click', async e => {
        e.preventDefault();
        e.stopPropagation();

        const imageId = imgGallery.getAttribute('data-image-id');
        const image = document.querySelector(`[data-image-id="${imageId}"]`);
        imageContainer.style.display = 'none';

        const confirmed = window.confirm('Voulez-vous vraiment supprimer cette image ?');

        if (confirmed) {
          const response = await deleteImage(imageId);

          if (response && response.ok) {
            alert('Image supprimée avec succès !');

            // Supprimer l'image une fois que la suppression est confirmée
            image.remove();

            fetch('http://localhost:5678/api/works')
              .then(response => response.json())
              .then(data => {
                works = data;
                createWorks(data);
              });
          } else {
            alert("Erreur lors de la suppression de l'image.");
          }
        } else {
          // Si l'utilisateur clique sur "Annuler", réafficher l'image
          imageContainer.style.display = 'block';
        }
      });


    })
  })
});

///// Boutons de la modale :
btnAdd.addEventListener('click', e => { //  btn ajout et configuration des options de catégorie.
  e.preventDefault()
  const categoriesSelect = document.getElementById('category')

  categories.forEach(category => {
    if (!optionsCreated) {
      categories.forEach(category => {
        if (category.name != 'Tous') {
          const selectOption = document.createElement('option')
          selectOption.value = category.id
          selectOption.innerText = category.name
          categoriesSelect.appendChild(selectOption)
        }
      })
      optionsCreated = true // MàJ de l'indicateur
    }
    modalOverlay.style.display = 'block'
    modal.style.display = 'block'
  })
  addGallery.style.display = 'none'
  addPhoto.style.display = 'block'
})
back.addEventListener('click', e => { //Retour modale
  e.preventDefault()

  // Réinitialise la couleur et l'état du bouton "Valider"
  btnValid.style.backgroundColor = '';
  btnValid.disabled = false;
  resetFormAndPreview
  addGallery.style.display = 'block'
  addPhoto.style.display = 'none'
})
closeButtons.forEach(closeButton => { //Quitter modale
  closeButton.addEventListener('click', e => {
    e.preventDefault()
    resetFormAndPreview
    modalOverlay.style.display = 'none'
    modal.style.display = 'none'
  })
})

/////Formulaire d'ajout de Travail :
// Ajout des écouteurs d'événements "input" aux champs
titleInput.addEventListener('input', checkFormFields);
fileInput.addEventListener('input', checkFormFields);

function checkFormFields() {// Vérifier les champs du formulaire
  const titleValue = titleInput.value;// Récupére les champs, stocke dans une variable
  const file = fileInput.files[0]; //  Récupère le fichier sélectionné

  // Réinitialisez la couleur et l'état du bouton
  btnValid.style.backgroundColor = '';
  btnValid.disabled = false;

  // Vérifiez si les deux champs sont remplis
  if (titleValue.trim() !== '' && file && file.type.startsWith('image/')) {
    btnValid.style.backgroundColor = '#1D6154'; // Active btn vert
    btnValid.disabled = false;
  }
}
fileInput.addEventListener('change', evt => {//Visualisation du travaux 
  evt.preventDefault()
  const [file] = fileInput.files //stock de l'img dans la variable file

  if (file) {// MàJ visualisation de l'img
    const imageUrl = URL.createObjectURL(file)
    previewImage.src = imageUrl
    previewImage.style.display = 'flex'
    btnFichier.style.display = 'none'
  }
})
const resetFormAndPreview = () => {// Fonction pour réinitialiser le formulaire et masquer les éléments de prévisualisation
  formAdd.reset();
  previewImage.style.display = 'none';
  btnFichier.style.display = 'block';
};


/*****  4. Séquences de chargement *****/

///// Gestion de l'Affichage en Fonction de l'Authentification :
if (token) { // Token est stocké dans localStorage
  [...editingElements, ...editButtons].forEach(element => {
    element.style.display = 'block';
  });
  myLink.textContent = 'Logout' // Modifie le texte du lien

  myLink.addEventListener('click', e => {
    e.preventDefault()
    // Supprime des donner stockés dans le localStorage
    localStorage.removeItem('token')
    localStorage.removeItem('userId')

    // Actualise le navigateur
    window.location.reload()
  })

  titleProjets.style.marginLeft = '6rem'
  categoriesContainer.style.display = 'none'

} else { // Aucun token n'est stocké dans localStorage
  [...editingElements, ...editButtons].forEach(element => {
    element.style.display = 'none';
  });
  myLink.textContent = 'Login' // Modifie le texte du lien
}

///// Récupération des Travaux depuis l'API :
fetch('http://localhost:5678/api/works')
  .then(response => {
    if (response.ok) {
      return response.json()
    } else {
      console.log(response)
    }
  })
  .then(data => {
    works = data
    createWorks(data)
  })
  .catch(error => {
    console.log(error)
  })

///// Récupération des Catégories depuis l'API :
fetch('http://localhost:5678/api/categories')
  .then(response => {
    if (response.ok) {
      return response.json()
    } else {
      console.log(response)
    }
  })
  .then(data => {
    categories = data
    createCategories(data)
  })
  .catch(error => {
    console.log(error)
  })

///// Soumission du formulaire d'ajout de Travail :
btnValid.addEventListener('click', async (e) => {
  e.preventDefault();

  const titleInput = formAdd.querySelector('#title');
  const fileInput = formAdd.querySelector('#file');
  const categorySelect = document.getElementById('category');
  const categoryId = categorySelect.value;
  const titleValue = titleInput.value;
  const file = fileInput.files[0];

  if (titleValue.trim() === '' || !file || !file.type.startsWith('image/')) {
    alert('Veuillez remplir tous les champs correctement.');
    return;  // Arrête l'exécution si les conditions ne sont pas remplies
  }

  // Création d'un nouvel objet pour l'image
  const newImage = {
    title: titleValue,
    imageUrl: URL.createObjectURL(file)
  };

  // Construction de FormData
  const formData = new FormData();
  formData.append('title', newImage.title);
  formData.append('category', categoryId);
  formData.append('image', file);

  // Requête d'ajout du Travail (Fetch)
  try {
    const response = await fetch('http://localhost:5678/api/works', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData
    });

    if (response.ok) {
      alert('Image envoyée avec succès!');

      formAdd.reset();

      previewImage.style.display = 'none';
      btnFichier.style.display = 'block';
      btnValid.style.backgroundColor = '';
      btnValid.disabled = false;

      fetch('http://localhost:5678/api/works') // GET MàJ img
        .then(response => response.json())
        .then(data => {
          works = data;
          createWorks(data);
          modalOverlay.style.display = 'none';
          modal.style.display = 'none';
        });
    } else {
      alert("Erreur lors de l'envoi de l'image à l'API.");
    }
  } catch (error) {
    console.error("Une erreur s'est produite :", error);
    alert("Une erreur s'est produite lors de l'envoi de l'image.");
  }
});

///// Requête de suppresion du Travail (Fetch) :
const deleteImage = async id => {
  try {
    const response = await fetch(`http://localhost:5678/api/works/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    return response
  } catch (error) {
    console.error("Une erreur s'est produite :", error)
    alert("Une erreur s'est produite lors de la suppression de l'image.")
  }
}