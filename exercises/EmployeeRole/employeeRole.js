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
		this.bindEvents();
	},

	bindEvents : function() {
		this.Todo.showHideEvent();
		this.Role.hoverEvent();
		this.Role.removeEvent();
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

// event methods on ToDo section
App.Todo = {
	// method to show hide the the to do list
	showHideEvent : function() {
		$("#to-dos").on("click", "a.show-hide", function() {
			if($(this).hasClass('minus')) {
				$(this).addClass('plus').removeClass('minus').appendTo($(this).parent());
				$(this).parent().siblings(".sub-container").slideUp(400);
			} else if($(this).hasClass('plus')) {
				$(this).addClass('minus').removeClass('plus').appendTo($(this).parent());
				$(this).parent().siblings(".sub-container").slideDown(400);
			}
		});
	}
}

// event methods on Role section
App.Role = {
	// hover event on the employee names in Role section
	hoverEvent : function() {
		$(".ui-droppable").on('mouseenter', 'li', function() {
			$(this).children().show();
		});

		$(".ui-droppable").on('mouseleave', 'li', function() {
			$(this).children().hide();
		})
	},

	// method to remove the employee name
	removeEvent : function() {
		$("#roles").on('click', '.remove', function() {
			var roleData = $(this).parents(".ui-droppable").attr("data-role");
			var nameData = $(this).parent().attr("data-name");
			if(confirm("Press Ok to Delete") == true) {
				$(this).parent().remove();
				$("div[data-role = '" + roleData + "']").find($("[data-name ='" + nameData + "']")).remove();	
			}
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
	$("<li>", { text : this.name }).attr("data-name", this.name).appendTo($("#employees ul"));
}

Employee.prototype.draggable = function() {
	$("#employees li").draggable({
		snap : true,
		cursor : "move",
		helper : "clone"
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
	var $roleSection = $("<div>");
	$("<p>", { class : 'role-header',text : this.role }).appendTo($roleSection);
	$("<ul>").attr("data-role", this.role).appendTo($roleSection);
	$roleSection.appendTo("#roles");
	var todoHeader = new ToDo(this.role);
}

Role.prototype.droppable = function() {
	var that = this;
	$("#roles ul").droppable({
		drop : function(event, ui) {
			if($(this).find($("[data-name='" + ui.draggable.attr("data-name") + "']")).length >=1) { 
				alert("This Employee is already assigned to this role");
			} else {
				var employeeName = ui.draggable.clone()
																	 		 .attr("data-name", ui.draggable.text())
																	 		 .appendTo($(this));
				$("<img>", { class : "remove", src : "cross.png"}).appendTo(employeeName).hide();
				that.addEmployee($(this), ui.draggable.text());
			}
		}
	}).disableSelection();
}

Role.prototype.addEmployee = function(role, name) {
	var $div = $("<div>", { class : "sub-container" }).attr("data-name", name);
		$("<p>", { class : "employee-name", text : name }).appendTo($div);
		$("<textarea>", { text : "Add todos for " + name + " here"}).appendTo($div);
		var selectorStr = "[data-role = '" + role.attr("data-role") + "']";
		if($("div" + selectorStr).find($(".plus")).length) {
			$div.appendTo($("div" + selectorStr)).hide();
		} else {
			$div.appendTo($("div" + selectorStr)).show();
		}
}

// class ToDo
function ToDo(role) {
 	this.role = role;
 	this.init();	
}

ToDo.prototype.init = function() {
	this.add();
}

ToDo.prototype.add = function() {
	$div = $("<div>", { class : 'role-todos'}).attr("data-role", this.role);
	$("<p>").html("<span>" + this.role +"</span> <a class='minus show-hide'/>").appendTo($div);
	$div.appendTo("#to-dos");
}

$(function() {
	App.init();
});
