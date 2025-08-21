import dotenv from 'dotenv'
import { execSync } from 'child_process'

dotenv.config()

const theme = process.env.THEME || 'default'
const command = `sass --watch src/sass:src/assets/css src/themes/${theme}:src/assets/css --style=compressed`

execSync(command, { stdio: 'inherit' })
