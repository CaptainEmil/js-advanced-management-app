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
    }

    filterForDoneTasks(){
        this.#filteredTasks = this.#tasks.filter((task)=> task.isDone);
    }

    filterForUndoneTasks(){
        this.#filteredTasks = this.#tasks.filter((task)=> !task.isDone);
    }

    get tasks() {
        return this.#tasks;
    }
}
