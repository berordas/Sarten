export const doRegister = async (username, email, password, first_name, last_name, birth_date, locality, municipality) => {
    const formattedDate = birth_date.split("/").reverse().join("-");
    const response = await fetch("https://sarten-backend.onrender.com/api/users/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            username,
            email,
            password,
            first_name,
            last_name,
            birth_date: formattedDate, 
            locality,
            municipality,
        }),
    });
    const data = await response.json();
    return data
}

export const validatePassword = (password) => {
    if (password.length < 8) {
        return "La contraseña debe tener al menos 8 caracteres";
    }
    
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    
    if (!hasLetter || !hasNumber) {
        return "La contraseña debe contener al menos una letra y un número";
    }
    
    return null; // Si no hay errores NULL
};