// Commentary text module - tool-wise message generation

const COMMENTARY_PROFILES = {
    punch: {
        label: "Punch",
        intro: [
            "Punch mode online. Respectfully, mercy has left the building.",
            "Gloves are imaginary. Violence of intent is very real."
        ],
        hit: [
            "Clean punch landed like a final exam you forgot about.",
            "That fist filed a complaint and won.",
            "Punch connected. Ego disconnected immediately.",
            "Direct impact. Confidence just entered airplane mode."
        ],
        miss: [
            "Punch missed. Air took emotional damage anyway.",
            "Swing and miss. Even gravity looked disappointed.",
            "No contact. Accuracy clocked out early today."
        ],
        combo: {
            tier3: [
                "Three-hit punch combo. This is now workplace bullying.",
                "Punch rhythm unlocked. The beat is disrespectful."
            ],
            tier5: [
                "Five-hit punch streak. HR has been notified.",
                "Hands are overheating. This combo is personal now."
            ],
            tier8: [
                "Eight-hit punch chain. Villain origin confirmed.",
                "Peak punch chaos achieved. The laws are now suggestions."
            ]
        }
    },
    slap: {
        label: "Slap",
        intro: [
            "Slap mode active. Drama is now a public service.",
            "Palm calibrated. Dignity audit begins now."
        ],
        hit: [
            "Crispy slap landed with premium disrespect.",
            "That slap had Oscar-level timing.",
            "Contact confirmed. Pride is still loading.",
            "A dramatic slap has been delivered to the soul."
        ],
        miss: [
            "Slap missed. Full drama, zero receipts.",
            "No connection, but the audience still screamed.",
            "Whiffed slap. Style stayed, substance left."
        ],
        combo: {
            tier3: [
                "Three-slap combo. Echoes filed a noise complaint.",
                "Slap flow activated. Momentum is extra spicy."
            ],
            tier5: [
                "Five-slap chain. Certified disrespect package delivered.",
                "Rapid slap streak. Drama crossed legal limits."
            ],
            tier8: [
                "Elite slap combo. Physics resigned on the spot.",
                "Eight-plus slaps. This is elite chaos choreography."
            ]
        }
    },
    hammer: {
        label: "Hammer",
        intro: [
            "Hammer mode armed. Structural integrity not guaranteed.",
            "Impact advisory active. Subtlety has officially retired."
        ],
        hit: [
            "Hammer drop connected. Budget approved for repairs.",
            "That hit sounded expensive and personal.",
            "Hammer impact confirmed. Nearby dimensions flinched.",
            "Direct hammer contact. Commitment level: terrifying."
        ],
        miss: [
            "Hammer missed. Nearby atoms sent thank-you notes.",
            "No contact. Tension survived, barely.",
            "Whiffed hammer swing. Maximum chaos, minimum accuracy."
        ],
        combo: {
            tier3: [
                "Three-hit hammer streak. Warning labels are sweating.",
                "Hammer chain started. Pressure is now everyone's problem."
            ],
            tier5: [
                "Five-hit hammer combo. Structural concerns upgraded to panic.",
                "Heavy hammer streak. Chaos is now fully operational."
            ],
            tier8: [
                "Elite hammer run. Demolition energy went mythic.",
                "Eight-plus hammer combo. Legendary thud protocol engaged."
            ]
        }
    }
};

function normalizeToolName(toolName) {
    const name = String(toolName || "punch").toLowerCase();
    if (name === "hammer") return "hammer";
    if (name === "slap" || name === "glove") return "slap";
    return "punch";
}

function randomFrom(list) {
    if (!Array.isArray(list) || list.length === 0) return "";
    return list[Math.floor(Math.random() * list.length)];
}

function getProfile(toolName) {
    return COMMENTARY_PROFILES[normalizeToolName(toolName)] || COMMENTARY_PROFILES.punch;
}

function buildComboSuffix(profile, combo) {
    if (combo >= 8) return `${combo}x combo. ${randomFrom(profile.combo.tier8)}`;
    if (combo >= 5) return `${combo}x combo. ${randomFrom(profile.combo.tier5)}`;
    if (combo >= 3) return `${combo}x combo. ${randomFrom(profile.combo.tier3)}`;
    return "";
}

function getIntroMessage(toolName) {
    const profile = getProfile(toolName);
    return randomFrom(profile.intro);
}

function getHitMessage(toolName, combo = 0) {
    const profile = getProfile(toolName);
    const base = `${randomFrom(profile.hit)} ${profile.label} used.`.trim();
    const comboSuffix = buildComboSuffix(profile, combo);
    return comboSuffix ? `${base} ${comboSuffix}` : base;
}

function getMissMessage(toolName) {
    const profile = getProfile(toolName);
    return randomFrom(profile.miss);
}

function getPlainStatusMessage(toolName, score) {
    const profile = getProfile(toolName);
    return `${profile.label} connected. Total smashed: ${score}.`;
}

export {
    COMMENTARY_PROFILES,
    getIntroMessage,
    getHitMessage,
    getMissMessage,
    getPlainStatusMessage,
    normalizeToolName
};
