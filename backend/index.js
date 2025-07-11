const { createClient } = require("@supabase/supabase-js");
const express = require("express");
const cors = require("cors");

const app = express();

// Replace with your actual frontend domain
const allowedOrigin = "https://rogerfang28.github.io";

// ✅ Enable CORS only for your frontend
app.use(cors({
  origin: allowedOrigin
}));

app.use(express.json());

// Supabase client
const supabaseUrl = "https://undiboutsautvefnlbrt.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVuZGlib3V0c2F1dHZlZm5sYnJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIxMTMxOTYsImV4cCI6MjA2NzY4OTE5Nn0.f9YP9jbLWoUgWdm-9QqRyxmXzZ3lzMuBFDnaAiFjfVE";
const supabase = createClient(supabaseUrl, supabaseKey);

// Save an email
app.post("/join", async (req, res) => {
  const { email } = req.body;
  console.log("Received email:", email); // ✅ Log input

  if (!email) return res.status(400).json({ message: "Email required" });

  const { data, error } = await supabase
    .from("emails")
    .insert([{ email }]);

  if (error) {
    console.error("Supabase insert error:", error); // ✅ Log Supabase error
    return res.status(500).json({ message: "Error saving email" });
  }

  console.log("Saved to Supabase:", data); // ✅ Log success
  res.json({ message: "Thanks for joining!", saved: data });
});


// Return all saved emails (optional)
app.get("/emails", (req, res) => {
  res.json({ emails: ["disabled in-memory list"] });
});

// Port for local testing or Render deployment
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
