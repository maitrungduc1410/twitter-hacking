const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();
const port = 3000;

app.set('trust proxy', true);

// Middleware setup
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production', // Ensures cookies are only sent over HTTPS in production
      httpOnly: true, // Prevents JavaScript from accessing the cookie
      sameSite: "strict", // Ensures cookies are sent only with same-site requests
      maxAge: 1000 * 60 * 60 * 2, // Optional: Set cookie expiration to 2 hours
    },
  })
);

// Simulated user database
const users = [
  { email: "user@example.com", password: "password123" }, // Replace with real DB logic
];

// Serve static files
app.use("/static", express.static("public"));

// Login route (POST request)
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  // Validate user credentials
  const user = users.find((u) => u.email === email && u.password === password);

  if (user) {
    req.session.isAuthenticated = true;
    req.session.user = { email }; // Save user info to session
    res.redirect("/"); // Redirect to the main page after login
  } else {
    res.status(401).send("Invalid login credentials");
  }
});

// Middleware to check authentication
const checkAuth = (req, res, next) => {
  if (!req.session.isAuthenticated) {
    res.sendFile(path.join(__dirname, "/login.html"));
  } else {
    next();
  }
};

// Main route
app.get("/", checkAuth, (req, res) => {
  const referer = req.get("Referer");
  const domain = `${req.protocol}://${req.get("host")}`; // Dynamically use HTTP or HTTPS

  // Disable caching. This is very important, else browser will still use cached version
  res.setHeader(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, proxy-revalidate"
  );
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");

  if (referer && referer.startsWith(domain)) {
    res.sendFile(path.join(__dirname, "/index.html"));
  } else {
    res.sendFile(path.join(__dirname, "/default.html"));
  }
});

// Secure logout route (POST request)
app.post("/logout", (req, res) => {
  if (req.session) {
    req.session.destroy((err) => {
      if (err) {
        console.error("Error during logout:", err);
        return res.status(500).send("Error logging out");
      }
      res.redirect("/"); // Redirect to login after logout
    });
  } else {
    res.redirect("/");
  }
});

// fallback to /
app.get("*", (req, res) => {
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`App running at http://localhost:${port}`);
});
