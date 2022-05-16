let tasks = [];
let db_read;
let filter_id = document.getElementById('filter_id').innerText;
let textFilter = document.getElementById('text_filter');

function createButtonDel(task){
    const newTask_del = document.createElement('a');
    newTask_del.setAttribute('class', 'icon-deleteTask mr-2');
    newTask_del.setAttribute('onclick', `deleteTask("${task.id}")`)
    newTask_del.setAttribute('href', '#');
    return newTask_del
}

function renderTasks(){
    let taskList = document.getElementById("taskList")
    taskList.innerHTML = '' 
    for(let task of tasks){
        // criando as contantes
        const newTask = document.createElement('li');
        const newTask_content = document.createElement('a');
        
        // atribuindo classes a cada tag
        newTask.setAttribute('class', 'task-li my-1 task-div');
        newTask_content.setAttribute('class', 'task-content nav-link text-dark');
        newTask_content.setAttribute('href', '#');
        
        // contruindo a li
        newTask.appendChild(newTask_content);
        newTask_content.appendChild(document.createTextNode(task.title))
        newTask.appendChild(createButtonDel(task));
        taskList.appendChild(newTask)
    }
}

async function readTasks(x){
    // if (x){
    //     filter_id = x
    // }
    // switch (filter_id) {
    //     case '1':
    //         db_read = await db
    //         .collection('tasks')
    //         .orderBy("title", "asc")
    //         .get()
    //         textFilter.innerHTML = 'Filtrar por Ordem Alfabetica ⇓'
    //         break
    //     case '2':
    //             db_read = await db
    //             .collection('tasks')
    //             .orderBy("title", "desc")
    //         .get()
    //         textFilter.innerHTML = 'Filtrar por Ordem Alfabetica ⇑'
    //         break
    //     case '3':
    //             db_read = await db
    //         .collection('tasks')
    //         .orderBy("data", "desc")
    //         .get()
    //         textFilter.innerHTML = 'Filtrar por Mais Recente'
    //         break
    //     case '4':
    //         db_read = await db
    //         .collection('tasks')
    //         .orderBy("data", "asc")
    //         .get()
    //         textFilter.innerHTML = 'Filtrar por Mais Antigo'
    //         break
    //     default:
    //         db_read = await db
    //         .collection('tasks')
    //         .orderBy("data", "desc")
    //         .get()
    //         textFilter.innerHTML = 'Filtrar por Mais Recente'
    //     }
    db_read = await db
    .collection('tasks')
    .where('title', '==', 'ola admin')
    .get()
    textFilter.innerHTML = 'Filtrar por Mais Recente'
    tasks = []
    for (doc of db_read.docs) {
        tasks.push({
            id: doc.id,
            title: doc.data().title
        })
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
        readTasks(filter_id)
    }else{
        swal.fire({
          icon: "error",
          title: "A Tarefa está vazia",
        })
    }
}

async function deleteTask(id) {
    await db.collection("tasks").doc(id).delete()
    readTasks()
}

document.addEventListener('keypress', function(e){
    if(e.which == 13){
        addTask()
    }
}, false);

window.onload = function(){
    getUser()
    readTasks()
}

