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
            return {
                index: "./static/index.html",
                glossary: "./static/glossary.html",
            }[entryName];
        },
    },
    output: {
        manifest: "./serviceworker-manifest.json",
        assetPrefix: "./",
    }
});
