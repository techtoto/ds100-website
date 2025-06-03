import { getRil100Data, type Ril100Data } from "./ril100data";
import { getSearchQuery } from "./search";

let ril100Data: Ril100Data[] = [];

getRil100Data().then((data) => {
    ril100Data = data;

    refreshList(getSearchQuery());
})

const defaultEntryLimit = 100;

const container = document.getElementById("data")!;
const footer = document.getElementById("footer-not-all-entries")!;
const showAllButton = document.getElementById("showAllButton")!;

export function refreshList(query = "", showAll = false) {
    query = query.trim();
    const filteredData = ril100Data!.filter((item) => {
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

        const aType = a["Typ-Kurz"];
        const bType = b["Typ-Kurz"];

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

    let amount = showAll ? filteredData.length : defaultEntryLimit;

    updateDom(filteredData, amount);
}

function updateDom(items: Ril100Data[], amount: number) {
    container.innerHTML = "";

    if (items.length > 100 && amount == defaultEntryLimit) {
        showAllButton.textContent = `Alle ${items.length} Einträge anzeigen`;
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
        const rl100CodeLink = document.createElement("a");
        rl100CodeLink.textContent = item["RL100-Code"];
        rl100CodeLink.href = `https://trassenfinder.de/api/web/infrastrukturen/5/dokumente/${item["RL100-Code"]}_APN-Skizze.pdf`;
        rl100CodeLink.target = "_blank";
        rl100Code.appendChild(rl100CodeLink);

        const rl100LongName = document.createElement("td");
        rl100LongName.setAttribute("class", "rl100LongName");
        rl100LongName.textContent = item["RL100-Langname"];

        const rl100TypeLong = document.createElement("td");
        rl100TypeLong.setAttribute("class", "rl100TypeLong");
        rl100TypeLong.textContent = item["Typ-Kurz"];

        entry.appendChild(rl100Code);
        entry.appendChild(rl100LongName);
        entry.appendChild(rl100TypeLong);
        container.appendChild(entry);
    });
}

showAllButton.addEventListener("click", () => {
    const query = getSearchQuery();
    refreshList(query, true);
})
