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

function createDelButton(reminder){
    const newReminderDel = document.createElement('a');
    newReminderDel.setAttribute('class', 'deleteReminder mr-2');
    newReminderDel.setAttribute('onclick', `deleteReminder("${reminder.id}")`)
    newReminderDel.setAttribute('href', '#');
    return newReminderDel
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
            newLembrete.appendChild(createDelButton(doc))
            newLembrete.appendChild(createTextSmall(doc.calendar))
            newLembrete.appendChild(createTextSmall(doc.dia))
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
                    return (a.title < b.title) ? 1 : ((b.title < a.title) ? -1 : 0);
                }
            );
            filter_consult.innerHTML = 'Ordem Alfabetica ⇓'
            break
        case '2':
            reminders = reminders.sort(
                function (a, b) {
                    return (a.title > b.title) ? 1 : ((b.title > a.title) ? -1 : 0);
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
    const dia = document.getElementById('day_reminder').value;
    let calendar = document.getElementById('data_reminder').value;
    const calendar_2 = calendar.split('-')
    const fitlerday = parseInt(calendar_2[0]) 
    const fitlermonth = parseInt(calendar_2[1]) 
    if (title && title != ' ' && text && text != ' ' && dia && dia != ' '){
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
            dia: dia,
            calendar: calendar,
            calendar_day: fitlerday,
            calendar_month: fitlermonth,
            data: current_data,
            uid: firebase.auth().currentUser.uid
        })
        readReminders(filter_id, id_user)
    }else{
        swal.fire({
          icon: "error",
          text: "O Lembrete está vazio",
        })
    }
}

async function deleteReminder(id) {
    await db.collection("reminders").doc(id).delete()
    readReminders(filter_id, id_user)
}

window.onload = function(){
    getUser('readReminders')
}

