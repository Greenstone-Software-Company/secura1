import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  contacts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

export const User = mongoose.models.User || mongoose.model('User', UserSchema);