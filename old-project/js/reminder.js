// config banco de dados
let db_read;
let reminders;
let id_user;
// config filtro
let filter_id = document.getElementById('filter_id').innerText;
let filter_consult = document.getElementById('filter_consult');
// config filtro por data
let current_data = new Date;
let current_month = current_data.getMonth() + 1;
let current_day = current_data.getDate();

function createButtons(reminder){
    const div_buttons = document.createElement('div');
    const btn_edit = document.createElement('a');
    const btn_del = document.createElement('a');
    // set div-btns
    div_buttons.setAttribute('class', 'div-reminder');
    // set btn-edit
    btn_edit.setAttribute('class', 'icon-editTask2 mr-2');
    btn_edit.setAttribute('onclick', `getInfoReminder("${reminder.id}")`)
    btn_edit.setAttribute('data-toggle', 'modal');
    btn_edit.setAttribute('data-target', '#reminder_edit');
    btn_edit.setAttribute('href', '#');
    // set btn-del
    btn_del.setAttribute('class', 'icon-deleteTask');
    btn_del.setAttribute('onclick', `deleteReminder("${reminder.id}")`)
    btn_del.setAttribute('href', '#');
    div_buttons.appendChild(btn_del)
    div_buttons.appendChild(btn_edit)
    return div_buttons
}

function createTextSmall(doc) {
    const newSmall = document.createElement('small')
    newSmall.setAttribute('class','text-muted pr-2')
    newSmall.appendChild(document.createTextNode(doc))
    return newSmall
}

function createText(doc) {
    const newParagrafo = document.createElement('p')
    newParagrafo.appendChild(document.createTextNode(doc))
    return newParagrafo
}

function createTitle(doc) {
    const newParagrafo = document.createElement('h5')
    newParagrafo.setAttribute('class','mt-2')
    newParagrafo.appendChild(document.createTextNode(doc))
    return newParagrafo
}

function renderReminders() {
    let reminderList = document.getElementById('reminderList')
    reminderList.innerHTML = 'Nada encontrado' 
    if(reminderList){
        reminderList.innerHTML = ''
        for (let doc of reminders) {
            // criando as contantes
            const newLembrete = document.createElement('li')
             // atribuindo classes a cada tag
            newLembrete.setAttribute('class',`${doc.dia} list-group-item card border my-3`)
            // contruindo a li
            newLembrete.appendChild(createButtons(doc))
            newLembrete.appendChild(createTextSmall(doc.calendar))
            newLembrete.appendChild(createTitle(doc.title))
            newLembrete.appendChild(createText(doc.text))
            reminderList.appendChild(newLembrete)
        }
    }
}

async function readReminders(x, id){
    if (x){filter_id = x}
    if (id){id_user = id}
    reminders = []
    db_read = await db
    .collection('reminders')
    .where('uid', '==', id)
    .get()
    for (doc of db_read.docs) {
        reminders.push({
            id: doc.id,
            title: doc.data().title,
            text: doc.data().text,
            calendar: doc.data().calendar,
            dia: doc.data().dia,
            calendar_month: doc.data().calendar_month,
            data: doc.data().data,
        })
    }
    switch (filter_id) {
        case '1':
            reminders = reminders.sort(
                function (a, b) {
                    return (a.title > b.title) ? 1 : ((b.title > a.title) ? -1 : 0);
                }
            );
            filter_consult.innerHTML = 'Ordem Alfabetica ⇓'
            break
        case '2':
            reminders = reminders.sort(
                function (a, b) {
                    return (a.title < b.title) ? 1 : ((b.title < a.title) ? -1 : 0);
                }
            );
            filter_consult.innerHTML = 'Ordem Alfabetica ⇑'
            break
        case '3':
            reminders = reminders.sort(
                function (a, b) {
                    return (a.data < b.data) ? 1 : ((b.data < a.data) ? -1 : 0);
                }
            );
            filter_consult.innerHTML = 'Mais Recente'
            break
        case '4':
            reminders = reminders.sort(
                function (a, b) {
                    return (a.data > b.data) ? 1 : ((b.data > a.data) ? -1 : 0);
                }
            );
            filter_consult.innerHTML = 'Mais Antigo'
            break
        case '5':
            filter_consult.innerHTML = 'sem funcionamento'
            break
        case '6':
            filter_consult.innerHTML = 'sem funcionamento'
            break
        default:
            reminders = reminders.sort(
                function (a, b) {
                    return (a.data < b.data) ? 1 : ((b.data < a.data) ? -1 : 0);
                }
            );
            filter_consult.innerHTML = 'Mais Recente'
    }
    renderReminders()
}

async function addReminder(){
    const reminderList = document.getElementById('reminderList')
    const title = document.getElementById('title_reminder').value;
    const text = document.getElementById('text_reminder').value;
    let calendar = document.getElementById('data_reminder').value;
    const calendar_filter = calendar.split('-')
    const fitlerday = parseInt(calendar_filter[2]) 
    const fitlermonth = parseInt(calendar_filter[1]) 

    if ((calendar) && (text && text != ' ')){
    // carregando nova tarefa
    const newreminder = document.createElement('li');
    const newreminder_content = document.createElement('a');
    // atribuindo classes a cada tag
    newreminder.setAttribute('class', 'reminder-li my-1 reminder-div');
    newreminder_content.setAttribute('class', 'reminder-content nav-link text-dark');
    // contruindo a li
    newreminder.appendChild(newreminder_content);
    newreminder_content.appendChild(document.createTextNode('Adicionando na nuvem...'))
    reminderList.appendChild(newreminder)
    await db.collection('reminders').add({
        title: title,
        text: text,
        calendar: calendar_filter.reverse().join('/'),
        calendar_day: fitlerday,
        calendar_month: fitlermonth,
        data: current_data,
        uid: firebase.auth().currentUser.uid
    })
    readReminders(filter_id, id_user)
    document.getElementById('title_reminder').value = ''
    document.getElementById('text_reminder').value = ''
    document.getElementById('data_reminder').value = ''
    }else{
        swal.fire({
            icon: "error",
            text: "Você não preencheu os campos corretamente",
        })
    }    
}

async function deleteReminder(id) {
    await db.collection("reminders").doc(id).delete()
    readReminders(filter_id, id_user)
}

async function getInfoReminder(id) {
    let edit_reminder = document.getElementById('title_saveReminder')
    let text_update = document.getElementById('text_saveReminder')
    //
    let db_editReminder = await db.collection("reminders").doc(id).get()
    let save_id = document.getElementById('save_idReminder')

    edit_reminder.value = db_editReminder.data().title
    text_update.value = db_editReminder.data().text
    save_id.value = id
}

async function saveReminder() {
    // get values
    let title_update = document.getElementById('title_saveReminder').value;
    let text_update = document.getElementById('text_saveReminder').value;
    // set values
     
    let save_id = document.getElementById('save_idReminder').value;
    if((title_update == '' || title_update == ' ') && (text_update == '' || text_update == ' ')){
        await db.collection("reminders").doc(save_id).delete()
    }else{
        await db.collection('reminders').doc(save_id).update({
            title: title_update,
            text: text_update,
            data: new Date(),
        })
    }
    readReminders(filter_id, id_user)
}

window.onload = function(){
    getUser('readReminders')
}

