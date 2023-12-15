const {
  HttpError,
  ctrlWrapper } = require("../helpers");
const { Contact } = require('../models/contact');

const getAll = async (req, res) => {
  const result = await Contact.find({},
    // Виключення полів які не треба повертати через "-"
    "-createdAt -updatedAt"
  );
  res.json(result);
};

const getById = async (req, res) => {
  const { contactId } = req.params
  const result = await Contact.findById(contactId)
  if (!result) {
    throw HttpError(404, "Not found")
  }
  res.json(result)
};

const addContact = async (req, res) => {
  const result = await Contact.create(req.body)
  res.status(201).json(result)
};

const removeContact = async (req, res) => {
  const { contactId } = req.params
  const result = await Contact.findByIdAndDelete(contactId)
  if (!result) {
    throw HttpError(404, "Not found")
  };
  res.json({ message: "Delete success" });
};

const updateContact = async (req, res) => {
  const { contactId } = req.params;
  const result = await Contact.findByIdAndUpdate(contactId, req.body,
    // Третій аргумент для повернення оновленого об'єкту
    { new: true });
  if (!result) {
    throw HttpError(404, "Not found")
  };
  res.json(result)
};

const updateFavorite = async (req, res) => {
  const { contactId } = req.params;
  const isFavorite = "favorite" in req.body;
  if (!isFavorite) {
    throw HttpError(400,"missing field favorite");
  }
  const result = await Contact.findByIdAndUpdate(contactId, req.body, { new: true });
  if (!result) {
    throw HttpError(404, "Not found")
  };
  res.status(200).json(result);
};

module.exports = {
  getAll: ctrlWrapper(getAll),
  getById: ctrlWrapper(getById),
  addContact: ctrlWrapper(addContact),
  removeContact: ctrlWrapper(removeContact),
  updateContact: ctrlWrapper(updateContact),
  updateFavorite: ctrlWrapper(updateFavorite)

};