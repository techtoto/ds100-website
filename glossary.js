const container = /** @type {HTMLElement} */ (document.getElementById("abbreviations"));
const firstLetters = [
    {
        name: "Hamburg",
        heading: "A"
    },
    "Berlin",
    "Dresden",
    "Essen",
    "Frankfurt",
    "Hannover",
    {
        name: "16,7-Hz-Anlagen",
        heading: "I",
        bold: false
    },
    "Köln",
    {
        name: "Halle",
        heading: "L"
    },
    "München",
    "Nürnberg",
    {
        name: "50-Hz-Anlagen",
        heading: "Q",
        bold: false
    },
    {
        name: "Karlsruhe",
        heading: "R"
    },
    "Saarbrücken",
    {
        name: "Stuttgart",
        heading: "T"
    },
    {
        name: "Erfurt",
        heading: "U"
    },
    {
        name: "Tankanlagen für Verbrennungsfahrzeuge",
        heading: "V"
    },
    {
        name: "Schwerin",
        heading: "W"
    },
    {
        name: "Ausland",
        heading: "X",
        bold: false
    },
    {
        name: "Streckenwechsel",
        heading: "Y",
        bold: false
    },
    {
        name: "Ausland",
        heading: "Z",
        bold: false
    }
]

/**
 * @param {string} text 
 */
function createBoldTextElement(text) {
    const textElement = document.createElement("span");
    textElement.classList.add("bold");
    textElement.textContent = text;
    return textElement;
}

/**
 * @param {(string | {name: string;heading: string;bold?: boolean;})[]} list
 * @param {HTMLElement} container
 * @param {boolean} boldInText
 */
function createWebsiteEntries(list, container, boldInText = false) {
    for (const item of list) {
        const entry = document.createElement("div");
        entry.classList.add("abbreviation-entry");
    
        const headingElement = document.createElement("span");
        headingElement.classList.add("capitalLetter");
        const heading = item["heading"] ?? item[0];
        headingElement.textContent = heading;
    
        const nameElement = document.createElement("p");
        const name = item["name"] ?? item;
        
        let boldCharIndex = name.toLowerCase().indexOf(heading.toLowerCase());
    
        if ((typeof item === "string" && boldInText) ||
            (typeof item === "object" && (item.bold ?? boldInText))) {
            if (boldCharIndex !== 0) {
                nameElement.appendChild(document.createTextNode(name.substring(0, boldCharIndex)));
            }
            nameElement.appendChild(createBoldTextElement(name[boldCharIndex]));
            nameElement.appendChild(document.createTextNode(name.substring(boldCharIndex + 1)));
        } else {
            nameElement.appendChild(document.createTextNode(name));
        }
    
        entry.appendChild(headingElement);
        entry.appendChild(nameElement);
        container.appendChild(entry);
    }
}

createWebsiteEntries(firstLetters, container, true);