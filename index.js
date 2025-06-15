const express = require('express');
const bodyParser = require('body-parser');
const Razorpay = require('razorpay');
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(bodyParser.json());

const supabase = createClient(
  "https://rufcctboplasewtrukwo.supabase.co",         // 🔁 Replace with your real project URL
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ1ZmNjdGJvcGxhc2V3dHJ1a3dvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk5NjA3NjUsImV4cCI6MjA2NTUzNjc2NX0.aXrfya95Qpcdoru2gNvC6t7BxsbnpfviHTSuMw-QnQg"                    // 🔁 Replace with your secret key (NOT anon key)
);

app.post('/webhook-verify', async (req, res) => {
  const { razorpay_payment_id, user_id, movie_id } = req.body;

  try {
    const { error } = await supabase.from('purchases').insert({
      user_id,
      movie_id
    });

    if (error) {
      console.error("DB Error:", error);
      return res.status(500).send("DB Error");
    }

    res.send("Purchase saved");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error");
  }
});

app.get("/", (req, res) => {
  res.send("Webhook is running 🎬");
});

app.listen(3000, () => console.log("Server running on port 3000"));
