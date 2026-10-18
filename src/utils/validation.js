
export function validateField(field, values, organisations) {
  const name = values.name.trim();

  switch (field) {
    case "name": {
      if (!name) {
        return "nameRequired";
      }

      if (name.length < 3 || name.length > 80) {
        return "nameLength";
      }

      const duplicate = organisations.some(
        (org) =>
          org.name.trim().toLowerCase() === name.toLowerCase()
      );

      if (duplicate) {
        return "nameDuplicate";
      }

      return "";
    }

    case "status":
      return values.status ? "" : "statusRequired";

    case "ownerEmail": {
      const email = values.ownerEmail.trim();

      if (!email) {
        return "emailRequired";
      }

      // A practical format check for this form.
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      return emailPattern.test(email) ? "" : "emailInvalid";
    }

    case "memberCount": {
      const count = values.memberCount.trim();

      // Member count is optional.
      if (count === "") {
        return "";
      }

      const number = Number(count);

      return Number.isInteger(number) && number >= 0
        ? ""
        : "memberCountInvalid";
    }

    default:
      return "";
  }
}

export function validateForm(values, organisations) {
  const fields = ["name", "status", "ownerEmail", "memberCount"];
  const errors = {};

  for (const field of fields) {
    const error = validateField(field, values, organisations);

    if (error) {
      errors[field] = error;
    }
  }

  return errors;
}
