/** @format */

"use strict";

const view = {
	formId: "todoForm",
	form: null,
	todosContainerId: "todoItems",
	todoContainer: null,
	currentItemId: null,
	removeAllBtn: null,
	controller: null,

	findForm() {
		const form = document.getElementById(this.formId);

		if (form === null || form.nodeName !== "FORM") {
			throw new Error("There is no such form on the page");
		}

		this.form = form;
		return form;
	},

	getTodosContainer() {
		const container = document.getElementById(this.todosContainerId);
		container ? (this.todoContainer = container) : null;
	},

	getRemoveAllBtn() {
		this.removeAllBtn = this.form.querySelector(".remove-all");
	},

	findInputsData() {
		return Array.from(
			this.form.querySelectorAll("input[type=text], textarea")
		).reduce((acc, item) => {
			acc[item.name] = item.value;
			return acc;
		}, {});
	},

	addFormHandler() {
		this.form.addEventListener("submit", this.formHandler.bind(this));

		this.todoContainer.addEventListener(
			"change",
			this.checkTodoItem.bind(this)
		);

		this.todoContainer.addEventListener(
			"click",
			this.removeElement.bind(this)
		);

		this.removeAllBtn.addEventListener(
			"click",
			this.removerAllTodos.bind(this)
		);
	},

	preFillTodoList() {
		document.addEventListener(
			"DOMContentLoaded",
			this.preFillHandler.bind(this)
		);
	},

	preFillHandler() {
		const data = this.controller.getData(this.formId);
		if (!data || !data.length) return;

		this.currentItemId = data[data.length - 1].itemId;

		const todoContainer = document.getElementById(this.todosContainerId);
		console.log(todoContainer);

		for (const item of data) {
			const template = this.createTemplate(item);
			todoContainer.prepend(template);
		}
	},

	formHandler(event) {
		event.preventDefault();
		this.currentItemId += 1;

		let data = {
			id: this.formId,
			completed: false,
			itemId: this.currentItemId,
			...this.findInputsData(),
		};
		console.log(data);

		this.controller.setData(data);

		this.todoContainer.prepend(this.createTemplate(data));

		event.target.reset();
	},

	checkTodoItem({ target }) {
		const itemId = target.getAttribute("data-item-id");
		const status = target.checked;

		this.controller.changeCompleted(itemId, this.formId, status);
	},

	removeElement({ target }) {
		if (!target.classList.contains("delete-btn")) return;

		this.controller.removeItem(
			this.formId,
			target.getAttribute("data-item-id")
		);

		//closest
		const rem = target;
		rem.closest("taskWrapper");
		const todoItemContainer = rem.closest(".taskWrapper");

		todoItemContainer.remove();
	},

	removerAllTodos() {
		this.controller.removeAll(this.formId);
		this.todoContainer.innerHTML = "";
	},

	createTemplate({ title, description, itemId, completed }) {
		const wrapper = document.createElement("div");
		wrapper.classList.add("col-4");

		let wrapInnerContent = '<div class="taskWrapper">';
		wrapInnerContent += `<div class="taskHeading">${title}</div>`;
		wrapInnerContent += `<div class="taskDescription">${description}</div>`;

		wrapInnerContent += `<hr>`;
		wrapInnerContent += `<label class="completed form-check">`;

		wrapInnerContent += `<input data-item-id="${itemId}" type="checkbox" class="form-check-input" >`;
		wrapInnerContent += `<span>Завершено ?</span>`;
		wrapInnerContent += `</label>`;

		wrapInnerContent += `<hr>`;
		wrapInnerContent += `<button class="btn btn-danger delete-btn" data-item-id="${itemId}">Удалить</button>`;

		wrapInnerContent += "</div>";

		wrapper.innerHTML = wrapInnerContent;
		wrapper.querySelector("input[type=checkbox]").checked = completed;

		return wrapper;
	},

	init(controllerInstance) {
		this.findForm();
		this.getTodosContainer();
		this.getRemoveAllBtn();
		this.preFillTodoList();
		this.addFormHandler();
		this.controller = controllerInstance;
	},
};
