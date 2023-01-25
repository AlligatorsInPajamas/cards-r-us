import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  googleId: {
    type: String,
    required: true,
  },
  displayName: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  gallery: {
    type: Array(String),
    require: false,
    default: [],
  },
});

// export default CurrentUser;
const GoogleUser = mongoose.model('GoogleUser', UserSchema);
module.exports = GoogleUser;
