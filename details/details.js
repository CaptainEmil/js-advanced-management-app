import Task from "../scripts/task.js";
import TasksList from "../scripts/tasks-list.js";

const homeButton = document.querySelector('.home-button');
let paramString = location.href.split('?')[1];
let queryString = new URLSearchParams(paramString);
const id = queryString.get('id');

const tasksList = new TasksList();

if (localStorage.getItem('tasksList') !== null) {
    const jsonArr = JSON.parse(localStorage.getItem('tasksList'));
    for (let task of jsonArr) {
        tasksList.addTasks(Task.fromJSON(task.id, task.name, task.description, task.date, task.dateInst, task.isDone));
    }
}

const task = tasksList.findTask(id);

homeButton.addEventListener('click', (e) => {
    location.href = '/index.html';
});

const div=document.createElement('div');
div.className='info-container';

const pName=document.createElement('p');
pName.textContent=`Name: ${task.name}`;

const pDescription=document.createElement('p');
pDescription.textContent=`Description: ${task.description}`;

const pStatus=document.createElement('p');
pStatus.textContent=`Status: ${task.isDone? 'Done': 'Undone'}`;

const pId=document.createElement('p');
pId.textContent=`Id: ${task.id}`;

const pDate=document.createElement('p');
pDate.textContent=`Date: ${task.date}`;

div.append(pName,pDescription,pStatus,pId,pDate);
document.body.append(div);