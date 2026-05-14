const { createClient } = supabase;
const supabaseUrl = "https://ytdkhxvrclhobqfkgiet.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl0ZGtoeHZyY2xob2JxZmtnaWV0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgyNTQyNDUsImV4cCI6MjA5MzgzMDI0NX0.AxLFK7VzwsueyB_1LXoYipGXb914JeaoVuD2wFZF8NY";
const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
let user;

const addNew = document.getElementById("addNew");



// if (user) {
//   showAdminButtons()
// }


document.addEventListener('DOMContentLoaded', async () => {
    try {
        // // Check if user is authenticated
        // const { data: { session } } = await supabaseClient.auth.getSession();

        // if (!session) {
        //     // No user signed in, redirect to signin page
        //     window.location.href = 'login.html';
        //     return;
        // }
        
        // user = session.user;
        
        // if (!user) {
        //     console.error('No user found in session');
        //     window.location.href = 'login.html';
        //     return;
        // }

        // // Fetch data from supabaseClient
        // const tasksResponse = await supabaseClient
        // .from('tasks')
        // .select('*')
        // .eq('user_id', user.id)
        // .order('due_date', { ascending: false })
        // .order('created_at', { ascending: false });

        // const instancesResponse = await supabaseClient
        // .from('task_instances')
        // .select('*')
        // .eq('user_id', user.id)
        // .order('instance_date', { ascending: false })
        // .order('created_at', { ascending: false });
        
        // if (tasksResponse.error) throw tasksResponse.error;
        // if (instancesResponse.error) throw instancesResponse.error;

        // // Process fetched data
        // tasksResponse.data.forEach((task) => {
        //     supabaseTasks.push({id: task.id, category: task.category, description: task.description, dueDate: toDatetimeLocal(task.due_date), priority: task.priority, recurrence: task.recurrence, completed: task.completed, skipped: false, taskId: null});
        // });
        // instancesResponse.data.forEach((instance) => {
        //     supabaseInstances.push({id: instance.id, category: instance.category, description: instance.description, dueDate: toDatetimeLocal(instance.instance_date), priority: instance.priority, recurrence:{ enabled: true }, completed: instance.completed, skipped: instance.skipped, taskId: instance.task_id});
        // });

        // supabaseTasks.forEach((task) => {
        //     if (!task.recurrence || !task.recurrence.enabled) {
        //         displayedTasks.push(new Task({...task})); 
        //     } else {
        //         supabaseInstances.forEach((instance) => {
        //             instance.recurrence = task.recurrence;
        //             if (instance.taskId == task.id) {
        //                 displayedTasks.push(new Task({...instance}));
        //             }
        //         });
        //     }
        // });
        
        addNew.addEventListener("click", async(e) => {
            const { data: { session } } = await supabaseClient.auth.getSession();

            if (!session) {
                // No user signed in, redirect to signin page
                window.location.href = 'login.html';
                return;
            }
            
            user = session.user;
            
            if (!user) {
                console.error('No user found in session');
                window.location.href = 'login.html';
                return;
            }
        });

        
        // delete button
        editDelete.onclick = async () => {
            logInDestination = "delete";
            const { data: { session } } =
                await supabaseClient.auth.getSession();

            if (!session) {
                logInDiv.classList.remove("hidden");
                return;
            }

            const confirmed = confirm(
                "Delete this quote?"
            );

            if (!confirmed) return;

            const { error } = await supabaseClient
                .from("quotes")
                .delete()
                .eq("id", this.id);

            if (error) {
                console.error(error);
                return;
            }

            quoteModal.classList.add("hidden");
            pageContent.classList.remove("noScroll");

            await refreshQuotes();

            if (currentTopic == "") {
                displayCategory();
            } else {
                displayTopic(currentTopic);
            }
        }

        // listOfTasks.addEventListener("click", async (e) => {
        //     const taskElement = e.target.closest(".task");
        //     if (!taskElement) return;
        //     if (e.target.closest(".taskInformation")) {
        //         editing = true;
        //         idToEdit = taskElement.dataset.id;
        //         displayTaskToEdit();
        //         screenFade(); 
        //         addTaskCategoryPage.classList.add("active");
        //         return;
        //     }
        //     if (e.target.closest(".taskComplete")) {
        //         const info = taskElement?.querySelector(".taskInformation");
        //         if (info) info.classList.add("completed");
        //         setTimeout(function() { console.log("Task Completed"); }, 500);

        //         const index = displayedTasks.findIndex(task => task.id === taskElement.dataset.id);
        //         if (!displayedTasks[index].recurrence || !displayedTasks[index].recurrence.enabled) {
        //             await supabaseClient.from('tasks').update({"completed": true}).eq('id', displayedTasks[index].id);
        //             displayedTasks[index].completed = true;
        //         } else {
        //             await supabaseClient.from('task_instances').update({"completed": true}).eq('id', displayedTasks[index].id);
        //             displayedTasks[index].completed = true;
        //         }
                
        //         refreshListOfTasks();
        //         refreshListOfCompletedTasks();
        //         return;
        //     }

        //     if (e.target.closest(".taskDelete")) {                
        //         const info = taskElement?.querySelector(".taskInformation");
        //         if (info) info.classList.add("deleted");
        //         setTimeout(function() { console.log("Task Deleted"); }, 500);

        //         const index = displayedTasks.findIndex(task => task.id === taskElement.dataset.id);
        //         if (!displayedTasks[index].recurrence || !displayedTasks[index].recurrence.enabled) {
        //             await supabaseClient.from('tasks').delete().eq('id', displayedTasks[index].id);
        //             displayedTasks.splice(index, 1);
        //         } else {
        //             await supabaseClient.from('task_instances').update({"skipped": true}).eq('id', displayedTasks[index].id);
        //             displayedTasks[index].skipped = true;
        //             let allSkipped = true;
        //             displayedTasks.forEach((task) => {
        //                 if (task.taskId == displayedTasks[index].taskId) {
        //                     if (!task.skipped) allSkipped = false;
        //                 }
        //             });
        //             if (allSkipped) {
        //                 await supabaseClient.from('tasks').delete().eq('id', displayedTasks[index].taskId); 
        //                 for (let i = displayedTasks.length - 1; i >= 0; i--) {
        //                     if (displayedTasks[i].taskId === displayedTasks[index].taskId) displayedTasks.splice(i, 1);
        //                 }
        //             }
        //         }
                
        //         refreshListOfTasks();
        //         return;
        //     }
        // });
    } catch (error) {
        console.error('Error fetching data:', error);
    }
});