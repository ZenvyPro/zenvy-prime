<!-- Include Supabase -->
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js"></script>

<script>
  const supabase = supabase.createClient(
    "https://rufcctboplasewtrukwo.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ1ZmNjdGJvcGxhc2V3dHJ1a3dvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk5NjA3NjUsImV4cCI6MjA2NTUzNjc2NX0.aXrfya95Qpcdoru2gNvC6t7BxsbnpfviHTSuMw-QnQg"
  );

  // Login
  async function login(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      alert("Login failed: " + error.message);
    } else {
      checkDevice(data.user.id);
    }
  }

  // Signup
  async function signup(email, password) {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) alert("Signup failed: " + error.message);
    else alert("Signup successful! Please login.");
  }

  // Device lock logic
  async function checkDevice(userId) {
    const deviceId = localStorage.getItem("device_id") || crypto.randomUUID();
    localStorage.setItem("device_id", deviceId);

    const { data, error } = await supabase
      .from("users_data")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error && error.code === "PGRST116") {
      // New user - insert device ID
      await supabase.from("users_data").insert({ user_id: userId, device_id: deviceId });
    } else if (data.device_id !== deviceId) {
      alert("Access denied. You are already logged in on another device.");
      await supabase.auth.signOut();
    } else {
      alert("Login successful.");
      window.location.href = "index.html";
    }
  }
</script>
