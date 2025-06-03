import { refreshList } from "./list";

const searchBar = document.getElementById("search")! as HTMLInputElement;

export function getSearchQuery() {
    return searchBar.value;
}

searchBar.addEventListener("input", () => {
    const query = searchBar.value;
    const url = new URL(window.location.href);

    refreshList(query);
    
    if (query === "") {
        url.hash = "";
    } else {
        url.hash = `#q=${encodeURIComponent(query)}`;
    }

    history.replaceState({}, "DS100", url);
});

function handleSearchParams() {
    const params = new URLSearchParams(document.location.hash.substring(1));
    const query = params.get("q") || "";
    searchBar.value = query;
    refreshList(query);
}

handleSearchParams();
window.addEventListener("hashchange", handleSearchParams);
