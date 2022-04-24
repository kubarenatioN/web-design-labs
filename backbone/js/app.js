const root = document.getElementById('root')
const addTaskForm = document.getElementById('add-task')

let tasksStore = [
	{
		title: 'Go to gym',
		done: true,
	},
	{
		title: 'Do lab works',
		done: true,
	},
	{
		title: 'Watch Netflix',
		done: false,
	},
]

const Task = Backbone.Model.extend({
	defaults: {
		title: 'Untitled',
		done: false,
	},
})

const TaskView = Backbone.View.extend({
	initialize: function(){
		this.render()
	},
	tagName: 'li',
	template: function(data) {
		const { title, done } = data
		this.el.classList.add('task-item')
		if (done) {
			this.el.classList.add('checked')
		}
		this.el.dataset.id = title
		return `
			<h3>${title}</h3>
			<input type='text'/>
			<input type='checkbox' ${done ? 'checked' : ''} onChange="checkChanged(event)" />
			<button class="removeBtn" onclick="removeTask('${title}')">Remove</button>
			<button class="editBtn" onclick="editTask(this, '${title}')">Edit</button>
			<button class="saveBtn" onclick="saveTask(this, '${title}')">Save</button>
		`
	},
	render: function() {
		this.$el.html(this.template(this.model.attributes))
	},
})

const TaskCollection = Backbone.Collection.extend({
	model: Task,
	render: function(data, root) {
		this.reset(data)
		root.innerHTML = ''
		this.models.forEach(m => {
			const view = new TaskView({ model: m })
			root.append(view.el)
		})
	},
})

const tasksCollection = new TaskCollection()
tasksCollection.render(tasksStore, root)
// tasksCollection.render(root)

function addTask(task) {
	tasksStore.push(task)
	tasksCollection.render(tasksStore, root)
}

function removeTask(title) {
	tasksStore = tasksStore.filter(t => t.title !== title)
	tasksCollection.render(tasksStore, root)
}

function editTask(btn) {
	const item = btn.parentNode
	console.log(item)
	item.classList.add('editable')
	const title = item.querySelector('h3')
	const editInput = item.querySelector('input[type="text"]')
	console.log(title, editInput);
	editInput.value = title.textContent
}

function saveTask(btn) {
	const prevTitle = btn.parentNode.dataset.id
	const newTitle = btn.parentNode.querySelector('input[type="text"]').value
	tasksStore.forEach(t => {
		if (t.title === prevTitle) {
			t.title = newTitle
		}
	})
	console.log(tasksStore);
	tasksCollection.render(tasksStore, root)
}

function checkChanged(e) {
	console.log(e.target);
	const isChecked = e.target.checked
	const item = e.target.parentNode
	console.log(item); 
	if (!isChecked) {
		item.classList.remove('checked')
	} else {
		item.classList.add('checked')
	}
	console.log(e.target.checked);
}

addTaskForm.addEventListener('submit', (e) => {
	e.preventDefault()

	const formData = new FormData(addTaskForm)
	const title = formData.get('title')
	addTask({
		title,
		done: false,
	})
	
	addTaskForm.reset()
})