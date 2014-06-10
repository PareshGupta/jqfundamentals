var App = {
	init : function() {
		$.getJSON("data.json")
			.done(function(data) {
				App.seedData = data;
				App.setup();
			})
			.fail(function() {
				alert("Not able to load JSON");
			});
	},

	setup : function() {
		this.addEmployees();
	},

	addEmployees : function() {
		$(this.seedData["employees"]).each(function(index, name) {
			var employee = new Employee(name);
		});
	}

}

function Employee(name) {
	this.name = name;
	this.add();
	this.draggable();
}

Employee.prototype.add = function() {
	$("<li>", { text : this.name } ).appendTo($("#employees"));
}

Employee.prototype.draggable = function() {
	$("#employees li").draggable({
		snap : true,
		cursor : "move",
		helper : "clone"
	}).disableSelection();
}

$(function() {
	App.init();
});