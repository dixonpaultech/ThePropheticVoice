const { createClient } = supabase;
const supabaseUrl = "https://ytdkhxvrclhobqfkgiet.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl0ZGtoeHZyY2xob2JxZmtnaWV0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgyNTQyNDUsImV4cCI6MjA5MzgzMDI0NX0.AxLFK7VzwsueyB_1LXoYipGXb914JeaoVuD2wFZF8NY";
const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
let user;

const params = new URLSearchParams(window.location.search);
let quoteId = params.get('id') ? params.get('id') : -1; // returns "quote's id"
let toggleSetting = "D";
let quoteToEdit;

const editForm = document.getElementById("editForm");
const doctrineToggle = document.getElementById('doctrineToggle');
const doctrineOrInvitation = document.getElementById('doctrineOrInvitation');
const homeButton = document.getElementById("homeButton");
const addScriptureBtn = document.getElementById('addScriptureBtn');
const scriptureInputs = document.getElementById('scriptureInputs');
const editTitle = document.getElementById('editTitle'); 
const editYear = document.getElementById('editYear');
const editSpeaker = document.getElementById('editSpeaker');
const editPosition = document.getElementById('editPosition');
const editQuote = document.getElementById('editQuote');
const editLink = document.getElementById('editLink');
const clearPage = document.getElementById('clearPage');
const editDelete = document.getElementById('editDelete');
const editMonthApril = document.getElementById('editMonthApril');
const editMonthOctober = document.getElementById('editMonthOctober');
const deleteModal = document.getElementById('deleteModal');
const deleteModalClose = document.getElementById('deleteModalClose');
const deleteModalConfirm = document.getElementById('deleteModalConfirm');
const statusMessage = document.getElementById('status-message'); 


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
        quoteDate.textContent = this.date;
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
}

const categories = {
    "The Godhead" : [
        "God the Father", "Jesus Christ", "The Holy Spirit", "Unity", "Joy", "Prayer", "Worship", "Heavenly Mother"
    ], 
    "The Plan Of Salvation" : [
        "Plan of Salvation", "Premortal Life", "Agency", "The Creation", "The Fall", "Opposition", "Mortal Life", "Self-Reliance", "Death", "The Spirit World", "The Second Coming / Millennium", "Resurrection", "Judgment & Degrees of Glory"
    ], 
    "The Atonement Of Jesus Christ" : [
        "Jesus's Earthly Ministry", "Christ's Atonement", "The Gospel", "Salvation", "Faith in Jesus Christ", "Repentance", "Justification", "Sanctification", "Forgiveness", "Discipleship", "Spiritual Foundation", "Peacemaking", "Christlike Attributes", "Gifts of the Spirit"
    ], 
    "Dispensation, Apostasy, & Restoration" : [
        "Dispensation", "Apostasy", "Restoration", "Gathering Israel", "Christ's Church", "Church Callings", "Church Activity"
    ], 
    "Prophets & Revelation" : [
        "Personal Revelation", "Prophetic Authority", "Scripture Study", "Angels", "Answering Questions"
    ], 
    "Priesthood & Priestood Keys" : [
        "The Aaronic Priesthood", "The Melchizedek Priesthood", "Church Organization"
    ], 
    "Ordinances & Covenants" : [
        "Ordinances", "Baptism", "Receiving the Holy Ghost", "The Sacrament", "Endowment", "Temple Sealing", "Covenants", "Baptismal Covenants", "Temple Covenants", "The Covenant Path", "Exaltation", "Proxy Temple Work"
    ], 
    "Relationships & Identity" : [
        "Divine Identity", "Marriage Relationships", "Family Relationships", "Parents", "Fatherhood", "Motherhood", "Belonging", "Friendships"
    ], 
    "Commandments" : [
        "2 Great Commandments", "Love God", "Love your Neighbor", "10 Commandments", "No Idolatry", "Name of The Lord", "Sabbath Day Holy", "No Murder", "No Stealing", "No Bearing False Witness", "No Coveting", "Tithing", "Fasting", "Word of Wisdom", "Law of Chastity"
    ]
}

const categoryArray = ["The Godhead", "The Plan Of Salvation", "The Atonement Of Jesus Christ", "Dispensation, Apostasy, & Restoration", "Prophets & Revelation", "Priesthood & Priestood Keys", "Ordinances & Covenants", "Relationships & Identity", "Commandments"];

