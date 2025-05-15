export const getProfile = async (token) => {
    const response = await fetch(`http://127.0.0.1:8000/api/users/profile/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    return response
}

export const changePassword = async (token, oldPassword, newPassword) => {
    const response = await fetch("http://127.0.0.1:8000/api/users/change-password/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
            old_password: oldPassword,
            new_password: newPassword
        })
    });
    return response;
};