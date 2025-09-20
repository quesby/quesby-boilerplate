
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read JSON data using fs.readFileSync
const installedModsData = JSON.parse(
  fs.readFileSync(path.join(__dirname, "src/_data/mods/installedMods.json"), "utf8")
);

const outputFile = path.join(__dirname, "src/_data/servermods.json");

async function updateMods() {
  try {
    console.log("🔄 Aggiornamento mod in corso...");
    
    const response = await fetch("https://mods.vintagestory.at/api/mods", {
      headers: { "User-Agent": "Mozilla/5.0" }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const { mods: allMods } = await response.json();

    const finalMods = installedModsData.map(({ modid, filename }) => {
      const modidLower = modid.toLowerCase();
      const matchingMod = allMods.find(mod =>
        (mod.modidstrs || []).some(id => id.toLowerCase() === modidLower)
      );

      const modUrl = matchingMod?.urlalias
        ? `https://mods.vintagestory.at/${matchingMod.urlalias}`
        : `https://mods.vintagestory.at/${modid}`;

      return {
        modid,
        filename,
        title: matchingMod?.name || modid,
        description: matchingMod?.summary || "",
        installedVersion: filename.replace(/^.*?([\d.]+.*)\.zip$/i, "$1"),
        modUrl,
        latestVersion: matchingMod?.versions?.[0]?.version || "",
        latestGameVersion: matchingMod?.versions?.[0]?.gameVersion || "",
        ...matchingMod
      };
    });

    fs.writeFileSync(outputFile, JSON.stringify(finalMods, null, 2), "utf8");
    console.log(`✅ Scritti ${finalMods.length} mod in servermods.json`);
    
  } catch (error) {
    console.error("❌ Errore durante l'aggiornamento delle mod:", error.message);
    process.exit(1);
  }
}

// Run the function
updateMods();
