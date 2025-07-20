const { createClient } = require("@supabase/supabase-js");
const express = require("express");
const cors = require("cors");

const app = express();

// Replace with your actual frontend domain
const allowedOrigin = "https://rogerfang28.github.io";

// ✅ Enable CORS for both production and local development
app.use(cors({
  origin: [allowedOrigin, "http://localhost:8080", "http://127.0.0.1:8080", "file://"],
  credentials: true
}));

app.use(express.json());

// Supabase client
const supabaseUrl = "https://undiboutsautvefnlbrt.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVuZGlib3V0c2F1dHZlZm5sYnJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIxMTMxOTYsImV4cCI6MjA2NzY4OTE5Nn0.f9YP9jbLWoUgWdm-9QqRyxmXzZ3lzMuBFDnaAiFjfVE";
const supabase = createClient(supabaseUrl, supabaseKey);

// Save an email
app.post("/join", async (req, res) => {
  const { email } = req.body;
  console.log("Received email:", email);

  // Validation
  if (!email) {
    return res.status(400).json({ message: "Email address is required" });
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Please provide a valid email address" });
  }

  try {
    // Check if email already exists
    const { data: existingEmail, error: checkError } = await supabase
      .from("emails")
      .select("email")
      .eq("email", email.toLowerCase())
      .single();

    if (existingEmail) {
      return res.status(409).json({ 
        message: "This email is already on our waitlist! We'll be in touch soon." 
      });
    }

    // Insert new email (ignore the error if it's just because no rows were found)
    if (checkError && checkError.code !== 'PGRST116') {
      console.error("Error checking existing email:", checkError);
      return res.status(500).json({ message: "Error processing request" });
    }

    // Save the email
    const { data, error } = await supabase
      .from("emails")
      .insert([{ 
        email: email.toLowerCase(),
        created_at: new Date().toISOString()
      }])
      .select();

    if (error) {
      console.error("Supabase insert error:", error);
      
      // Handle specific errors
      if (error.code === '23505') {
        return res.status(409).json({ 
          message: "This email is already on our waitlist! We'll be in touch soon." 
        });
      }
      
      // Handle Row-Level Security policy error
      if (error.code === '42501') {
        console.error("RLS Policy Error - need to configure Supabase policies");
        return res.status(500).json({ 
          message: "Database configuration issue. Please contact support." 
        });
      }
      
      return res.status(500).json({ message: "Error saving email to waitlist" });
    }

    console.log("Successfully saved to Supabase:", data);
    res.status(201).json({ 
      message: "Welcome to the DebateLogic waitlist! We'll notify you when we launch.",
      success: true
    });

  } catch (error) {
    console.error("Unexpected error:", error);
    res.status(500).json({ message: "An unexpected error occurred" });
  }
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
