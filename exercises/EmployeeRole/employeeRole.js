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
		this.addRoles();
	},

	addEmployees : function() {
		$(this.seedData["employees"]).each(function(index, name) {
			var employee = new Employee(name);
		});
	},

	addRoles : function() {
		$(this.seedData["roles"]).each(function(index, role) {
			var role = new Role(role);
		});
	}

}

// Employee Class
function Employee(name) {
	this.name = name;
	this.init();
}

Employee.prototype.init = function() {
	this.add();
	this.draggable();	
}

Employee.prototype.add = function() {
	$("<li>", { text : this.name }).appendTo($("#employees"));
}

Employee.prototype.draggable = function() {
	$("#employees li").draggable({
		snap : true,
		cursor : "move",
		helper : "clone",
		stop: function(event, ui) {
      // $(li.helper).clone(true);						// issue 1 : drag only copy of the employee name
    }
	}).disableSelection();
}

// Role Class
function Role(role) {
	this.role = role;
	this.init();
}

Role.prototype.init = function() {
	this.add();
	this.droppable();		
}

Role.prototype.add = function() {
	$("<ul>").data("role", this.role).html($("<li>", { text : this.role })).appendTo("#roles");
}

Role.prototype.droppable = function() {
	$("#roles ul").droppable({
		drop : function(event, ui) {
			if($(this).find(ui).length) {
				return 0;
			} else {
				ui.draggable.appendTo($(this));		
			}
		}
	});
}


$(function() {
	App.init();
});