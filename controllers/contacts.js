const { HttpError, ctrlWrapper } = require("../helpers");
const contacts = require('../models/contacts');

const getAll = async (req, res) => {
  const result = await contacts.listContacts();
  res.json(result)
};

const getById = async (req, res) => {
  const { contactId } = req.params
  const result = await contacts.getContactById(contactId)
  if (!result) {
    throw HttpError(404, "Not found")
  }
  res.json(result)
};

const addContact = async (req, res) => {
  const result = await contacts.addContact(req.body)
  res.status(201).json(result)
};

const removeContact = async (req, res) => {
  const { contactId } = req.params
  const result = await contacts.removeContact(contactId)
  if (!result) {
    throw HttpError(404, "Not found")
  };
  res.json({ message: "Delete success" });
};

const updateContact = async (req, res) => {
  const { contactId } = req.params;
  const result = await contacts.updateContact(contactId, req.body);
  if (!result) {
    throw HttpError(404, "Not found")
  };
  res.json(result);
};

module.exports = {
  getAll: ctrlWrapper(getAll),
  getById: ctrlWrapper(getById),
  addContact: ctrlWrapper(addContact),
  removeContact: ctrlWrapper(removeContact),
  updateContact: ctrlWrapper(updateContact)
};