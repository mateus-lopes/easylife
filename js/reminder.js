let reminders = []
let filter_consult = document.getElementById('filter_consult')
let filter_day = document.getElementById('filter_day')
let filter_month = document.getElementById('filter_month')

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
            newLembrete.appendChild(createTextSmall(doc.data))
            newLembrete.appendChild(createTextSmall(doc.dia))
            newLembrete.appendChild(createTitle(doc.title))
            newLembrete.appendChild(createText(doc.text))
            reminderList.appendChild(newLembrete)
        }
    }
}

async function readReminders(x){
    reminders = []
    if(!x || x=='1'){
        let logreminders = await db.collection('reminders')
        .orderBy("title", "asc").get()
        for (doc of logreminders.docs) {
            reminders.push({
                id: doc.id,
                title: doc.data().title,
                text: doc.data().text,
                data: doc.data().data,
                dia: doc.data().dia,
            })
        }
        filter_consult.innerHTML = 'Ordem Alfabetica (A-Z)'
    } else if(x=='2'){
        let logreminders = await db.collection("reminders")
        .orderBy("title", "desc").get()
        for (doc of logreminders.docs) {
            reminders.push({
                id:doc.id,
                title: doc.data().title,
                text: doc.data().text,
                data: doc.data().data,
                dia: doc.data().dia,
            })
        }
        filter_consult.innerHTML = 'Ordem Alfabetica (Z-A)'
    } else if(x=='3'){
        let logreminders = await db.collection("reminders")
        .orderBy("data", "asc").get()
        for (doc of logreminders.docs) {
            reminders.push({
                id:doc.id,
                title: doc.data().title,
                text: doc.data().text,
                data: doc.data().data,
                dia: doc.data().dia,
            })
        }
        filter_consult.innerHTML = 'Mais Recente'
    } else if(x=='4'){
        let logreminders = await db.collection("reminders")
        .orderBy("data", "desc").get()
        for (doc of logreminders.docs) {
            reminders.push({
                id:doc.id,
                title: doc.data().title,
                text: doc.data().text,
                data: doc.data().data,
                dia: doc.data().dia,
            })
        }
        filter_consult.innerHTML = 'Mais Antigo'
    }
    renderReminders()
}

async function addReminder(){
    const reminderList = document.getElementById('reminderList')
    const title = document.getElementById('title_reminder').value;
    const text = document.getElementById('text_reminder').value;
    const dia = document.getElementById('day_reminder').value;
    const data = document.getElementById('data_reminder').value;
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
            data: data,
        })
        readReminders()
    }else{
        swal.fire({
          icon: "error",
          title: "A Tarefa está vazia",
        })
    }
}

async function deleteReminder(id) {
    await db.collection("reminders").doc(id).delete()
    readReminders()
}

window.onload = function(){
    getUser()
    readReminders()
}

