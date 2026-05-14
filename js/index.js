const { createClient } = supabase;
const supabaseUrl = "https://ytdkhxvrclhobqfkgiet.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl0ZGtoeHZyY2xob2JxZmtnaWV0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgyNTQyNDUsImV4cCI6MjA5MzgzMDI0NX0.AxLFK7VzwsueyB_1LXoYipGXb914JeaoVuD2wFZF8NY";
const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
let user;

const addNew = document.getElementById("addNew");
const logInError = document.getElementById("logInError");
const logInDiv = document.getElementById("logInDiv");
const categories = document.getElementById("categories");
const logInCancel = document.getElementById("logInCancel");




// if (user) {
//   showAdminButtons()
// }


document.addEventListener('DOMContentLoaded', async () => {
    try {
        const { data: { session } } = await supabaseClient.auth.getSession();
        // // Check if user is authenticated        
        addNew.addEventListener("click", async(e) => {
            if (!session) {
                logInDiv.classList.remove("hidden");
                return;
            }
            user = session.user;
            if (!user) {
                logInDiv.classList.remove("hidden");
                return;
            }
            console.log("User logged in");
            window.location.href = 'add.html';
        });

        logInCancel.addEventListener("click", async(e) => {
            logInDiv.classList.add("hidden");
        });

        logInDiv.addEventListener("submit", async (e) => {
            e.preventDefault();
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;

            const { data, error } = await supabaseClient.auth.signInWithPassword({
            email,
            password,
            });

            if (error) {
                console.error("Login error: ", error.message);
                logInError.classList.remove("hidden");
            } else {
                logInError.classList.add("hidden");
                logInDiv.classList.add("hidden");
                console.log("User logged in: ", data.user);
                window.location.href = 'add.html';
            }
        });

        categories.addEventListener("click", async (e) => {

            window.location.href = `view.html?id=${e.target.closest(".category").dataset.id}`;
        });
    } catch (error) {
        console.error('Error fetching data:', error);
    }
});