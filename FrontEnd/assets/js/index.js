////////////////////// CONNECTION ----------------------//
//------------------------------------------------------//
let works
let categories
const token = localStorage.getItem('token');

// Barre d'éditeur
const editingElements = document.querySelectorAll('.editing');
const editElements = document.querySelectorAll('.edit');
const titleProjets = document.querySelector('.title-projets');

if (token) {
    // Token est stocké dans localStorage
    editingElements.forEach(element => {
        element.style.display = 'block';
    });
    editElements.forEach(element => {
        element.style.display = 'block';
    });

    myLink.textContent = 'Logout';
    myLink.addEventListener('click', e => {
        e.preventDefault()
        localStorage.removeItem('token')
        window.location.reload()
    });

    titleProjets.style.marginLeft = '6rem';
} else {
    // Aucun token n'est stocké dans localStorage
    editingElements.forEach(element => {
        element.style.display = 'none';
    });
    editElements.forEach(element => {
        element.style.display = 'none';
    });
    myLink.textContent = 'Login';
}
//------------------------------------------------------//
//------------------------------------------------------//



////////////////////// MODAL ---------------------------//
//------------------------------------------------------//
const modalOverlay = document.querySelector('.modal-opacite')
const modal = document.querySelector('.modal')
const editButtons = document.querySelectorAll('.edit');
const galleryShift = document.querySelector('.gallery-shift');


let galleryCreated = false; // Suivie créa galerie
let optionsCreated = false; // Suivie créa options
//------------------------------------------------------//
//------------------------------------------------------//



////////////////////// MODAL (Galerie photo) -----------//
//------------------------------------------------------//

editButtons.forEach(editButton => {
    editButton.addEventListener('click', e => {

        // Galerie n'a pas encore été créée (modal Galerie photo)
        if (!galleryCreated) {
            works.forEach((work) => {
                // Créer le conteneur d'image
                const imageContainer = document.createElement('div');
                imageContainer.classList.add('image-container');

                // Créer l'image
                const imgGallery = document.createElement('img');
                imgGallery.src = work.imageUrl;
                imgGallery.alt = work.title;
                imgGallery.setAttribute('data-image-id', work.id); // Stocker l'ID dans l'attribut data-image-id

                // Créer les icônes
                const iconContainer = document.createElement('div');
                iconContainer.classList.add('icons');
                const arrowsIcon = document.createElement('i');
                arrowsIcon.classList.add('fas', 'fa-arrows-up-down-left-right');
                const trashIcon = document.createElement('i');
                trashIcon.classList.add('fas', 'fa-trash-can');



                trashIcon.addEventListener('click', async (e) => {
                    e.preventDefault(); // Empêcher le comportement par défaut du lien
                    e.stopPropagation();
                    const imageId = imgGallery.getAttribute('data-image-id');
                    imageContainer.style.display = 'none';

                    // Supprimer l'élément de l'API
                    const response = await deleteImage(imageId);

                    if (response && response.ok) {
                        alert('Image supprimée avec succès !');
                    } else {
                        alert('Erreur lors de la suppression de l\'image.');
                    }
                });


                // Ajout des icônes à leur conteneur
                iconContainer.appendChild(arrowsIcon);
                iconContainer.appendChild(trashIcon);

                // Création le bouton "éditer"
                const btnEditer = document.createElement('p');
                btnEditer.textContent = "éditer";

                // Ajout l'image, les icônes et le bouton "éditer" au conteneur d'image
                imageContainer.appendChild(imgGallery);
                imageContainer.appendChild(iconContainer);
                imageContainer.appendChild(btnEditer);

                // Ajout du conteneur d'image à la galerie
                galleryShift.appendChild(imageContainer);
            });

            galleryCreated = true; // Mise à jour de l'indicateur
        }

        // Afficher les éléments de la modal
        modalOverlay.style.display = 'block';
        modal.style.display = 'block';
        addGallery.style.display = 'block';
        addPhoto.style.display = 'none';
    });
});
//------------------------------------------------------//
//------------------------------------------------------//



