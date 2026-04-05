import { DEFAULT_ARENAS, FOLDER_ARENA_FILES } from './default-arenas.js';

function toLabel(fileName) {
	return fileName
		.replace(/\.[^/.]+$/, "")
		.replace(/[-_]+/g, " ")
		.trim();
}

function buildFolderArenas(fileNames = FOLDER_ARENA_FILES) {
	return fileNames.map((fileName) => ({
		id: `folder-${fileName.replace(/\.[^/.]+$/, "").toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
		label: toLabel(fileName),
		className: "arena-photo",
		photoUrl: `./arenas/${encodeURIComponent(fileName)}`
	}));
}

function buildGameplayAreas() {
	return [
		...DEFAULT_ARENAS,
		...buildFolderArenas()
	];
}

const gameplayAreas = buildGameplayAreas();

export {
	toLabel,
	buildFolderArenas,
	buildGameplayAreas
};

export default gameplayAreas;
