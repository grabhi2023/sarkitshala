'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

const CATEGORY_OPTIONS = [
  { value: 'arduino', label: 'Arduino' },
  { value: 'esp', label: 'ESP32' },
  { value: 'raspberry', label: 'Raspberry Pi' },
];

const DIFFICULTY_OPTIONS = [
  { value: 'basic', label: 'Basic' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
];

const GUIDE_ROWS = [
  ['Post title', 'Heading 1 (or the Title style), used once on the first line.'],
  ['Sections', 'Heading 2. Use at least two. Sub-sections use Heading 3.'],
  ['Code', 'A paragraph style named "Code" with a monospace font. An optional first line like "lang: python" sets the language.'],
  ['Tip / callout', 'A paragraph style named "Callout".'],
  ['Images', 'Insert > Pictures with layout "In Line with Text". Put each image in its own paragraph and add Alt Text.'],
  ['Image caption', 'A paragraph style named "Caption" directly below the image.'],
  ['FAQ', 'A Heading 2 that contains "FAQ", then each question as Heading 3 with its answer paragraphs below.'],
  ['SEO details', 'Optional two-column table at the very top with the rows: slug, description, tags, metatitle.'],
];

const MAX_FILE_BYTES = 20 * 1024 * 1024;
const PAGE_SIZE = 20;
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const inputClass =
  'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/25 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:opacity-70 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-500 dark:disabled:bg-slate-800/60';
const btnBase =
  'inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100';
const btnPrimary = `${btnBase} bg-blue-600 text-white shadow-sm hover:bg-blue-700`;
const btnGhost = `${btnBase} border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700`;
const btnDanger = `${btnBase} border border-red-300 bg-white text-red-600 hover:bg-red-50 dark:border-red-900 dark:bg-slate-800 dark:text-red-400 dark:hover:bg-red-950/40`;
const cardClass = 'rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900';
const mutedClass = 'text-slate-500 dark:text-slate-400';

const labelOf = (options, value) => options.find((o) => o.value === value)?.label || value;

function formatDate(value) {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

function formatBytes(bytes) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function splitWarnings(list) {
  const items = Array.isArray(list) ? list : [];
  return {
    info: items.filter((w) => w.startsWith('Info:')),
    issues: items.filter((w) => !w.startsWith('Info:')),
  };
}

async function request(url, options = {}) {
  const res = await fetch(url, { credentials: 'same-origin', ...options });
  let data = null;
  try {
    data = await res.json();
  } catch {
    data = null;
  }
  if (res.status === 401) {
    window.location.assign('/admin/login');
    throw new Error('Your session has expired');
  }
  if (!res.ok) throw new Error(data?.message || `Request failed (${res.status})`);
  return data;
}

function uploadDocx(formData, onProgress) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/import-docx');
    xhr.responseType = 'json';
    xhr.timeout = 170000;
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) onProgress(Math.round((event.loaded / event.total) * 100));
    };
    xhr.onload = () => {
      const data = xhr.response;
      if (xhr.status === 401) {
        window.location.assign('/admin/login');
        reject(new Error('Your session has expired'));
        return;
      }
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(data);
        return;
      }
      if (xhr.status === 413 && !data?.message) {
        reject(new Error('The server rejected the file because it is too large.'));
        return;
      }
      reject(new Error(data?.message || `Import failed (${xhr.status})`));
    };
    xhr.onerror = () => reject(new Error('Network error. Check your connection and try again.'));
    xhr.ontimeout = () => reject(new Error('The import took too long. Try a document with fewer or smaller images.'));
    xhr.send(formData);
  });
}

function Spinner({ className = 'h-4 w-4' }) {
  return (
    <svg className={`animate-spin ${className}`} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
    </svg>
  );
}

