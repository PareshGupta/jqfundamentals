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
		this.addSearch();
		this.bindEvents();
	},

	bindEvents : function() {
		this.Employee.hover();
		this.Employee.removeEvent();
		this.Todo.showHideEvent();
		this.Todo.addTodos();
		this.Todo.removeTodo();
		this.Todo.save();
		this.Todo.edit();
		this.Todo.searchTodo();
		this.Todo.showHideAllTodos();
		this.Role.hoverEvent();
		this.Role.removeEvent();
	},

	addSearch : function() {
		$('<input>', { type : 'search'}).appendTo("#search-container");
		$('<button>', { id : 'search', text : 'Search'}).appendTo("#search-container");
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
	},

	// method to add the to-do list items 
	addTodos : function() {
		$(".role-todos").on("click", ".add-todos", function() {
			if($(this).prev().children().length >= 3) {
				$(this).prev().css('overflow', 'scroll');
			}
			$(this).prev().find(".text").remove();
			var $todoListItem = $("<div>", { class : "todo-listitem" });
			$("<input>", { type : 'text', class : 'todo-input'}).appendTo($todoListItem);
			$("<a>", { class : 'save'}).appendTo($todoListItem);
			$("<a>", { class : 'cancel'}).appendTo($todoListItem);
			$todoListItem.appendTo($(this).prev());
		});
	},

	// method to remove the todo list items
	removeTodo : function() {
		$(".role-todos").on("click", ".cancel, .remove-todo", function() {
			if($(this).parent().siblings().length <= 3) {
				$(this).parents(".todo-container").css("overflow", "visible");
			}
			if(!$(this).parent().siblings().length) {
				var name = $(this).parents(".todo-container").prev().text();
				$("<span>", { class : 'text' }).text("Add todos for " + name + " here").appendTo($(this).parents(".todo-container"));
			} 
			$(this).parent().remove();
		});
	},

	// method to save the todo list items
	save : function() {
		$(".role-todos").on("click", ".save", function() {
			var value = $(this).prev().val();
			if($(this).parent().siblings(":contains(" + value + ")").length) {
				alert("This todo is already assigned to the employee");
			} else {
				$(this).prev().remove();
				$("<span>", { class : 'todo'}).text(value).prependTo($(this).parent());
				$(this).addClass('edit').removeClass('save');
				$(this).next().addClass('remove-todo').removeClass('cancel');
			}
		});
	},

	// method to edit the todo list items
	edit : function() {
		$(".role-todos").on("click", ".edit", function() {
			var value = $(this).prev().text();
			$(this).prev().remove()
			$("<input>", { class : 'todo-input', type : 'text', value : value}).prependTo($(this).parent());
			$(this).addClass('save').removeClass('edit');
			$(this).next().addClass('cancel').removeClass('remove-todo');
		});
	},

	// method to search the todo list items
	searchTodo : function() {
		$('#search').click(function() {
			if($(".sub-container input").length) {
				alert("ToDo list cannot be in edit/new state");
			} else {
				$(".sub-container").hide();
				var value = $("[type='search']").val();
				$(".sub-container:contains(" + value + ")").slideDown(400).siblings().slideDown(400);
				var $employeeName = $(".sub-container:contains(" + value + ")").find(".employee-name");
				$employeeName.each(function() {
					$(this).addClass("highlight");
				});
				setTimeout(function() {
					$employeeName.each(function() {
						$(this).removeClass("highlight");
					});
				}, 2000);
			}
		});
	},

	// method to show and hide all the todo's of all employees
	showHideAllTodos : function() {
		$("#show-todos").click(function() {
			// $(".role-todos").slideDown(400);
			$(".sub-container").slideDown(400);
		});

		$("#hide-todos").click(function() {
			// $(".role-todos").slideUp(400);
			$(".sub-container").slideUp(400);
		});
	}
}

App.Role = {
	// hover event on the employee names in Role section
	hoverEvent : function() {
		$(".ui-droppable").on('mouseenter', 'li', function() {
			$(this).children().show();
		});

		$(".ui-droppable").on('mouseleave', 'li', function() {
			$(this).children().hide();
		});
	},

	// method to remove the employee name from the role section
	removeEvent : function() {
		$("#roles").on('click', '.remove', function() {
			var roleData = $(this).parents(".ui-droppable").attr("data-role");
			var nameData = $(this).parent().attr("data-name");
			if(confirm("Press Ok to Delete")) {
				$(this).parent().remove();
				$("div[data-role = '" + roleData + "']").find($("[data-name ='" + nameData + "']")).remove();	
			}
		});
	}
}

App.Employee = {
	// method to hover on the employee names in Employee section
	hover : function() {
		$("#employees ul").on('mouseenter', ".ui-draggable", function() {
			$(this).children().show();
		});

		$("#employees ul").on('mouseleave', ".ui-draggable", function() {
			$(this).children().hide();
		});
	},

	removeEvent : function() {
		$("#employees ul").on('click', '.remove', function() {
			var $employeeName = $(this).parent().attr("data-name");
			if(confirm("Press Ok to remove the Employee ")) {
				$("[data-name='" + $employeeName + "']").remove();
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
	var $employeeName = $("<li>", { text : this.name }).attr("data-name", this.name);
	$("<a>", { class : "remove"}).hide().appendTo($employeeName);
	$employeeName.appendTo($("#employees ul"));
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
				that.addEmployee($(this), ui.draggable.text());
			}
		}
	}).disableSelection();
}

Role.prototype.addEmployee = function(role, name) {
	var $div = $("<div>", { class : "sub-container" }).attr("data-name", name);
		$("<p>", { class : "employee-name", text : name }).appendTo($div);
		$("<div>", { class : "todo-container"}).html("<span class='text'>Add todos for " + name + " here" +"</span>").appendTo($div);
		$("<a>", { class : 'add-todos'}).appendTo($div);
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
	$("<p>").html("<span class='todo-header'>" + this.role +"</span> <a class='minus show-hide'/>").appendTo($div);
	$div.appendTo("#to-dos");
}

$(function() {
	App.init();
});
