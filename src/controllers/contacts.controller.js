const contacts = require('../models/contacts.model');
const ApiError = require('../utils/ApiError');

function contactNotFound(id) {
  return new ApiError(404, 'CONTACT_NOT_FOUND', `No contact found with id ${id}.`);
}

function createContact(req, res) {
  const contact = contacts.create(req.contactData);
  res.status(201).location(`/api/contacts/${contact.id}`).json(contact);
}

function listContacts(req, res) {
  res.json(contacts.findAll());
}

function getContact(req, res) {
  const contact = contacts.findById(req.contactId);
  if (!contact) throw contactNotFound(req.contactId);
  res.json(contact);
}

function updateContact(req, res) {
  const contact = contacts.update(req.contactId, req.contactData);
  if (!contact) throw contactNotFound(req.contactId);
  res.json(contact);
}

function deleteContact(req, res) {
  if (!contacts.remove(req.contactId)) throw contactNotFound(req.contactId);
  res.status(204).end();
}

module.exports = { createContact, listContacts, getContact, updateContact, deleteContact };