function StatusBadge({ status }) {
  const live = status === 'published';
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
        live
          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
          : 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400'
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${live ? 'bg-emerald-500' : 'bg-amber-500'}`} />
      {live ? 'Published' : 'Draft'}
    </span>
  );
}

function Field({ label, hint, htmlFor, children }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 block text-xs font-semibold text-slate-800 dark:text-slate-200">
        {label}
      </label>
      {children}
      {hint ? <p className={`mt-1.5 text-[11px] leading-snug ${mutedClass}`}>{hint}</p> : null}
    </div>
  );
}

function Modal({ title, onClose, wide = false, children }) {
  useEffect(() => {
    const onKey = (event) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-slate-900/70 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        className={`flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-2xl border border-slate-200 bg-white text-slate-900 opacity-100 shadow-2xl dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 sm:rounded-2xl ${
          wide ? 'sm:max-w-2xl' : 'sm:max-w-md'
        }`}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-slate-200 bg-slate-50 px-5 py-3.5 dark:border-slate-700 dark:bg-slate-800">
          <h2 className="text-base font-semibold">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-xl leading-none text-slate-500 transition hover:bg-slate-200 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-100"
          >
            &times;
          </button>
        </div>
        <div className="overflow-y-auto bg-white p-5 dark:bg-slate-900">{children}</div>
      </div>
    </div>
  );
}

function EditModal({ postId, onClose, onSaved, notify }) {
  const [form, setForm] = useState(null);
  const [loadError, setLoadError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;
    request(`/api/admin/posts/${postId}`)
      .then(({ post }) => {
        if (!active) return;
        setForm({
          title: post.title || '',
          difficulty: post.difficulty || 'basic',
          order: String(post.order ?? 0),
          tags: (post.tags || []).join(', '),
          excerpt: post.excerpt || '',
          metaTitle: post.seo?.metaTitle || '',
          metaDescription: post.seo?.metaDescription || '',
          authorName: post.authorName || '',
          slug: post.slug,
          category: post.category,
        });
      })
      .catch((error) => {
        if (active) setLoadError(error.message);
      });
    return () => {
      active = false;
    };
  }, [postId]);

  const update = (key) => (event) => setForm((prev) => ({ ...prev, [key]: event.target.value }));

  async function save(event) {
    event.preventDefault();
    setSaving(true);
    try {
      await request(`/api/admin/posts/${postId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: form.title,
          difficulty: form.difficulty,
          order: form.order,
          tags: form.tags,
          excerpt: form.excerpt,
          metaTitle: form.metaTitle,
          metaDescription: form.metaDescription,
          authorName: form.authorName,
        }),
      });
      notify('Post details saved');
      onSaved();
    } catch (error) {
      notify(error.message, 'error');
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal title="Edit post details" onClose={onClose} wide>
      {loadError ? (
        <p className="rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
          {loadError}
        </p>
      ) : !form ? (
        <div className={`flex items-center gap-2 py-6 text-sm ${mutedClass}`}>
          <Spinner /> Loading...
        </div>
      ) : (
        <form onSubmit={save} className="space-y-4">
          <p className="rounded-lg bg-slate-100 px-3 py-2 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            URL: <span className="font-mono font-semibold">/{form.category}/{form.slug}</span> (the URL cannot be changed here)
          </p>
          <Field label="Title" htmlFor="edit-title">
            <input id="edit-title" className={inputClass} value={form.title} onChange={update('title')} maxLength={200} required />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Level" htmlFor="edit-difficulty">
              <select id="edit-difficulty" className={inputClass} value={form.difficulty} onChange={update('difficulty')}>
                {DIFFICULTY_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Sort order" htmlFor="edit-order" hint="Lower numbers appear first inside a level.">
              <input id="edit-order" type="number" min="0" max="100000" className={inputClass} value={form.order} onChange={update('order')} />
            </Field>
          </div>
          <Field label="Meta title" htmlFor="edit-meta-title" hint="Shown in Google results. Keep it under 65 characters.">
            <input id="edit-meta-title" className={inputClass} value={form.metaTitle} onChange={update('metaTitle')} maxLength={120} />
          </Field>
          <Field
            label="Meta description"
            htmlFor="edit-meta-description"
            hint={`${form.metaDescription.length}/160 characters. Required before publishing.`}
          >
            <textarea id="edit-meta-description" rows={3} className={`${inputClass} resize-y`} value={form.metaDescription} onChange={update('metaDescription')} maxLength={200} />
          </Field>
          <Field label="Excerpt" htmlFor="edit-excerpt">
            <textarea id="edit-excerpt" rows={2} className={`${inputClass} resize-y`} value={form.excerpt} onChange={update('excerpt')} maxLength={300} />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Tags" htmlFor="edit-tags" hint="Comma separated, up to 12.">
              <input id="edit-tags" className={inputClass} value={form.tags} onChange={update('tags')} />
            </Field>
            <Field label="Author" htmlFor="edit-author">
              <input id="edit-author" className={inputClass} value={form.authorName} onChange={update('authorName')} maxLength={80} />
            </Field>
          </div>
          <div className="flex flex-col-reverse gap-2 border-t border-slate-200 pt-4 dark:border-slate-700 sm:flex-row sm:justify-end">
            <button type="button" className={`${btnGhost} py-2`} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className={`${btnPrimary} py-2`} disabled={saving}>
              {saving ? <Spinner className="h-3.5 w-3.5" /> : null}
              Save changes
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
}

export default function AdminDashboard() {
  const [category, setCategory] = useState('arduino');
  const [difficulty, setDifficulty] = useState('basic');
  const [slug, setSlug] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [phase, setPhase] = useState('idle');
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef(null);

  const [posts, setPosts] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [fCategory, setFCategory] = useState('');
  const [fStatus, setFStatus] = useState('');
  const [q, setQ] = useState('');
  const [debouncedQ, setDebouncedQ] = useState('');
  const [loading, setLoading] = useState(true);
  const [listError, setListError] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  const [expanded, setExpanded] = useState(null);
  const [busyId, setBusyId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [deleteBusy, setDeleteBusy] = useState(false);
  const [toast, setToast] = useState(null);

  const notify = useCallback((message, type = 'success') => setToast({ message, type, id: Date.now() }), []);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => setToast(null), 4500);
    return () => clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQ(q.trim());
      setPage(1);
    }, 350);
    return () => clearTimeout(timer);
  }, [q]);

  useEffect(() => {
    let active = true;
    async function load() {
      setLoading(true);
      setListError('');
      try {
        const params = new URLSearchParams({ page: String(page), limit: String(PAGE_SIZE) });
        if (fCategory) params.set('category', fCategory);
        if (fStatus) params.set('status', fStatus);
        if (debouncedQ) params.set('q', debouncedQ);
        const data = await request(`/api/admin/posts?${params.toString()}`);
        if (!active) return;
        setPosts(data.posts);
        setTotal(data.total);
        setPages(data.pages);
      } catch (error) {
        if (active) setListError(error.message);
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, [page, fCategory, fStatus, debouncedQ, refreshKey]);

  const refresh = () => setRefreshKey((k) => k + 1);

  function chooseFile(candidate) {
    setUploadError('');
    setResult(null);
    if (!candidate) return;
    const name = candidate.name.toLowerCase();
    if (name.endsWith('.pdf')) {
      setUploadError('PDF files are not supported. Open the PDF in Word, or export from your editor, and save it as .docx first.');
      return;
    }
    if (name.endsWith('.doc')) {
      setUploadError('The old .doc format is not supported. In Word choose File > Save As > Word Document (.docx).');
      return;
    }
    if (!name.endsWith('.docx')) {
      setUploadError('Only .docx files are supported.');
      return;
    }
    if (candidate.size === 0) {
      setUploadError('This file is empty.');
      return;
    }
    if (candidate.size > MAX_FILE_BYTES) {
      setUploadError(`This file is ${formatBytes(candidate.size)}. The limit is 20 MB.`);
      return;
    }
    setFile(candidate);
  }

  function clearFile() {
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  async function handleImport(event) {
    event.preventDefault();
    const cleanSlug = slug.trim().toLowerCase();
    if (!file) {
      setUploadError('Choose a .docx file first.');
      return;
    }
    if (cleanSlug && !SLUG_PATTERN.test(cleanSlug)) {
      setUploadError('The slug may only contain lowercase letters, numbers and single hyphens.');
      return;
    }

    setPhase('uploading');
    setProgress(0);
    setResult(null);
    setUploadError('');

    const form = new FormData();
    form.append('file', file);
    form.append('category', category);
    form.append('difficulty', difficulty);
    if (cleanSlug) form.append('slug', cleanSlug);
    if (authorName.trim()) form.append('authorName', authorName.trim());

    try {
      const data = await uploadDocx(form, (value) => {
        setProgress(value);
        if (value >= 100) setPhase('processing');
      });
      setResult(data);
      clearFile();
      setSlug('');
      setFCategory('');
      setFStatus('');
      setQ('');
      setPage(1);
      refresh();
    } catch (error) {
      setUploadError(error.message);
    } finally {
      setPhase('idle');
    }
  }

  async function runPublish(id, action) {
    setBusyId(id);
    try {
      const data = await request(`/api/admin/posts/${id}/publish`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });
      notify(action === 'publish' ? 'Post published' : 'Post moved back to drafts');
      setResult((prev) => (prev && prev.id === id ? { ...prev, status: data.status } : prev));
      refresh();
    } catch (error) {
      notify(error.message, 'error');
    } finally {
      setBusyId(null);
    }
  }

  async function confirmDelete() {
    if (!deleting) return;
    setDeleteBusy(true);
    try {
      await request(`/api/admin/posts/${deleting._id}`, { method: 'DELETE' });
      notify('Post deleted');
      setDeleting(null);
      setResult((prev) => (prev && prev.id === deleting._id ? null : prev));
      refresh();
    } catch (error) {
      notify(error.message, 'error');
    } finally {
      setDeleteBusy(false);
    }
  }

  async function signOut() {
    try {
      await fetch('/api/admin/auth/logout', { method: 'POST', credentials: 'same-origin' });
    } finally {
      window.location.assign('/admin/login');
    }
  }

  const busy = phase !== 'idle';
  const resultWarnings = splitWarnings(result?.warnings);
  const images = result?.images;

  return (
    <div className="mx-auto max-w-6xl bg-transparent px-3 pb-20 pt-24 sm:px-5">
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50 sm:text-3xl">Content Admin</h1>
          <p className={`mt-1 text-sm ${mutedClass}`}>Import Word documents as draft posts, review them, then publish.</p>
        </div>
        <div className="flex items-center gap-2">
          <a href="/" target="_blank" rel="noopener noreferrer" className={`${btnGhost} py-2`}>
            View site
          </a>
          <button type="button" onClick={signOut} className={`${btnGhost} py-2`}>
            Sign out
          </button>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-5">
        <section className={`${cardClass} p-5 sm:p-6 lg:col-span-3`}>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">Import a document</h2>
          <p className={`mt-1 text-xs ${mutedClass}`}>
            Supported: <strong className="text-slate-800 dark:text-slate-200">.docx</strong> up to 20 MB with up to 60 images. PDF and .doc files are not supported.
          </p>

          <form onSubmit={handleImport} className="mt-5 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Category" htmlFor="up-category">
                <select id="up-category" className={inputClass} value={category} onChange={(e) => setCategory(e.target.value)} disabled={busy}>
                  {CATEGORY_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Level" htmlFor="up-difficulty">
                <select id="up-difficulty" className={inputClass} value={difficulty} onChange={(e) => setDifficulty(e.target.value)} disabled={busy}>
                  {DIFFICULTY_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </Field>
              <Field
                label="Slug (optional)"
                htmlFor="up-slug"
                hint="Becomes the URL. Leave empty to use the slug row of your document table, or the title."
              >
                <input id="up-slug" className={inputClass} value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="interfacing-soil-moisture" disabled={busy} maxLength={100} />
              </Field>
              <Field label="Author (optional)" htmlFor="up-author">
                <input id="up-author" className={inputClass} value={authorName} onChange={(e) => setAuthorName(e.target.value)} placeholder="Sarkitshala Team" disabled={busy} maxLength={80} />
              </Field>
            </div>

            <div
              onDragOver={(e) => {
                e.preventDefault();
                if (!busy) setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragging(false);
                if (!busy) chooseFile(e.dataTransfer.files?.[0]);
              }}
              className={`rounded-xl border-2 border-dashed p-6 text-center transition sm:p-8 ${
                dragging
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30'
                  : 'border-slate-300 bg-slate-50 hover:border-blue-400 dark:border-slate-600 dark:bg-slate-800/40'
              }`}
            >
              <input
                ref={fileInputRef}
                id="up-file"
                type="file"
                accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                className="sr-only"
                disabled={busy}
                onChange={(e) => chooseFile(e.target.files?.[0])}
              />
              {file ? (
                <div className="flex flex-wrap items-center justify-center gap-4">
                  <div className="text-left">
                    <p className="max-w-[240px] truncate text-sm font-semibold text-slate-900 dark:text-slate-100 sm:max-w-[320px]">{file.name}</p>
                    <p className={`text-xs ${mutedClass}`}>{formatBytes(file.size)}</p>
                  </div>
                  <button type="button" className={btnGhost} onClick={clearFile} disabled={busy}>
                    Remove
                  </button>
                </div>
              ) : (
                <>
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-200">Drag and drop your .docx file here</p>
                  <p className={`mt-1 text-xs ${mutedClass}`}>or</p>
                  <label htmlFor="up-file" className={`${btnPrimary} mt-3 cursor-pointer px-4 py-2`}>
                    Choose file
                  </label>
                </>
              )}
            </div>

            {busy ? (
              <div aria-live="polite" className="rounded-xl border border-blue-200 bg-blue-50 p-3 dark:border-blue-900 dark:bg-blue-950/30">
                <div className="mb-2 flex items-start justify-between gap-3 text-xs text-blue-900 dark:text-blue-200">
                  <span className="flex items-start gap-2 font-medium">
                    <Spinner className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                    {phase === 'uploading' ? 'Uploading document...' : 'Processing: reading content and uploading images. Large documents can take a minute or two. Keep this tab open.'}
                  </span>
                  {phase === 'uploading' ? <span className="font-semibold">{progress}%</span> : null}
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-blue-100 dark:bg-slate-700">
                  <div
                    className={`h-full rounded-full bg-blue-600 transition-all ${phase === 'processing' ? 'animate-pulse' : ''}`}
                    style={{ width: phase === 'processing' ? '100%' : `${progress}%` }}
                  />
                </div>
              </div>
            ) : null}

            {uploadError ? (
              <div role="alert" className="rounded-lg border border-red-300 bg-red-50 px-3 py-2.5 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
                {uploadError}
              </div>
            ) : null}

            <button type="submit" disabled={busy || !file} className={`${btnPrimary} w-full py-3 text-sm`}>
              {busy ? <Spinner /> : null}
              {busy ? 'Importing...' : 'Import as draft'}
            </button>
          </form>

          {result ? (
            <div className="mt-5 rounded-xl border border-emerald-300 bg-emerald-50 p-4 text-sm dark:border-emerald-900 dark:bg-emerald-950/30">
              <p className="break-words font-semibold text-emerald-800 dark:text-emerald-300">
                {result.created ? 'Draft created' : result.status === 'published' ? 'Live post updated' : 'Draft updated'}: /{result.category}/{result.slug}
              </p>
              <p className="mt-1 text-emerald-900/80 dark:text-emerald-200/80">
                {result.blocks} content blocks
                {images
                  ? ` | ${images.uploaded} image(s) uploaded to Cloudinary${images.reused ? `, ${images.reused} duplicate(s) reused` : ''}${images.failed ? `, ${images.failed} failed` : ''}${images.skipped ? `, ${images.skipped} skipped (time limit)` : ''}${images.removed ? `, ${images.removed} old image(s) cleaned up` : ''}`
                  : ''}
              </p>
              {resultWarnings.info.map((line) => (
                <p key={line} className="mt-1 text-xs text-emerald-900/70 dark:text-emerald-200/70">
                  {line.replace(/^Info:\s*/, '')}
                </p>
              ))}
              {resultWarnings.issues.length > 0 ? (
                <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-900 dark:bg-amber-950/30">
                  <p className="text-xs font-semibold text-amber-800 dark:text-amber-300">
                    {resultWarnings.issues.length} thing(s) to review
                  </p>
                  <ul className="mt-1 list-disc space-y-0.5 pl-5 text-xs text-amber-900 dark:text-amber-200">
                    {resultWarnings.issues.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
              <div className="mt-4 flex flex-wrap gap-2">
                <a href={`/api/admin/preview?category=${result.category}&slug=${result.slug}`} target="_blank" rel="noopener noreferrer" className={btnGhost}>
                  Preview
                </a>
                {result.status === 'published' ? (
                  <a href={`/${result.category}/${result.slug}`} target="_blank" rel="noopener noreferrer" className={btnGhost}>
                    View live
                  </a>
                ) : (
                  <button type="button" className={btnPrimary} disabled={busyId === result.id} onClick={() => runPublish(result.id, 'publish')}>
                    {busyId === result.id ? <Spinner className="h-3.5 w-3.5" /> : null}
                    Publish now
                  </button>
                )}
                <button type="button" className={btnGhost} onClick={() => setEditingId(result.id)}>
                  Edit details
                </button>
              </div>
            </div>
          ) : null}
        </section>

        <aside className={`${cardClass} h-fit p-5 sm:p-6 lg:col-span-2`}>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">How to prepare your document</h2>
          <ol className={`mt-3 list-decimal space-y-1.5 pl-5 text-xs marker:font-semibold marker:text-blue-600 ${mutedClass}`}>
            <li>Write the post in Microsoft Word and apply the styles below.</li>
            <li>Save it as a Word Document (.docx).</li>
            <li>Choose the category and level, then upload it here.</li>
            <li>Review the warnings, preview the draft, then publish.</li>
          </ol>
          <dl className="mt-5 divide-y divide-slate-200 overflow-hidden rounded-xl border border-slate-200 text-xs dark:divide-slate-700 dark:border-slate-700">
            {GUIDE_ROWS.map(([name, text], i) => (
              <div key={name} className={`grid grid-cols-3 gap-3 px-3 py-2.5 ${i % 2 === 0 ? 'bg-slate-50 dark:bg-slate-800/40' : 'bg-white dark:bg-slate-900'}`}>
                <dt className="font-semibold text-slate-900 dark:text-slate-100">{name}</dt>
                <dd className={`col-span-2 leading-relaxed ${mutedClass}`}>{text}</dd>
              </div>
            ))}
          </dl>
          <div className={`mt-5 space-y-2 text-xs leading-relaxed ${mutedClass}`}>
            <p>
              <strong className="text-slate-900 dark:text-slate-100">Have a PDF or Google Doc?</strong> From Google Docs use File &gt; Download &gt; Microsoft Word (.docx). Custom styles such as Code do not survive that export, so apply them again in Word.
            </p>
            <p>
              <strong className="text-slate-900 dark:text-slate-100">Images</strong> are resized to WebP (under 500 KB), uploaded to Cloudinary, and only their links are stored in the database. Uploading the same document again replaces the old images.
            </p>
          </div>
        </aside>
      </div>

      <section className={`${cardClass} mt-8 overflow-hidden`}>
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-5 py-4 dark:border-slate-700">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">Posts</h2>
            <p className={`text-xs ${mutedClass}`}>{total} total</p>
          </div>
          <div className="flex w-full flex-wrap gap-2 sm:w-auto">
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search title or slug"
              aria-label="Search posts"
              className={`${inputClass} w-full sm:w-52`}
            />
            <select
              aria-label="Filter by category"
              className={`${inputClass} w-full sm:w-auto`}
              value={fCategory}
              onChange={(e) => {
                setFCategory(e.target.value);
                setPage(1);
              }}
            >
              <option value="">All categories</option>
              {CATEGORY_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            <select
              aria-label="Filter by status"
              className={`${inputClass} w-full sm:w-auto`}
              value={fStatus}
              onChange={(e) => {
                setFStatus(e.target.value);
                setPage(1);
              }}
            >
              <option value="">All statuses</option>
              <option value="draft">Drafts</option>
              <option value="published">Published</option>
            </select>
          </div>
        </div>

        {listError ? (
          <div className="px-5 py-6 text-sm text-red-600 dark:text-red-400">
            {listError}{' '}
            <button type="button" className="font-semibold underline" onClick={refresh}>
              Retry
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto [scrollbar-width:thin]">
            <table className="w-full min-w-[820px] text-left text-sm">
              <thead className="bg-slate-100 text-xs uppercase tracking-wide text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                <tr>
                  <th className="px-5 py-3 font-semibold">Title</th>
                  <th className="px-3 py-3 font-semibold">Category</th>
                  <th className="px-3 py-3 font-semibold">Level</th>
                  <th className="px-3 py-3 font-semibold">Status</th>
                  <th className="px-3 py-3 font-semibold">Updated</th>
                  <th className="px-5 py-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {loading && posts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className={`px-5 py-12 text-center ${mutedClass}`}>
                      <span className="inline-flex items-center gap-2">
                        <Spinner /> Loading posts...
                      </span>
                    </td>
                  </tr>
                ) : posts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className={`px-5 py-12 text-center ${mutedClass}`}>
                      No posts found. Import your first document above.
                    </td>
                  </tr>
                ) : (
                  posts.map((post) => {
                    const { issues } = splitWarnings(post.importWarnings);
                    const rowBusy = busyId === post._id;
                    return (
                      <FragmentRow key={post._id}>
                        <tr className={`transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50 ${loading ? 'opacity-60' : ''}`}>
                          <td className="px-5 py-3.5">
                            <p className="max-w-[320px] truncate font-medium text-slate-900 dark:text-slate-100">{post.title}</p>
                            <p className={`font-mono text-xs ${mutedClass}`}>/{post.category}/{post.slug}</p>
                            {issues.length > 0 ? (
                              <button
                                type="button"
                                onClick={() => setExpanded(expanded === post._id ? null : post._id)}
                                className="mt-1 text-[11px] font-semibold text-amber-700 hover:underline dark:text-amber-400"
                              >
                                {issues.length} warning(s) {expanded === post._id ? '- hide' : '- show'}
                              </button>
                            ) : null}
                          </td>
                          <td className="px-3 py-3.5 text-slate-700 dark:text-slate-300">{labelOf(CATEGORY_OPTIONS, post.category)}</td>
                          <td className="px-3 py-3.5 text-slate-700 dark:text-slate-300">{labelOf(DIFFICULTY_OPTIONS, post.difficulty)}</td>
                          <td className="px-3 py-3.5">
                            <StatusBadge status={post.status} />
                          </td>
                          <td className={`whitespace-nowrap px-3 py-3.5 text-xs ${mutedClass}`}>{formatDate(post.updatedAt)}</td>
                          <td className="px-5 py-3.5">
                            <div className="flex flex-wrap justify-end gap-1.5">
                              <a href={`/api/admin/preview?category=${post.category}&slug=${post.slug}`} target="_blank" rel="noopener noreferrer" className={btnGhost}>
                                Preview
                              </a>
                              {post.status === 'published' ? (
                                <a href={`/${post.category}/${post.slug}`} target="_blank" rel="noopener noreferrer" className={btnGhost}>
                                  Live
                                </a>
                              ) : null}
                              <button type="button" className={btnGhost} onClick={() => setEditingId(post._id)}>
                                Edit
                              </button>
                              <button
                                type="button"
                                className={post.status === 'published' ? btnGhost : btnPrimary}
                                disabled={rowBusy}
                                onClick={() => runPublish(post._id, post.status === 'published' ? 'unpublish' : 'publish')}
                              >
                                {rowBusy ? <Spinner className="h-3.5 w-3.5" /> : null}
                                {post.status === 'published' ? 'Unpublish' : 'Publish'}
                              </button>
                              <button type="button" className={btnDanger} onClick={() => setDeleting(post)}>
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                        {expanded === post._id ? (
                          <tr className="bg-amber-50 dark:bg-amber-950/20">
                            <td colSpan={6} className="px-5 py-3">
                              <ul className="list-disc space-y-0.5 pl-5 text-xs text-amber-900 dark:text-amber-200">
                                {issues.map((line) => (
                                  <li key={line}>{line}</li>
                                ))}
                              </ul>
                            </td>
                          </tr>
                        ) : null}
                      </FragmentRow>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}

        {pages > 1 ? (
          <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-5 py-3 text-xs dark:border-slate-700 dark:bg-slate-800/40">
            <span className={mutedClass}>
              Page {page} of {pages}
            </span>
            <div className="flex gap-2">
              <button type="button" className={btnGhost} disabled={page <= 1 || loading} onClick={() => setPage((p) => Math.max(1, p - 1))}>
                Previous
              </button>
              <button type="button" className={btnGhost} disabled={page >= pages || loading} onClick={() => setPage((p) => Math.min(pages, p + 1))}>
                Next
              </button>
            </div>
          </div>
        ) : null}
      </section>

      {editingId ? (
        <EditModal
          postId={editingId}
          onClose={() => setEditingId(null)}
          onSaved={() => {
            setEditingId(null);
            refresh();
          }}
          notify={notify}
        />
      ) : null}

      {deleting ? (
        <Modal title="Delete this post?" onClose={() => (deleteBusy ? undefined : setDeleting(null))}>
          <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
            <strong className="text-slate-900 dark:text-slate-100">{deleting.title}</strong> (/{deleting.category}/{deleting.slug}) and its uploaded images will be permanently deleted. This cannot be undone.
          </p>
          <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <button type="button" className={`${btnGhost} py-2`} onClick={() => setDeleting(null)} disabled={deleteBusy}>
              Cancel
            </button>
            <button type="button" className={`${btnBase} bg-red-600 py-2 text-white shadow-sm hover:bg-red-700`} onClick={confirmDelete} disabled={deleteBusy}>
              {deleteBusy ? <Spinner className="h-3.5 w-3.5" /> : null}
              Delete permanently
            </button>
          </div>
        </Modal>
      ) : null}

      {toast ? (
        <div
          role="status"
          aria-live="polite"
          className={`fixed bottom-5 left-4 right-4 z-[70] rounded-xl px-4 py-3 text-sm font-medium text-white shadow-xl sm:left-auto sm:right-5 sm:max-w-sm ${
            toast.type === 'error' ? 'bg-red-600' : 'bg-slate-900 dark:bg-slate-700'
          }`}
        >
          {toast.message}
        </div>
      ) : null}
    </div>
  );
}

function FragmentRow({ children }) {
  return <>{children}</>;
}