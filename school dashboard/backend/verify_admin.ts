import axios from "axios";

const TEST_EMAIL = "schooladmin@gmail.com";
const TEST_PASS = "123456";
const API_URL = "http://localhost:5001/api";

const verifySchoolAdmin = async () => {
  try {
    console.log("--- STARTING SCHOOL ADMIN VERIFICATION ---");
    
    // 1. Test Login
    console.log(`1. Testing login for ${TEST_EMAIL}...`);
    const loginRes = await axios.post(`${API_URL}/auth/login`, {
      email: TEST_EMAIL,
      password: TEST_PASS
    });
    
    const token = loginRes.data.token;
    console.log("✅ Login Successful! Token received.");
    console.log("User Role:", loginRes.data.role);
    console.log("School ID:", loginRes.data.schoolId);

    // 2. Test Dashboard Stats
    console.log("2. Testing Admin Dashboard Stats API...");
    const statsRes = await axios.get(`${API_URL}/admin/dashboard/stats`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log("✅ Admin Dashboard API Successful!");
    console.log("Data Received:", JSON.stringify(statsRes.data, null, 2));

    // 3. Test Staff List
    console.log("3. Testing Staff List API...");
    const staffRes = await axios.get(`${API_URL}/staff`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log(`✅ Staff List API Successful! (${staffRes.data.length} records)`);

    console.log("\n--- VERIFICATION COMPLETE: SCHOOL ADMIN SYSTEM FUNCTIONAL ---");
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

verifySchoolAdmin();
