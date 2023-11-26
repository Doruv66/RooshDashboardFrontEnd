import jwt_decode from "jwt-decode";

const TokenManager = {
  getAccessToken: () => localStorage.getItem("accessToken"),
  getClaims: () => {
    const claims = localStorage.getItem("claims");
    return claims ? JSON.parse(claims) : undefined;
  },
  setAccessToken: (token) => {
    localStorage.setItem("accessToken", token);
    const claims = jwt_decode(token);
    localStorage.setItem("claims", JSON.stringify(claims));
    return claims;
  },
  getAccessTokenInfo: () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      return undefined;

    }

    try {
      const decoded_token = jwt_decode(token);
      return decoded_token;
    } catch (error) {
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

// import jwt_decode from "jwt-decode";

// const TokenManager = {
//     getAccessToken: () => localStorage.getItem("accessToken"),
//     getClaims: () => {
//         const storedClaims = localStorage.getItem("claims");
//         return storedClaims ? JSON.parse(storedClaims) : undefined;
//     },
//     setAccessToken: (token) => {
//         localStorage.setItem("accessToken", token);
//         const claims = jwt_decode(token);
//         localStorage.setItem("claims", JSON.stringify(claims));
//         return claims;
//     },
//     clear: () => {
//         localStorage.removeItem("accessToken");
//         localStorage.removeItem("claims");
//     }
// }

// export default TokenManager;