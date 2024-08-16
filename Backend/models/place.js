const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const placeSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: {
    url: { type: String, required: true },
    filename: { type: String, required: true },
  },
  address: { type: String, required: true },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  creator: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

// placeSchema.post('findOneAndDelete', async function (doc){
//   if (doc) {
//     await User.findByIdAndUpdate(doc.creator, { $pull: { places: doc._id } });
//   }
// });

module.exports = mongoose.model("Place", placeSchema);
