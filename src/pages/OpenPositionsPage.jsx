/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { departmentOptions, positionTypeOptions } from "../lib/cmsOptions";
import { backendUrl } from "../lib/config";

const createInitialPositionState = () => ({
  title: "",
  department: "Sales & Showroom",
  type: ["Full-time"],
  location: "Ernakulam, Kerala",
  description: "",
  requirementsText: "",
});

const OpenPositionsPage = ({ token }) => {
  const [formData, setFormData] = useState(createInitialPositionState);
  const [openPositions, setOpenPositions] = useState([]);
  const [editingId, setEditingId] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const fetchOpenPositions = async () => {
    try {
      setIsLoading(true);
      const { data } = await axios.get(`${backendUrl}/api/cms/open-positions`);

      if (data.success) {
        setOpenPositions(data.openPositions);
        return;
      }

      toast.error(data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOpenPositions();
  }, []);

  const updateField = (field, value) => {
    setFormData((current) => ({ ...current, [field]: value }));
  };

  const toggleSelection = (field, value) => {
    setFormData((current) => {
      const exists = current[field].includes(value);

      return {
        ...current,
        [field]: exists
          ? current[field].filter((item) => item !== value)
          : [...current[field], value],
      };
    });
  };

  const resetForm = () => {
    setEditingId("");
    setFormData(createInitialPositionState());
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setIsSaving(true);

      const payload = {
  title: formData.title,
  department: [formData.department],
  type: formData.type,
  location: formData.location,
  description: formData.description,
  requirements: formData.requirementsText
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean),
};

      const { data } = editingId
        ? await axios.put(
            `${backendUrl}/api/cms/open-positions/${editingId}`,
            payload,
            { headers: { token } }
          )
        : await axios.post(`${backendUrl}/api/cms/open-positions`, payload, {
            headers: { token },
          });

      if (!data.success) {
        toast.error(data.message);
        return;
      }

      toast.success(data.message);
      resetForm();
      fetchOpenPositions();
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (openPosition) => {
    setEditingId(openPosition._id);
    setFormData({
  title: openPosition.title,
  department: openPosition.department[0],
  type: openPosition.type,
  location: openPosition.location,
  description: openPosition.description,
  requirementsText: openPosition.requirements.join("\n"),
});

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Delete this position?");

    if (!confirmed) {
      return;
    }

    try {
      const { data } = await axios.delete(
        `${backendUrl}/api/cms/open-positions/${id}`,
        {
          headers: { token },
        }
      );

      if (!data.success) {
        toast.error(data.message);
        return;
      }

      toast.success(data.message);
      if (editingId === id) {
        resetForm();
      }
      fetchOpenPositions();
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const uniqueDepartments = [
    ...new Set(openPositions.flatMap((position) => position.department)),
  ];
  const partTimeCount = openPositions.filter((position) =>
    position.type.includes("Part-time")
  ).length;

  return (
    <div className="space-y-6">
      <section className="panel-shell rounded-[32px] px-6 py-7 sm:px-8 sm:py-8">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[var(--forest)]">
              Careers Desk
            </p>
            <h1 className="font-display mt-3 text-4xl leading-none text-[var(--ink)] sm:text-5xl">
              Open positions management
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-7 text-[var(--muted)] sm:text-base">
              Maintain showroom, design, marketing, and operations openings for
              the Drishya Marbles & Tiles team from one hiring dashboard.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-[24px] border border-[var(--line)] bg-white/60 px-5 py-4">
              <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">
                Positions
              </p>
              <p className="mt-3 font-display text-4xl text-[var(--ink)]">
                {openPositions.length}
              </p>
            </div>
            <div className="rounded-[24px] border border-[var(--line)] bg-white/60 px-5 py-4">
              <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">
                Part-Time Roles
              </p>
              <p className="mt-3 font-display text-4xl text-[var(--ink)]">{partTimeCount}</p>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
        <form onSubmit={handleSubmit} className="panel-shell rounded-[32px] p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--forest)]">
                {editingId ? "Edit Vacancy" : "New Vacancy"}
              </p>
              <h2 className="font-display mt-2 text-3xl text-[var(--ink)]">
                {editingId ? "Update role details" : "Create an opening"}
              </h2>
            </div>

            {editingId ? (
              <button type="button" onClick={resetForm} className="secondary-button">
                Cancel
              </button>
            ) : null}
          </div>

          <div className="mt-8 grid gap-5">
            <label className="space-y-2">
              <span className="text-sm font-semibold text-[var(--ink)]">Position Title</span>
              <input
                type="text"
                value={formData.title}
                onChange={(event) => updateField("title", event.target.value)}
                placeholder="Senior Sales Executive"
                required
              />
            </label>

            <div className="space-y-3">
              <span className="text-sm font-semibold text-[var(--ink)]">Departments</span>
              <div className="flex flex-wrap gap-3">
                {departmentOptions.map((option) => {
  const active = formData.department === option;

  return (
    <button
      key={option}
      type="button"
      onClick={() => updateField("department", option)}
      className={`option-pill ${active ? "option-pill-active" : ""}`}
    >
      {option}
    </button>
  );
})}
              </div>
            </div>

            <div className="space-y-3">
              <span className="text-sm font-semibold text-[var(--ink)]">Employment Type</span>
              <div className="flex flex-wrap gap-3">
                {positionTypeOptions.map((option) => {
                  const active = formData.type.includes(option);

                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => toggleSelection("type", option)}
                      className={`option-pill ${active ? "option-pill-active" : ""}`}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
            </div>

            <label className="space-y-2">
              <span className="text-sm font-semibold text-[var(--ink)]">Location</span>
              <input
                type="text"
                value={formData.location}
                onChange={(event) => updateField("location", event.target.value)}
                placeholder="Ernakulam, Kerala"
                required
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-semibold text-[var(--ink)]">Description</span>
              <textarea
                value={formData.description}
                onChange={(event) => updateField("description", event.target.value)}
                placeholder="Describe the role, audience, and responsibility scope."
                className="min-h-[180px]"
                required
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-semibold text-[var(--ink)]">
                Requirements
              </span>
              <textarea
                value={formData.requirementsText}
                onChange={(event) => updateField("requirementsText", event.target.value)}
                placeholder={"Add one requirement per line.\n3+ years of B2C/B2B sales experience"}
                className="min-h-[200px]"
                required
              />
            </label>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <button type="submit" className="primary-button" disabled={isSaving}>
              {isSaving
                ? "Saving..."
                : editingId
                  ? "Update Position"
                  : "Publish Position"}
            </button>
            <button
              type="button"
              onClick={fetchOpenPositions}
              className="secondary-button"
            >
              Refresh List
            </button>
          </div>
        </form>

        <section className="panel-shell rounded-[32px] p-6 sm:p-8">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--forest)]">
                Careers Pipeline
              </p>
              <h2 className="font-display mt-2 text-3xl text-[var(--ink)]">
                Active vacancy list
              </h2>
            </div>
            <p className="text-sm text-[var(--muted)]">
              {uniqueDepartments.length} department stream(s)
            </p>
          </div>

          <div className="mt-6 space-y-4">
            {isLoading ? (
              <div className="rounded-[28px] border border-dashed border-[var(--line)] px-6 py-12 text-center text-[var(--muted)]">
                Loading career openings...
              </div>
            ) : null}

            {!isLoading && !openPositions.length ? (
              <div className="rounded-[28px] border border-dashed border-[var(--line)] px-6 py-12 text-center">
                <h3 className="font-display text-3xl text-[var(--ink)]">No vacancies yet</h3>
                <p className="mt-3 text-sm text-[var(--muted)]">
                  Publish the first role for the Ernakulam showroom or support team.
                </p>
              </div>
            ) : null}

            {!isLoading
              ? openPositions.map((openPosition) => (
                  <article
                    key={openPosition._id}
                    className="rounded-[28px] border border-[var(--line)] bg-white/70 p-5 shadow-[0_16px_30px_rgba(61,44,29,0.08)]"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <div className="flex flex-wrap gap-2">
                          {openPosition.type.map((item) => (
                            <span
                              key={`${openPosition._id}-${item}`}
                              className="rounded-full bg-[rgba(79,106,87,0.14)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--forest)]"
                            >
                              {item}
                            </span>
                          ))}
                        </div>
                        <h3 className="font-display mt-3 text-3xl leading-none text-[var(--ink)]">
                          {openPosition.title}
                        </h3>
                      </div>

                      <p className="text-sm text-[var(--muted)]">{openPosition.location}</p>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {openPosition.department.map((item) => (
                        <span
                          key={`${openPosition._id}-department-${item}`}
                          className="rounded-full border border-[var(--line)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]"
                        >
                          {item}
                        </span>
                      ))}
                    </div>

                    <p className="mt-4 text-sm leading-7 text-[var(--ink)]">
                      {openPosition.description}
                    </p>

                    <div className="mt-5 rounded-[24px] bg-[rgba(255,255,255,0.58)] p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--muted)]">
                        Requirements
                      </p>
                      <ul className="mt-3 space-y-2 text-sm leading-7 text-[var(--ink)]">
                        {openPosition.requirements.map((item) => (
                          <li key={`${openPosition._id}-requirement-${item}`}>- {item}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-5 flex flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={() => handleEdit(openPosition)}
                        className="secondary-button"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(openPosition._id)}
                        className="danger-button"
                      >
                        Delete
                      </button>
                    </div>
                  </article>
                ))
              : null}
          </div>
        </section>
      </div>
    </div>
  );
};

export default OpenPositionsPage;
