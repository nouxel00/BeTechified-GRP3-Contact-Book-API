const express = require('express');
const controller = require('../controllers/contacts.controller');
const validateContact = require('../middlewares/validateContact');
const validateId = require('../middlewares/validateId');

const router = express.Router();

router.post('/', validateContact, controller.createContact);
router.get('/', controller.listContacts);
router.get('/:id', validateId, controller.getContact);
router.put('/:id', validateId, validateContact, controller.updateContact);
router.delete('/:id', validateId, controller.deleteContact);

module.exports = router;
