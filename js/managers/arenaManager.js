import { buildGameplayAreas } from '../arena/arena.js';

function initArenaManager(options) {
    const {
        canvas,
        arenaButtons,
        arenaPhotoUpload,
        arenaPhotoName,
        arenaNameModal,
        arenaNameInput,
        arenaNameError,
        arenaNameCancel,
        arenaNameSave
    } = options || {};

    let currentArenaClass = "";
    let currentPhotoUrl = "";
    let pendingArenaDataUrl = "";
    let pendingArenaCanPersist = true;
    const arenaStorageKey = "faceSmasherArenaPhotos";
    const gameplayAreas = buildGameplayAreas();

    function applyArenaClass(className) {
        if (currentArenaClass) {
            canvas.classList.remove(currentArenaClass);
        }
        currentArenaClass = className;
        if (currentArenaClass) {
            canvas.classList.add(currentArenaClass);
        }
    }

    function applyArenaTheme(arena) {
        applyArenaClass(arena.className);
        if (arena.photoUrl) {
            canvas.style.setProperty("--arena-photo", `url("${arena.photoUrl}")`);
        } else {
            canvas.style.removeProperty("--arena-photo");
        }
    }

    function selectArenaButton(arenaId) {
        if (!arenaButtons) return;
        const selected = arenaButtons.querySelector(".arena-btn.selected");
        if (selected) selected.classList.remove("selected");
        const next = arenaButtons.querySelector(`[data-arena-id="${arenaId}"]`);
        if (next) next.classList.add("selected");
    }

    function getSavedArenas() {
        try {
            const raw = localStorage.getItem(arenaStorageKey);
            return raw ? JSON.parse(raw) : [];
        } catch (error) {
            return [];
        }
    }

    function saveArenas(arenas) {
        localStorage.setItem(arenaStorageKey, JSON.stringify(arenas));
    }

    function getArenaList() {
        return [...gameplayAreas, ...getSavedArenas()];
    }

    function estimateDataUrlBytes(dataUrl) {
        if (typeof dataUrl !== "string") return 0;
        const commaIndex = dataUrl.indexOf(",");
        if (commaIndex < 0) return dataUrl.length;
        const base64 = dataUrl.slice(commaIndex + 1);
        const padding = base64.endsWith("==") ? 2 : (base64.endsWith("=") ? 1 : 0);
        return Math.max(0, Math.floor((base64.length * 3) / 4) - padding);
    }

    function loadImage(dataUrl) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = () => reject(new Error("Image decode failed"));
            img.src = dataUrl;
        });
    }

    async function optimizeForStorage(dataUrl) {
        const initialBytes = estimateDataUrlBytes(dataUrl);
        if (initialBytes > 0 && initialBytes <= 420000) {
            return dataUrl;
        }

        const img = await loadImage(dataUrl);
        const maxSide = 1280;
        const scale = Math.min(1, maxSide / Math.max(img.width, img.height));
        const width = Math.max(1, Math.round(img.width * scale));
        const height = Math.max(1, Math.round(img.height * scale));

        const canvasEl = document.createElement("canvas");
        canvasEl.width = width;
        canvasEl.height = height;
        const c2d = canvasEl.getContext("2d");
        if (!c2d) {
            return dataUrl;
        }

        c2d.drawImage(img, 0, 0, width, height);

        const qualitySteps = [0.86, 0.8, 0.74, 0.68, 0.62, 0.56];
        let bestDataUrl = dataUrl;
        let bestSize = initialBytes || Number.MAX_SAFE_INTEGER;

        for (const quality of qualitySteps) {
            const jpegData = canvasEl.toDataURL("image/jpeg", quality);
            const jpegSize = estimateDataUrlBytes(jpegData);
            if (jpegSize > 0 && jpegSize < bestSize) {
                bestDataUrl = jpegData;
                bestSize = jpegSize;
            }
            if (jpegSize > 0 && jpegSize <= 420000) {
                return jpegData;
            }
        }

        return bestDataUrl;
    }

    function readImageToDataUrl(file) {
        return new Promise((resolve, reject) => {
            if (!file.type || !file.type.startsWith("image/")) {
                reject(new Error("Unsupported file type"));
                return;
            }

            const reader = new FileReader();
            reader.onload = async () => {
                try {
                    const optimized = await optimizeForStorage(reader.result);
                    resolve({ dataUrl: optimized, canPersist: true });
                } catch (error) {
                    resolve({ dataUrl: reader.result, canPersist: true });
                }
            };
            reader.onerror = () => {
                try {
                    const tempUrl = URL.createObjectURL(file);
                    resolve({ dataUrl: tempUrl, canPersist: false });
                } catch (error) {
                    reject(new Error("Image read failed"));
                }
            };
            reader.readAsDataURL(file);
        });
    }

    function resetArenaUpload() {
        if (arenaPhotoUpload) {
            arenaPhotoUpload.value = "";
        }
    }

    function openArenaNameModal(defaultName) {
        if (!arenaNameModal || !arenaNameInput || !arenaNameError) return;
        arenaNameInput.value = defaultName || "";
        arenaNameError.classList.add("hidden");
        arenaNameModal.classList.remove("hidden");
        arenaNameInput.focus();
    }

    function closeArenaNameModal() {
        if (!arenaNameModal) return;
        arenaNameModal.classList.add("hidden");
    }

    function clearPendingArenaData() {
        if (!pendingArenaCanPersist && pendingArenaDataUrl) {
            URL.revokeObjectURL(pendingArenaDataUrl);
        }
        pendingArenaDataUrl = "";
        pendingArenaCanPersist = true;
    }

    function savePendingArena() {
        if (!arenaNameInput || !arenaNameError) return;
        const arenaLabel = arenaNameInput.value.trim();
        if (!arenaLabel) {
            arenaNameError.classList.remove("hidden");
            arenaNameInput.focus();
            return;
        }

        if (!pendingArenaDataUrl) {
            closeArenaNameModal();
            return;
        }

        const saved = getSavedArenas();
        const newArena = {
            id: `photo-${Date.now()}-${Math.floor(Math.random() * 100000)}`,
            label: arenaLabel,
            className: "arena-photo",
            photoUrl: pendingArenaDataUrl
        };

        if (pendingArenaCanPersist) {
            saved.push(newArena);
            try {
                saveArenas(saved);
                arenaPhotoName.textContent = `${arenaLabel} saved`;
            } catch (error) {
                arenaPhotoName.textContent = `${arenaLabel} loaded (not saved)`;
            }
        } else {
            currentPhotoUrl = pendingArenaDataUrl;
            arenaPhotoName.textContent = `${arenaLabel} loaded (not saved)`;
        }

        buildArenaButtons(newArena.id);
        selectArenaButton(newArena.id);
        applyArenaTheme(newArena);
        pendingArenaDataUrl = "";
        pendingArenaCanPersist = true;
        closeArenaNameModal();
        resetArenaUpload();
    }

    function buildArenaButtons(selectedId) {
        if (!arenaButtons) return;
        arenaButtons.innerHTML = "";
        const arenas = getArenaList();
        arenas.forEach((arena, index) => {
            const button = document.createElement("button");
            button.type = "button";
            button.className = "arena-btn";
            button.textContent = arena.label;
            button.dataset.arenaId = arena.id;

            if ((selectedId && selectedId === arena.id) || (index === 0 && !currentArenaClass)) {
                button.classList.add("selected");
                applyArenaTheme(arena);
            }

            button.addEventListener("click", () => {
                selectArenaButton(arena.id);
                applyArenaTheme(arena);
            });

            arenaButtons.appendChild(button);
        });
    }

    buildArenaButtons();

    if (arenaPhotoUpload) {
        arenaPhotoUpload.addEventListener("change", async (e) => {
            const file = e.target.files[0];
            arenaPhotoName.textContent = file ? file.name : "No arena photo selected";

            if (!file) return;

            if (currentPhotoUrl) {
                URL.revokeObjectURL(currentPhotoUrl);
                currentPhotoUrl = "";
            }

            clearPendingArenaData();

            try {
                const fileLabel = file.name.replace(/\.[^/.]+$/, "").trim();
                const arenaLabel = fileLabel || "Photo Arena";
                const result = await readImageToDataUrl(file);
                pendingArenaDataUrl = result.dataUrl;
                pendingArenaCanPersist = result.canPersist;
                openArenaNameModal(arenaLabel);
            } catch (error) {
                arenaPhotoName.textContent = "Image failed to load";
            }
        });
    }

    if (arenaNameCancel) {
        arenaNameCancel.addEventListener("click", () => {
            clearPendingArenaData();
            closeArenaNameModal();
            resetArenaUpload();
            arenaPhotoName.textContent = "No arena photo selected";
        });
    }

    if (arenaNameSave) {
        arenaNameSave.addEventListener("click", savePendingArena);
    }

    if (arenaNameInput) {
        arenaNameInput.addEventListener("input", () => {
            if (arenaNameError) {
                arenaNameError.classList.add("hidden");
            }
        });

        arenaNameInput.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                event.preventDefault();
                savePendingArena();
            }
        });
    }

    if (arenaNameModal) {
        arenaNameModal.addEventListener("keydown", (event) => {
            if (event.key === "Escape") {
                event.preventDefault();
                if (arenaNameCancel) {
                    arenaNameCancel.click();
                }
            }
        });
    }
}

export { initArenaManager };
