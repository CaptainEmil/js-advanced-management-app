import Task from "../scripts/task.js";
import TasksList from "../scripts/tasks-list.js";
import {regexDescription,regexName} from '../scripts/regex.js';

const homeButton=document.querySelector('.home-button');
let paramString = location.href.split('?')[1];
let queryString = new URLSearchParams(paramString);
for (let pair of queryString) {
   console.log("Key is: " + pair[0]);
   console.log("Value is: " + pair[1]);
}

homeButton.addEventListener('click',(e)=>{
    location.href='/index.html';
});

