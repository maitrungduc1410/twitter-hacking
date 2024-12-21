const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();
const port = 3000;

// Middleware setup
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: false,
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
  const domain = `http://${req.get("host")}`; // Adjust if using HTTPS

  console.log(referer, 1111);

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
