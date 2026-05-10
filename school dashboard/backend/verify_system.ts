import axios from "axios";

const TEST_EMAIL = "superadmin@gmail.com";
const TEST_PASS = "123456";
const API_URL = "http://localhost:5001/api";

const verifySystem = async () => {
  try {
    console.log("--- STARTING SYSTEM VERIFICATION ---");
    
    // 1. Test Login
    console.log(`1. Testing login for ${TEST_EMAIL}...`);
    const loginRes = await axios.post(`${API_URL}/auth/login`, {
      email: TEST_EMAIL,
      password: TEST_PASS
    });
    
    const token = loginRes.data.token;
    console.log("✅ Login Successful! Token received.");

    // 2. Test Monitoring API with Token
    console.log("2. Testing Monitoring Health API with token...");
    const healthRes = await axios.get(`${API_URL}/superadmin/monitoring/health`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log("✅ Monitoring API Successful!");
    console.log("Data Received:", JSON.stringify(healthRes.data, null, 2));

    // 3. Test Error Logs API
    console.log("3. Testing Error Logs API...");
    const errorRes = await axios.get(`${API_URL}/superadmin/monitoring/errors`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log(`✅ Error Logs API Successful! (${errorRes.data.length} logs found)`);

    console.log("\n--- VERIFICATION COMPLETE: ALL SYSTEMS FUNCTIONAL ---");
    process.exit(0);
  } catch (error: any) {
    console.error("❌ VERIFICATION FAILED!");
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error(`Message: ${JSON.stringify(error.response.data)}`);
    } else {
      console.error(`Error: ${error.message}`);
    }
    process.exit(1);
  }
};

verifySystem();
