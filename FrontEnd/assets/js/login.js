let email = "";
let password = "";

const inputEmail = document.querySelector('input[type="email"]');
const inputPassword = document.querySelector('input[type="password"]');
const form = document.querySelector("form");


inputEmail.addEventListener("input", (e) => {
    email = e.target.value;
});

inputPassword.addEventListener("input", (e) => {
    password = e.target.value;
});

form.addEventListener("submit", (e) => {
    e.preventDefault();
    console.log(password);
    if (email !== "") {
        if (password !== "") {
            const formData = {
                email: form.email.value,
                password: form.password.value,
            };

            fetch("http://localhost:5678/api/users/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            })
                .then((response) => {
                    if (response.ok) {
                        return response.json();
                    } else {
                        const pError = document.createElement('p')
                        pError.innerText = 'Les indentifiant son invalide'
                        pError.classList.add('error')
                        form.appendChild(pError)
                    }
                })
                .then((data) => {
                    if (data) {
                        localStorage.setItem("token", data.token);
                        window.location.href = "index.html";
                    }
                })
                .catch((error) => {
                    console.error(error);
                });

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
