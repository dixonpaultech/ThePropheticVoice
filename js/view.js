const { createClient } = supabase;
const supabaseUrl = "https://ytdkhxvrclhobqfkgiet.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl0ZGtoeHZyY2xob2JxZmtnaWV0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgyNTQyNDUsImV4cCI6MjA5MzgzMDI0NX0.AxLFK7VzwsueyB_1LXoYipGXb914JeaoVuD2wFZF8NY";
const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
let user;

// Get the ID from the URL (e.g., target.html?id=category2)
const params = new URLSearchParams(window.location.search);
let categoryId = params.get('id') ? (params.get('id') < 9 ? params.get('id') : 0) : 0; // returns "category2"
let currentTopic = "";
let toggleSetting = "D";
let logInDestination = "";

const pageContent = document.getElementById("pageContent");

const addNew = document.getElementById("addNew");
const logInError = document.getElementById("logInError");
const logInDiv = document.getElementById("logInDiv");
const doctrineToggle = document.getElementById('doctrineToggle');
const doctrineOrInvitation = document.getElementById('doctrineOrInvitation');
const listOfQuotes = document.getElementById('listOfQuotes');
const categoryName = document.querySelectorAll('.categoryName');
const topics = document.querySelectorAll('.topic');
const logInCancel = document.getElementById("logInCancel");
const homeButton = document.getElementById("homeButton");
const filterBtn = document.getElementById('mobileFilterToggle');
const sidebar = document.getElementById('sidebar');

const quoteModal = document.getElementById("quoteModal");
const modalType = document.getElementById("modalType");
const modalClose = document.getElementById("modalClose");
const modalTitle = document.getElementById("modalTitle");
const modalDate = document.getElementById("modalDate");
const modalSpeaker = document.getElementById("modalSpeaker");
const modalPosition = document.getElementById("modalPosition");
const modalTopic = document.getElementById("modalTopic");
const modalQuote = document.getElementById("modalQuote");
const modalScriptures = document.getElementById("modalScriptures");
const modalLink = document.getElementById("modalLink");
const modalNotes = document.getElementById("modalNotes");
const modalEdit = document.getElementById("modalEdit");
const saveNotesBtn = document.getElementById("saveNotesBtn");
const notesStatus = document.getElementById("notesStatus");

class Quote {
    constructor({ id, doctrine, title, date, speaker, position, quote, category, topic, link, scriptures, priority, notes}) {
        this.id = id;
        this.doctrine = doctrine;
        this.title = title;
        this.date = date;
        this.speaker = speaker;
        this.position = position;
        this.quote = quote;
        this.category = category;
        this.topic = topic;
        this.link = link;
        this.scriptures = scriptures;
        this.priority = priority;
        this.notes = notes;
    }
    toHTML() {
        const quoteDiv = document.createElement("div");
        quoteDiv.className = "quote";
        quoteDiv.dataset.id = this.id;
        const quoteTitle = document.createElement("div");
        quoteTitle.className = "quoteTitle";
        quoteTitle.textContent = this.title;
        const quoteInfo = document.createElement("div");
        quoteInfo.className = "quoteInfo";
        const quoteDate = document.createElement("div");
        quoteDate.className = "quoteDate";
        quoteDate.textContent = `${this.date[5] == "0" ? "Apr" : "Oct"} ${this.date.slice(0, 4)}`;
        const quoteSpeaker = document.createElement("div");
        quoteSpeaker.className = "quoteSpeaker";
        quoteSpeaker.textContent = this.speaker.trim().split(' ').pop(); 
        const quotePosition = document.createElement("div");
        quotePosition.className = "quotePosition";
        quotePosition.textContent = this.position;
        const quoteText = document.createElement("div");
        quoteText.className = "quoteText";
        quoteText.textContent = this.quote;
        const quoteTopic = document.createElement("div");
        quoteTopic.className = "quoteTopic";
        quoteTopic.textContent = this.topic;
        
        quoteInfo.appendChild(quoteDate);
        quoteInfo.appendChild(quoteSpeaker);
        quoteInfo.appendChild(quotePosition);

        quoteDiv.appendChild(quoteTitle);
        quoteDiv.appendChild(quoteInfo);
        quoteDiv.appendChild(quoteText);
        quoteDiv.appendChild(quoteTopic);
        quoteDiv.addEventListener("click", () => {
            this.showModal();
        });
        return quoteDiv;
    }
    showModal() {
        modalTitle.textContent = this.title;
        modalDate.textContent = `${this.date[5] == "0" ? "April" : "October"} ${this.date.slice(0, 4)}`;
        modalSpeaker.textContent = this.speaker;
        modalPosition.textContent = this.position;
        modalTopic.textContent = this.topic;
        modalQuote.textContent = this.quote;

        // scriptures
        modalScriptures.innerHTML = "";

        if (this.scriptures) {
            this.scriptures
                .split(";")
                .filter(s => s.trim() !== "")
                .forEach(scripture => {
                    const div = document.createElement("div");
                    div.textContent = scripture.trim();
                    modalScriptures.appendChild(div);
                });
        }

        // link
        modalLink.href = this.link;
        modalLink.textContent = this.link;
        modalType.textContent = this.doctrine
            ? "INVITATION"
            : "DOCTRINE";

        modalType.className = this.doctrine
            ? "modalType invitation"
            : "modalType doctrine";
        // notes
        modalNotes.value = this.notes || "";

        saveNotesBtn.onclick = async () => {
            const { data: { session } } =
                await supabaseClient.auth.getSession();

            if (!session) {
                logInDiv.classList.remove("hidden");
                return;
            }

            const { error } = await supabaseClient
                .from("quotes")
                .update({
                    notes: modalNotes.value.trim()
                })
                .eq("id", this.id);

            if (error) {
                notesStatus.textContent = "Failed to save";
                console.error(error);
                return;
            }

            this.notes = modalNotes.value.trim();

            notesStatus.textContent = "Saved!";

            setTimeout(() => {
                notesStatus.textContent = "";
            }, 2000);
        };

        // edit button
        modalEdit.onclick = async () => {
            logInDestination = "edit.html";
            const { data: { session } } =
                await supabaseClient.auth.getSession();

            if (!session) {
                logInDiv.classList.remove("hidden");
                return;
            }

            window.location.href = `${logInDestination}?id=${this.id}`;
        }

        quoteModal.classList.remove("hidden");
        pageContent.classList.add("noScroll");
    }
}

