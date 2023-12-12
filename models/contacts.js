const fs = require('fs/promises');
const Contact = require('../models/contact');
const { randomUUID } = require('crypto');
const path = require('path');
const contactsPath = path.join(__dirname, "./contacts.json");
console.log(Contact);
const listContacts = async () => {
  const result = await Contact.find();
  console.log(result);
  const buffer = await fs.readFile(result);
  return JSON.parse(buffer);
};

const getContactById =
  async (id) => {
    const contacts = await listContacts();
    const idContact = await contacts.find(contact => contact.id === id);
    return idContact || null;
  };

const removeContact = async (id) => {
  const contacts = await listContacts();
  const filterContacts = await contacts.findIndex(contact => contact.id === id)
  if (filterContacts === -1) {
    return null
  };
  const [result] = contacts.splice(filterContacts, 1);
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return result;
};

const addContact = async (body) => {
  const contacts = await listContacts();
  const contact = { id: randomUUID(), ...body };
  contacts.push(contact);
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
};

const updateContact = async (id, body) => {
  const contacts = await listContacts();
  const contactUpdate = await contacts.findIndex(contact => contact.id === id);
  if (contactUpdate === -1) {
    return null
  }
  contacts[contactUpdate] = { id, ...body }
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return contacts[contactUpdate]
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
