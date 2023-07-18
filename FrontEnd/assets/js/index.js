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
