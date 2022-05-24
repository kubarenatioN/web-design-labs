const root = document.getElementById("root");
const addTaskForm = document.getElementById("add-task");

const labels = ["Done", "Missed"];

const config = {
	type: 'bar',
	data: {
		labels,
		datasets: [{
			label: 'Tasks',
			data: [1, 2],
			backgroundColor: [
				'rgba(75, 192, 192, 0.2)',
				'rgba(255, 159, 64, 0.2)',
			],
			borderColor: [
				'rgb(75, 192, 192)',
				'rgb(255, 159, 64)',
			],
			borderWidth: 1,
		}],
	},
	options: {
		scales: {
			y: {
				ticks: {
					stepSize: 1
				}
			}
		}
	}
}

const chart = new Chart(document.getElementById("chart"), config);

let tasksStore = [
	{
		title: "Go to gym",
		done: true,
	},
	{
		title: "Do lab works",
		done: true,
	},
	{
		title: "Watch Netflix",
		done: false,
	},
];

const Task = Backbone.Model.extend({
	defaults: {
		title: "Untitled",
		done: false,
	},
});

const TaskView = Backbone.View.extend({
	initialize: function () {
		this.render();
	},
	tagName: "li",
	template: function (data) {
		const { title, done } = data;
		this.el.classList.add("task-item");
		if (done) {
			this.el.classList.add("checked");
		}
		this.el.dataset.id = title;
		return `
			<h3>${title}</h3>
			<input type='text'/>
			<input type='checkbox' ${
				done ? "checked" : ""
			} onChange="checkChanged(event)" />
			<button class="removeBtn" onclick="removeTask('${title}')">Remove</button>
			<button class="editBtn" onclick="editTask(this, '${title}')">Edit</button>
			<button class="saveBtn" onclick="saveTask(this, '${title}')">Save</button>
		`;
	},
	render: function () {
		this.$el.html(this.template(this.model.attributes));
	},
});

const TaskView2 = Backbone.View.extend({
	initialize: function () {
		this.render();
	},
	render: function () {
		this.$el.html(this.template(this.model.attributes));
	},
});

const TaskCollection = Backbone.Collection.extend({
	model: Task,
	render: function (data, root) {
		this.reset(data);
		root.innerHTML = "";
		this.models.forEach((m) => {
			const view = new TaskView({ model: m });
			root.append(view.el);
		});
	},
});

const tasksCollection = new TaskCollection();
tasksCollection.render(tasksStore, root);
// tasksCollection.render(root)

function addTask(task) {
	tasksStore.push(task);
	tasksCollection.render(tasksStore, root);
	updateChartData(tasksCollection.models.map(model => model.attributes))
}

function removeTask(title) {
	tasksStore = tasksStore.filter((t) => t.title !== title);
	tasksCollection.render(tasksStore, root);
	updateChartData(tasksCollection.models.map(model => model.attributes))
}

function editTask(btn) {
	const item = btn.parentNode;
	console.log(item);
	item.classList.add("editable");
	const title = item.querySelector("h3");
	const editInput = item.querySelector('input[type="text"]');
	editInput.value = title.textContent;
}

function saveTask(btn) {
	const prevTitle = btn.parentNode.dataset.id;
	const newTitle = btn.parentNode.querySelector('input[type="text"]').value;
	tasksStore.forEach((t) => {
		if (t.title === prevTitle) {
			t.title = newTitle;
		}
	});
	tasksCollection.render(tasksStore, root);
}

function checkChanged(e) {
	const isChecked = e.target.checked;
	const item = e.target.parentNode;
	if (!isChecked) {
		item.classList.remove("checked");
	} else {
		item.classList.add("checked");
	}
	const title = item.dataset.id
	// console.log(title);
	const updatedModels = tasksCollection.models.map(model => {
		if (model.attributes.title !== title) return model
		model.attributes.done = !model.attributes.done
		return model
	})
	updateChartData(updatedModels.map(model => model.attributes))
}

addTaskForm.addEventListener("submit", (e) => {
	e.preventDefault();

	const formData = new FormData(addTaskForm);
	const title = formData.get("title");
	addTask({
		title,
		done: false,
	});

	addTaskForm.reset();
});

function getTasksByStatus(tasks) {
	const done = tasks.filter(t => t.done)
	const failed = tasks.filter(t => !t.done)
	return [done.length, failed.length]
}

function updateChartData(data) {
	const newData = getTasksByStatus(data)
	chart.data.datasets[0].data = newData
	chart.update()
}