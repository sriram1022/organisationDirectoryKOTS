
import { useEffect, useRef, useState } from "react";
import en from "../locales/en.json";
import { validateField, validateForm } from "../utils/validation";

const initialValues = {
  name: "",
  status: "",
  ownerEmail: "",
  memberCount: ""
};

const fields = ["name", "status", "ownerEmail", "memberCount"];

function CreateOrganisationForm({ organisations, onCreate, onCancel }) {
  const dialogRef = useRef(null);
  const [values, setValues] = useState({ ...initialValues });
  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    dialog?.showModal();

    return () => {
      if (dialog?.open) {
        dialog.close();
      }
    };
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;

    setValues((current) => ({
      ...current,
      [name]: value
    }));

    setSuccess(false);
  }

  function handleBlur(event) {
    const field = event.target.name;

    setTouched((current) => ({
      ...current,
      [field]: true
    }));

    setErrors((current) => ({
      ...current,
      [field]: validateField(field, values, organisations)
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    const nextErrors = validateForm(values, organisations);
    setErrors(nextErrors);
    setTouched({
      name: true,
      status: true,
      ownerEmail: true,
      memberCount: true
    });

    if (Object.values(nextErrors).some(Boolean)) {
      return;
    }

    const newOrganisation = {
      id: `local-${Date.now()}`,
      rowKey: `local-${Date.now()}`,
      name: values.name.trim(),
      status: values.status,
      memberCount:
        values.memberCount.trim() === ""
          ? null
          : Number(values.memberCount),
      ownerEmail: values.ownerEmail.trim(),
      createdAt: new Date().toISOString()
    };

    onCreate(newOrganisation);

    setValues({ ...initialValues });
    setTouched({});
    setErrors({});
    setSuccess(true);
  }

  function errorMessage(field) {
    if (!touched[field] || !errors[field]) {
      return null;
    }

    return (
      <p className="field-error" role="alert">
        {en.form[errors[field]]}
      </p>
    );
  }

  return (
    <dialog
      ref={dialogRef}
      className="create-form-dialog"
      aria-labelledby="create-organisation-title"
      onCancel={onCancel}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onCancel();
        }
      }}
    >
      <section className="create-form-panel">
        <h2 id="create-organisation-title">{en.form.title}</h2>
        <p className="form-description">{en.form.duplicateIdNote}</p>

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-field">
            <label htmlFor="organisation-name">
              {en.form.name} *
            </label>
            <input
              id="organisation-name"
              name="name"
              value={values.name}
              autoFocus
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder={en.form.namePlaceholder}
              aria-invalid={Boolean(touched.name && errors.name)}
              aria-describedby={
                touched.name && errors.name ? "name-error" : undefined
              }
            />
            {errorMessage("name") &&
              <div id="name-error">{errorMessage("name")}</div>}
          </div>

          <div className="form-field">
            <label htmlFor="organisation-status">
              {en.form.status} *
            </label>
            <select
              id="organisation-status"
              name="status"
              value={values.status}
              onChange={handleChange}
              onBlur={handleBlur}
              aria-invalid={Boolean(touched.status && errors.status)}
            >
              <option value="">-- {en.form.status} --</option>
              <option value="active">{en.filter.active}</option>
              <option value="inactive">{en.filter.inactive}</option>
              <option value="suspended">{en.filter.suspended}</option>
            </select>
            {errorMessage("status")}
          </div>

          <div className="form-field">
            <label htmlFor="organisation-owner">
              {en.form.ownerEmail} *
            </label>
            <input
              id="organisation-owner"
              name="ownerEmail"
              type="email"
              value={values.ownerEmail}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder={en.form.ownerEmailPlaceholder}
              aria-invalid={Boolean(touched.ownerEmail && errors.ownerEmail)}
            />
            {errorMessage("ownerEmail")}
          </div>

          <div className="form-field">
            <label htmlFor="organisation-members">
              {en.form.memberCount}
            </label>
            <input
              id="organisation-members"
              name="memberCount"
              type="number"
              min="0"
              step="1"
              value={values.memberCount}
              onChange={handleChange}
              onBlur={handleBlur}
              aria-invalid={Boolean(touched.memberCount && errors.memberCount)}
            />
            {errorMessage("memberCount")}
          </div>

          {success && (
            <p role="status" className="success-message">
              {en.form.success}
            </p>
          )}

          <div className="form-actions">
            <button type="submit">{en.form.submit}</button>
            <button type="button" onClick={onCancel}>
              {en.form.cancel}
            </button>
          </div>
        </form>
      </section>
    </dialog>
  );
}

export default CreateOrganisationForm;
