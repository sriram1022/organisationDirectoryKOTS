
import { normalizeOrganisations } from "../utils/normalizeOrganisation";

function wait(milliseconds) {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}

export async function getOrganisations() {
  // Simulate an API response delay between 400 and 900 ms.
  const delay = 400 + Math.floor(Math.random() * 501);

  await wait(delay);

  // Simulate a 15% chance of API failure.
  if (Math.random() < 0.15) {
    throw new Error("ORGANISATIONS_LOAD_FAILED");
  }

  // Fetch the local fixture as if it came from an API.
  const response = await fetch("/data/organisations.json");

  if (!response.ok) {
    throw new Error("ORGANISATIONS_LOAD_FAILED");
  }

  const rawRecords = await response.json();

  // Return clean records for the UI.
  return normalizeOrganisations(rawRecords);
}
