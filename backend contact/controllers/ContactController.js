const asyncHandler = require("express-async-handler");
const Contact = require("../Models/contactModel");

const getContact = asyncHandler(async (req, res) => {
  const { search, category, favorite } = req.query;
  const query = { user_id: req.user.id };

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { phone: { $regex: search, $options: "i" } },
    ];
  }

  if (category && category !== "All") {
    query.category = category;
  }

  if (favorite === "true") {
    query.isFavorite = true;
  }

  const contacts = await Contact.find(query).sort({ isFavorite: -1, createdAt: -1 });
  res.status(200).json(contacts);
});

const createContact = asyncHandler(async (req, res) => {
  const { name, email, phone, category, isFavorite } = req.body;

  if (!name || !email || !phone) {
    res.status(400);
    throw new Error("All fields are mandatory");
  }

  const contact = await Contact.create({
    user_id: req.user.id,
    name,
    email,
    phone,
    category: category || "Personal",
    isFavorite: !!isFavorite,
  });

  res.status(201).json(contact);
});

const getContactById = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);

  if (!contact) {
    res.status(404);
    throw new Error("Contact not found");
  }

  if (contact.user_id.toString() !== req.user.id) {
    res.status(403);
    throw new Error("User don't have permission to access this contact");
  }

  res.status(200).json(contact);
});

const updateContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);

  if (!contact) {
    res.status(404);
    throw new Error("Contact not found");
  }

  if (contact.user_id.toString() !== req.user.id) {
    res.status(403);
    throw new Error("User don't have permission to update other user contacts");
  }

  const updatedContact = await Contact.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  res.status(200).json(updatedContact);
});

const deleteContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);

  if (!contact) {
    res.status(404);
    throw new Error("Contact not found");
  }

  if (contact.user_id.toString() !== req.user.id) {
    res.status(403);
    throw new Error("User don't have permission to delete other user contacts");
  }

  await Contact.deleteOne({ _id: req.params.id });
  res.status(200).json({ message: `Delete contact ${req.params.id}` });
});

const toggleFavorite = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);

  if (!contact) {
    res.status(404);
    throw new Error("Contact not found");
  }

  if (contact.user_id.toString() !== req.user.id) {
    res.status(403);
    throw new Error("User unauthorized");
  }

  contact.isFavorite = !contact.isFavorite;
  await contact.save();

  res.status(200).json(contact);
});

module.exports = {
  getContact,
  createContact,
  updateContact,
  getContactById,
  deleteContact,
  toggleFavorite,
};