function getPriority (position, date) {
    const mostRecentConference = new Date();
    mostRecentConference.setDate(1);
    const month = mostRecentConference.getMonth() + 1; // JS months are 0-based
    let year = mostRecentConference.getFullYear();

    if (month >= 10) { // October
        mostRecentConference.setMonth(9);
    } else if (month >= 4) { // April
        mostRecentConference.setMonth(3);
    } else { // last October
        mostRecentConference.setMonth(9);
        mostRecentConference.setFullYear(year - 1);
    }
    year = mostRecentConference.getFullYear();

    if (position == "President") {
        if (new Date(date) == mostRecentConference) { // most recent conference
            return 1;
        } else if (new Date(date) > mostRecentConference.setFullYear(year - 5)) { // last 5 years
            return 4;
        } else if (new Date(date) > mostRecentConference.setFullYear(year - 10)) { // 5-10 years ago
            return 8;
        } else if (new Date(date) > mostRecentConference.setFullYear(year - 15)) { // 10-15 years ago
            return 12;
        } else if (new Date(date) > mostRecentConference.setFullYear(year - 20)) { // 15-20 years ago
            return 16;
        } else return 19;
    } else if (position == "First Presidency") {
        if (new Date(date) == mostRecentConference) { // most recent conference
            return 2;
        } else if (new Date(date) > mostRecentConference.setFullYear(year - 5)) { // last 5 years
            return 5;
        } else if (new Date(date) > mostRecentConference.setFullYear(year - 10)) { // 5-10 years ago
            return 9;
        } else if (new Date(date) > mostRecentConference.setFullYear(year - 15)) { // 10-15 years ago
            return 13;
        } else if (new Date(date) > mostRecentConference.setFullYear(year - 20)) { // 15-20 years ago
            return 17;
        } else return 19;
    } else if (position == "Apostle") {
        if (new Date(date) == mostRecentConference) { // most recent conference
            return 3;
        } else if (new Date(date) > mostRecentConference.setFullYear(year - 5)) { // last 5 years
            return 6;
        } else if (new Date(date) > mostRecentConference.setFullYear(year - 10)) { // 5-10 years ago
            return 10;
        } else if (new Date(date) > mostRecentConference.setFullYear(year - 15)) { // 10-15 years ago
            return 14;
        } else if (new Date(date) > mostRecentConference.setFullYear(year - 20)) { // 15-20 years ago
            return 18;
        } else return 19;
    } else if (position == "General Officer") {
        if (new Date(date) == mostRecentConference) { // most recent conference
            return 7;
        } else if (new Date(date) > mostRecentConference.setFullYear(year - 5)) { // last 5 years
            return 11;
        } else if (new Date(date) > mostRecentConference.setFullYear(year - 10)) { // 5-10 years ago
            return 15;
        } else if (new Date(date) > mostRecentConference.setFullYear(year - 15)) { // 10-15 years ago
            return 13;
        } else if (new Date(date) > mostRecentConference.setFullYear(year - 20)) { // 15-20 years ago
            return 19;
        } else return 20;
    }
    return 20;

}

function fillEdit () {
    // fill all scripture inputs
    scriptureInputs.innerHTML = "";
    if (quoteToEdit.scriptures) {
        quoteToEdit.scriptures
            .split(";")
            .filter(s => s.trim() !== "")
            .forEach(scripture => {
                const div = document.createElement("div");
                div.textContent = scripture.trim();
                scriptureInputs.appendChild(div);
            });
    }

    // Reset doctrine toggle
    if (quoteToEdit.doctrine) {
        doctrineToggle.checked = true;
        toggleSetting = "I";
        doctrineOrInvitation.textContent = "INVITATIONS";
    } else {
        doctrineToggle.checked = false;
        toggleSetting = "D";
        doctrineOrInvitation.textContent = "DOCTRINE";
    }

    editTitle.value = quoteToEdit.title;
    editLink.value = quoteToEdit.link;
    if (quoteToEdit.date[5] == "0") {
        editMonthApril.checked = true;
        editMonthOctober.checked = false;
    } else {
        editMonthOctober.checked = true;
        editMonthApril.checked = false;
    }
    editYear.value = quoteToEdit.date.slice(0,4);
    editSpeaker.value = quoteToEdit.speaker;
    editPosition.value = quoteToEdit.position;
    document.querySelectorAll(".topicCheckbox").forEach(topicCheckbox => {
        if (topicCheckbox.value == quoteToEdit.topic) {
            topicCheckbox.checked = true;
        }
    });
    editQuote.textContent = quoteToEdit.quote;
    // Open the category section
    document.querySelectorAll("details").forEach(detail => {
        const categoryName = detail.querySelector('summary');
        if (categoryName.textContent == quoteToEdit.category) {
            detail.open = true;
        }
    });
}

