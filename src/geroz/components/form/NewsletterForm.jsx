import { useState, useRef, useEffect } from "react";
import { toast } from "react-toastify";
import { useActionState } from "react";
import clsx from "clsx";
import { newsLetterFormAction } from '../../utils/formActions.js';

const initialState = {
  success: false,
  message: "",
  field: undefined,
};

const ALERT_DURATION = 4000;

const NewsletterForm = ({ variant }) => {
  const [state, formAction, pending] = useActionState(
    newsLetterFormAction,
    initialState
  );

  const formRef = useRef(null);

  const [formValues, setFormValues] = useState({
    email: "",
  });

  // Update form values from server state (preserve on error)
  useEffect(() => {
    if (state.data) {
      setFormValues((prev) => ({ ...prev, ...state.data }));
    }
  }, [state._id]);

  // Reset form only on real success
  useEffect(() => {
    if (state.success && !state.field && formRef.current) {
      formRef.current.reset();
      setFormValues({
        email: "",
      });
    }
  }, [state._id]);

  const [alertMessage, setAlertMessage] = useState("");

  // Manage alert message visibility
  useEffect(() => {
    if (state.message) {
      setAlertMessage(state.message);

      const timer = setTimeout(() => {
        setAlertMessage("");
      }, ALERT_DURATION);

      return () => clearTimeout(timer);
    }
    return undefined;
  }, [state._id]);

  // Show toast notifications
  useEffect(() => {
    if (state.message) {
      if (state.success) {
        toast.success(state.message, { autoClose: ALERT_DURATION });
      } else {
        toast.error(state.message, { autoClose: ALERT_DURATION });
      }
    }
  }, [state._id]);

  // Auto-focus on error field
  useEffect(() => {
    if (state.field) {
      const input = formRef.current?.querySelector<HTMLInputElement>(
        `[name="${state.field}"]`
      );
      if (input) {
        input.focus();
      }
    }
  }, [state._id]);

  return (
    <div role="region" aria-labelledby="newsletter-form-heading">
      <h2 id="newsletter-form-heading" className="visually-hidden">
        Newsletter Subscription Form
      </h2>

      <form
        ref={formRef}
        className={`form-clt ${variant ? "mt-5" : "mt-4"}`}
        action={formAction}
        aria-describedby="newsletter-description"
      >
        <div id="newsletter-description" className="visually-hidden">
          Enter your email to subscribe to our newsletter.
        </div>

        <input
          type="email"
          name="email"
          id="newsletter-email"
          placeholder="Enter your email"
          aria-label="Email address"
          aria-required="true"
          aria-invalid={state.field === "email"}
          disabled={pending}
          value={formValues.email}
          onChange={(e) =>
            setFormValues((prev) => ({
              ...prev,
              email: e.target.value,
            }))
          }
          required
        />

        <button
          type="submit"
          className={clsx(variant ? "theme-btn" : "icon", {
            "is-pending": pending,
          })}
          aria-label="Subscribe to newsletter"
          disabled={pending}
        >
          {pending ? (
            <i className="fas fa-spinner fa-spin" aria-hidden="true"></i>
          ) : variant ? (
            <>
              Subscribe
              <i className="fab fa-telegram-plane" aria-hidden="true"></i>
            </>
          ) : (
            <i className="fal fa-long-arrow-right" aria-hidden="true"></i>
          )}
        </button>

        {alertMessage && (
          <div
            className={`alert position-absolute top-2 w-100 alert-${
              state.success ? "success" : "danger"
            } mt-3 flex items-center`}
            role="alert"
            aria-live="assertive"
          >
            {state.success ? (
              <i className="fas fa-check-circle me-2" aria-hidden="true"></i>
            ) : (
              <i className="fas fa-times-circle me-2" aria-hidden="true"></i>
            )}
            {alertMessage}
          </div>
        )}
      </form>
    </div>
  );
};

export default NewsletterForm;
