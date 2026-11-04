import { useCallback, useState, useEffect, useMemo } from "react";
import { useAuth } from "../Service/authContext.js";
import API from "../api/axios.js";
import {
  Search,
  Plus,
  Star,
  Trash2,
  Edit3,
  Phone,
  Mail,
  Tag,
  LogOut,
  Users,
  UserCheck,
  Briefcase,
  X,
  Loader2,
  AlertCircle,
  Copy,
  Check
} from "lucide-react";

export default function Dashboard() {
  const { user, logout } = useAuth();

  // State Management
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [onlyFavorites, setOnlyFavorites] = useState(false);

  // Modals & Panels
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [inspectContact, setInspectContact] = useState(null);
  const [copiedField, setCopiedField] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    category: "Personal",
    isFavorite: false,
  });

  // Fetch Contacts
  const fetchContacts = useCallback(async () => {
    try {
      setLoading(true);
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (selectedCategory !== "All") params.category = selectedCategory;
      if (onlyFavorites) params.favorite = "true";

      const res = await API.get("/contacts", { params });
      setContacts(res.data);
    } catch (err) {
      console.error("Error fetching contacts:", err);
    } finally {
      setLoading(false);
    }
  }, [search, selectedCategory, onlyFavorites]);

  // Debounced search trigger
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchContacts();
    }, 250);
    return () => clearTimeout(timer);
  }, [fetchContacts]);

  // Handle Form Open for Create / Edit
  const openCreateModal = () => {
    setEditingContact(null);
    setFormData({
      name: "",
      email: "",
      phone: "",
      category: "Personal",
      isFavorite: false,
    });
    setErrorMsg("");
    setIsModalOpen(true);
  };

  const openEditModal = (contact) => {
    setEditingContact(contact);
    setFormData({
      name: contact.name,
      email: contact.email,
      phone: contact.phone,
      category: contact.category || "Personal",
      isFavorite: contact.isFavorite || false,
    });
    setErrorMsg("");
    setIsModalOpen(true);
  };

  // Save Contact (Create or Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    setErrorMsg("");

    try {
      if (editingContact) {
        const res = await API.put(`/contacts/${editingContact._id}`, formData);
        setContacts((prev) =>
          prev.map((c) => (c._id === editingContact._id ? res.data : c))
        );
        if (inspectContact?._id === editingContact._id) {
          setInspectContact(res.data);
        }
      } else {
        const res = await API.post("/contacts", formData);
        setContacts((prev) => [res.data, ...prev]);
      }
      setIsModalOpen(false);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Failed to save contact.");
    } finally {
      setActionLoading(false);
    }
  };

  // Delete Contact
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this contact?")) return;

    try {
      await API.delete(`/contacts/${id}`);
      setContacts((prev) => prev.filter((c) => c._id !== id));
      if (inspectContact?._id === id) {
        setInspectContact(null);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Error deleting contact.");
    }
  };

  // Toggle Favorite
  const toggleFavorite = async (contact) => {
    try {
      const res = await API.patch(`/contacts/${contact._id}/favorite`);
      const updated = res.data;
      setContacts((prev) =>
        prev.map((c) => (c._id === contact._id ? updated : c))
      );
      if (inspectContact?._id === contact._id) {
        setInspectContact(updated);
      }
    } catch {
      // Fallback if patch route is not registered on backend
      try {
        const res = await API.put(`/contacts/${contact._id}`, {
          ...contact,
          isFavorite: !contact.isFavorite,
        });
        setContacts((prev) =>
          prev.map((c) => (c._id === contact._id ? res.data : c))
        );
      } catch (fallbackErr) {
        console.error("Favorite toggle failed:", fallbackErr);
      }
    }
  };

  // Copy to clipboard helper
  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Metrics Bar
  const stats = useMemo(() => {
    const total = contacts.length;
    const favs = contacts.filter((c) => c.isFavorite).length;
    const work = contacts.filter((c) => c.category === "Work").length;
    return { total, favs, work };
  }, [contacts]);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col selection:bg-emerald-500 selection:text-neutral-950">
      
      {/* Top Navbar */}
      <header className="border-b border-neutral-900 bg-neutral-950/80 backdrop-blur-md sticky top-0 z-30 px-6 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold">
              <Users size={19} />
            </div>
            <div>
              <h1 className="text-base font-bold text-neutral-100 tracking-tight leading-none">
                Nexus<span className="text-emerald-400">Contacts</span>
              </h1>
              <p className="text-[11px] text-neutral-400 font-mono mt-1">
                {user?.email}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={openCreateModal}
              className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 text-xs sm:text-sm font-semibold px-4 py-2 rounded-xl transition shadow-sm shadow-emerald-500/20 cursor-pointer"
            >
              <Plus size={16} />
              <span>Add Contact</span>
            </button>

            <button
              onClick={logout}
              className="p-2 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-neutral-400 hover:text-neutral-200 transition cursor-pointer"
              title="Sign Out"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto w-full px-6 py-8 flex-1">
        
        {/* Quick Insights Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="p-4 rounded-xl bg-neutral-900/50 border border-neutral-800/80 flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-neutral-800 text-emerald-400">
              <Users size={18} />
            </div>
            <div>
              <div className="text-xl font-bold font-mono text-neutral-100">{stats.total}</div>
              <div className="text-xs text-neutral-500">Total Entries</div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-neutral-900/50 border border-neutral-800/80 flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-neutral-800 text-amber-400">
              <Star size={18} />
            </div>
            <div>
              <div className="text-xl font-bold font-mono text-neutral-100">{stats.favs}</div>
              <div className="text-xs text-neutral-500">Starred / Favorites</div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-neutral-900/50 border border-neutral-800/80 flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-neutral-800 text-teal-400">
              <Briefcase size={18} />
            </div>
            <div>
              <div className="text-xl font-bold font-mono text-neutral-100">{stats.work}</div>
              <div className="text-xs text-neutral-500">Work Contacts</div>
            </div>
          </div>
        </div>

        {/* Search, Filter, and View Controls */}
        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between mb-6 pb-6 border-b border-neutral-900">
          
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-3 text-neutral-500" size={16} />
            <input
              type="text"
              placeholder="Search by name, email, or phone digits..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-neutral-900/80 border border-neutral-800 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-emerald-500/80 focus:ring-1 focus:ring-emerald-500/30 transition"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-3 text-neutral-500 hover:text-neutral-300"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Filters & Toggles */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setOnlyFavorites(!onlyFavorites)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border transition cursor-pointer ${
                onlyFavorites
                  ? "bg-amber-400/10 border-amber-400/40 text-amber-300"
                  : "bg-neutral-900 border-neutral-800 text-neutral-400 hover:border-neutral-700"
              }`}
            >
              <Star size={13} fill={onlyFavorites ? "currentColor" : "none"} />
              Favorites
            </button>

            <div className="h-5 w-px bg-neutral-800 hidden sm:block" />

            {["All", "Personal", "Work", "Family", "Other"].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-2 rounded-xl text-xs font-medium border transition cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-400"
                    : "bg-neutral-900 border-neutral-800 text-neutral-400 hover:border-neutral-700"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Contacts Directory Listing */}
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center gap-3 text-neutral-500">
            <Loader2 size={24} className="animate-spin text-emerald-400" />
            <span className="text-xs font-mono">Querying contacts database...</span>
          </div>
        ) : contacts.length === 0 ? (
          <div className="py-20 border border-dashed border-neutral-800 rounded-2xl flex flex-col items-center justify-center text-center p-6">
            <div className="w-12 h-12 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-500 mb-3">
              <UserCheck size={22} />
            </div>
            <h3 className="text-base font-semibold text-neutral-300">No contacts found</h3>
            <p className="text-xs text-neutral-500 max-w-sm mt-1">
              {search || selectedCategory !== "All" || onlyFavorites
                ? "No entries match your search criteria. Try resetting your filters."
                : "Your directory is empty. Add your first contact using the button above."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {contacts.map((contact) => (
              <div
                key={contact._id}
                onClick={() => setInspectContact(contact)}
                className={`bg-neutral-900/40 hover:bg-neutral-900/70 border rounded-2xl p-5 flex flex-col justify-between transition cursor-pointer group ${
                  inspectContact?._id === contact._id
                    ? "border-emerald-500/50 shadow-md shadow-emerald-500/5"
                    : "border-neutral-800/80 hover:border-neutral-700"
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-neutral-800/90 border border-neutral-700/80 flex items-center justify-center font-bold text-sm text-emerald-400">
                        {contact.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm text-neutral-200 group-hover:text-emerald-400 transition">
                          {contact.name}
                        </h4>
                        <span className="inline-flex items-center gap-1 text-[11px] font-mono text-neutral-500">
                          <Tag size={10} /> {contact.category || "Personal"}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(contact);
                      }}
                      className={`p-2 rounded-lg border transition ${
                        contact.isFavorite
                          ? "bg-amber-400/10 border-amber-400/30 text-amber-400"
                          : "border-neutral-800 text-neutral-600 hover:text-neutral-400"
                      }`}
                    >
                      <Star size={14} fill={contact.isFavorite ? "currentColor" : "none"} />
                    </button>
                  </div>

                  <div className="space-y-1.5 text-xs text-neutral-400 mt-4">
                    <div className="flex items-center gap-2 font-mono">
                      <Mail size={13} className="text-neutral-600 shrink-0" />
                      <span className="truncate">{contact.email}</span>
                    </div>
                    <div className="flex items-center gap-2 font-mono">
                      <Phone size={13} className="text-neutral-600 shrink-0" />
                      <span>{contact.phone}</span>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="flex items-center justify-between pt-4 mt-5 border-t border-neutral-900 text-xs text-neutral-500">
                  <span className="text-[11px] font-mono text-neutral-600">
                    {new Date(contact.createdAt).toLocaleDateString()}
                  </span>
                  
                  <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => openEditModal(contact)}
                      className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 transition"
                      title="Edit"
                    >
                      <Edit3 size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(contact._id)}
                      className="p-1.5 rounded-lg text-neutral-500 hover:text-rose-400 hover:bg-rose-500/10 transition"
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Slide-over Contact Details Inspector */}
      {inspectContact && (
        <aside className="fixed inset-y-0 right-0 w-full sm:w-96 bg-neutral-900 border-l border-neutral-800 p-6 z-40 shadow-2xl flex flex-col justify-between overflow-y-auto">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
              <span className="text-xs font-mono text-neutral-400 uppercase tracking-wider">
                Contact Dossier
              </span>
              <button
                onClick={() => setInspectContact(null)}
                className="p-1 rounded-lg text-neutral-500 hover:text-neutral-300 hover:bg-neutral-800"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-6 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-neutral-800 border border-neutral-700 flex items-center justify-center font-bold text-2xl text-emerald-400 mb-3">
                {inspectContact.name.charAt(0).toUpperCase()}
              </div>
              <h3 className="text-lg font-bold text-neutral-100">{inspectContact.name}</h3>
              <div className="mt-1 flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs bg-neutral-800 border border-neutral-700 text-neutral-300">
                  {inspectContact.category || "Personal"}
                </span>
                {inspectContact.isFavorite && (
                  <span className="px-2 py-0.5 rounded-full text-[11px] bg-amber-400/10 border border-amber-400/30 text-amber-400 flex items-center gap-1">
                    <Star size={11} fill="currentColor" /> Starred
                  </span>
                )}
              </div>
            </div>

            <div className="mt-8 space-y-4">
              <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800/80">
                <div className="text-[11px] text-neutral-500 font-medium mb-1">Email</div>
                <div className="flex items-center justify-between text-xs text-neutral-300 font-mono">
                  <span className="truncate">{inspectContact.email}</span>
                  <button
                    onClick={() => copyToClipboard(inspectContact.email, "email")}
                    className="p-1 hover:text-emerald-400 transition"
                  >
                    {copiedField === "email" ? <Check size={14} /> : <Copy size={14} />}
                  </button>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800/80">
                <div className="text-[11px] text-neutral-500 font-medium mb-1">Phone Number</div>
                <div className="flex items-center justify-between text-xs text-neutral-300 font-mono">
                  <span>{inspectContact.phone}</span>
                  <button
                    onClick={() => copyToClipboard(inspectContact.phone, "phone")}
                    className="p-1 hover:text-emerald-400 transition"
                  >
                    {copiedField === "phone" ? <Check size={14} /> : <Copy size={14} />}
                  </button>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800/80">
                <div className="text-[11px] text-neutral-500 font-medium mb-1">System ID</div>
                <div className="text-[11px] text-neutral-400 font-mono break-all">
                  {inspectContact._id}
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-neutral-800 flex gap-2">
            <button
              onClick={() => openEditModal(inspectContact)}
              className="flex-1 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
            >
              <Edit3 size={14} /> Edit
            </button>
            <button
              onClick={() => handleDelete(inspectContact._id)}
              className="px-4 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
            >
              <Trash2 size={14} /> Delete
            </button>
          </div>
        </aside>
      )}

      {/* Create / Edit Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-800 mb-5">
              <h3 className="text-base font-bold text-neutral-100">
                {editingContact ? "Edit Contact" : "Add New Contact"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-neutral-500 hover:text-neutral-300"
              >
                <X size={18} />
              </button>
            </div>

            {errorMsg && (
              <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
                <AlertCircle size={15} className="shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="text-neutral-400 block mb-1 font-medium">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Aditi Sharma"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-neutral-200 focus:outline-none focus:border-emerald-500 transition"
                />
              </div>

              <div>
                <label className="text-neutral-400 block mb-1 font-medium">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-neutral-200 focus:outline-none focus:border-emerald-500 transition"
                />
              </div>

              <div>
                <label className="text-neutral-400 block mb-1 font-medium">Phone Number</label>
                <input
                  type="text"
                  required
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-neutral-200 focus:outline-none focus:border-emerald-500 transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-neutral-400 block mb-1 font-medium">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2.5 text-neutral-200 focus:outline-none focus:border-emerald-500 transition"
                  >
                    <option value="Personal">Personal</option>
                    <option value="Work">Work</option>
                    <option value="Family">Family</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="flex flex-col justify-end">
                  <label className="flex items-center gap-2 p-2.5 rounded-xl border border-neutral-800 bg-neutral-950 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isFavorite}
                      onChange={(e) =>
                        setFormData({ ...formData, isFavorite: e.target.checked })
                      }
                      className="rounded accent-emerald-500"
                    />
                    <span className="text-neutral-300 font-medium">Mark as Favorite</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-neutral-950 text-xs font-semibold flex items-center gap-2 transition"
                >
                  {actionLoading && <Loader2 size={14} className="animate-spin" />}
                  <span>{editingContact ? "Save Changes" : "Create Contact"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}