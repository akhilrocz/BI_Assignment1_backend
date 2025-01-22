const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    from_date: Date,
    to_date: Date,
    venue: String,
    address: String,
    price: Number,
    image: String,
    host: String,
    type: String,
    isPaid: Boolean,
    tags: [String],
    speakers: [
      {
        name: String,
        profilePic: String,
        role: String,
      },
    ],
    additionalInformation: {
      dressCode: String,
      ageRestrictions: String,
    },
  },
  {
    timestamps: true,
  }
);

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;
