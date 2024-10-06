import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    auto: true,
  },
  // id: {
  //   type: String,
  //   required: true,
  //   unique: true,
  // },
  // email: {
  //   type: String,
  //   required: true,
  //   unique: true,
  // },
  username: {
    type: String,
    required: true,
    unique: true,
    index: true,
    sparse:true,
  },
  password: {
    type: String,
    required: true,
  },
  // photo: {
  //   type: String,
  //   required: true,
  // },
  // firstName: {
  //   type: String,
  // },
  // lastName: {
  //   type: String,
  // },
  planId: {
    type: Number,
    default: 1,
  },
  creditBalance: {
    type: Number,
    default: 10,
  },
});

const User = mongoose.model('User', UserSchema);
export default User;