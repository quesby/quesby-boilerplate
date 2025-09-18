import { execSync } from "child_process"
import fs from "fs"

const siteData = JSON.parse(fs.readFileSync("./src/_data/site.json", "utf-8"))
const theme = siteData.theme || "default"

console.log(" Theme from site.json:", theme)
console.log(" Input path:", `src/themes/${theme}`)

const input1= `src/themes/${theme}`
const output = "src/assets/css"
const loadPath = "--load-path=node_modules"

const command = `sass ${loadPath} ${input1}:${output} --style=compressed`

console.log("🔍 Command:", command)

execSync(command, { stdio: "inherit" })
