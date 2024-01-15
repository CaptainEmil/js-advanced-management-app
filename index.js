'use strict';

console.clear();



class Task {
    #id;
    #name;
    #description;
    #date;
    #dateInst;
    #isDone;
    constructor(name, description) {
        this.#id = crypto.randomUUID();
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

    get dateInst() {
        return this.#dateInst;
    }
}

class TasksList {
    #tasks;
    #filteredTasks;

    constructor(...tasks) {
        this.#tasks = [...tasks];
        this.#filteredTasks=[...tasks];
    }

    addTask(task) {
        this.#tasks.push(task);
    }
    
    sortByDate() {
        this.#filteredTasks.sort((a, b) => b.dateInst()-a.dateInst());
        this.#tasks.sort((a, b) => b.dateInst()-a.dateInst());
    }

    sortByName() {
        this.#filteredTasks.sort((a, b) =>{ 
            if (a.name < b.name) {
                return -1;
              }
              if (a.name > b.name) {
                return 1;
              }
              return 0;
        });

        this.#tasks.sort((a, b) =>{ 
            if (a.name < b.name) {
                return -1;
              }
              if (a.name > b.name) {
                return 1;
              }
              return 0;
        });
    }

    filterForDoneTasks(){
        this.#filteredTasks = this.#tasks.filter((task)=> task.isDone);
    }

    filterForUndoneTasks(){
        this.#filteredTasks = this.#tasks.filter((task)=> !task.isDone);
    }

    unfilterTasks(){
        this.#filteredTasks = [...this.#tasks];
    }

    get tasks() {
        return this.#tasks;
    }

    removeAllElementsInList(tasksList) {
        while (tasksList.firstChild) {
            tasksList.removeChild(tasksList.firstChild);
        }
    }

    appendList(){
        const tasksList=document.querySelector('#tasks-list');
        this.removeAllElementsInList(tasksList);
        for(const task of this.#filteredTasks){
            const li=document.createElement('li');
            li.id=task.id;

            const spanName=document.createElement('span');
            spanName.textContent=task.name;

            const spanStatus=document.createElement('span');
            spanStatus.textContent=`Status: ${isDone?'Done':'Undone'}`;

            const statusCheckbox=document.createElement('input');
            statusCheckbox.setAttribute('type','checkbox');
            statusCheckbox.checked=isDone;

            const editBtn=document.createElement('button');
            editBtn.className='edit-button';
            editBtn.textContent='Edit';

            const deleteBtn=document.createElement('button');
            deleteBtn.className='delete-button';
            deleteBtn.textContent='Delete';

            li.append(spanName,spanStatus,statusCheckbox,editBtn,deleteBtn);
            tasksList.append(li);
        }
    }
}
