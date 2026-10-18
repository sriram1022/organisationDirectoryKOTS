import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const currentFile = fileURLToPath(import.meta.url);
const currentDirectory = path.dirname(currentFile);
const projectDirectory = path.resolve(currentDirectory, "..");

const seedPath = path.join(
    projectDirectory,
    "public",
    "data",
    "organisations-seed.json"
);

const outputPath = path.join(
    projectDirectory,
    "public",
    "data",
    "organisations.json"
);

// Read the original eight records.
const seed = JSON.parse(fs.readFileSync(seedPath, "utf8"));

// Clone the original records so we never mutate the seed.
const organisations = structuredClone(seed);

const names = [
    "Bluewave Solutions",
    "Summit Enterprises",
    "Pioneer Systems",
    "Evergreen Group",
    "Silverline Services",
    "Brightpath Technologies",
    "Cedarstone Industries",
    "Westbridge Partners",
    "Mapleleaf Corporation",
    "Horizon Business Group",
    "Oakwood Services",
    "Redstone Technologies"
];

const statuses = [
    "active",
    "inactive",
    "suspended",
    "ACTIVE",
    "Active",
    "actve",
    null
];

const owners = [
    "admin@example.com",
    "operations@example.com",
    "support@example.com",
    "owner@example.com",
    "not-an-email",
    null
];

const dateValues = [
    "2024-02-15T10:00:00Z",
    "2024-07-19T16:20:00Z",
    "2025-06-01T08:00:00Z",
    1710150720000,
    "not a date"
];

for (let i = 0; i < 132; i++) {
    const template = seed[i % seed.length];

    // Make a separate copy of the selected source record.
    const record = structuredClone(template);

    // Give most generated records a new, readable name.
    // Some retain malformed names to preserve the data quirks.
    if (i % 17 === 0) {
        record.name = "";
    } else if (i % 19 === 0) {
        record.name = null;
    } else if (i % 23 === 0) {
        record.name = names[i % names.length] + " 🚀    ";
    } else {
        record.name = `${names[i % names.length]} ${i + 1}`;
    }

    // Intentionally retain occasional duplicate IDs.
    // Most generated records have a unique ID.
    record.id = i % 20 === 0 ? 42 : 100 + i;

    // Keep a mixture of normal and malformed statuses.
    record.status = statuses[i % statuses.length];

    // Preserve occasional string, null and negative counts.
    if (i % 13 === 0) {
        record.memberCount = "12";
    } else if (i % 17 === 0) {
        record.memberCount = null;
    } else if (i % 29 === 0) {
        record.memberCount = -1;
    } else {
        record.memberCount = i * 3;
    }

    // Keep missing and invalid owner values sometimes.
    const email = owners[i % owners.length];

    if (email === null) {
        delete record.owner;
    } else {
        record.owner = { email };
    }

    // Include ISO strings, numeric timestamps and invalid dates.
    record.createdAt = dateValues[i % dateValues.length];

    organisations.push(record);
}

// Save the expanded fixture.
fs.writeFileSync(
    outputPath,
    JSON.stringify(organisations, null, 2) + "\n",
    "utf8"
);

console.log(`Generated ${organisations.length} organisations.`);
console.log(`Output: ${outputPath}`);