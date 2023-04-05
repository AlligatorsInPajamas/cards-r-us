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
  username: {
    type: String,
    required: true,
  },
  avatar: [
    {
      type: String,
      required: false,
    },
  ],
  gallery: {
    type: Array(String),
    require: false,
    default: [],
  },
});

// export default CurrentUser;
const GoogleUser = mongoose.model('GoogleUser', UserSchema);
module.exports = GoogleUser;
