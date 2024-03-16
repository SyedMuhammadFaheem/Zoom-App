const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const port = 3001;

app.use(bodyParser.json());
app.use(cors());

app.post("/exchange-code", async (req, res) => {
  const { authorizationCode, redirect_uri } = req.body;
  console.log(authorizationCode, redirect_uri);
  const tokenEndpoint = "https://zoom.us/oauth/token";
  const data = {
    code: authorizationCode,
    grant_type: "authorization_code",
    redirect_uri: redirect_uri,
  };

  try {
    const response = await axios.post(tokenEndpoint, data, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization:
          "Basic MlJ0dW9nVlJzT0RZOTF6bFR5dHBROmxOQTdvOU11enVIRlVaNDQ1UUYxZjF0RXE1UW1rdTcw",
      },
    });

    console.log("Zoom Access Token:", response.data.access_token);
    res.json({ access_token: response.data.access_token });
  } catch (error) {
    console.error("Error exchanging code for token:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/create-meeting", async (req, res) => {
  const { details, token } = req.body;
  console.log(details, token);

  const urlEndpoint = "https://api.zoom.us/v2/users/me/meetings";
  const data = details;
  try {
    const response = await axios.post(urlEndpoint, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("Meeting URL:", response.data.start_url);
    res.json({ start_url: response.data.start_url });
  } catch (error) {
    console.error("Error getting meeting url:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
