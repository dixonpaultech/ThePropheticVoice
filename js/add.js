const { createClient } = supabase;
const supabaseUrl = "https://ytdkhxvrclhobqfkgiet.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl0ZGtoeHZyY2xob2JxZmtnaWV0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgyNTQyNDUsImV4cCI6MjA5MzgzMDI0NX0.AxLFK7VzwsueyB_1LXoYipGXb914JeaoVuD2wFZF8NY";
const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
let user;

let toggleSetting = "D";

const addForm = document.getElementById("addForm");
const doctrineToggle = document.getElementById('doctrineToggle');
const doctrineOrInvitation = document.getElementById('doctrineOrInvitation');
const homeButton = document.getElementById("homeButton");
const addScriptureBtn = document.getElementById('addScriptureBtn');
const scriptureInputs = document.getElementById('scriptureInputs');
const addTitle = document.getElementById('addTitle'); 
const addYear = document.getElementById('addYear');
const addSpeaker = document.getElementById('addSpeaker');
const addPosition = document.getElementById('addPosition');
const addQuote = document.getElementById('addQuote');
const addLink = document.getElementById('addLink');

const categories = {
    "The Godhead" : [
        "God the Father", "Jesus Christ", "The Holy Spirit", "Unity", "Joy", "Prayer", "Worship", "Heavenly Mother"
    ], 
    "The Plan Of Salvation" : [
        "Plan of Salvation", "Premortal Life", "Agency", "The Creation", "The Fall", "Opposition", "Mortal Life", "Self-Reliance", "Death", "The Spirit World", "The Second Coming / Millennium", "Resurrection", "Judgment & Degrees of Glory"
    ], 
    "The Atonement Of Jesus Christ" : [
        "Jesus's Earthly Ministry", "Jesus's Atonement", "The Gospel", "Salvation", "Faith in Jesus Christ", "Repentance", "Justification", "Sanctification", "Forgiveness", "Discipleship", "Spiritual Foundation", "Peacemaking", "Christlike Attributes", "Gifts of the Spirit"
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

function clearAdd() {
    // Reset the entire form
    addForm.reset();

    // Clear all topic checkboxes manually
    document.querySelectorAll(".topicCheckbox").forEach(cb => {
        cb.checked = false;
    });

    // Remove all scripture inputs
    scriptureInputs.innerHTML = "";

    // Reset doctrine toggle
    doctrineToggle.checked = false;

    // Optional:
    // collapse all details sections
    document.querySelectorAll("details").forEach(detail => {
        detail.open = false;
    });
}


async function handleSubmit(event) {
    event.preventDefault();
    // DOCTRINE TOGGLE
    const doctrine = !doctrineToggle.checked; 
    // checked = invitations; unchecked = doctrine
 
    // BASIC INFO 
    const title = addTitle.value.trim(); 
    const month = document.querySelector('input[name="month"]:checked')?.value; 
    const year = addYear.value;
    const date = `${year}-${(month == "April" ? "04-01" : "10-01")} `;
    const speaker = addSpeaker.value.trim();
    const position = addPosition.value;
    const quote = addQuote.value.trim();
    const link = addLink.value.trim();
 
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
    clearAdd();
    return selectedTopics[0];
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

        homeButton.addEventListener("click", async(e) => {
            window.location.href = 'index.html';
        });

        addForm.addEventListener("submit", async (e) => {
            const topicId = await handleSubmit(e);
            window.location.href = `view.html?id=${topicId}`;
        });
  
        addScriptureBtn.addEventListener('click', () => {
            const input = document.createElement('input');
            input.type = 'text';
            input.name = 'scriptures[]';
            input.placeholder = 'John 3:16';
            scriptureInputs.appendChild(input);
        })

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