////////////////////// MODAL (Ajouter une photo) -------//
//------------------------------------------------------//
const addGallery = document.querySelector('.add-gallery')
const addPhoto = document.querySelector('.add-photo')
const back = document.querySelector('.back')
const closeButtons = document.querySelectorAll('.close')
const btnAdd = document.querySelector('.btn-add')

btnAdd.addEventListener('click', e => {
    e.preventDefault();
    const categoriesSelect = document.getElementById('category')
    categories.forEach((category) => {
        if (!optionsCreated) {
            categories.forEach((category) => {
                if (category.name != 'Tous') {
                    const selectOption = document.createElement('option');
                    selectOption.value = category.id;
                    selectOption.innerText = category.name;
                    categoriesSelect.appendChild(selectOption);
                }
            });
            optionsCreated = true; // Mise à jour de l'indicateur
        }
        modalOverlay.style.display = 'block';
        modal.style.display = 'block';
    })
    addGallery.style.display = 'none';
    addPhoto.style.display = 'block';
})

const previewImage = document.getElementById('selected-image');
const formAdd = document.getElementById('formAdd');
const fileInput = formAdd.querySelector('[name="file"]');
const btnFichier = formAdd.querySelector('.button-fichier');

fileInput.addEventListener('change', evt => {
    evt.preventDefault();
    const [file] = fileInput.files;
    if (file) {
        // Mettez à jour l'image de prévisualisation avec l'image sélectionnée
        const imageUrl = URL.createObjectURL(file);
        previewImage.src = imageUrl;
        previewImage.style.display = 'flex';
        btnFichier.style.display = 'none';
    }
});

// btn close & retour
closeButtons.forEach(closeButton => {
    closeButton.addEventListener('click', e => {
        e.preventDefault()
        // Réinitialise le formulaire en utilisant la méthode reset()
        formAdd.reset();
        // Réinitialise la prévisualisation de l'image
        previewImage.style.display = 'none';
        btnFichier.style.display = 'block';

        modalOverlay.style.display = 'none'
        modal.style.display = 'none'
    })
})

back.addEventListener('click', e => {
    e.preventDefault();
    // Réinitialise le formulaire en utilisant la méthode reset()
    formAdd.reset();
    // Réinitialise la prévisualisation de l'image
    previewImage.style.display = 'none';
    btnFichier.style.display = 'block';

    addGallery.style.display = 'block';
    addPhoto.style.display = 'none';
});
//------------------------------------------------------//
//------------------------------------------------------//



//////////// Ajout des works -----------------------------//
//------------------------------------------------------//
const btnValid = document.querySelector('.btn-valid');

// Ajout de l'écouteur d'événement dans la fonction asynchrone
btnValid.addEventListener('click', async e => {
    e.preventDefault(); // Empêche le comportement par défaut du bouton

    const titleInput = formAdd.querySelector('#title');
    const fileInput = formAdd.querySelector('#file');

    const categorySelect = document.getElementById('category');
    const categoryId = categorySelect.value

    const titleValue = titleInput.value;
    const file = fileInput.files[0];

    if (titleValue.trim() === '' || !file || !file.type.startsWith('image/')) {
        alert("Veuillez remplir tous les champs correctement.");
    }

    // Créer un nouvel objet pour l'image
    const newImage = {
        title: titleValue,
        imageUrl: URL.createObjectURL(file)
    };

    // Construction de FormData
    const formData = new FormData();
    formData.append('title', newImage.title);
    formData.append('category', categoryId);
    formData.append('image', file);

    // Envoyer la requête à l'API
    try {
        const response = await fetch("http://localhost:5678/api/works", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        });

        if (response.ok) {
            alert("Image envoyée avec succès !");
            // Réinitialisation du formulaire

            // Réinitialisation de la prévisualisation de l'image
            previewImage.style.display = "none";
            btnFichier.style.display = "block";
            return false;
        } else {
            alert("Erreur lors de l'envoi de l'image à l'API.");
        }
    } catch (error) {
        console.error("Une erreur s'est produite :", error);
        alert("Une erreur s'est produite lors de l'envoi de l'image.");
    }
    // return false;
});







