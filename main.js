var ds100Data = [];

function debounce(func, delay = 400) {
    let timerId;
    return (...args) => {
        clearTimeout(timerId);
        timerId = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
}

const debouncedUserInput = debounce(refreshList);

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

    let amount = 100;
    if (showAll) {
        amount = filteredData.length;
    }

    updateDom(filteredData, amount);
}

const searchBar = document.getElementById("search");
searchBar.addEventListener("input", (event) => {
    debouncedUserInput(event.currentTarget.value);
});

function showAllEntries() {
    const query = document.getElementById('search').value;
    refreshList(query, 1000);
}

fetch("https://ds100.boecker.dev/ds100.json").then((response) => {
    return response.json();
}).then((data) => {
    ds100Data = data;

    refreshList();
});

function updateDom(items, amount = 100) {
    const container = document.getElementById("data");
    const footer = document.getElementById("footer");

    container.innerHTML = "";

    if (items.length > 100 && amount == 100) {
        footer.style.display = "block";
    } else {
        footer.style.display = "none";
    }

    items.slice(0, amount).forEach((item) => {
        const entry = document.createElement("div");
        entry.setAttribute("class", "entry");

        const rl100Code = document.createElement("p");
        rl100Code.textContent = item["RL100-Code"];

        const rl100LongName = document.createElement("p");
        rl100LongName.textContent = item["RL100-Langname"];

        const rl100TypeLong = document.createElement("p");
        rl100TypeLong.textContent = item["Typ Lang"];

        entry.appendChild(rl100Code);
        entry.appendChild(rl100LongName);
        entry.appendChild(rl100TypeLong);
        container.appendChild(entry);
    })
}

function handleFirstTab(e) {
    if (e.keyCode === 9) { 
        document.body.classList.add('user-is-tabbing');
        window.removeEventListener('keydown', handleFirstTab);
    }
}

window.addEventListener('keydown', handleFirstTab);
