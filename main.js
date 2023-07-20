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

const debouncedUserInput = debounce(userInput);

function userInput(input) {
    const filteredData = ds100Data.filter((item) => {
        const lowercase = input.toLowerCase();

        const name = item["RL100-Langname"].toLowerCase();
        const code = item["RL100-Code"].toLowerCase();

        return code.includes(lowercase) || name.includes(lowercase);
    });

    filteredData.sort((a, b) => {
        const lowercase = input.toLowerCase();

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

        const uppercase = input.toUpperCase();

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

        if (aCode.startsWith(input) && !bCode.startsWith(input)) {
            return -1;
        } else if (!aCode.startsWith(input) && bCode.startsWith(input)) {
            return 1;
        }

        return 0;
    });

    updateDom(filteredData);
}

document.addEventListener("DOMContentLoaded", () => {
    const searchBar = document.getElementById("search");

    searchBar.addEventListener("input", (event) => {
        console.log(event.currentTarget.value);

        debouncedUserInput(event.currentTarget.value);
    });
});

fetch("https://ds100.boecker.dev/ds100.json").then((response) => {
    return response.json();
}).then((data) => {
    data.sort((a, b) => {
        const aName = a["RL100-Langname"].toLowerCase();
        const bName = b["RL100-Langname"].toLowerCase();

        const aType = a["Typ Lang"];
        const bType = b["Typ Lang"];

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

        return 0;
    });

    ds100Data = data;

    updateDom(ds100Data);
});

function updateDom(items) {
    const container = document.getElementById("data");

    container.innerHTML = "";

    items.slice(0,100).forEach((item) => {
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
