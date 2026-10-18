
const VALID_STATUSES = ["active", "inactive", "suspended"];

export function normalizeOrganisation(raw, index = 0) {
  // Never modify the original object.
  const source = raw ?? {};

  // Normalize the name safely.
  const name =
    typeof source.name === "string" ? source.name.trim() : "";

  // Normalize the status.
  const rawStatus =
    typeof source.status === "string"
      ? source.status.trim().toLowerCase()
      : "";

  const status = VALID_STATUSES.includes(rawStatus)
    ? rawStatus
    : "unknown";

  // Normalize member count.
  const parsedCount =
    typeof source.memberCount === "number"
      ? source.memberCount
      : typeof source.memberCount === "string" &&
          source.memberCount.trim() !== ""
        ? Number(source.memberCount)
        : NaN;

  const memberCount =
    Number.isInteger(parsedCount) && parsedCount >= 0
      ? parsedCount
      : null;

  // Normalize owner email.
  const rawEmail = source.owner?.email;

  const ownerEmail =
    typeof rawEmail === "string" && rawEmail.trim()
      ? rawEmail.trim()
      : "";

  // Normalize date safely.
  const parsedDate =
    typeof source.createdAt === "number" ||
    typeof source.createdAt === "string"
      ? new Date(source.createdAt)
      : null;

  const createdAt =
    parsedDate && !Number.isNaN(parsedDate.getTime())
      ? parsedDate.toISOString()
      : null;

  return {
    // Keep a stable row key even when IDs are duplicated.
    rowKey: `${String(source.id ?? "missing")}-${index}`,

    // Preserve the original ID for display/debugging.
    id: source.id ?? null,

    name,
    status,
    memberCount,
    ownerEmail,
    createdAt
  };
}

export function normalizeOrganisations(records) {
  if (!Array.isArray(records)) {
    return [];
  }

  return records.map((record, index) =>
    normalizeOrganisation(record, index)
  );
}
