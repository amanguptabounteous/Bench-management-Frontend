// import apiClient from "../api/apiClinet";

// const authService = {
//   login: async (email, password) => {
//     const resp = await apiClient.post("/bms/admin/login", { email, password });
//     const { token, refreshToken } = resp.data;
//     localStorage.setItem("token", token);
//     localStorage.setItem("refreshToken", refreshToken);
//     return resp.data;
//   },
//   logout: () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("refreshToken");
//   },
//   // optionally: refreshToken(), getCurrentUser(), etc.
// };

// export default authService;

import apiClient from "../api/apiClinet";

const authService = {
  login: async (email, password, role) => {
    let resp;
    if (role === "trainer") {
      // Trainer: expects id, pass, roll
      resp = await apiClient.post("/bms/trainer/login", {
        id: email,
        pass: password,
        roll: role,
      });
    } else {
      // Admin: expects id, pass
      resp = await apiClient.post("/bms/admin/login", {
        id: email,
        pass: password,
      });
    }
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