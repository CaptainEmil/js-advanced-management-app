'use strict';

console.clear();

localStorage.clear();
class Task {
    #id;
    #name;
    #description;
    #date;
    #dateInst;
    #isDone;
    constructor(name, description) {
        this.#id = "id" + Math.random().toString(16).slice(2);
        this.#name = name;
        this.#description = description;
        this.#dateInst = new Date();
        let date = new Date();
        let dateArr = date.toISOString().split('.')[0].split('T');
        let dayMonthYear = dateArr[0].split('-').reverse().join('.');
        let hourMinSec = dateArr[1];
        this.#date = `${dayMonthYear} ${hourMinSec}`;
        this.#isDone = false;
    }

    get id() {
        return this.#id;
    }

    get name() {
        return this.#name;
    }

    get description() {
        return this.#description;
    }

    get date() {
        return this.#date;
    }

    get isDone() {
        return this.#isDone;
    }

    set isDone(isDone) {
        this.#isDone=isDone;
    }

    get dateInst() {
        return this.#dateInst;
    }

    toJSON() {
        return {
            ['#id']: this.#id,
            ['#name']: this.#name,
            ['#description']: this.#description,
            ['#date']: this.#date,
            ['#dateInst']: this.#dateInst,
            ['#isDone']: this.#isDone,
        };
    }

    makeDone(){
        this.#isDone=true;
    }

    makeUndone(){
        this.#isDone=false;
    }
}

class TasksList {
    #tasks;
    #filteredTasks;
    #filterType = 'all';

    constructor(...tasks) {
        this.#tasks = [...tasks];
        this.#filteredTasks = [...tasks];
    }

    addTasks(...tasks) {
        this.#tasks.push(...tasks);
        this.#filteredTasks.push(...tasks);
    }

    sortByDate() {
        this.#filteredTasks.sort((a, b) => b.dateInst - a.dateInst);
        this.#tasks.sort((a, b) => b.dateInst - a.dateInst);
    }

    sortByName() {
        this.#filteredTasks.sort((a, b) => {
            if (a.name < b.name) {
                return -1;
            }
            if (a.name > b.name) {
                return 1;
            }
            return 0;
        });

        this.#tasks.sort((a, b) => {
            if (a.name < b.name) {
                return -1;
            }
            if (a.name > b.name) {
                return 1;
            }
            return 0;
        });
    }

    findTask(id){
        return this.#tasks.find((task)=>task.id===id);

    }

    indexOfTask(id){
        const task=this.findTask(id);
        return this.#tasks.indexOf(task);
    }

    deleteTask(id){
        const index=this.indexOfTask(id);
        this.#tasks.splice(index,1);
    }

    makeTaskDone(id){
        const task=this.findTask(id);
        task.isDone=true;
    }

    makeTaskUndone(id){
        const task=this.findTask(id);
        task.isDone=false;
    }

    filterForDoneTasks() {
        this.#filteredTasks = this.#tasks.filter((task) => task.isDone);
        this.#filterType = 'done';
    }

    filterForUndoneTasks() {
        this.#filteredTasks = this.#tasks.filter((task) => !task.isDone);
        this.#filterType = 'undone';
    }

    unfilterTasks() {
        this.#filteredTasks = [...this.#tasks];
        this.#filterType = 'all';
    }

    removeAllElementsInList(tasksList) {
        while (tasksList.firstChild) {
            tasksList.removeChild(tasksList.firstChild);
        }
    }

    appendList() {
        const tasksList = document.querySelector('#tasks-list');
        this.removeAllElementsInList(tasksList);
        for (const task of this.#filteredTasks) {
            const li = document.createElement('li');
            li.id = task.id;

            const spanName = document.createElement('span');
            spanName.textContent = task.name;

            const spanStatus = document.createElement('span');
            spanStatus.textContent = `Status: ${task.isDone ? 'Done' : 'Undone'}`;

            const statusCheckbox = document.createElement('input');
            statusCheckbox.className = 'status-checkbox';
            statusCheckbox.setAttribute('type', 'checkbox');
            statusCheckbox.checked = task.isDone;


            const editBtn = document.createElement('button');
            editBtn.className = 'edit-button';
            editBtn.textContent = 'Edit';

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-button';
            deleteBtn.textContent = 'Delete';

            li.append(spanName, spanStatus, statusCheckbox, editBtn, deleteBtn);
            tasksList.append(li);
        }
    }

    updateList() {
        const sortType = document.querySelector('#sort-by').value;
        switch (this.#filterType) {
            case 'all':
                this.unfilterTasks();
                break;
            case 'done':
                this.filterForDoneTasks();
                break;
            case 'undone':
                this.filterForUndoneTasks();
                break;
        }
        switch (sortType) {
            case 'date':
                this.sortByDate();
                break;
            case 'name':
                this.sortByName();
                break;
        }
        this.appendList();
    }

    get tasks() {
        return this.#tasks;
    }
}

function updateAll(){
    tasksList.updateList();
    deleteButtons = document.querySelectorAll('.delete-button');
    statusCheckboxes = document.querySelectorAll('.status-checkbox');
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
const tasksList = localStorage.getItem('tasksList') === null ? new TasksList() : localStorage.getItem('tasksList');
let deleteButtons = document.querySelectorAll('.delete-button');
const select=document.querySelector('#sort-by');
const doneFilterButton=document.querySelector('.done-filter-button');
const undoneFilterButton=document.querySelector('.undone-filter-button');
const allFilterButton=document.querySelector('.all-filter-button');
let statusCheckboxes = document.querySelectorAll('.status-checkbox');

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const inputTaskName = document.querySelector('#input-task-name');
    const inputTaskDescription = document.querySelector('#input-task-description');
    let regexName = /^(?:([a-z]{1,16}|[а-яА-ЯёЁ]{1,16}|[0-9]{1,16})\s)*(((?:[0-9]{1,16}\s)(?:([a-z]{1,16}|[а-яА-ЯёЁ]{1,16})))|((?:([a-z]{1,16}|[а-яА-ЯёЁ]{1,16})\s)(?:[0-9]{1,16}))|((?:([a-z]{1,16}|[а-яА-ЯёЁ]{1,16}))(?:\s([a-z]{1,16}|[а-яА-ЯёЁ]{1,16}))))$/g;
    let regexDescription= /\s*([a-z]{1,16}|[а-яА-ЯёЁ]{1,16}|[0-9]{1,16})(?:\s([a-z]{1,16}|[а-яА-ЯёЁ]{1,16}|[0-9]{1,16}))*\s*/g;

    if(!regexName.test(inputTaskName.value)){
        console.log("invalid name!");
        return;
    }
    if(!regexDescription.test(inputTaskDescription.value)||inputTaskName.value===inputTaskDescription.value.trim()){
        console.log("invalid description!");
        return;
    }


    const task = new Task(inputTaskName.value, inputTaskDescription.value);
    tasksList.addTasks(task);

    updateAll();
    localStorage.setItem('tasksList', JSON.stringify(new Task('dsasdfsf', 'adfasfdaf')));

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

