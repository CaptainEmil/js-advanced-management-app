import Task from "./task.js";

export default class TasksList {
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