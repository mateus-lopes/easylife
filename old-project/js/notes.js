// config banco de dados
let db_read;
let notes;
let id_user;
// config filtro
let filter_id = document.getElementById('filter_id').innerText;
let filter_consult = document.getElementById('filter_consult');
// config filtro por data
let current_data = new Date;

function createButtons(note, id_note){
    const div_buttons = document.createElement('div');
    const btn_edit = document.createElement('a');
    const btn_del = document.createElement('a');
    // set btn-edit
    btn_edit.setAttribute('class', 'icon-editTask2 mr-2');
    btn_edit.setAttribute('id', id_note);
    btn_edit.setAttribute('onclick', `editNote("${note.id}")`);

    // set btn-del
    btn_del.setAttribute('class', 'icon-deleteTask');
    btn_del.setAttribute('onclick', `deleteNote("${note.id}")`);
    btn_del.setAttribute('href', '#');
    div_buttons.appendChild(btn_del);
    div_buttons.appendChild(btn_edit);
    return div_buttons
}

function renderNotes(){
    let taskList = document.getElementById("note_list")
    taskList.innerHTML = '' 
    id_note = 1000;
    for(let task of notes){
        id_note++;
        // criando as contantes
        const newTask = document.createElement('li');
        const newTask_content = document.createElement('a');
        
        // atribuindo classes a cada tag
        newTask.setAttribute('class', 'task-li my-1 task-div');
        newTask.setAttribute('id', id_note);
        newTask_content.setAttribute('class', 'task-content nav-link text-dark');
        
        // contruindo a li
        newTask.appendChild(newTask_content);
        newTask_content.appendChild(document.createTextNode(task.title))
        newTask.appendChild(createButtons(task, id_note));
        taskList.appendChild(newTask)
    }
}


async function readNotes(x, id){
    await db.collection("profile").doc(firebase.auth().currentUser.uid).update({
        key_note: false,
    })
    if (x){filter_id = x}
    if (id){id_user = id}
    notes = []
    db_notes = await db
    .collection('notes')
    .where('uid', '==', id)
    .get()
    for (doc of db_notes.docs) {
        notes.push({
            id: doc.id,
            title: doc.data().title,
            text: doc.data().text,
            data: doc.data().data,
        })
    }
    switch (filter_id) {
        case '1':
            notes = notes.sort(
                function (a, b) {
                    return (a.title > b.title) ? 1 : ((b.title > a.title) ? -1 : 0);
                }
            );
            filter_consult.innerHTML = 'Ordem Alfabetica ⇓'
            break
        case '2':
            notes = notes.sort(
                function (a, b) {
                    return (a.title < b.title) ? 1 : ((b.title < a.title) ? -1 : 0);
                }
            );
            filter_consult.innerHTML = 'Ordem Alfabetica ⇑'
            break
        case '3':
            notes = notes.sort(
                function (a, b) {
                    return (a.data < b.data) ? 1 : ((b.data < a.data) ? -1 : 0);
                }
            );
            filter_consult.innerHTML = 'Mais Recente'
            break
        case '4':
            notes = notes.sort(
                function (a, b) {
                    return (a.data > b.data) ? 1 : ((b.data > a.data) ? -1 : 0);
                }
            );
            filter_consult.innerHTML = 'Mais Antigo'
            break
        default:
            notes = notes.sort(
                function (a, b) {
                    return (a.data < b.data) ? 1 : ((b.data < a.data) ? -1 : 0);
                }
            );
            filter_consult.innerHTML = 'Mais Recente'
    }
    renderNotes()
}

async function addNote(){
    const title = document.getElementById('note_title').value;
    const text = document.getElementById('note_text').value;

    if (title){
        await db.collection('notes').add({
            title: title,
            text: text,
            data: current_data,
            uid: firebase.auth().currentUser.uid
        });
        swal.fire({
            icon: "success",
            text: "Salvo com sucesso",
        })
        .then(() => {
            setTimeout(() => {
            window.location.replace("notes.html")
            }, 800)
        })
    }else{
        swal.fire({
            icon: "error",
            text: "Você não preencheu os campos corretamente",
        })
    }    
}

async function deleteNote(id) {
    await db.collection("notes").doc(id).delete()
    readNotes(filter_id, id_user)
}

async function editNote(id){
    await db.collection("profile").doc(firebase.auth().currentUser.uid).update({
        key_note: id,
    })
    .then(() => {
        setTimeout(() => {
        window.location.replace("edit_note.html")
        }, 200)
    })
}

window.onload = function(){
    getUser('readNotes')
}