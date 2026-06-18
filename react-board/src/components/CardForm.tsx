import { ChangeEvent, FormEvent, useMemo, useState } from 'react';
import {
  Card,
  CardStatus,
  COLUMN_ORDER,
  COLUMN_LABELS,
  ASSIGNEE_OPTIONS,
} from '../interfaces/card';

type CardFormProps = {
  card?: Card | null;
  onSave: (card: Omit<Card, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onClose: () => void;
};

type Errors = {
  title?: string;
  description?: string;
};

const CardForm = ({ card, onSave, onClose }: CardFormProps) => {
  const isEdit = !!card;
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState(() => ({
    title: card?.title ?? '',
    description: card?.description ?? '',
    status: card?.status ?? ('todo' as CardStatus),
    assigneeId: card?.assignee.id ?? ASSIGNEE_OPTIONS[0].id,
  }));

  const errors = useMemo<Errors>(() => {
    const currentErrors: Errors = {};
    const trimmedTitle = formData.title.trim();

    if (!trimmedTitle) currentErrors.title = 'Title is required.';
    else if (trimmedTitle.length < 3) currentErrors.title = 'Title must be at least 3 characters.';
    else if (trimmedTitle.length > 120) currentErrors.title = 'Title cannot exceed 120 characters.';

    if (formData.description.length > 500) {
      currentErrors.description = 'Description cannot exceed 500 characters.';
    }

    return currentErrors;
  }, [formData]);

  const isFormInvalid = Object.keys(errors).length > 0;

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);

    if (isFormInvalid) return;

    const assignee = ASSIGNEE_OPTIONS.find((user) => user.id === formData.assigneeId) ?? ASSIGNEE_OPTIONS[0];

    onSave({
      title: formData.title.trim(),
      description: formData.description.trim(),
      status: formData.status,
      assignee,
    });
  };

  return (
    <>
      <div className="modal-backdrop" onClick={onClose} />
      <div className="modal" role="dialog" aria-modal="true">
        <header className="modal-header">
          <h2 className="modal-title">{isEdit ? 'Edit Card' : 'New Card'}</h2>

          <button className="close-btn" onClick={onClose} aria-label="Close" type="button">
            ✕
          </button>
        </header>

        <form className="modal-body" onSubmit={handleSubmit}>
          <div className={`field ${submitted && errors.title ? 'field-error' : ''}`}>
            <label className="label" htmlFor="title">
              Title <span className="required">*</span>
            </label>

            <input
              id="title"
              name="title"
              className="input"
              type="text"
              placeholder="What needs to be done?"
              autoComplete="off"
              value={formData.title}
              onChange={handleChange}
            />

            {submitted && errors.title && <p className="error-msg">{errors.title}</p>}
          </div>

          <div className={`field ${submitted && errors.description ? 'field-error' : ''}`}>
            <label className="label" htmlFor="description">
              Description
            </label>

            <textarea
              id="description"
              name="description"
              className="input textarea"
              placeholder="Add more context…"
              rows={3}
              value={formData.description}
              onChange={handleChange}
            />

            {submitted && errors.description && <p className="error-msg">{errors.description}</p>}
          </div>

          <div className="field-row">
            <div className="field">
              <label className="label" htmlFor="status">
                Status
              </label>

              <select
                id="status"
                name="status"
                className="input"
                value={formData.status}
                onChange={handleChange}
              >
                {COLUMN_ORDER.map((status) => (
                  <option key={status} value={status}>
                    {COLUMN_LABELS[status]}
                  </option>
                ))}
              </select>
            </div>

            <div className="field">
              <label className="label" htmlFor="assigneeId">
                Assignee
              </label>

              <select
                id="assigneeId"
                name="assigneeId"
                className="input"
                value={formData.assigneeId}
                onChange={handleChange}
              >
                {ASSIGNEE_OPTIONS.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <footer className="modal-footer">
            <button className="btn-cancel" type="button" onClick={onClose}>
              Cancel
            </button>

            <button className="btn-submit" type="submit">
              {isEdit ? 'Save Changes' : 'Create Card'}
            </button>
          </footer>
        </form>
      </div>
    </>
  );
};

export default CardForm;