import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rawModFilesPath = path.join(__dirname, "../src/_data/mods/raw-modfiles");
const modFilesPath = path.join(__dirname, "../src/_data/mods/modfiles.txt");

function extractMods() {
  try {
    console.log("�� Estrazione mod da raw-modfiles...");
    
    if (!fs.existsSync(rawModFilesPath)) {
      throw new Error("File raw-modfiles non trovato!");
    }

    const rawContent = fs.readFileSync(rawModFilesPath, "utf8");
    
    // Estrae tutti i valori degli attributi value
    const valueMatches = rawContent.match(/value="([^"]+)"/g);
    
    if (!valueMatches) {
      throw new Error("Nessun valore 'value' trovato nel file raw-modfiles");
    }

    // Estrae solo i valori (senza value="")
    const modValues = valueMatches.map(match => 
      match.replace(/value="([^"]+)"/, "$1")
    );

    // Salva i valori separati da virgola
    const modFilesContent = modValues.join(",");
    fs.writeFileSync(modFilesPath, modFilesContent, "utf8");
    
    console.log(`✅ Estratti ${modValues.length} mod in modfiles.txt`);
    console.log("�� Mod trovate:", modValues.join(", "));
    
  } catch (error) {
    console.error("❌ Errore durante l'estrazione:", error.message);
    process.exit(1);
  }
}

extractMods();
