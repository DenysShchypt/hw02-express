const {
   HttpError, 
   ctrlWrapper } = require("../helpers");
const {Contact} = require('../models/contact');

const getAll = async (req, res) => {
  const result = await Contact.find({},"-createdAt -updatedAt");
  res.json(result);
};

const getById = async (req, res) => {
  const { id } = req.params
  const result = await Contact.findById(id)
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
  const result = await Contact.findOneAndDelete(contactId)
  if (!result) {
    throw HttpError(404, "Not found")
  };
  res.json({ message: "Delete success" });
};

const updateContact = async (req, res) => {
  const { contactId } = req.params;
  const result = await Contact.findByIdAndUpdate(contactId, req.body,{new:true});
  if (!result) {
    throw HttpError(404, "Not found")
  };
  res.json(result);
};
const updateFavorite = async (req, res) => {
  const { contactId } = req.params;
  if (!req.body) {
   return res.json(400,{"message": "missing field favorite"});
  }
  const result = await Contact.findByIdAndUpdate(contactId, req.body,{new:true});
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
  updateContact: ctrlWrapper(updateContact),
  updateFavorite: ctrlWrapper(updateFavorite)

};