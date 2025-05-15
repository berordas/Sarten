export const getProfile = async (token) => {
    const response = await fetch(`https://sarten-backend.onrender.com/api/users/profile/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    return response
}

export const changePassword = async (token, oldPassword, newPassword) => {
    const response = await fetch("https://sarten-backend.onrender.com/api/users/change-password/", {
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