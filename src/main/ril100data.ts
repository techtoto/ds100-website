const RIL100_CSV_URL = "./ril100.csv";

export type Ril100Data = {
    [key: string]: string,
};

export async function getRil100Data(): Promise<Ril100Data[]> {
    const csvText = await getRil100CSV();

    return parseFile(csvText);
}

async function getRil100CSV() {
    try {
        const freshData = await fetchFreshRil100Data();

        setTimeout(async () => {
            await (await caches.open("ril100data")).put(RIL100_CSV_URL, freshData)
        }, 500)

        return freshData.clone().text();
    } catch(e) {
        console.error("Failed to fetch fresh ril 100 data", e);

        const cachedData = await (await caches.open("ril100data")).match(RIL100_CSV_URL);

        if(cachedData) {
            return cachedData.text();
        } else {
            throw new Error("Unable to find cached ril 100 data");
        }
    }
}

async function fetchFreshRil100Data(): Promise<Response> {
    const response = await fetch(RIL100_CSV_URL);

    if(!response.ok) {
        throw new Error("Response not okay");
    }

    return response;
}

function parseFile(text: string): Ril100Data[] {
    const lines = text.trim().split("\n");

    const headers = parseLine(lines.shift() || "");

    if(!headers) {
        return [];
    }

    const otherLines = lines
        .map(parseLine)
        .filter(line => line.length > 0);

    const objs = otherLines
        .map(values => {
            if(values.length !== headers.length) {
                throw new Error("Column count mismatch");
            }

            const entries = [];

            for(let i = 0; i < headers.length; i++) {
                entries.push([headers[i], values[i]]);
            }

            return entries;
        })
        .map(Object.fromEntries)

    return objs;
}

function parseLine(line: string): string[] {
    if(line.length === 0) {
        return [];
    }

    let inString = false;
    let result: string[] = [];
    let currentString = "";

    for(const char of line) {
        if(char === "\"") {
            inString = !inString;
        } else if(char === "," && !inString) {
            result.push(currentString);
            currentString = "";
        } else {
            currentString += char;
        }
    }

    if(inString) {
        throw new Error("Unterminated string")
    }

    return result
}
