import { useActionState, useEffect, useState } from "react";
import "./FormTest.css";

type Sex = "male" | "female" | "other";

interface FormValues {
  name: string;
  sex: Sex | "";
  age: string;
  observation: string;
}

interface FormErrors {
  name?: string;
  age?: string;
}

interface FormState {
  submitted: FormValues | null;
  errors: FormErrors;
}

const initialValues: FormValues = {
  name: "",
  sex: "",
  age: "",
  observation: "",
};

const initialState: FormState = {
  submitted: null,
  errors: {},
};

async function handleSubmit(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const name = formData.get("name") as string;
  const age = formData.get("age") as string;

  const errors: FormErrors = {};

  if (name.length <= 2) {
    errors.name = "Name must have more than 2 characters";
  }

  const ageNum = Number.parseInt(age, 10);
  if (!age || Number.isNaN(ageNum) || ageNum <= 30) {
    errors.age = "Age must be bigger than 30";
  }

  if (Object.keys(errors).length > 0) {
    return { submitted: null, errors };
  }

  const submitted: FormValues = {
    name,
    sex: (formData.get("sex") || "") as Sex | "",
    age,
    observation: formData.get("observation") as string,
  };

  return { submitted, errors: {} };
}

function FormTest() {
  const [values, setValues] = useState<FormValues>(initialValues);
  const [state, action, pending] = useActionState(handleSubmit, initialState);

  const handleChange = <K extends keyof FormValues>(
    field: K,
    value: FormValues[K],
  ) => {
    setValues((current) => ({ ...current, [field]: value }));
  };

  useEffect(() => {
    if (state.submitted) {
      setValues(state.submitted);
    }
  }, [state.submitted]);

  const hasErrors = Object.keys(state.errors).length > 0;

  const handleClear = () => {
    setValues(initialValues);
  };

  return (
    <section className="form-test">
      <h1>Form Test</h1>
      {hasErrors && (
        <div className="error-banner" data-testid="error-banner">
          <p>Please fix the following errors:</p>
          <ul>
            {state.errors.name && <li>{state.errors.name}</li>}
            {state.errors.age && <li>{state.errors.age}</li>}
          </ul>
        </div>
      )}
      <form action={action} noValidate>
        <div className="field">
          <label htmlFor="name">Name</label>
          <input
            id="name"
            name="name"
            type="text"
            value={values.name}
            onChange={(e) => handleChange("name", e.target.value)}
            aria-invalid={!!state.errors.name}
          />
          {state.errors.name && (
            <span className="error-text" data-testid="name-error">
              {state.errors.name}
            </span>
          )}
        </div>

        <div className="field">
          <label htmlFor="sex">Sex</label>
          <select
            id="sex"
            name="sex"
            value={values.sex}
            onChange={(e) => handleChange("sex", e.target.value as Sex)}
          >
            <option value="" disabled>
              Select…
            </option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="field">
          <label htmlFor="age">Age</label>
          <input
            id="age"
            name="age"
            type="text"
            inputMode="numeric"
            value={values.age}
            onChange={(e) => handleChange("age", e.target.value)}
            aria-invalid={!!state.errors.age}
          />
          {state.errors.age && (
            <span className="error-text" data-testid="age-error">
              {state.errors.age}
            </span>
          )}
        </div>

        <div className="field">
          <label htmlFor="observation">Observation</label>
          <textarea
            id="observation"
            name="observation"
            rows={4}
            value={values.observation}
            onChange={(e) => handleChange("observation", e.target.value)}
          />
        </div>

        <div className="form-actions">
          <button type="submit" disabled={pending}>
            {pending ? "Submitting..." : "Submit"}
          </button>
          <button type="button" onClick={handleClear}>
            Clear
          </button>
        </div>
      </form>

      {state.submitted && (
        <div className="submitted" data-testid="submitted-values">
          <h2>Submitted values</h2>
          <ul>
            <li>Name: {state.submitted.name}</li>
            <li>Sex: {state.submitted.sex}</li>
            <li>Age: {state.submitted.age}</li>
            <li>Observation: {state.submitted.observation}</li>
          </ul>
        </div>
      )}
    </section>
  );
}

export default FormTest;
