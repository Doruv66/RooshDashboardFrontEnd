import TokenManager from "./TokenManager";

const AuthAPI = {
    login: (username, password) => {
        return fetch('http://localhost:8080/tokens', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, password }),
        })
          .then((response) => response.json())
          .then(data => data.accessToken)
          .then(accessToken => TokenManager.setAccessToken(accessToken));
      },
}

export default AuthAPI;