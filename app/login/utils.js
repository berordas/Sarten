export const doLogin = async (username, password) => {
    const response = await fetch("https://sarten-backend.onrender.com/api/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
    });
    const data = await response.json();
    return data
}

export const getProfile = async (token) => {
    const response = await fetch(`https://sarten-backend.onrender.com/api/users/profile/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    const data = await response.json();
    return data
}
