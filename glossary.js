const abbrContainer = /** @type {HTMLElement} */ (document.getElementById("abbreviations"));
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

const typesContainer = /** @type {HTMLElement} */ (document.getElementById("type"));
/* unbekannte Typen (in der csv drin, nicht auf Wikipedia und nicht eindeutig herleitbar):
    Ats
    BZ (Betriebszentrale ist es nicht, aber irgendwelche Stellwerke)
    CEst
    CGbf
    dUw (wohl irgendein Unterwerk)
    Emst
    ES
    fb-* (-GW)
    fBKA
    fGUw
    fUw
    GEGr
    GKs
    GSp
    Guw
    Hst (Haltestelle?)
    Ks
    Kw
    (NE-) Tpg, Tpp
    NLZ
    Psw
    SaSt
    Sbk
    Sst
    ST
    Sw
    Tbv
    tGUw
    TS
    TSO
*/
const types = [
    {
        name: "Abnehmeranlage",
        heading: "AA"
    },
    {
        name: "Abzweigstelle",
        heading: "Abzw"
    },
    {
        name: "Anschlussstelle",
        heading: "Anst"
    },
    {
        name: "Ausweichanschlussstelle",
        heading: "Awanst"
    },
    {
        name: "Bahnhof",
        heading: "Bf"
    },
    {
        name: "Bahnhofsteil",
        heading: "Bft"
    },
    {
        name: "Blockstelle",
        heading: "Bk"
    },
    {
        name: "Brechpunkt",
        heading: "Brchpk"
    },
    {
        name: "Bedienstandort",
        heading: "BSO"
    },
    {
        name: "Bushaltestelle",
        heading: "Bush"
    },
    {
        name: "Deckungsstelle",
        heading: "Dkst"
    },
    {
        name: "Einsatzstelle für Zugpersonal",
        heading: "Est"
    },
    {
        name: "Fernwirkstelle",
        heading: "Fwst"
    },
    {
        name: "Grenzpunkt",
        heading: "Gp"
    },
    {
        name: "Haltepunkt",
        heading: "Hp"
    },
    {
        name: "Landesgrenze",
        heading: "LGr"
    },
    {
        name: "Laufweg",
        heading: "LW"
    },
    {
        name: "Museumsbahnhof",
        heading: "Museum"
    },
    {
        name: "Parkeisenbahn",
        heading: "Park"
    },
    {
        name: "Produktionsdurchführungsgrenze",
        heading: "PDGr"
    },
    {
        name: "Regionalbereichsgrenze",
        heading: "RBGr"
    },
    {
        name: "Selbsttätige Blockstelle",
        heading: "Sbk"
    },
    {
        name: "Schutzstrecke",
        heading: "Schstr"
    },
    {
        name: "Schiffslandestelle",
        heading: "Slst"
    },
    {
        name: "Schaltposten",
        heading: "Sp"
    },
    {
        name: "Streckenwechsel",
        heading: "Strw"
    },
    {
        name: "Tankstelle",
        heading: "Tank"
    },
    {
        name: "Tarifpunkt",
        heading: "Tp"
    },
    {
        name: "Trafostation",
        heading: "TrSt"
    },
    {
        name: "Umrichterwerk",
        heading: "Urw"
    },
    {
        name: "Unterwerk",
        heading: "Uw"
    },
    {
        name: "Überleitstelle",
        heading: "Üst"
    },
    {
        name: "Werk",
        heading: "Werk"
    },
    {
        name: "Zentralschaltstelle",
        heading: "Zes"
    },
    {
        name: "Nichtbundeseigene Eisenbahn",
        heading: "NE-*"
    },
    {
        name: "verpachtet",
        heading: "vp-*"
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

createWebsiteEntries(firstLetters, abbrContainer, true);
createWebsiteEntries(types, typesContainer, false);