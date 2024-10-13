// Get references to input and list elements
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');

// Add a new task
function addTask() {
  const taskText = todoInput.value.trim();
  if (taskText === '') return;

  const li = document.createElement('li');
  const input = document.createElement('input');
  input.type = 'text';
  input.value = taskText;
  input.disabled = true;

  const buttonContainer = document.createElement('div');
  buttonContainer.className = 'task-buttons';

  const editButton = document.createElement('button');
  editButton.textContent = 'Edit';
  editButton.onclick = () => toggleEdit(input, editButton);

  const deleteButton = document.createElement('button');
  deleteButton.textContent = 'Delete';
  deleteButton.onclick = () => li.remove();

  buttonContainer.appendChild(editButton);
  buttonContainer.appendChild(deleteButton);

  li.appendChild(input);
  li.appendChild(buttonContainer);
  todoList.appendChild(li);

  todoInput.value = '';
}

// Toggle edit mode for a task
function toggleEdit(input, editButton) {
  if (input.disabled) {
    input.disabled = false;
    editButton.textContent = 'Save';
    input.focus();
  } else {
    input.disabled = true;
    editButton.textContent = 'Edit';
  }
}
