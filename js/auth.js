const db = firebase.firestore()
let currentUser = {}

function login() {
    if (firebase.auth().currentUser) {
        firebase.auth().signOut()
    }
    const check = document.getElementById("checkbox")
    const email = document.getElementById("email").value
    const password = document.getElementById("password").value
    if(check.checked){
        firebase.auth().signInWithEmailAndPassword(email, password)
        .then(() => {
            swal
            .fire({
                icon: "success",
                text: "Login realizado com sucesso",
            })
            .then(() => {
                setTimeout(() => {
                window.location.replace("index.html")
                }, 800)
            })
        })
        .catch((error) => {
            const errorCode = error.code
            switch (errorCode) {
                case "auth/wrong-password":
                    swal.fire({
                    icon: "error",
                    text: "Senha inválida",
                    })
                    break
                case "auth/invalid-email":
                    swal.fire({
                    icon: "error",
                    text: "E-mail inválido",
                    })
                    break
                case "auth/too-many-requests":
                    swal.fire({
                    icon: "error",
                    text: "O acesso a esta conta foi temporariamente desativado devido a muitas tentativas de login com falha. Tente novamente mais tarde. ",
                    })
                    break
                case "auth/user-not-found":
                    swal
                    .fire({
                        icon: "warning",
                        text: "Usuário não encontrado",
                    })
                    break
                default:
                    swal.fire({
                        icon: "error",
                        title: error.code,
                        text: error.message,
                    })
            }
        })
    }else{
        swal.fire({
            icon: 'error',
            text: 'Você precisa ter mais de 12 anos para ter acesso a uma conta!',
        })
    }
}
  
async function recordUserInfo(currentUser){
    await db.collection("profile").doc(currentUser.uid).set({
        uid: currentUser.uid,
        name: currentUser.name,
        email: currentUser.email,
        password: currentUser.password,
        description: currentUser.description,
    })	
}

async function signUp(){
    if (firebase.auth().currentUser) {
        firebase.auth().signOut()
    }
    // signUp config (validação de duas senhas e checkbox)
    const check = document.getElementById("checkbox")
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const password_verification = document.getElementById("password_verification").value;
    // function
    if(password !== password_verification){
        swal.fire({
            icon: 'error',
            text: 'As senhas precisam estar iguais',
        })
    }else if(check.checked){
        firebase.auth().createUserWithEmailAndPassword(email, password)
        .then(() => {
            // userINFO config
            currentUser.uid = firebase.auth().currentUser.uid
            currentUser.name  = name
            currentUser.email = email
            currentUser.password = password
            currentUser.description = 'Você ainda não digitou uma descrição';
            recordUserInfo(currentUser)
            // acesso a nova conta
            swal.fire({     
                icon: "success", 
                text: "Usuário foi criado com sucesso" 
            })
            .then(() => {
                setTimeout(() => {
                window.location.replace("index.html")
                }, 800)
            })
        })
        .catch((error) => {
            const errorCode = error.code
            switch (errorCode) {
                case "auth/weak-password":
                    swal.fire({
                        icon: "error",
                        text: "Senha muito fraca",
                    })
                    break
                case "auth/wrong-password":
                    swal.fire({
                        icon: "error",
                        text: "Senha Invalida",
                    })
                    break
                case "auth/invalid-email":
                    swal.fire({
                        icon: "error",
                        text: "Email Invalido",
                    })
                    break
                case "auth/email-already-in-use":
                    swal.fire({
                        icon: "error",
                        text: "Este Email já está em uso",
                    })
                    break
                default:
                    swal.fire({
                        icon: "error",
                        text: error.message,
                    })
            }
        })
    }else{
        swal.fire({
            icon: 'error',
            text: 'Você precisa ter mais de 12 anos para ter acesso a uma conta!',
        })
    }
}

function logOut() {
    firebase.auth().signOut()
}