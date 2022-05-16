const db = firebase.firestore()
let currentUser = {}
let currentUsers = []

// LOGIN CONFIG
async function getUser() {
    firebase.auth().onAuthStateChanged((user) => {
        if (!user) {
            swal.fire({
            icon: "error",
            title: "Conexão Expirada",
            })
            .then(() => {
            setTimeout(() => {
                window.location.replace("login_profile.html")
            }, 500)
            })
        } else {
            currentUser.uid = user.uid
            console.log(currentUser.uid)
            setTimeout(function() {
                $("body").addClass("fadeIn")
            });
            setTimeout(function() {
                $(".loading").addClass("hidden")
            });
            readProfile(currentUser.uid)
        }
    })
}

// NAV CONIFG
function ToggleNav(toggle){
    toggle.classList.toggle("bigIn")
    toggle.classList.toggle("bigOut")
}

nav = document.querySelector('#nav_id')
nav_content = document.querySelector('#content_nav')
nav.addEventListener('click', function(){ToggleNav(nav_content)})

// profile config

async function readProfile(uid){
    let logUsers = await db
    .collection('profile')
    .where("uid", "==", uid)
    .get()
    for (doc of logUsers.docs) {
        currentUser.name = doc.data().name;
        currentUser.email = doc.data().email;
        currentUser.password = doc.data().password;
    }
    document.getElementById('name_profile').value = currentUser.name
    document.getElementById('email_profile').value = currentUser.email
    document.getElementById('password_profile').value = currentUser.password
}

async function saveProfile(){
    const name = document.getElementById('name_profile').value 
    const email = document.getElementById('email_profile').value 
    const password = document.getElementById('password_profile').value 
    await db.collection('profile').doc(firebase.auth().currentUser.uid).update({
        name: name,
        email: email,
        password: password,
    })
    swal.fire({
        icon: 'success',
        text: 'Seu perfil foi salvo com sucesso!'
    })
}

function logOut() {
    firebase.auth().signOut()
}

// teste de imagem de perfil
function img_profile(){
    document.getElementById('img_profile').src = 'D:/Projetos/projetos/2022/easyLife/img/profile_active.png'; 
}

window.onload = function(){
    getUser();
}

