const db = firebase.firestore()
const storageRef = firebase.storage().ref();
let currentUser = {}
let currentUsers = []
let num = 0

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
    let logRead = await db
    .collection('reminders')
    .where("uid", "==", uid)
    .get()
    let logNotes = await db
    .collection('notes')
    .where("uid", "==", uid)
    .get()
    let logTasks = await db
    .collection('tasks')
    .where("uid", "==", uid)
    .get()
    let logTasksFinish = await db
    .collection('tasks_finish')
    .where("uid", "==", uid)
    .get()
    let logUsers = await db
    .collection('profile')
    .where("uid", "==", uid)
    .get()
    for (doc of logUsers.docs) {
        currentUser.name = doc.data().name;
        currentUser.email = doc.data().email;
        currentUser.password = doc.data().password;
        currentUser.url_image =  doc.data().url_image;
    }
    let password_ivisible = '######'
    document.getElementById('name_profile').textContent = currentUser.name
    document.getElementById('email_profile').textContent  = currentUser.email
    document.getElementById('password_profile').textContent  = password_ivisible
    document.getElementById('img_profile').src = currentUser.url_image
    document.getElementById('qtd_task').textContent = logTasks.docs.length
    document.getElementById('qtd_finishtask').textContent = logTasksFinish.docs.length
    document.getElementById('qtd_notes').textContent = logNotes.docs.length
    document.getElementById('qtd_reminders').textContent = logRead.docs.length
}

async function saveProfile(){
    swal.fire({
        icon: 'info',
        text: 'em desenvolvimento...'
    })
}

function logOut() {
    firebase.auth().signOut()
}

async function recordUserIMG(url){
    await db.collection("profile").doc(firebase.auth().currentUser.uid).update({
        url_image: url,
        data: new Date(),
    })
    readProfile(firebase.auth().currentUser.uid)
}

function upload_IMG(){
    // file name
    const input = document.getElementById('myfile')
    var file = input.files;
    var file = file[0];
  
    // Upload file and metadata to the object 'images/mountains.jpg'
    var uploadTask = storageRef.child('images_user/' + file.name).put(file);
    
    // Listen for state changes, errors, and completion of the upload.
    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
        (snapshot) => {
            // ...
        },
        (error) => {
            // A full list of error codes is available at
            // https://firebase.google.com/docs/storage/web/handle-errors
            switch (error.code) {
            // ...
            }
        },
        () => {
            // gravar no banco
            uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                recordUserIMG(downloadURL)
            });
        }
    );
}

function hide_show(){
    let password = document.getElementById('password_profile')
    let img = document.getElementById('hide_show_img')
    if( num == 0){
        img.setAttribute('src', 'img/icon/Show.svg')
        password.textContent = currentUser.password
        num = 1
    } else {
        img.setAttribute('src', 'img/icon/Hide.svg')
        password.textContent = '######'
        num = 0
    }

}

window.onload = function(){
    getUser();
}