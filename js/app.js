/** @format */
"use strict";

(function () {
	let controllerInstance = controller(view, model);
	view.init(controllerInstance);
	model.init(controllerInstance);
})();
