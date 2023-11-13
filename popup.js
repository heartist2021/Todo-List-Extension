document.addEventListener('DOMContentLoaded', function () {
  const taskInput = document.getElementById('task-input');
  const addTaskButton = document.getElementById('add-task');
  const todoList = document.getElementById('todo-list');

  // Retrieve tasks from storage and display them
  chrome.storage.sync.get('tasks', function (data) {
    const tasks = data.tasks || [];
    tasks.forEach(task => displayTask(task));
  });

  addTaskButton.addEventListener('click', function () {
    const taskText = taskInput.value.trim();

    if (taskText !== '') {
      const task = { text: taskText, done: false };

      // Retrieve tasks from storage, add new task, and save it back
      chrome.storage.sync.get('tasks', function (data) {
        const tasks = data.tasks || [];
        tasks.push(task);

        chrome.storage.sync.set({ tasks: tasks }, function () {
          displayTask(task);
          taskInput.value = '';
        });
      });
    }
  });

  function displayTask(task) {
    const taskItem = document.createElement('li');
    taskItem.classList.add('task-item');

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.classList.add('task-checkbox');
    checkbox.checked = task.done;

    const taskText = document.createElement('span');
    taskText.textContent = task.text;

    taskItem.appendChild(checkbox);
    taskItem.appendChild(taskText);

    // Mark task as done when checkbox state changes
    checkbox.addEventListener('change', function () {
      task.done = this.checked;
      chrome.storage.sync.set({ tasks: tasks });
      updateTaskStyle(taskItem, task);
    });

    // Set initial style based on task status
    updateTaskStyle(taskItem, task);

    todoList.appendChild(taskItem);
  }

  function updateTaskStyle(taskItem, task) {
    if (task.done) {
      taskItem.style.textDecoration = 'line-through';
      taskItem.style.color = '#888';
    } else {
      taskItem.style.textDecoration = 'none';
      taskItem.style.color = '#000';
    }
  }
});
