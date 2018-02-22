const mongoose = require('mongoose')

import { siteSchema } from './Site';

export const adminSchema = mongoose.Schema({
    name: String,
    email: String,
    passwordHash: String,
    sites: [siteSchema]
})