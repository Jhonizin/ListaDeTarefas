document.addEventListener('DOMContentLoaded', () => {
  const taskForm = document.getElementById('task-form');
  const taskInput = document.getElementById('task-input');
  const taskList = document.getElementById('task-list');

  // Carregar tarefas ao iniciar
  loadTasks();

  // Adicionar nova tarefa
  taskForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const description = taskInput.value.trim();
    
    if (description) {
      try {
        const response = await fetch('http://localhost:3000/api/tasks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ description })
        });
        const newTask = await response.json();
        addTaskToDOM(newTask);
        taskInput.value = '';
      } catch (error) {
        console.error('Erro ao adicionar tarefa:', error);
      }
    }
  });

  // Carregar tarefas do servidor
  async function loadTasks() {
    try {
      const response = await fetch('http://localhost:3000/api/tasks');
      const tasks = await response.json();
      tasks.forEach(addTaskToDOM);
    } catch (error) {
      console.error('Erro ao carregar tarefas:', error);
    }
  }

  // Adicionar tarefa ao DOM
  function addTaskToDOM(task) {
    const li = document.createElement('li');
    li.dataset.id = task.id;
    
    const span = document.createElement('span');
    span.textContent = task.description;
    if (task.completed) {
      span.classList.add('completed');
    }
    
    span.addEventListener('click', () => toggleTaskCompletion(task.id, span));
    
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Excluir';
    deleteBtn.classList.add('delete-btn');
    deleteBtn.addEventListener('click', () => deleteTask(task.id, li));
    
    li.appendChild(span);
    li.appendChild(deleteBtn);
    taskList.appendChild(li);
  }

  // Alternar status de conclusão
  async function toggleTaskCompletion(id, span) {
    try {
      const task = await fetch(`http://localhost:3000/api/tasks/${id}`).then(res => res.json());
      const response = await fetch(`http://localhost:3000/api/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !task.completed })
      });
      const updatedTask = await response.json();
      span.classList.toggle('completed', updatedTask.completed);
    } catch (error) {
      console.error('Erro ao atualizar tarefa:', error);
    }
  }

  // Excluir tarefa
  async function deleteTask(id, li) {
    try {
      await fetch(`http://localhost:3000/api/tasks/${id}`, { method: 'DELETE' });
      taskList.removeChild(li);
    } catch (error) {
      console.error('Erro ao excluir tarefa:', error);
    }
  }
});