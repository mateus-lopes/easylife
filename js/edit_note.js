// config 
let db_notes;
let id_user;
let key_note;     
let edit_title = document.getElementById('edit_note_title');
let edit_text = document.getElementById('edit_note_text');

async function infoNote(id){
    key_note = (await db.collection("profile").doc(id).get()).data().key_note
    if(key_note != false){
        db_notes = await db.collection("notes").doc(key_note).get()
        let title = db_notes.data().title
        let text = db_notes.data().text
        upNote(title, text)
    } else {
        swal.fire({
            icon: "error",
            text: "Você não selecionou uma nota para editar",
        })
        .then(() => {
            setTimeout(() => {
                window.location.replace("notes.html")
            }, 200)
        })
    }
}

async function upNote(title, text){
    edit_title.value = title;
    edit_text.value = text;
}

async function saveNote(){
    if (edit_title && edit_title.value != ' ') {
        await db.collection("notes").doc(key_note).update({
            title: edit_title.value,
            text: edit_text.value,
        })
        await db.collection("profile").doc(firebase.auth().currentUser.uid).update({
            key_note: false,
        })
        swal.fire({
            icon: "success",
            text: "Salvo com sucesso",
        })
        .then(() => {
            setTimeout(() => {
                window.location.replace("notes.html")
            }, 200)
        })
    } else {
        swal.fire({
            icon: "error",
            text: "Você não preencheu os campos corretamente",
        })
    }
}

window.onload = function(){
    getUser('editNote')
}