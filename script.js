let tasks = JSON.parse(localStorage.getItem('myTasks')) || [];
let editIndex = -1;
let currentFilter = 'all';

const taskForm = document.getElementById('taskForm');
const taskTitle = document.getElementById('taskTitle');
const taskDesc = document.getElementById('taskDesc');
const taskDate = document.getElementById('taskDate');
const taskPriority = document.getElementById('taskPriority');
const taskList = document.getElementById('taskList');
const errorMsg = document.getElementById('errorMsg');
const successMsg = document.getElementById('successMsg');
const searchInput = document.getElementById('searchInput');
const submitBtn = document.getElementById('submitBtn');
const cancelBtn = document.getElementById('cancelBtn');
const formTitle = document.getElementById('formTitle');

showTasks();

taskForm.addEventListener('submit', function(e){
    e.preventDefault();
    errorMsg.textContent = '';
    successMsg.textContent = '';

    let title = taskTitle.value.trim();
    let desc = taskDesc.value.trim();
    let date = taskDate.value;
    let priority = taskPriority.value;

    if(title === ''){
        errorMsg.textContent = 'Please enter task title!';
        return;
    }
    if(title.length < 3){
        errorMsg.textContent = 'Title must be at least 3 characters!';
        return;
    }

    let taskData = {
        title: title,
        desc: desc,
        date: date,
        priority: priority,
        completed: false,
        id: Date.now()
    };

    if(editIndex === -1){
        tasks.push(taskData);
        successMsg.textContent = 'Task added successfully!';
    } else {
        tasks[editIndex].title = title;
        tasks[editIndex].desc = desc;
        tasks[editIndex].date = date;
        tasks[editIndex].priority = priority;
        editIndex = -1;
        submitBtn.textContent = 'Add Task';
        formTitle.textContent = 'Add New Task';
        cancelBtn.style.display = 'none';
        successMsg.textContent = 'Task updated successfully!';
    }

    localStorage.setItem('myTasks', JSON.stringify(tasks));
    taskForm.reset();
    showTasks();

    setTimeout(() => successMsg.textContent = '', 2000);
});

function showTasks(){
    let searchText = searchInput.value.toLowerCase();
    taskList.innerHTML = '';

    let filtered = tasks.filter(t => {
        let matchSearch = t.title.toLowerCase().includes(searchText);
        if(currentFilter === 'completed') return matchSearch && t.completed;
        if(currentFilter === 'pending') return matchSearch &&!t.completed;
        return matchSearch;
    });

    if(filtered.length === 0){
        taskList.innerHTML = '<p style="text-align:center;color:#94a3b8;">No tasks found.</p>';
    }

    filtered.forEach((task) => {
        let realIndex = tasks.findIndex(x => x.id === task.id);
        let div = document.createElement('div');
        div.className = `task ${task.completed? 'completed' : ''}`;
        div.innerHTML = `
            <h4>${task.title}</h4>
            ${task.desc? `<p>${task.desc}</p>` : ''}
            <div class="task-meta">
                <span class="priority-${task.priority}">${task.priority.toUpperCase()}</span>
                ${task.date? `<span>📅 ${task.date}</span>` : ''}
                <span>${task.completed? '✅ Completed' : '⏳ Pending'}</span>
            </div>
            <div class="task-actions">
                <button class="btn-complete" onclick="toggleComplete(${realIndex})">${task.completed? 'Undo' : 'Complete'}</button>
                <button class="btn-edit" onclick="editTask(${realIndex})">Edit</button>
                <button class="btn-delete" onclick="deleteTask(${realIndex})">Delete</button>
            </div>
        `;
        taskList.appendChild(div);
    });

    // update stats
    document.getElementById('totalTasks').textContent = `Total: ${tasks.length}`;
    document.getElementById('pendingTasks').textContent = `Pending: ${tasks.filter(t =>!t.completed).length}`;
    document.getElementById('completedTasks').textContent = `Completed: ${tasks.filter(t => t.completed).length}`;
}

function toggleComplete(index){
    tasks[index].completed =!tasks[index].completed;
    localStorage.setItem('myTasks', JSON.stringify(tasks));
    showTasks();
}

function editTask(index){
    let t = tasks[index];
    taskTitle.value = t.title;
    taskDesc.value = t.desc;
    taskDate.value = t.date;
    taskPriority.value = t.priority;
    editIndex = index;
    submitBtn.textContent = 'Update Task';
    formTitle.textContent = 'Edit Task';
    cancelBtn.style.display = 'block';
    window.scrollTo(0,0);
}

function deleteTask(index){
    if(confirm('Are you sure you want to delete this task?')){
        tasks.splice(index, 1);
        localStorage.setItem('myTasks', JSON.stringify(tasks));
        showTasks();
    }
}

cancelBtn.addEventListener('click', () => {
    editIndex = -1;
    taskForm.reset();
    submitBtn.textContent = 'Add Task';
    formTitle.textContent = 'Add New Task';
    cancelBtn.style.display = 'none';
    errorMsg.textContent = '';
});

searchInput.addEventListener('input', showTasks);

document.querySelectorAll('.filter').forEach(btn => {
    btn.addEventListener('click', function(){
        document.querySelectorAll('.filter').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        currentFilter = this.dataset.filter;
        showTasks();
    });
});