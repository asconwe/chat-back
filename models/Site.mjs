const mongoose = require('mongoose');

import { chatSchema } from './Chat';
import { adminSchema } from './Admin'

export const siteSchema = mongoose.Schema({
    name: String,
    address: String,
    chats: [chatSchema],
    admins: [adminSchema]
})

