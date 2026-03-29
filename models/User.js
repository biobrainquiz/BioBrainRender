const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  mobile: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },

  // --- Updated Email Verification Fields ---
  isVerified: { 
    type: Boolean, 
    default: false 
  },
  emailVerificationToken: { 
    type: String, 
    default: null 
  },
  emailVerificationExpires: { 
    type: Date, 
    default: null 
  },
  // ------------------------------------------

  roles: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Role"
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  userCreatedOn: { type: Date, default: Date.now },
  resetPasswordToken: { type: String, default: null },
  resetPasswordExpires: { type: Date, default: null }
}, { timestamps: true });

// Password hashing middleware
userSchema.pre("save", async function (next) {
  if (!this.isModified("password"))  return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Cascade delete middleware
userSchema.pre("findOneAndDelete", async function (next) {
  const filter = this.getFilter();
  const User = mongoose.model("User");
  const user = await User.findOne(filter);

  if (!user) return next();

  const Attempt = require("./Attempt");
  // Assuming cascadeDelete is a utility function available in your scope
  if (typeof cascadeDelete === 'function') {
    await cascadeDelete(Attempt, { userid: user._id });
  }
});

module.exports = mongoose.model("User", userSchema);