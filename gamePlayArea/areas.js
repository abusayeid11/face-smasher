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
        id: "blast",
        label: "Boom Room",
        className: "arena-blast"
    },
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
    {
        id: "cool",
        label: "Chill Zone",
        className: "arena-cool"
    },
    {
        id: "comet",
        label: "Comet Crash",
        className: "arena-comet"
    },
    {
        id: "photo",
        label: "Photo Arena",
        className: "arena-photo"
    },
    ...folderArenas
];

export default gameplayAreas;
