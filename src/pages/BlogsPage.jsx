/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";
import { blogTagOptions } from "../lib/cmsOptions";
import { backendUrl } from "../lib/config";

const createInitialBlogState = () => ({
  title: "",
  description: "",
  content: "",
  tag: ["Design Guide"],
  readTime: "5",
  author: "Drishya Editorial Team",
  date: new Date().toISOString().split("T")[0],
});

const formatDateForInput = (value) => {
  const date = new Date(value);
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const formatDateLabel = (value) =>
  new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));

const BlogsPage = ({ token }) => {
  const [formData, setFormData] = useState(createInitialBlogState);
  const [blogs, setBlogs] = useState([]);
  const [editingId, setEditingId] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const fetchBlogs = async () => {
    try {
      setIsLoading(true);
      const { data } = await axios.get(`${backendUrl}/api/cms/blogs`);

      if (data.success) {
        setBlogs(data.blogs);
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
    fetchBlogs();
  }, []);

  const updateField = (field, value) => {
    setFormData((current) => ({ ...current, [field]: value }));
  };

  const toggleTag = (value) => {
    setFormData((current) => {
      const exists = current.tag.includes(value);

      return {
        ...current,
        tag: exists
          ? current.tag.filter((item) => item !== value)
          : [...current.tag, value],
      };
    });
  };

  const resetForm = () => {
    setEditingId("");
    setFormData(createInitialBlogState());
    setImageFile(null);
    setImagePreview("");
  };

  const handleImageChange = (event) => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) {
      return;
    }

    setImageFile(selectedFile);
    setImagePreview(URL.createObjectURL(selectedFile));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setIsSaving(true);

      const basePayload = {
        title: formData.title,
        description: formData.description,
        content: formData.content,
        tag: formData.tag,
        readTime: Number(formData.readTime),
        author: formData.author,
        date: formData.date,
        existingImage: editingId ? imagePreview : "",
      };

      const hasNewImage = Boolean(imageFile);
      const payload = hasNewImage ? new FormData() : basePayload;

      if (hasNewImage) {
        payload.append("title", basePayload.title);
        payload.append("description", basePayload.description);
        payload.append("content", basePayload.content);
        payload.append("tag", JSON.stringify(basePayload.tag));
        payload.append("readTime", basePayload.readTime);
        payload.append("author", basePayload.author);
        payload.append("date", basePayload.date);
        payload.append("existingImage", basePayload.existingImage);
        payload.append("image", imageFile);
      }

      const { data } = editingId
        ? await axios.put(`${backendUrl}/api/cms/blogs/${editingId}`, payload, {
            headers: { token },
          })
        : await axios.post(`${backendUrl}/api/cms/blogs`, payload, {
            headers: { token },
          });

      if (!data.success) {
        toast.error(data.message);
        return;
      }

      toast.success(data.message);
      resetForm();
      fetchBlogs();
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (blog) => {
    setEditingId(blog._id);
    setFormData({
      title: blog.title,
      description: blog.description,
      content: blog.content,
      tag: blog.tag,
      readTime: `${blog.readTime}`,
      author: blog.author,
      date: formatDateForInput(blog.date),
    });
    setImageFile(null);
    setImagePreview(blog.image || "");

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Delete this blog entry?");

    if (!confirmed) {
      return;
    }

    try {
      const { data } = await axios.delete(`${backendUrl}/api/cms/blogs/${id}`, {
        headers: { token },
      });

      if (!data.success) {
        toast.error(data.message);
        return;
      }

      toast.success(data.message);
      if (editingId === id) {
        resetForm();
      }
      fetchBlogs();
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const totalReadTime = blogs.reduce((sum, blog) => sum + Number(blog.readTime || 0), 0);

  return (
    <div className="space-y-6">
      <section className="panel-shell rounded-[32px] px-6 py-7 sm:px-8 sm:py-8">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[var(--accent-dark)]">
              Content Studio
            </p>
            <h1 className="font-display mt-3 text-4xl leading-none text-[var(--ink)] sm:text-5xl">
              Drishya blog management
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-7 text-[var(--muted)] sm:text-base">
              Publish design guidance, product stories, sanitary ware highlights,
              and material trend articles from one editorial dashboard.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-[24px] border border-[var(--line)] bg-white/60 px-5 py-4">
              <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">
                Total Blogs
              </p>
              <p className="mt-3 font-display text-4xl text-[var(--ink)]">{blogs.length}</p>
            </div>
            <div className="rounded-[24px] border border-[var(--line)] bg-white/60 px-5 py-4">
              <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">
                Read Minutes
              </p>
              <p className="mt-3 font-display text-4xl text-[var(--ink)]">{totalReadTime}</p>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
        <form onSubmit={handleSubmit} className="panel-shell rounded-[32px] p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--accent-dark)]">
                {editingId ? "Edit Article" : "New Article"}
              </p>
              <h2 className="font-display mt-2 text-3xl text-[var(--ink)]">
                {editingId ? "Update blog details" : "Create a fresh story"}
              </h2>
            </div>

            {editingId ? (
              <button
                type="button"
                onClick={resetForm}
                className="secondary-button"
              >
                Cancel
              </button>
            ) : null}
          </div>

          <div className="mt-8 grid gap-5">
            <div className="space-y-3">
              <span className="text-sm font-semibold text-[var(--ink)]">
                Featured Image
              </span>
              <label className="flex cursor-pointer items-center gap-4 rounded-[28px] border border-dashed border-[var(--line)] bg-white/55 p-4 transition hover:bg-white/80">
                <img
                  src={imagePreview || assets.upload_area}
                  alt="Blog preview"
                  className="h-24 w-24 rounded-[22px] border border-[var(--line)] object-cover"
                />
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-[var(--ink)]">
                    {imageFile ? imageFile.name : imagePreview ? "Replace current image" : "Upload blog image"}
                  </p>
                  <p className="text-xs leading-6 text-[var(--muted)]">
                    Add a visual for the article card and content listing.
                  </p>
                </div>
                <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
              </label>
            </div>

            <label className="space-y-2">
              <span className="text-sm font-semibold text-[var(--ink)]">Title</span>
              <input
                type="text"
                value={formData.title}
                onChange={(event) => updateField("title", event.target.value)}
                placeholder="Premium stone finishes for modern Kerala homes"
                required
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-semibold text-[var(--ink)]">Description</span>
              <textarea
                value={formData.description}
                onChange={(event) => updateField("description", event.target.value)}
                placeholder="Short summary shown in listings and previews."
                className="min-h-[120px]"
                required
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-semibold text-[var(--ink)]">Content</span>
              <textarea
                value={formData.content}
                onChange={(event) => updateField("content", event.target.value)}
                placeholder="Write the full article content here."
                className="min-h-[220px]"
                required
              />
            </label>

            <div className="space-y-3">
              <span className="text-sm font-semibold text-[var(--ink)]">Tags</span>
              <div className="flex flex-wrap gap-3">
                {blogTagOptions.map((option) => {
                  const active = formData.tag.includes(option);

                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => toggleTag(option)}
                      className={`option-pill ${active ? "option-pill-active" : ""}`}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              <label className="space-y-2">
                <span className="text-sm font-semibold text-[var(--ink)]">Read Time</span>
                <input
                  type="number"
                  min="1"
                  value={formData.readTime}
                  onChange={(event) => updateField("readTime", event.target.value)}
                  placeholder="5"
                  required
                />
              </label>

              <label className="space-y-2 md:col-span-2">
                <span className="text-sm font-semibold text-[var(--ink)]">Author</span>
                <input
                  type="text"
                  value={formData.author}
                  onChange={(event) => updateField("author", event.target.value)}
                  placeholder="Drishya Editorial Team"
                  required
                />
              </label>
            </div>

            <label className="space-y-2">
              <span className="text-sm font-semibold text-[var(--ink)]">Publish Date</span>
              <input
                type="date"
                value={formData.date}
                onChange={(event) => updateField("date", event.target.value)}
                required
              />
            </label>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <button type="submit" className="primary-button" disabled={isSaving}>
              {isSaving ? "Saving..." : editingId ? "Update Blog" : "Publish Blog"}
            </button>
            <button type="button" onClick={fetchBlogs} className="secondary-button">
              Refresh List
            </button>
          </div>
        </form>

        <section className="panel-shell rounded-[32px] p-6 sm:p-8">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--accent-dark)]">
                Editorial Library
              </p>
              <h2 className="font-display mt-2 text-3xl text-[var(--ink)]">
                Published blog entries
              </h2>
            </div>
            <p className="text-sm text-[var(--muted)]">{blogs.length} item(s)</p>
          </div>

          <div className="mt-6 space-y-4">
            {isLoading ? (
              <div className="rounded-[28px] border border-dashed border-[var(--line)] px-6 py-12 text-center text-[var(--muted)]">
                Loading blog content...
              </div>
            ) : null}

            {!isLoading && !blogs.length ? (
              <div className="rounded-[28px] border border-dashed border-[var(--line)] px-6 py-12 text-center">
                <h3 className="font-display text-3xl text-[var(--ink)]">No blogs yet</h3>
                <p className="mt-3 text-sm text-[var(--muted)]">
                  Start with a design guide or product story for the showroom site.
                </p>
              </div>
            ) : null}

            {!isLoading
                ? blogs.map((blog) => (
                  <article
                    key={blog._id}
                    className="rounded-[28px] border border-[var(--line)] bg-white/70 p-5 shadow-[0_16px_30px_rgba(61,44,29,0.08)]"
                  >
                    {blog.image ? (
                      <img
                        src={blog.image}
                        alt={blog.title}
                        className="mb-5 h-52 w-full rounded-[24px] object-cover"
                      />
                    ) : null}

                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="space-y-2">
                        <div className="flex flex-wrap gap-2">
                          {blog.tag.map((item) => (
                            <span
                              key={`${blog._id}-${item}`}
                              className="rounded-full bg-[rgba(166,106,44,0.12)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent-dark)]"
                            >
                              {item}
                            </span>
                          ))}
                        </div>
                        <h3 className="font-display text-3xl leading-none text-[var(--ink)]">
                          {blog.title}
                        </h3>
                      </div>

                      <div className="text-right text-sm text-[var(--muted)]">
                        <p>{formatDateLabel(blog.date)}</p>
                        <p>{blog.readTime} min read</p>
                        <p>{blog.author}</p>
                      </div>
                    </div>

                    <p className="mt-4 text-sm leading-7 text-[var(--muted)]">{blog.description}</p>
                    <p
                      className="mt-4 text-sm leading-7 text-[var(--ink)]"
                      style={{
                        display: "-webkit-box",
                        WebkitLineClamp: 4,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {blog.content}
                    </p>

                    <div className="mt-5 flex flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={() => handleEdit(blog)}
                        className="secondary-button"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(blog._id)}
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

export default BlogsPage;
