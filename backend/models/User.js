import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
  accountType: { type: String, enum: ['individual', 'business'], default: 'individual' },
  businessName: { type: String },
  businessRegNumber: { type: String },
  taxId: { type: String },
  isVerified: { type: Boolean, default: false },
  emailVerified: { type: Boolean, default: false },
  verificationToken: { type: String },
  verificationTokenExpires: { type: Date },
  resetPasswordCode: { type: String },
  resetPasswordCodeExpires: { type: Date },
  subscription: { type: String, enum: ['free', 'pro', 'enterprise'], default: 'free' },
  subscriptionExpiry: { type: Date },
  referralCode: { type: String, unique: true },
  referredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  profileImage: { type: String },
  emailNotifications: { type: Boolean, default: true },
  smsNotifications: { type: Boolean, default: false },
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare password
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;
