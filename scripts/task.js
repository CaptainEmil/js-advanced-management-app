export default class Task {
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

    set id(id){
        this.#id=id;
    }

    get name() {
        return this.#name;
    }

    set name(name){
        this.#name=name;
    }


    get description() {
        return this.#description;
    }

    set description(description){
        this.#description=description;
    }

    get date() {
        return this.#date;
    }

    set date(date) {
        this.#date=date;
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

    set dateInst(dateInst) {
        this.#dateInst=dateInst;
    }

    toJSON() {
        return {
            ['id']: this.#id,
            ['name']: this.#name,
            ['description']: this.#description,
            ['date']: this.#date,
            ['dateInst']: this.#dateInst,
            ['isDone']: this.#isDone,
        };
    }

    static fromJSON(id,name,description,date,dateInst,isDone){
        const newTask=new Task(name,description);
        newTask.id=id;
        newTask.date=date;
        newTask.dateInst=new Date(dateInst);
        newTask.isDone=isDone;
        return newTask;
    }
}