const express = require("express");
const axios = require("axios");
const { parseString } = require("xml2js");

const app = express();
const cors = require("cors");
app.use(
  cors({
    origin: ["https://nekretnine-one-proba1.netlify.app"],
    methods: "GET,PUT,POST",
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true,
  })
);

app.get("/api/listings", async (req, res) => {
  try {
    const response = await axios.get(
      "https://aureus.relper.com/export/index.php?action=import&agency=theonetim&site=26&secret=8e2b7e1b0d09451fec5c038818c5544a"
    );

    parseString(response.data, (err, result) => {
      if (err) {
        console.error("Error parsing XML:", err);

        res.status(500).json({ error: "Internal Server Error" });
      } else {
        res.status(200).json(processListings(result));
      }
    });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const processListings = (jsonData) => {
  if ("listings" in jsonData) {
    jsonData.listings.listing.forEach((item) => {
      for (let prop in item) {
        if (Array.isArray(item[prop]) && item[prop].length === 1) {
          item[prop] = item[prop][0];
        }
      }
    });
  }

  return jsonData.listings.listing;
};

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
