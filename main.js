const defaultEntries = 100;
var ds100Data = [];

const searchBar = document.getElementById("search");

function handleSearchParams() {
    const params = new URLSearchParams(document.location.search);
    searchBar.value = params.get("q");
}

handleSearchParams();

function refreshList(query = "", showAll = false) {
    const filteredData = ds100Data.filter((item) => {
        const lowercase = query.toLowerCase();

        const name = item["RL100-Langname"].toLowerCase();
        const code = item["RL100-Code"].toLowerCase();

        return code.includes(lowercase) || name.includes(lowercase);
    });

    filteredData.sort((a, b) => {
        const lowercase = query.toLowerCase();
        const uppercase = query.toUpperCase();

        const aName = a["RL100-Langname"].toLowerCase();
        const bName = b["RL100-Langname"].toLowerCase();

        const aCode = a["RL100-Code"];
        const bCode = b["RL100-Code"];

        const aType = a["Typ Lang"];
        const bType = b["Typ Lang"];

        const aState = a["Betriebszustand"];
        const bState = b["Betriebszustand"];

        if (aName === lowercase && bName !== lowercase) {
            return -1;
        } else if (aName !== lowercase && bName === lowercase) {
            return 1;
        }

        if (aCode === uppercase && bCode !== uppercase) {
            return -1;
        } else if (aCode !== uppercase && bCode === uppercase) {
            return 1;
        }

        if ((aState !== "a.B." && bState === "a.B.") || 
            (aState !== "ehemals" && bState === "ehemals")) {
            return -1;
        } else if ((aState === "a.B." && bState !== "a.B.") || 
            (aState === "ehemals" && bState !== "ehemals")) {
            return 1;
        }

        if (aType === "Bf" && bType !== "Bf") {
            return -1;
        } else if (aType !== "Bf" && bType === "Bf") {
            return 1;
        }

        if (aType === "Hp" && bType !== "Hp") {
            return -1;
        } else if (aType !== "Hp" && bType === "Hp") {
            return 1;
        }

        if (aName.includes("hbf") && !bName.includes("hbf")) {
            return -1;
        } else if (!aName.includes("hbf") && bName.includes("hbf")) {
            return 1;
        }


        if (aName.startsWith(lowercase) && !bName.startsWith(lowercase)) {
            return -1;
        } else if (!aName.startsWith(lowercase) && bName.startsWith(lowercase)) {
            return 1;
        }

        if (aCode.startsWith(query) && !bCode.startsWith(query)) {
            return -1;
        } else if (!aCode.startsWith(query) && bCode.startsWith(query)) {
            return 1;
        }

        return 0;
    });

    let amount = showAll ? filteredData.length : defaultEntries;

    updateDom(filteredData, amount);
}

searchBar.addEventListener("input", (event) => {
    const query = event.currentTarget.value
    const url = new URL(window.location);
    refreshList(query);
    if (query === "") {
        url.search = "";
    } else {
        url.search = `?q=${query}`;
    }
    history.replaceState({}, 'DS100', url);
});

function showAllEntries() {
    const query = searchBar.value;
    refreshList(query, true);
}

fetch("./ds100.json").then((response) => {
    return response.json();
}).then((data) => {
    ds100Data = data;
    refreshList(searchBar.value);
});

function updateDom(items, amount) {
    const container = document.getElementById("data");
    const footer = document.getElementById("footer-not-all-entries");

    container.innerHTML = "";

    if (items.length > 100 && amount == defaultEntries) {
        footer.style.display = "block";
    } else {
        footer.style.display = "none";
    }

    items.slice(0, amount).forEach((item) => {
        const entry = document.createElement("tr");
        entry.classList.add("entry");

        if (item["Betriebszustand"] === "a.B." || item["Betriebszustand"] === "ehemals") {
            entry.classList.add("inactive");
        }

        const rl100Code = document.createElement("td");
        rl100Code.setAttribute("class", "rl100Code");
        rl100Code.textContent = item["RL100-Code"];

        const rl100LongName = document.createElement("td");
        rl100LongName.setAttribute("class", "rl100LongName");
        rl100LongName.textContent = item["RL100-Langname"];

        const rl100TypeLong = document.createElement("td");
        rl100TypeLong.setAttribute("class", "rl100TypeLong");
        rl100TypeLong.textContent = item["Typ Lang"];

        entry.appendChild(rl100Code);
        entry.appendChild(rl100LongName);
        entry.appendChild(rl100TypeLong);
        container.appendChild(entry);
    });
}
