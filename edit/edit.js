import Task from "../scripts/task.js";
import TasksList from "../scripts/tasks-list.js";
import { regexDescription, regexName } from '../scripts/regex.js';

const homeButton = document.querySelector('.home-button');
const form = document.querySelector('#add-task-form');
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

let inputTaskName = document.querySelector('#input-task-name');
let inputTaskDescription = document.querySelector('#input-task-description');
const task = tasksList.findTask(id);

inputTaskName.value=task.name;
inputTaskDescription.value=task.description;

homeButton.addEventListener('click', (e) => {
    location.href = '/index.html';
});

form.addEventListener('submit', (e) => {
    e.preventDefault();
    inputTaskName = document.querySelector('#input-task-name');
    inputTaskDescription = document.querySelector('#input-task-description');

    if (!regexName.test(inputTaskName.value)) {
        console.log("invalid name!");
        return;
    }
    if (!regexDescription.test(inputTaskDescription.value) || inputTaskName.value === inputTaskDescription.value.trim()) {
        console.log("invalid description!");
        return;
    }

    task.name = inputTaskName.value 
    task.description = inputTaskDescription.value;

    localStorage.setItem('tasksList', JSON.stringify(tasksList.tasks));
    location.href = '/index.html';
});