function clearEdit() {
    // Reset the entire form
    editForm.reset();

    // Clear all topic checkboxes manually
    document.querySelectorAll(".topicCheckbox").forEach(cb => {
        cb.checked = false;
    });

    // Remove all scripture inputs
    scriptureInputs.innerHTML = "";

    // Reset doctrine toggle
    doctrineToggle.checked = false;
    toggleSetting = "D";
    doctrineOrInvitation.textContent = "DOCTRINE";

    // Optional:
    // collapse all details sections
    document.querySelectorAll("details").forEach(detail => {
        detail.open = false;
    });
}

async function findQuote () {
    const { data, error } = await supabaseClient
    .from('quotes')
    .select('*')
    .eq('id', quoteId)
    .single();
    
    if (error) {
        console.error('Error fetching data:', error.message);
    }
    quoteToEdit = new Quote({id: data.id, doctrine: data.doctrine, title: data.title, date: data.date, speaker: data.speaker, position: data.position, quote: data.quote, category: data.category, topic: data.topic, link: data.link, scriptures: data.scriptures, priority: data.priority});
}

/**
 * Custom fetch wrapper that handles extended timeouts for sleeping servers
 */
async function fetchWithRetry(resource, options = {}, retries = 3) {
    // Render free tier can take ~50 seconds to spin up. We set a 60-second limit.
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 60000); 

    try {
        const response = await fetch(resource, {
            ...options,
            signal: controller.signal
        });
        clearTimeout(id);

        if (!response.ok) throw new Error('Server responded with an error');
        return await response.json();

    } catch (error) {
        clearTimeout(id);
        // If it failed because it timed out or dropped connection, retry if we have attempts left
        if (retries > 0) {
            statusMessage.innerText = `⏳ Server is taking a moment to wake up... Retrying (Attempts left: ${retries})...`;
            return await fetchWithRetry(resource, options, retries - 1);
        }
        throw error;
    }
}

function extractMetadata(doc) {
    // ---- 1. TALK TITLE ----
    // Cleans up trailing site descriptions from the <title> tag
    const rawTitle = doc.querySelector('title')?.innerText || '';
    const cleanTitle = rawTitle.split('|')[0].split('-')[0].trim();
    addTitle.value = cleanTitle;

    // ---- 2. SCHEMA.ORG (SPEAKER & DATE) ----
    // Locates the JSON-LD script block you found
    const jsonLdScript = doc.querySelector('script[type="application/ld+json"][data-react-helmet="true"]');
    if (jsonLdScript) {
        const schema = JSON.parse(jsonLdScript.textContent);
        
        // Speaker Name
        const speakerName = schema.mainEntity?.author?.name || '';
        addSpeaker.value = speakerName;

        // Year & Month (April/October) from datePublished
        const publishDateStr = schema.datePublished; // e.g., "2023-10-30T00:00:00.000Z"
        if (publishDateStr) {
            const dateObj = new Date(publishDateStr);
            addYear.value = dateObj.getFullYear();
            
            // Conference months are April (3) or October (9)
            const month = dateObj.getMonth(); 
            (month === 3 || month === 4) ? editMonthApril.checked = true : editMonthOctober.checked = false;
        }
    }

    // ---- 3. SPEAKER POSITION ----
    // Maps the raw text criteria into your 4 specific dropdown options
    const roleElement = doc.querySelector('.author-role');
    if (roleElement) {
        const roleText = roleElement.textContent.toLowerCase();
        let positionValue = 'General Officer'; // Default fallback

        if (roleText.includes('President of The Church')) {
            positionValue = 'President of the church';
        } else if (roleText.includes('First Presidency')) {
            positionValue = 'First Presidency';
        } else if (roleText.includes('Apostle') || roleText.includes('Apostles') || roleText.includes('Twelve')) {
            positionValue = 'Apostle';
        }

        addPosition.value = positionValue;
    }
}

async function handleSubmit(event) {
    event.preventDefault();
    // DOCTRINE TOGGLE
    const doctrine = doctrineToggle.checked; 
    // checked = invitations; unchecked = doctrine
 
    // BASIC INFO 
    const title = editTitle.value.trim(); 
    const month = document.querySelector('input[name="month"]:checked')?.value; 
    const year = editYear.value;
    const date = `${year}-${(month == "April" ? "04-01" : "10-01")} `;
    const speaker = editSpeaker.value.trim();
    const position = editPosition.value;
    const quote = editQuote.value.trim();
    const link = editLink.value.trim();
 
    // TOPICS ARRAY 
    const selectedTopics = [...document.querySelectorAll(".topicCheckbox:checked")]
    .map(cb => cb.value);
 
    // SCRIPTURES ARRAY 
    const scriptureList = [...document.querySelectorAll(".scriptureInput")]
    .map(input => input.value.trim())
    .filter(value => value !== "");
    let scriptures = "";
    scriptureList.forEach((scripture) => {
        scriptures += scripture;
        scriptures += ";";
    })
 
    // PRIORITY 
    const priority = getPriority(position, year);

    const { data, error } = await supabaseClient.from('quotes').delete().eq('id', quoteId);
    if (error) {
        console.error(error);
        return;
    }   
    for (const selectedTopic of selectedTopics) {
        const category = Object.keys(categories).find(key =>
            categories[key].includes(selectedTopic)
        );
        const { data, error } = await supabaseClient.from('quotes').insert({
            doctrine: doctrine,
            title: title,
            date: date,
            speaker: speaker,
            position: position,
            quote: quote,
            category: category,
            topic: selectedTopic,
            link: link,
            scriptures: scriptures,
            priority: priority,
            notes: ""
        }).select().single();
        if (error) {
            console.error(error);
        }
    }
    clearEdit();
    return selectedTopics[0];
}