const allTopics = {
    "The Godhead" : [
        "God The Father", "Jesus Christ", "The Holy Spirit", "Unity", "Prayer & Worship", "Heavenly Mother"
    ], 
    "The Plan Of Salvation" : [
        "Plan of Salvation", "Premortal Life", "Creation & The Fall", "Agency & Opposition", "Mortal Life", "Death & The Spirit World", "The Second Coming & Millennium", "Resurrection", "Judgment & Degrees of Glory"
    ], 
    "The Atonement Of Jesus Christ" : [
        "Jesus's Earthly Ministry", "Christ's Atonement", "The Gospel", "Faith in Jesus Christ", "Repentance & Salvation", "Discipleship & Sanctification", "Christlike Attributes & Spiritual Gifts"
    ], 
    "The Restoration" : [
        "Dispensation & Apostasy", "The Restoration of Christ's Church", "Gathering Israel", "Church Service"
    ], 
    "Revelation & Scripture" : [
        "Prophets & Apostles", "Personal Revelation", "Scripture Study", "Angels"
    ], 
    "Ordinances & Covenants" : [
        "Ordinances & Covenants", "Gospel Ordinances", "Gospel Covenants", "Proxy Temple Work", "The Covenant Path & Exaltation"
    ], 
    "Relationships & Identity" : [
        "Divine Identity & Belonging", "Marriage & Family Relationships", "Fatherhood & Motherhood", "Friendships"
    ], 
    "Commandments" : [
        "Love God", "Love Your Neighbor", "Sabbath Day Holy", "Tithing & Fasting", "Word of Wisdom", "Law of Chastity"
    ]
}

const categories = ["The Godhead", "The Plan Of Salvation", "The Atonement Of Jesus Christ", "The Restoration", "Revelation & Scripture", "Ordinances & Covenants", "Relationships & Identity", "Commandments"];

const quotes = {
    "The Godhead" : [],
    "The Plan Of Salvation" : [],
    "The Atonement Of Jesus Christ": [],
    "The Restoration" : [],
    "Revelation & Scripture" : [],
    "Ordinances & Covenants" : [],
    "Relationships & Identity" : [],
    "Commandments": []
}

function clearTopics() {
    topics.forEach((topic) => {
        topic.classList.remove("selected");
    })
}
function clearCategories() {
    categoryName.forEach((category) => {
        category.classList.remove("selected");
    })
}

