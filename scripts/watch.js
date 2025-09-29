import { execSync } from "child_process"
import fs from "fs"

const siteData = JSON.parse(fs.readFileSync("./src/_data/site.json", "utf-8"))
const theme = siteData.theme || "default"

// Paths to compile
const input1 = `src/themes/${theme}`
const output = "src/assets/css"

// Load path for Sass (e.g. for @neutrino/core/sass)
const loadPath = "--load-path=node_modules"

// Full command
const command = `sass --watch ${loadPath} ${input1}:${output} --style=compressed`

execSync(command, { stdio: "inherit" })