function cancelEdit() {
    window.location.href=`/view.html?id=${categoryArray.findIndex(eachCategory => eachCategory == quoteToEdit.category)}`;
}

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const { data: { session } } = await supabaseClient.auth.getSession();
        if (!session) {
            // No user signed in, redirect to signin page
            window.location.href = 'index.html';
            return;
        }
        
        user = session.user;
        
        if (!user) {
            console.error('No user found in session');
            window.location.href = 'index.html';
            return;
        }

        if (quoteId == -1) {
            console.error('No quote selected');
            window.location.href = 'index.html';
            return;
        }

        clearEdit();
        await findQuote();
        fillEdit();

        homeButton.addEventListener("click", async(e) => {
            window.location.href = 'index.html';
        });

        // Create or select a status element in your HTML to show loading messages
        addLink.addEventListener('change', async (e) => {
            const url = e.target.value;
            if (!url.includes('churchofjesuschrist.org')) return;

            // 1. Immediately show loading/waking visual state to the user
            statusMessage.innerText = "⏳ Connecting to autofill server...";
            statusMessage.style.color = "#d97706"; // Orange warning color
            addLink.disabled = true; // Disable input so they don't mash keys

            try {
                // 2. Call the fetch function with an extended timeout/retry strategy
                const htmlData = await fetchWithRetry('https://conference-proxy.onrender.com', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ url: url })
                });
                
                // 3. Load the HTML string into a temporary virtual DOM element
                const parser = new DOMParser();
                const doc = parser.parseFromString(htmlData.html, 'text/html');

                // 4. Extract data using your existing logic
                extractMetadata(doc);

                // 5. Show success state
                statusMessage.innerText = "✅ Form autofilled successfully!";
                statusMessage.style.color = "#16a34a"; // Green success

            } catch (err) {
                console.error("Autofill failed: ", err);
                statusMessage.innerText = "❌ Connection timed out. Please try again or fill fields manually.";
                statusMessage.style.color = "#dc2626"; // Red error
            } finally {
                addLink.disabled = false; // Always re-enable input field
            }
        });

        editForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const topicId = await handleSubmit(e);
            const myCategory = Object.keys(categories).find(key => categories[key].includes(topicId));
            const categoryId = categoryArray.findIndex(category => category == quoteToEdit.category);
            window.location.href = `view.html?id=${categoryId}`;
        });
  
        addScriptureBtn.addEventListener('click', () => {
            const input = document.createElement('input');
            input.type = 'text';
            input.name = 'scriptures[]';
            input.classList.add("scriptureInput");
            input.placeholder = 'John 3:16';
            scriptureInputs.appendChild(input);
        })

        clearPage.addEventListener('click', () => {
            clearEdit();
        })

        editDelete.addEventListener('click', () => {
            deleteModal.classList.remove("hidden");
        });

        deleteModalClose.addEventListener('click', () => {
            deleteModal.classList.add("hidden");
        });

        deleteModalConfirm.addEventListener('click', async () => {
            const { data, error } = await supabaseClient.from('quotes').delete().eq('id', quoteId);
            if (error) {
                console.error(error);
                return;
            }   
            deleteModal.classList.add("hidden");
            const categoryId = categoryArray.findIndex(category => category == quoteToEdit.category);
            window.location.href = `view.html?id=${categoryId}`;
            clearEdit();
        });

        doctrineToggle.addEventListener('change', function() {
            if (this.checked) {
                setTimeout(() => {}, 1000);
                toggleSetting = "I";
                doctrineOrInvitation.textContent = "INVITATIONS";
            } else {
                setTimeout(() => {}, 1000);
                toggleSetting = "D";
                doctrineOrInvitation.textContent = "DOCTRINE";
            }
        });
    } catch (error) {
        console.error('Error fetching data:', error);
    }
});