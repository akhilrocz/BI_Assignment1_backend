const express = require("express");
const app = express();
const { initializeDatabase } = require("./db/db.connect");

const cors = require("cors");

const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

const Event = require("./models/event.models");

// app.use(cors());

app.use(express.json());
initializeDatabase();

app.get("/", (req, res) => {
  res.send("hello server");
});

app.get("/api/events", async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (error) {
    console.log("Error fetching events:", error);
    res.status(500).json({ message: "Error fetching events." });
  }
});

app.get("/api/events/search", async (req, res) => {
  const { query, type } = req.query;
  try {
    let filter = {};
    if (type && type !== "Both") {
      filter.type = type;
    }
    if (query) {
      const searchQuery = new RegExp(query, "i");
      filter.$or = [{ title: searchQuery }, { tags: searchQuery }];
    }
    const events = await Event.find(filter);
    res.json(events);
  } catch (error) {
    console.error("Error searching events:", error);
    res.status(500).json({ message: "Error searching events." });
  }
});

app.get("/api/events/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const event = await Event.findById(id);
    if (!event) {
      res.status(404).json({ message: "Event not found." });
    } else {
      res.json(event);
    }
  } catch (error) {
    console.log("Error fetching event:", error);
    res.status(500).json({ message: "Error fetching event:" });
  }
});

// const jsonData = fs.readFileSync("events.json", "utf-8");

// const eventsData = JSON.parse(jsonData);

// function seedData() {
//   try {
//     for (const eventData of eventsData) {
//       const newEvent = new Event({
//         title: eventData.title,
//         description: eventData.description,
//         from_date: eventData.from_date,
//         to_date: eventData.to_date,
//         venue: eventData.venue,
//         address: eventData.address,
//         price: eventData.price,
//         image: eventData.image,
//         host: eventData.host,
//         type: eventData.type,
//         isPaid: eventData.isPaid,
//         tags: eventData.tags,
//         speakers: eventData.speakers,
//         additionalInformation: eventData.additionalInformation,
//       });
//       newEvent.save();
//     }
//   } catch (error) {
//     console.log("Error while saving the data.", error);
//   }
// }

// seedData();

const PORT = 3000;

app.listen(PORT, () => {
  console.log("Server running on PORT", PORT);
});
