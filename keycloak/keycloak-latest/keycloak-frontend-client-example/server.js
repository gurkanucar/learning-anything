require("dotenv").config(); // so we can load client secrets from .env

const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());

// These should come from environment variables in real production usage
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID || "5bdaed662b4e7ccef7bd";
const GITHUB_CLIENT_SECRET =
  process.env.GITHUB_CLIENT_SECRET || "f4094fce7eed1414114487b272cb966538f9464b";

// 1) Redirect user to GitHub for login (Optional route)
app.get("/github/login", (req, res) => {
  // Typically you might generate random state and store it in a session.
  // For demonstration only:
  const state = Math.random().toString(36).substring(7);

  // In a real app, store `state` in session or DB for validation.
  const redirectUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&scope=user:email&state=${state}`;
  res.redirect(redirectUrl);
});

// 2) Handle callback from GitHub
app.get("/github/callback", async (req, res) => {
  const { code, state } = req.query;

  try {
    // Exchange code for an access token
    const tokenResponse = await axios.post(
      "https://github.com/login/oauth/access_token",
      {
        client_id: GITHUB_CLIENT_ID,
        client_secret: GITHUB_CLIENT_SECRET,
        code: code,
        state: state, // In production, validate this against stored state
      },
      {
        headers: {
          Accept: "application/json",
        },
      }
    );

    const { access_token } = tokenResponse.data;
    if (!access_token) {
      return res.status(400).json({ error: "No access token received" });
    }

    // Fetch user profile data from GitHub
    const userResponse = await axios.get("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    // For further info, you can also get user email:
    // const emailResponse = await axios.get("https://api.github.com/user/emails", {
    //   headers: { Authorization: `Bearer ${access_token}` },
    // });

    // Return data back to the frontend (or store in session)
    res.json({
      accessToken: access_token,
      user: userResponse.data,
      // emails: emailResponse.data, // if you request user:email scope
    });
  } catch (error) {
    console.error("GitHub OAuth callback error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
