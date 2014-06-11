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
		this.addTodos();
		this.showHideEvent();
		this.hoverEvent();
		this.removeEvent();
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
	},

	addTodos : function() {
		$(this.seedData["roles"]).each(function(index, role) {
			var todoHeader = new ToDo(role);
		});
	},

	// method to show hide the the to do list
	showHideEvent : function() {
		$("#to-dos").on("click", "img", function() {
			if($(this).hasClass('minus')) {
				$("<img>", { class : "plus show-hide", src : "plus-icon.jpg"}).appendTo($(this).parent());
				$(this).parent().siblings(".sub-container").slideUp(400);
			} else {
				$("<img>", { class : "minus show-hide", src : "minus-icon.jpg"}).appendTo($(this).parent());
				$(this).parent().siblings(".sub-container").slideDown(400);
			}
			$(this).remove();
		});
	},

	// hover event on the employee names to show the delete option
	hoverEvent : function() {
		$(".ui-droppable").on('mouseenter', 'li:not(:first)', function() {
			$(this).children().show();
		});

		$(".ui-droppable").on('mouseleave', 'li:not(:first)', function() {
			$(this).children().hide();
		})
	},

	// method to remove the employee name
	removeEvent : function() {
		$("#roles").on('click', '.remove', function() {
			var roleData = $(this).parents(".ui-droppable").attr("data-role");
			var nameData = $(this).parent().attr("data-name");
			$(this).parent().remove();
			$("div[data-role = '" + roleData + "']").find($("[data-name ='" + nameData + "']")).remove();
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
	$("#employees li:not(:first)").draggable({
		snap : true,
		cursor : "move",
		helper : "clone",
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
	$("<ul>").attr("data-role", this.role)
					 .html($("<li>", { class : 'role-header',text : this.role }))
					 .appendTo("#roles");
}

Role.prototype.droppable = function() {
	var that = this;
	$("#roles ul").droppable({
		drop : function(event, ui) {
			if($(this).find($("li", { class : ui.draggable.text()})).length > 1) {  // issue 1 : if condition not working
				return false;
			} else {
				var employeeName = ui.draggable.clone()
																	 		 .removeClass("ui-draggable")
																	 		 .attr("data-name", ui.draggable.text())
																	 		 .appendTo($(this));
				$("<img>", { class : "remove", src : "cross.png"}).appendTo(employeeName).hide();
				that.addEmployees($(this), ui.draggable);
			}
		}
	}).disableSelection();
}

Role.prototype.addEmployees = function(obj, ui) {
	var $div = $("<div>", { class : "sub-container" }).attr("data-name", ui.text());
		$("<p>", { class : "employee-name", text : ui.text() }).appendTo($div);
		$("<textarea>", { text : "Add todos for " + ui.text() + " here"}).appendTo($div);
		var selectorStr = "[data-role = '" + obj.attr("data-role") + "']";
		$div.appendTo($("div" + selectorStr));
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
	$("<p>").html("<span>" + this.role +"</span> <img class='minus show-hide' src='minus-icon.jpg'/>").appendTo($div);
	$div.appendTo("#to-dos");
}

$(function() {
	App.init();
});