function scrollToTop() {
    // Scrolls the window to the absolute top-left corner (0,0)
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

function findKeyWithItem (obj, search) {
    return Object.keys(obj).find(key => obj[key].includes(search));
};

function displayCategory() {
    if (0 <= categoryId <= 7) {
        clearCategories();
        categoryName[categoryId].classList.add("selected");
        categoryName[categoryId].nextElementSibling.style.display = 'block';
        listOfQuotes.innerHTML = "";
        const category = categories[categoryId];
        quotes[category].forEach((quote) => {
            if (toggleSetting == "D" ? !quote.doctrine : quote.doctrine) {
                listOfQuotes.appendChild(quote.toHTML());
            }
        });
    }
}

function getCurrentConference() {
    const today = new Date();

    const year = today.getFullYear();
    const month = today.getMonth() + 1;

    if (month >= 10) {
        return `${year}-10-01`;
    }

    if (month >= 4) {
        return `${year}-04-01`;
    }

    return `${year - 1}-10-01`;
}

async function checkPriorityUpdate() {
    const conference = getCurrentConference();

    try {
        const { data } = await supabaseClient
            .from("app_settings")
            .select("value")
            .eq("key", "last_priority_update")
            .single();

        if (data.value !== conference) {

            console.log("Updating priorities...");

            await updateAllPriorities();

            await supabaseClient
                .from("app_settings")
                .update({ value: conference })
                .eq("key", "last_priority_update");
        }
    } catch (error) {
        console.error("Error checking priority update:", error);
    }
}

async function updateAllPriorities() {
    try {
        const { data: quotes } = await supabaseClient
            .from("quotes")
            .select("id, position, date");

        for (const quote of quotes) {

            const priority =
                getPriority(
                    quote.position,
                    quote.date
                );

            await supabaseClient
                .from("quotes")
                .update({
                    priority
                })
                .eq("id", quote.id);
        }
    } catch (error) {
        console.error("Error checking priority update:", error);
    }
}

function displayTopic(topic) {
    listOfQuotes.innerHTML = "";
    const category = categories[categoryId];
    quotes[category].forEach((quote) => {
        if (quote.topic == topic && (toggleSetting == "D" ? !quote.doctrine : quote.doctrine)) {
            listOfQuotes.appendChild(quote.toHTML());
        }
    });
}

function updateTopicCounts() {
    // remove old counts first
    document.querySelectorAll(".topicCount").forEach(el => el.remove());

    topics.forEach(topicElement => {
        const topicName = topicElement.dataset.topic || topicElement.textContent.trim();
        topicElement.dataset.topic = topicName;

        let count = 0;

        // search every category
        categories.forEach(category => {
            quotes[category].forEach(quote => {

                // respect doctrine/invitation toggle
                const matchesToggle =
                    toggleSetting == "D"
                        ? !quote.doctrine
                        : quote.doctrine;

                if (quote.topic === topicName && matchesToggle) {
                    count++;
                }
            });
        });

        // only show if > 0
        if (count > 0) {
            const countSpan = document.createElement("span");
            countSpan.className = "topicCount";
            countSpan.textContent = ` (${count})`;

            topicElement.appendChild(countSpan);
        }
    });
}

async function refreshQuotes () {
    categories.forEach(category => {
        quotes[category] = [];
    });
    //get godhead, salvation, atonement, restoration, revelation, ordinances, identity, commandments
    const godheadData = await supabaseClient
    .from('quotes')
    .select('*')
    .eq('category', "The Godhead")
    .order('priority', { ascending: true })
    .order('date', { ascending: false })
    .order('title', { ascending: true });

    const salvationData = await supabaseClient
    .from('quotes')
    .select('*')
    .eq('category', "The Plan Of Salvation")
    .order('priority', { ascending: true })
    .order('date', { ascending: false })
    .order('title', { ascending: true });
    
    const atonementData = await supabaseClient
    .from('quotes')
    .select('*')
    .eq('category', "The Atonement Of Jesus Christ")
    .order('priority', { ascending: true })
    .order('date', { ascending: false })
    .order('title', { ascending: true });
    
    const restorationData = await supabaseClient
    .from('quotes')
    .select('*')
    .eq('category', "The Restoration")
    .order('priority', { ascending: true })
    .order('date', { ascending: false })
    .order('title', { ascending: true });

    const revelationData = await supabaseClient
    .from('quotes')
    .select('*')
    .eq('category', "Revelation & Scripture")
    .order('priority', { ascending: true })
    .order('date', { ascending: false })
    .order('title', { ascending: true });
    
    const ordinancesData = await supabaseClient
    .from('quotes')
    .select('*')
    .eq('category', "Ordinances & Covenants")
    .order('priority', { ascending: true })
    .order('date', { ascending: false })
    .order('title', { ascending: true });

    const identityData = await supabaseClient
    .from('quotes')
    .select('*')
    .eq('category', "Relationships & Identity")
    .order('priority', { ascending: true })
    .order('date', { ascending: false })
    .order('title', { ascending: true });
    
    const commandmentsData = await supabaseClient
    .from('quotes')
    .select('*')
    .eq('category', "Commandments")
    .order('priority', { ascending: true })
    .order('date', { ascending: false })
    .order('title', { ascending: true });
    
    if (godheadData.error) throw godheadData.error;
    if (salvationData.error) throw salvationData.error;
    if (atonementData.error) throw atonementData.error;
    if (restorationData.error) throw restorationData.error;
    if (revelationData.error) throw revelationData.error;
    if (ordinancesData.error) throw ordinancesData.error;
    if (identityData.error) throw identityData.error;
    if (commandmentsData.error) throw commandmentsData.error;

    // Process fetched data
    godheadData.data.forEach((quote) => {
        quotes[categories[0]].push(new Quote({id: quote.id, doctrine: quote.doctrine, title: quote.title, date: quote.date, speaker: quote.speaker, position: quote.position, quote: quote.quote, category: quote.category, topic: quote.topic, link: quote.link, scriptures: quote.scriptures, priority: quote.priority, notes: quote.notes}));
    });
    salvationData.data.forEach((quote) => {
        quotes[categories[1]].push(new Quote({id: quote.id, doctrine: quote.doctrine, title: quote.title, date: quote.date, speaker: quote.speaker, position: quote.position, quote: quote.quote, category: quote.category, topic: quote.topic, link: quote.link, scriptures: quote.scriptures, priority: quote.priority, notes: quote.notes}));
    });
    atonementData.data.forEach((quote) => {
        quotes[categories[2]].push(new Quote({id: quote.id, doctrine: quote.doctrine, title: quote.title, date: quote.date, speaker: quote.speaker, position: quote.position, quote: quote.quote, category: quote.category, topic: quote.topic, link: quote.link, scriptures: quote.scriptures, priority: quote.priority, notes: quote.notes}));
    });
    
    restorationData.data.forEach((quote) => {
        quotes[categories[3]].push(new Quote({id: quote.id, doctrine: quote.doctrine, title: quote.title, date: quote.date, speaker: quote.speaker, position: quote.position, quote: quote.quote, category: quote.category, topic: quote.topic, link: quote.link, scriptures: quote.scriptures, priority: quote.priority, notes: quote.notes}));
    });
    revelationData.data.forEach((quote) => {
        quotes[categories[4]].push(new Quote({id: quote.id, doctrine: quote.doctrine, title: quote.title, date: quote.date, speaker: quote.speaker, position: quote.position, quote: quote.quote, category: quote.category, topic: quote.topic, link: quote.link, scriptures: quote.scriptures, priority: quote.priority, notes: quote.notes}));
    });
    
    ordinancesData.data.forEach((quote) => {
        quotes[categories[5]].push(new Quote({id: quote.id, doctrine: quote.doctrine, title: quote.title, date: quote.date, speaker: quote.speaker, position: quote.position, quote: quote.quote, category: quote.category, topic: quote.topic, link: quote.link, scriptures: quote.scriptures, priority: quote.priority, notes: quote.notes}));
    });
    identityData.data.forEach((quote) => {
        quotes[categories[6]].push(new Quote({id: quote.id, doctrine: quote.doctrine, title: quote.title, date: quote.date, speaker: quote.speaker, position: quote.position, quote: quote.quote, category: quote.category, topic: quote.topic, link: quote.link, scriptures: quote.scriptures, priority: quote.priority, notes: quote.notes}));
    });
    commandmentsData.data.forEach((quote) => {
        quotes[categories[7]].push(new Quote({id: quote.id, doctrine: quote.doctrine, title: quote.title, date: quote.date, speaker: quote.speaker, position: quote.position, quote: quote.quote, category: quote.category, topic: quote.topic, link: quote.link, scriptures: quote.scriptures, priority: quote.priority, notes: quote.notes}));
    });
}

// function createElementDisplacementMap(elementId) {
//     const element = document.getElementById(elementId);
//     if (!element) return null;

//     // 1. Get the dimensions of the target element
//     const width = element.offsetWidth;
//     const height = element.offsetHeight;

//     // 2. Create an off-screen canvas and context
//     const canvas = document.createElement('canvas');
//     canvas.width = width;
//     canvas.height = height;
//     const ctx = canvas.getContext('2d');

//     // 3. Define styling variables
//     const padding = 16;
//     const borderWidth = 2;
//     const borderRadius = Math.min(width, height) / 4; // Rounded edges

//     // ctx.roundRect (standard since 2022) is used to draw the shapes

//     // A. Outer Red Area (Padding)
//     ctx.fillStyle = 'red';
//     ctx.beginPath();
//     ctx.roundRect(0, 0, width, height, borderRadius);
//     ctx.fill();

//     // B. Green Border
//     ctx.strokeStyle = 'green';
//     ctx.lineWidth = borderWidth;
//     ctx.beginPath();
//     ctx.roundRect(
//         padding, 
//         padding, 
//         width - (padding * 2), 
//         height - (padding * 2), 
//         borderRadius - padding > 0 ? borderRadius - padding : 0
//     );
//     ctx.stroke();

//     // C. Inner Grey Area
//     ctx.fillStyle = 'grey';
//     ctx.beginPath();
//     ctx.roundRect(
//         padding + borderWidth, 
//         padding + borderWidth, 
//         width - (padding + borderWidth) * 2, 
//         height - (padding + borderWidth) * 2, 
//         (borderRadius - padding - borderWidth) > 0 ? borderRadius - padding - borderWidth : 0
//     );
//     ctx.fill();

//     // 4. Return as Data URI (PNG format)
//     return canvas.toDataURL('image/png');
//     // Usage:
//     // const dataUri = createElementDisplacementMap('my-element-id');
//     // console.log(dataUri);
// }




document.addEventListener('DOMContentLoaded', async () => {
    try {
        const { data: { session } } = await supabaseClient.auth.getSession();
        await checkPriorityUpdate();
        await refreshQuotes();
        displayCategory();
        updateTopicCounts();
        
        addNew.addEventListener("click", async(e) => {
            logInDestination = "add.html";
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
            window.location.href = logInDestination;
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
                if (logInDestination == "delete") return;
                window.location.href = logInDestination;
            }
        });

        logInCancel.addEventListener("click", async(e) => {
            logInDiv.classList.add("hidden");
        });

        doctrineToggle.addEventListener('change', function() {
            if (this.checked) {
                toggleSetting = "I";
                doctrineOrInvitation.textContent = "INVITATIONS";
            } else {
                toggleSetting = "D";
                doctrineOrInvitation.textContent = "DOCTRINE";
            }

            updateTopicCounts();

            if (currentTopic == "") {
                displayCategory();
            } else {
                displayTopic(currentTopic);
            }
        });

        filterBtn.addEventListener('click', () => {
            sidebar.classList.toggle('mobileHidden')
        })

        homeButton.addEventListener("click", async(e) => {
            logInDestination = "index.html";
            window.location.href = logInDestination;
        });

        categoryName.forEach(button => {
            button.addEventListener('click', () => {
                const content = button.nextElementSibling;
                content.style.display = content.style.display === 'block' ? 'none' : 'block';
                if (content.style.display == "block") {
                }
            });
        });

        topics.forEach(topic => {
            topic.addEventListener('click', () => {
                clearTopics();
                topic.classList.add("selected");
                currentTopic = topic.dataset.topic;
                const selectedCategoryName = findKeyWithItem(allTopics, currentTopic);
                categoryId = categories.findIndex(category => category == selectedCategoryName);
                displayTopic(currentTopic);
                clearCategories();
                const category = topic.closest('.categoryContainer').querySelector('.categoryName');
                categoryId = categories.findIndex(eachCategory => eachCategory == category.textContent);
                category.classList.add("selected");
                displayTopic(currentTopic);
                scrollToTop();
            });
        });

        modalClose.addEventListener("click", () => {
            quoteModal.classList.add("hidden");
            pageContent.classList.remove("noScroll");
        });

        quoteModal.addEventListener("click", (e) => {
            if (e.target === quoteModal) {
                quoteModal.classList.add("hidden");
                pageContent.classList.remove("noScroll");
            }
        });
    } catch (error) {
        console.error('Error fetching data:', error);
    }
});
