// Sélectionne les éléments galerie et categories
const galleryContainer=document.querySelector('#portfolio .gallery')
const categoriesContainer=document.querySelector('#portfolio .categories')

// Requête à l'API works
fetch('http://localhost:5678/api/works')
.then(response => response.json())
.then(works => { 
    createWorks(works)
})

function createWorks(works){
    works.forEach(work => {
        //Création les élément figure et img
        const figureContainer=document.createElement('figure')
        const imageElement=document.createElement('img')
        const titleElement=document.createElement('figcaption')

        //Définition de la propriété src et alt sur l'élément <img>
        imageElement.src=work.imageUrl
        imageElement.alt=work.title
        //Définition du titre dans l'élément <figcaption>
        titleElement.innerHTML=work.title

        //<img>(imageElement) enfant de <figure>(figureConteiner)
        figureContainer.appendChild(imageElement)
        //<figure>(figureContainer) enfant de <gallery>(galleryContainer)
        galleryContainer.appendChild(figureContainer)
        // <figcaption>(titleElement) enfant de <figure>(figureContainer)
        figureContainer.appendChild(titleElement)
    });
}

// Requête à l'API categories
fetch('http://localhost:5678/api/categories')
.then(response => response.json())
.then(categories => { 

    // Ajoute de bouton supplémentaire à la liste des catégories
    const allBtn = { name: 'Tous' };
    categories.unshift(allBtn);

    createCategories(categories)
})

function createCategories(categories){
    categories.forEach(categorie=>{
        // Création des <button>
        const btnCategories=document.createElement('button')

        // Définition des noms des categories
        btnCategories.innerHTML=categorie.name

        // Application du style css
        btnCategories.classList.add('categorie-btn');
        
        // <button>(btnCategories) enfant de <div class="categories>"(categoriesContainer)
        categoriesContainer.appendChild(btnCategories);
    })
}