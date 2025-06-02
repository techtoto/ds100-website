const CACHE_ID = "swcache-1";

const additionalFilesToCache = [
    "./",
    "./manifest.json",
    "./favicon.svg",
    "./favicon-black.svg",
    "./favicon-512x512.png",
];

self.addEventListener("install", (event) => {
    event.waitUntil((async () => {
        const fileResponse = await fetch("./serviceworker-manifest.json", { cache: "no-cache" });
        const fileJson = await fileResponse.json();
        const filesToCache = fileJson.allFiles
            .concat(additionalFilesToCache);

        const cache = await caches.open(CACHE_ID);
        await cache.addAll(filesToCache);
    })());
});

self.addEventListener("fetch", (event) => {
    event.respondWith((async () => {
        const cache = await caches.open(CACHE_ID);
        const cachedResponse = await cache.match(event.request);

        if(cachedResponse) {
            return cachedResponse;
        }

        return await fetch(event.request);
    })());
});
