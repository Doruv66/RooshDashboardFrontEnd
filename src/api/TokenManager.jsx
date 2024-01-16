import {jwtDecode} from "jwt-decode";

const TokenManager = {
  getAccessToken: () => localStorage.getItem("accessToken"),
  getClaims: () => {
    const claims = localStorage.getItem("claims");
    return claims ? JSON.parse(claims) : undefined;
  },
  setAccessToken: (token) => {
    localStorage.setItem("accessToken", token);
    const claims = jwtDecode(token);
    localStorage.setItem("claims", JSON.stringify(claims));
    return claims;
  },

  getAccessTokenInfo: () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      return undefined;

    }
    try {
      const decoded_token = jwtDecode(token);
      return decoded_token;
    }
    catch (error) {
      console.error("Error decoding token:", error);
      return undefined;
    }
  },
  clear: () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("claims");
  },
};

export default TokenManager;