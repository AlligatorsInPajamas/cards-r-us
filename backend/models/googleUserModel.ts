import mongoose from 'mongoose';
const Schema = mongoose.Schema;

// export interface User {
//   id: string;
//   firstName: string;
//   lastName: string;
//   //photo: { value: string }[];
// }

// const userSchema = new Schema<User>({
//   firstName: { type: String },
//   lastName: { type: String },
//   //photo: [{ value: String }],
// });

const UserSchema = new Schema({
  google: {
    id: {
      type: String,
    },
    name: {
      type: String,
    },
    email: {
      type: String,
    },
  },
});
// const CurrentUser =
//   (mongoose.models.CurrentUser as mongoose.Model<User>) ||
//   mongoose.model('CurrentUser', userSchema);

// const CurrentUser = mongoose.model('user', userSchema);

// export default CurrentUser;
const GoogleUser = mongoose.model('User', UserSchema);
module.exports = GoogleUser;
