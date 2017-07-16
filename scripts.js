//or $.ready(function()..$ is variable to access jquery
$(function() {		//$ means wait for doc to load before running JS here
    //$('#app-container').append('Hello');
	var todos = [
    {
        task: 'do jQuery tutorial',
        isCompleted: false
    },
    {
        task: 'take a nap',
        isCompleted: true
    }
    ];

    var app = {		//namespacing
        showTodos: function() {
            var todosListEl = $('#todos-list');	//selector is called

            todosListEl.html('');		//jquery method making sure its empty

            todos.forEach(function(todo) {
                var taskClasses = 'todo-task' + (todo.isCompleted ? ' is-completed' : '');	//puts empty string if it is not completed
				//backslashes is for multiple lines
                todosListEl.append('\
                <tr>\
                    <td class="' + taskClasses + '">' + todo.task + '</td>\
                    <td>\
                        <button class="edit-button">Edit</button>\
                        <button class="delete-button">Delete</button>\
                        <button class="save-button">Save</button>\
                        <button class="cancel-button">Cancel</button>\
                    </td>\
                </tr>\
                ');
            });
        },

        addTodo: function(event) {
            event.preventDefault();			//preventing default behaviour..prevent from refreshing on clicking create
            
            var createInput = $('#create-input');
            //createInput.val("hello");
			var createInputValue = createInput.val();		//.val grabs whatever in input box..jquert method
			//console.log(createInputValue);
            var errorMessage = null;		//assuming there is no error at first

            if (!createInputValue) {		//if no input value
                errorMessage = 'Task cannot be empty.';
            } else {
                todos.forEach(function(todo) {
                    if (todo.task === createInputValue) {
                        errorMessage = 'Task already exists.'
                    }
                });
            }

            if (errorMessage) {
                app.showError(errorMessage);
                return;		//return data back rather than pushing into array
            }

            todos.push({
                task: createInputValue,
                isCompleted: false
            });

            createInput.val('');		//to clear input from input box once it is created
            app.showTodos();
        },

        toggleTodo: function() {
            todos.forEach(function(todo) {
                if (todo.task === $(this).text()) {				//if task matches with item clicked
                    todo.isCompleted = !todo.isCompleted;		//toggling
					console.log(this);
					console.log($(this).text());		//.text is jquery 
                }
            }.bind(this));		//to bind it to this particular context..else window is shown in console
            app.showTodos();		//to refresh with new toggling
        },

        enterEditMode: function() {
            var actionsCell = $(this).closest('td');		//narrow event to just one row..$this is for edit button
            var taskCell = actionsCell.prev();				//the todotask is previous element of this selector
			//$('.save-button').show();
            actionsCell.find('.save-button').show();	//show and hide are jquery methods
            actionsCell.find('.cancel-button').show();		//find inside selector which actioncell we r looking for
            actionsCell.find('.edit-button').hide();
            actionsCell.find('.delete-button').hide();

            taskCell.removeClass('todo-task');		//remove/add/toggleClass are jqueries
            app.currentTask = taskCell.text();		//save current task to revert back if clicked cancel
            taskCell.html('<input type="text" class="edit-input" value="' + app.currentTask + '" />');
        },

        exitEditMode: function() {
            var actionsCell = $(this).closest('td');
            var taskCell = actionsCell.prev();

            actionsCell.find('.save-button').hide();
            actionsCell.find('.cancel-button').hide();
            actionsCell.find('.edit-button').show();
            actionsCell.find('.delete-button').show();

            taskCell.addClass('todo-task');			//put the class back in page..no need of dot for addClass
            taskCell.html(app.currentTask);			
        },

        saveTask: function() {
            var newTask = $('.edit-input').val();

            todos.forEach(function(todo) {
                if (app.currentTask === todo.task) {		//if current edited task is matching with one of the task,then save change there
                    todo.task = newTask;
                }
            });
            app.currentTask = newTask;
            app.exitEditMode.call(this);		//call specifies a particular context to be called
        },

        deleteTask: function() {
            var taskToDelete = $(this).parent('td').prev().text();		//parent is similiar to closest..prev is for taskcell
            var found = false;		//caching for better performance
            todos.forEach(function(todo, index) {
                if (!found && taskToDelete === todo.task) {	//if item is not found yet
                    todos.splice(index, 1);
                    found = true;		//coz u dont need check anymore for remaining items
                }
            });
            app.showTodos();
        },

        showError: function(errorMessage) {
            $('.error-message').html(errorMessage).slideDown();		//similar to show but it is cooler coz it slides error slowly rather than showing fast
        },

        clearError: function() {
            $('.error-message').fadeOut();		//the error shown disappears once u continue typing
        }	//fadeOut is not supported in new jquery version
    };
	
	//two methods for styling in jquery
    $('#create-form button').css('background', 'green');		
    $('#create-form button').css({
        color: 'white',
        borderRadius: '8px'		//camelCase is provided by jquery
    });

    app.showTodos();
    /* $('.todo-task').on('click', function(){
		alert("clicked");
	}); */
    // $('.todo-task').on('click', app.toggleTodo);			//this toggles just for first time
    $('#create-form').on('submit', app.addTodo);			//submit uses enter button rather than click
    $('#create-input').on('keyup', app.clearError);			//clearError is function
    $('table').on('click', '.todo-task', app.toggleTodo);		//this toggles everytime beacuse the attribute is taken rather than specific value
    $('table').on('click', '.edit-button', app.enterEditMode);
    $('table').on('click', '.cancel-button', app.exitEditMode);
    $('table').on('click', '.save-button', app.saveTask);
    $('table').on('click', '.delete-button', app.deleteTask);
});