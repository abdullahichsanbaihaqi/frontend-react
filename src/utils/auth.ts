import axios from "../api/axios";

export const logout = async () => {
  const token = localStorage.getItem("token");

  try {
    if (token) {
      await axios.post(
        "/auth/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    }
  } catch (err) {
    console.error("Logout error:", err);
  } finally {
    localStorage.removeItem("token");
    localStorage.removeItem("displayName");

    window.location.href = "/login";
  }
};