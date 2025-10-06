let tasks = [];

const addTask = (tasks, value) => [             
    ...tasks, 
    {
        id: crypto.randomUUID(),
        text: value,
        isState: false
    }
]

const removeTask = (tasks, id) => tasks.filter(t => t.id !== id)

const updateTask = (tasks, id) => tasks.map(
    t => t.id === id
        ? { ...t, isState: !t.isState }
        : t
)

const filterTasks = (tasks, predicate) => tasks.filter(predicate)
const filter = (tasks, func, status) => {
    switch(status) {
        case "complete": 
            return func(tasks, t => t.isState)
        case "incomplete":
            return func(tasks, t => !t.isState)
        default: 
            return tasks
    }
}

const render = (tasks) => {
    const taskList = document.getElementById("task-list");
    
    taskList.innerHTML = tasks.map(t => `
        <div class="task">
            <input class="state" data-id="${t.id}" type="checkbox" ${t.isState && "checked"} />
            <span>${t.text}</span>
            <button class="button" data-id="${t.id}">✕</button>
        </div>
    `).join("");
}

document.getElementById("add-button")
    .addEventListener("click", () => {
        const input = document.getElementById("input")

        if (!input.value.trim())
            return

        tasks = addTask(tasks, input.value.trim())
        input.value = ""
        render(filter(tasks))
    })
            
document.getElementById("task-list")
    .addEventListener("click", (event) => {
        if (!event.target.classList.contains("button"))
            return

        tasks = removeTask(tasks, event.target.getAttribute("data-id"))
        render(tasks)
    })

document.getElementById("task-list")
    .addEventListener("change", (event) => {
        if (!event.target.classList.contains("state"))
            return

        tasks = updateTask(tasks, event.target.getAttribute("data-id"))
        render(tasks)
    })

document.getElementById("filter-containers")
    .addEventListener("click", (event) => {
        if (!event.target.classList.contains("filter-button"))
            return

        const sort = filter(
            tasks,
            filterTasks, 
            event.target.getAttribute("data-state")
        )

        render(sort)
    })