//------------------------------------------------------//
//------------------------------------------------------//



////////////////////// Galerie & Categories ------------//
//------------------------------------------------------//
const galleryContainer = document.querySelector(".gallery");
const categoriesContainer = document.querySelector(".categories");

// Requête à l'API works
fetch("http://localhost:5678/api/works")
    .then((response) => response.json())
    .then((data) => {
        works = data;
        createWorks(data); // Appel de la fonction pour créer les éléments de galerie
        console.log(data);


    });

function createWorks(works) {
    works.forEach((work) => {
        //Création les élément figure et img
        const figureContainer = document.createElement("figure");
        const imageElement = document.createElement("img");
        const titleElement = document.createElement("figcaption");

        //Définition de la propriété src et alt sur l'élément <img>
        imageElement.src = work.imageUrl;
        imageElement.alt = work.title;
        //Définition du titre dans l'élément <figcaption>
        titleElement.innerHTML = work.title;

        //<img>(imageElement) enfant de <figure>(figureConteiner)
        figureContainer.appendChild(imageElement);
        //<figure>(figureContainer) enfant de <gallery>(galleryContainer)
        galleryContainer.appendChild(figureContainer);
        // <figcaption>(titleElement) enfant de <figure>(figureContainer)
        figureContainer.appendChild(titleElement);
        // Ajout d'un attribut data-id à l'élément figure pour stocker l'ID du travail
        figureContainer.setAttribute("data-id", work.categoryId);
    });
}

// Requête à l'API categories
fetch("http://localhost:5678/api/categories")
    .then((response) => response.json())
    .then((data) => {
        categories = data
        createCategories(data);
    });

function createCategories(categories) {
    categories.unshift({ name: "Tous" });
    console.log(categories);

    categories.forEach((categorie) => {
        // Création des <button>
        const btnCategories = document.createElement("button");
        // Définition des noms des categories
        btnCategories.innerHTML = categorie.name;

        btnCategories.classList.add("categorie-btn");
        categoriesContainer.appendChild(btnCategories);

        if (categorie.id === 1) {
            btnCategories.addEventListener("click", () => {
                // Parcoure tous les éléments figure dans la galerie
                galleryContainer.querySelectorAll("figure").forEach((figure) => {
                    // Récupére l'ID du travail stocké dans l'attribut data-id
                    const categoryId = parseInt(figure.getAttribute("data-id"));

                    // Si l'ID du travail est différent de 1, masque l'élément figure
                    if (categoryId !== 1) {
                        figure.style.display = "none";
                    } else {
                        // Sinon, affiche l'élément figure
                        figure.style.display = "block";
                    }
                });
            });
        }

        if (categorie.id === 2) {
            btnCategories.addEventListener("click", () => {
                galleryContainer.querySelectorAll("figure").forEach((figure) => {
                    const categoryId = parseInt(figure.getAttribute("data-id"));

                    if (categoryId !== 2) {
                        figure.style.display = "none";
                    } else {
                        figure.style.display = "block";
                    }
                });
            });
        }

        if (categorie.id === 3) {
            btnCategories.addEventListener("click", () => {
                galleryContainer.querySelectorAll("figure").forEach((figure) => {
                    const categoryId = parseInt(figure.getAttribute("data-id"));

                    if (categoryId !== 3) {
                        figure.style.display = "none";
                    } else {
                        figure.style.display = "block";
                    }
                });
            });
        }

        if (categorie.name === "Tous") {
            btnCategories.addEventListener("click", () => {
                // Parcoure tous les éléments figure dans la galerie
                galleryContainer.querySelectorAll("figure").forEach((figure) => {
                    // Affiche tous les éléments figure
                    figure.style.display = "block";
                });
            });
        }
    });
}
//------------------------------------------------------//
//------------------------------------------------------//

// Fonction pour supprimer une image de la galerie
const deleteImage = async (id) => {
    try {
        const response = await fetch(`http://localhost:5678/api/works/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        return response;
    } catch (error) {
        console.error('Une erreur s\'est produite :', error);
        alert('Une erreur s\'est produite lors de la suppression de l\'image.');
    }

};