import apiClient from "../api/apiClinet";

const authService = {
  login: async (email, password, role) => {
    let resp;
    // Your existing API call logic is perfect.
    if (role === "trainer") {
      resp = await apiClient.post("/bms/trainer/login", {
        email, // Note: The old code used 'id', ensure your backend accepts 'email' or change back to 'id'.
        password,
      });
    } else {
      resp = await apiClient.post("/bms/admin/login", {
        email,
        password,
      });
    }

    const { token, refreshToken } = resp.data;
    
    // Store everything in localStorage on successful login
    if (token) {
      localStorage.setItem("token", token);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("role", role); // <-- Add this line
    }

    return resp.data;
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("role"); // <-- Add this line
  },
};

export default authService;