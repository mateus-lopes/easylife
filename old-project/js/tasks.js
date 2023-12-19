let tasks = [];
let db_read;
let id_user;
let filter_id = document.getElementById('filter_id').innerText;
let textFilter = document.getElementById('text_filter');

function createButtons(task, id_task){
    const div_buttons = document.createElement('div');
    const btn_edit = document.createElement('a');
    const btn_del = document.createElement('a');
    // set btn-edit
    btn_edit.setAttribute('class', 'icon-editTask mr-2');
    btn_edit.setAttribute('onclick', `finishTask("${task.id}", "${id_task}")`)
    btn_edit.setAttribute('id', task.id)
    btn_edit.setAttribute('href', '#'); 
    // set btn-del
    btn_del.setAttribute('class', 'icon-deleteTask');
    btn_del.setAttribute('onclick', `deleteTask("${task.id}")`)
    btn_del.setAttribute('href', '#');
    div_buttons.appendChild(btn_del)
    div_buttons.appendChild(btn_edit)
    return div_buttons
}

function renderTasks(){
    let taskList = document.getElementById("taskList")
    taskList.innerHTML = '' 
    id_task = 1000;
    for(let task of tasks){
        id_task++;
        // criando as contantes
        const newTask = document.createElement('li');
        const newTask_content = document.createElement('a');
        
        // atribuindo classes a cada tag
        newTask.setAttribute('class', 'task-li my-1 task-div');
        newTask.setAttribute('id', id_task);
        newTask_content.setAttribute('class', 'task-content nav-link text-dark');
        newTask_content.setAttribute('onclick', `editTask("${task.id}")`);
        newTask_content.setAttribute('data-toggle', 'modal');
        newTask_content.setAttribute('data-target', '#teste');
        newTask_content.setAttribute('href', '#');
        
        // contruindo a li
        newTask.appendChild(newTask_content);
        newTask_content.appendChild(document.createTextNode(task.title))
        newTask.appendChild(createButtons(task, id_task));
        taskList.appendChild(newTask)
    }
}

async function readTasks(x, id){
    if (x){filter_id = x}
    if (id){id_user = id}
    tasks = []
    db_read = await db
    .collection('tasks')
    .where('uid', '==', id)
    .get()
    for (doc of db_read.docs) {
        tasks.push({
            id: doc.id,
            title: doc.data().title,
            data: doc.data().data,
        })
    }
    switch (filter_id) {
        case '1':
            tasks = tasks.sort(
                function (a, b) {
                    return (a.title > b.title) ? 1 : ((b.title > a.title) ? -1 : 0);
                }
            );
            textFilter.innerHTML = 'Alfabetica ⇓'
            break
        case '2':
            tasks = tasks.sort(
                function (a, b) {
                    return (a.title < b.title) ? 1 : ((b.title < a.title) ? -1 : 0);
                }
            );
            textFilter.innerHTML = 'Alfabetica ⇑'
            break
        case '3':
            tasks = tasks.sort(
                function (a, b) {
                    return (a.data < b.data) ? 1 : ((b.data < a.data) ? -1 : 0);
                }
            );
            textFilter.innerHTML = 'Mais Recente'
            break
        case '4':
            tasks = tasks.sort(
                function (a, b) {
                    return (a.data > b.data) ? 1 : ((b.data > a.data) ? -1 : 0);
                }
            );
            textFilter.innerHTML = 'Mais Antigo'
            break
        default:
            tasks = tasks.sort(
                function (a, b) {
                    return (a.data < b.data) ? 1 : ((b.data < a.data) ? -1 : 0);
                }
            );
            textFilter.innerHTML = 'Mais Recente'
    }
    renderTasks()
}

async function addTask(){
    const taskList = document.getElementById('taskList')
    const title = document.getElementById('new_task').value
    if(title){
        // carregandio nova tarefa
        const newTask = document.createElement('li');
        const newTask_content = document.createElement('a');
        // atribuindo classes a cada tag
        newTask.setAttribute('class', 'task-li my-1 task-div');
        newTask_content.setAttribute('class', 'task-content nav-link text-dark');
        // contruindo a li
        newTask.appendChild(newTask_content);
        newTask_content.appendChild(document.createTextNode('Adicionando na nuvem...'))
        taskList.appendChild(newTask)
        // data
        const data_origin = new Date();
        await db.collection('tasks').add({
            title: title,
            data: data_origin,
            uid: firebase.auth().currentUser.uid
        })
        readTasks(filter_id, id_user)
        document.getElementById('new_task').value = ''
    }else{
        swal.fire({
          icon: "error",
          text: "A Tarefa está vazia",
        })
    }
}

async function deleteTask(id) {
    await db.collection("tasks").doc(id).delete()
    readTasks(filter_id, id_user)
}

async function editTask(id) {
    let edit_task = document.getElementById('edit_task')
    let db_editTask = await db.collection("tasks").doc(id).get()
    let save_id = document.getElementById('save_idTask')
    edit_task.value = db_editTask.data().title
    save_id.value = id
}

async function saveTask() {
    let title_update = document.getElementById('edit_task').value;
    let save_id = document.getElementById('save_idTask').value;
    if(title_update == '' || title_update == ' '){
        await db.collection("tasks").doc(save_id).delete()
    }else{
        await db.collection('tasks').doc(save_id).update({
            title: title_update,
            data: new Date(),
        })
    }
    readTasks(filter_id, id_user)
}

async function finishTask(id, x){
    const img = document.getElementById(id) 
    img.classList.add('icon-finishTask')
    const li = document.getElementById(x) 
    const title = (await db.collection("tasks").doc(id).get()).data().title
    await db.collection('tasks_finish').add({
        title: title,
        data: new Date(),
        uid: firebase.auth().currentUser.uid
    })
    // anima imagem
    await db.collection("tasks").doc(id).delete()
    setTimeout(() => {
        li.classList.add('bigOutFast')
        readTasks(filter_id, id_user)
    })
}

window.onload = function(){
    getUser('readTasks')
}

