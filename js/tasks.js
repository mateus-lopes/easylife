let tasks = []
let textFilter = document.getElementById('text_filter')

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
    tasks = []
    if(!x || x=='1'){
        let logTasks = await db.collection('tasks')
        .orderBy("title", "asc").get()
        for (doc of logTasks.docs) {
            tasks.push({
                id: doc.id,
                title: doc.data().title
            })
        }
        textFilter.innerHTML = 'Ordem Alfabetica (A-Z)'
    } else if(x=='2'){
        let logTasks = await db.collection("tasks")
        .orderBy("title", "desc").get()
        for (doc of logTasks.docs) {
            tasks.push({
                id: doc.id,
                title: doc.data().title
            })
        }
        textFilter.innerHTML = 'Ordem Alfabetica (Z-A)'
    } else if(x=='3'){
        let logTasks = await db.collection("tasks")
        .orderBy("data", "desc").get()
        for (doc of logTasks.docs) {
            tasks.push({
                id: doc.id,
                title: doc.data().title
            })
        }
        textFilter.innerHTML = 'Mais Recente'
    } else if(x=='4'){
        let logTasks = await db.collection("tasks")
        .orderBy("data", "asc").get()
        for (doc of logTasks.docs) {
            tasks.push({
                id: doc.id,
                title: doc.data().title
            })
        }
        textFilter.innerHTML = 'Mais Antigo'
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
        const data = new Date();
        await db.collection('tasks').add({
            title: title,
            data: data,
        })
        readTasks()
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