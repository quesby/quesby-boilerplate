import { execSync } from "child_process"
import fs from "fs"

const siteData = JSON.parse(fs.readFileSync("./src/_data/site.json", "utf-8"))
const theme = siteData.theme || "default"

// percorsi da compilare
const input1 = `src/themes/${theme}`
const output = "src/assets/css"

// load-path per Sass (es. per @neutrino/core/sass)
const loadPath = "--load-path=node_modules"

// comando completo
const command = `sass --watch ${loadPath} ${input1}:${output} --style=compressed`

execSync(command, { stdio: "inherit" })
