import Task from "./scripts/task.js";
import TasksList from "./scripts/tasks-list.js";
import {regexDescription,regexName} from './scripts/regex.js';

'use strict';

console.clear();

function updateAll(){
    tasksList.updateList();
    deleteButtons = document.querySelectorAll('.delete-button');
    statusCheckboxes = document.querySelectorAll('.status-checkbox');
    editButtons = document.querySelectorAll('.edit-button');
    for(let i=0; i<deleteButtons.length;++i){
        deleteButtons[i].addEventListener('click', (e)=>{
            const id = deleteButtons[i].closest('li').id;
            tasksList.deleteTask(id);
            updateAll();
        });
    }
    for(let i=0; i<statusCheckboxes.length;++i){
        statusCheckboxes[i].addEventListener('change', (e)=>{
            const id = statusCheckboxes[i].closest('li').id;
            if(statusCheckboxes[i].checked){
                tasksList.makeTaskDone(id);
            }
            else{
                tasksList.makeTaskUndone(id);
            }
            updateAll();
        });
    }
    for(let i=0; i<editButtons.length;++i){
        editButtons[i].addEventListener('click', (e)=>{
            const id = editButtons[i].closest('li').id;
            location.href=`/edit/edit.html?id=${id}`;
        });
    }
    localStorage.setItem('tasksList', JSON.stringify(tasksList.tasks));
}

function filter(tasksList,type){
    switch (type) {
        case 'all':
            tasksList.unfilterTasks();
            break;
        case 'done':
            tasksList.filterForDoneTasks();
            break;
        case 'undone':
            tasksList.filterForUndoneTasks();
            break;
    }
}

const form = document.querySelector('#add-task-form');
let deleteButtons = document.querySelectorAll('.delete-button');
const select=document.querySelector('#sort-by');
const doneFilterButton=document.querySelector('.done-filter-button');
const undoneFilterButton=document.querySelector('.undone-filter-button');
const allFilterButton=document.querySelector('.all-filter-button');
let statusCheckboxes = document.querySelectorAll('.status-checkbox');
let editButtons = document.querySelectorAll('.edit-button');

const tasksList = new TasksList();

if(localStorage.getItem('tasksList') !== null){
    const jsonArr=JSON.parse(localStorage.getItem('tasksList'));
    for(let task of jsonArr){
        tasksList.addTasks(Task.fromJSON(task.id,task.name,task.description,task.date,task.dateInst,task.isDone));
        updateAll();
    }
}



form.addEventListener('submit', (e) => {
    e.preventDefault();
    const inputTaskName = document.querySelector('#input-task-name');
    const inputTaskDescription = document.querySelector('#input-task-description');
    const pError=document.querySelector('#error');
    const isNameValid=regexName.test(inputTaskName.value);
    const isDescriptionValid=regexDescription.test(inputTaskDescription.value)&&inputTaskName.value!==inputTaskDescription.value.trim();
    
    pError.textContent=isNameValid?"":"invalid name!";
    pError.className=isNameValid?'hidden-error':'visible-error';
    if(!isNameValid){
        return;
    }

    pError.textContent=isDescriptionValid?"":"invalid description!";
    pError.className=isDescriptionValid?'hidden-error':'visible-error';
    if(!isDescriptionValid){
        return;
    }

    pError.className='hidden-error';
    const task = new Task(inputTaskName.value, inputTaskDescription.value);
    tasksList.addTasks(task);

    updateAll();

    inputTaskName.value='';
    inputTaskDescription.value='';
});

select.addEventListener('change',(e)=>{
    const sortType=select.value;
    switch (sortType) {
        case 'date':
            tasksList.sortByDate();
            break;
        case 'name':
            tasksList.sortByName();
            break;
    }
    updateAll();
});

doneFilterButton.addEventListener('click', (e)=>{
    filter(tasksList,'done');
    updateAll();
});

allFilterButton.addEventListener('click', (e)=>{
    filter(tasksList,'all');
    updateAll();
});

undoneFilterButton.addEventListener('click', (e)=>{
    filter(tasksList,'undone');
    updateAll();
});

