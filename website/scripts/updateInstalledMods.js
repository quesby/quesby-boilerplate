import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const modFilesPath = path.join(__dirname, "../src/_data/mods/modfiles.txt");
const installedModsPath = path.join(__dirname, "../src/_data/mods/installedMods.json");

function updateInstalledMods() {
  try {
    console.log("🔄 Aggiornamento installedMods.json...");
    
    if (!fs.existsSync(modFilesPath)) {
      throw new Error("File modfiles.txt non trovato!");
    }

    const modFilesContent = fs.readFileSync(modFilesPath, "utf8");
    const modFilenames = modFilesContent.split(",").map(name => name.trim()).filter(name => name);

    if (modFilenames.length === 0) {
      throw new Error("Nessuna mod trovata in modfiles.txt");
    }

    // Crea la struttura installedMods.json
    const installedMods = modFilenames.map(filename => {
      // Estrae il modid dal filename (assumendo formato: modid-version.zip)
      const modid = filename.replace(/^(.+?)-[\d.]+.*\.zip$/i, "$1");
      
      return {
        modid,
        filename
      };
    });

    // Salva il file
    fs.writeFileSync(installedModsPath, JSON.stringify(installedMods, null, 2), "utf8");
    
    console.log(`✅ Aggiornato installedMods.json con ${installedMods.length} mod`);
    console.log("📝 Mod installate:", installedMods.map(m => `${m.modid} (${m.filename})`).join(", "));
    
  } catch (error) {
    console.error("❌ Errore durante l'aggiornamento:", error.message);
    process.exit(1);
  }
}

updateInstalledMods();
