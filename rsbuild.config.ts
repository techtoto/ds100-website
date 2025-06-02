import { defineConfig } from "@rsbuild/core";

export default defineConfig({
    source: {
        entry: {
            index: "./src/main/index.js",
            glossary: "./src/glossary/index.js",
        },
    },
    html: {
        template({ entryName }) {
            return entryName === "glossary" ? "./static/glossary.html" : "./static/index.html";
        },
    },
});
