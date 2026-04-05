const folderArenaFiles = [
    "Vikings.png",
    "SUST Gate.png"
];

function toLabel(fileName) {
    return fileName
        .replace(/\.[^/.]+$/, "")
        .replace(/[-_]+/g, " ")
        .trim();
}

const folderArenas = folderArenaFiles.map((fileName) => ({
    id: `folder-${fileName.replace(/\.[^/.]+$/, "").toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
    label: toLabel(fileName),
    className: "arena-photo",
    photoUrl: `./gamePlayArea/arenas/${encodeURIComponent(fileName)}`
}));

const gameplayAreas = [
 
    {
        id: "candy",
        label: "Candy Smash",
        className: "arena-candy"
    },
    {
        id: "neon",
        label: "Neon Alley",
        className: "arena-neon"
    },
  

   
    ...folderArenas
];

export default gameplayAreas;