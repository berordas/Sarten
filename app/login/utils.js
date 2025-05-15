export const doLogin = async (username, password) => {
    const response = await fetch("http://127.0.0.1:8000/api/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
    });
    const data = await response.json();
    return data
}

export const getProfile = async (token) => {
    const response = await fetch(`http://127.0.0.1:8000/api/users/profile/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    const data = await response.json();
    return data
}
