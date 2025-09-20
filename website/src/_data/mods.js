import servermods from "./servermods.json" with { type: "json" };
import server from "./server.json" with { type: "json" };

const mods = servermods;
const vsVersion = server.vsVersion;

export default {
  mods: mods.map(mod => {
    const version = mod.latestVersion || "";
    const isCompatible = version.startsWith(vsVersion) || version.startsWith(vsVersion.slice(0, 4));
    return {
      ...mod,
      isCompatible
    };
  }),
  vsVersion
};
