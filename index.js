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
    constructor(name, description, isoDate=(new Date()).toISOString()) {
        this.#id = "id" + Math.random().toString(16).slice(2);
        this.#name = name;
        this.#description = description;
        this.#dateInst = new Date(isoDate);
        let date = new Date(isoDate);
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

    get dateInst() {
        return this.#dateInst;
    }

    toJson() {
        return JSON.stringify({
            ['#id']: this.#id,
            ['#name']: this.#name,
            ['#description']: this.#description,
            ['#date']: this.#date,
            ['#dateInst']: this.#dateInst,
            ['#isDone']: this.#isDone,
        });
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

    deleteTask(id){
        const task=this.#tasks.find((task)=>task.id===id);
        const index=this.#tasks.indexOf(task);

        this.#tasks.splice(index,1);
        this.#filteredTasks.splice(index,1);
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
    for(let i=0; i<deleteButtons.length;++i){
        deleteButtons[i].addEventListener('click', (e)=>{
            const id = deleteButtons[i].closest('li').id;
            tasksList.deleteTask(id);
            updateAll();
        });
    }
}

const form = document.querySelector('#add-task-form');
const tasksList = localStorage.getItem('tasksList') === null ? new TasksList() : localStorage.getItem('tasksList');
let deleteButtons = document.querySelectorAll('.delete-button');
const select=document.querySelector('#sort-by');

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const inputTaskName = document.querySelector('#input-task-name');
    const inputTaskDescription = document.querySelector('#input-task-description');

    const task = new Task(inputTaskName.value, inputTaskDescription.value);
    tasksList.addTasks(task);

    updateAll();
    localStorage.setItem('tasksList', (new Task('dsasdfsf', 'adfasfdaf')).toJson());
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
