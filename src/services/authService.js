import apiClient from "../api/apiClinet";

const authService = {
  login: async (email, password) => {
    const resp = await apiClient.post("/bms/admin/login", { email, password });
    const { token, refreshToken } = resp.data;
    localStorage.setItem("token", token);
    localStorage.setItem("refreshToken", refreshToken);
    return resp.data;
  },
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
  },
  // optionally: refreshToken(), getCurrentUser(), etc.
};

export default authService;
