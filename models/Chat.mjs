const mongoose = require('mongoose')

import { adminSchema } from './Amin';

export const chatSchema = mongoose.Schema({
    endUserName: String,
    admin: [adminSchema],
    messages: [{ author: String, date: Date, message: String }]
})