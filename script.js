let taskList = document.querySelector("ul")
let taskTitle = document.querySelector("#title");
let textBox = document.querySelector("#textbox");
let savebtn = document.querySelector("#save");
let updateBtn = document.querySelector(".add-btn")
let deleteBtn = document.querySelector(".delete-btn")



function toggleOutline() {
  if (taskTitle.style.outline === "none" && textBox.style.outline === "none") {
    taskTitle.style.outline = "2px solid #386491";
    textBox.style.outline = "2px solid #386491";
  } else {
    taskTitle.style.outline = "none";
    textBox.style.outline = "none"
  }
}
// Keyboard Functionality
taskTitle.addEventListener("keyup", (e) => {
    if (e.key === "Enter" && taskTitle.value !== "") {
        createTask()
    }
})

// function to open a task...

let selectedTaskId = null;
let viewTask = null;

taskList.addEventListener("click", function (e) {
    let li = e.target.closest("li");
    let fullData = getData()
    if (!li) return;

    let id = li.dataset.id;
    selectedTaskId = id;
    viewTask = fullData.find(item => item.id == id)
    taskTitle.value = viewTask.title;
    toggleOutline()
    taskTitle.setAttribute("readonly", true)
    textBox.value = viewTask.description;
    textBox.setAttribute("readonly", true)

    document.querySelectorAll("li").forEach((e) => {
        e.classList.remove("active")
    })

    li.classList.add("active")
})

// Checks duplicate name titles:
function isDuplicateTask(title) {
    let tasks = getData();
    let normalizedTitle = title.trim().toLowerCase();

    return tasks.some(task =>
        task.title.trim().toLowerCase() === normalizedTitle
    );
}

// To create a task in the side bar
let createTask = function () {
    let notesName = taskTitle.value.trim();
    let userText = textBox.value.trim()
    if (isDuplicateTask(notesName)) {
        alert("Please use another title name...")
        taskTitle.removeAttribute("readonly")
        taskTitle.focus()
        textBox.removeAttribute("readonly")
        taskTitle.value = ""
        return;
    }
    if(notesName === ""){
        alert("Create a task")
        taskTitle.removeAttribute("readonly")
        textBox.removeAttribute("readonly")
        taskTitle.focus()

    }
    if (notesName !== "" && userText !== "") {
        addToLocalStorage(notesName, userText);
        showUserTask()
        taskTitle.value = ""
        textBox.value = ""
    }
    showUserTask()
}
savebtn.addEventListener("click", createTask)

// task updation...
let id = null;
let taskEdit = false;
taskList.addEventListener("click", (e) => {
    let li = e.target.closest("li")
    if (!li) return
    id = li.dataset.id
})
updateBtn.textContent = "Edit"
let updateTask = function () {
    if (taskTitle.value.trim() === "" && updateBtn.textContent === "Save") {
        // updateBtn.textContent === "Edit"
        alert("Select you task for editing...")
    }
    if (!taskEdit) {
        taskTitle.removeAttribute("readonly")
        textBox.removeAttribute("readonly")
        taskTitle.focus()
        updateBtn.textContent = "Save"
        updateBtn.style.backgroundColor = "#ffffff"
        updateBtn.style.color = "black"
        taskEdit = true;
        toggleOutline()
    }
    else {
        let allData = getData();
        let updatedTitle = taskTitle.value.trim();
        let updatedDescription = textBox.value.trim();
        let taskIndex = allData.findIndex(item => item.id == id)
        allData[taskIndex].title = updatedTitle;
        allData[taskIndex].description = updatedDescription
        localStorage.setItem("task", JSON.stringify(allData))
        textBox.setAttribute("readonly", true)
        taskTitle.setAttribute("readonly", true)
        updateBtn.textContent = "Edit"
        updateBtn.style.backgroundColor = "#DF6756"
        updateBtn.style.color = "white"
        taskEdit = false;
        toggleOutline()

    }
    showUserTask()
}

updateBtn.addEventListener("click", updateTask)

// Saving and Retrieving data from local storage:
function addToLocalStorage(taskName, text) {
    let data = JSON.parse(localStorage.getItem("task")) || [];
    let newTask = {
        id: Date.now(),
        title: taskName,
        description: text,
    }
    data.push(newTask)
    localStorage.setItem("task", JSON.stringify(data))
}

let getData = function () {
    return JSON.parse(localStorage.getItem("task")) || []
}

const showUserTask = () => {
    taskList.innerHTML = ""
    let allData = getData()
    allData.forEach((task) => {
        let list = document.createElement("li")
        list.className = "note-item"
        list.textContent = task.title;
        list.dataset.id = task.id;

        if (task.id == selectedTaskId) {
            list.classList.add("active");
        }
        taskList.appendChild(list);
    })

}
showUserTask()

deleteBtn.addEventListener("click", function () {
    let del = getData()
    let index = del.findIndex(item => item.id == viewTask.id)
    del.splice(index, 1)
    localStorage.setItem("task", JSON.stringify(del))
    showUserTask()
    taskTitle.value = ""
    textBox.value = ""

})