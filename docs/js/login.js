const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", async function(event) {

    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const message = document.getElementById("message");

    try {

        const response = await fetch("/auth/login", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                username: username,
                password: password
            })
        });

        if (response.ok) {

            const data = await response.json();

            // Save JWT token
            localStorage.setItem("token", data.token);

            // Go to home page
            window.location.href = "/home.html";

        } else {

            message.textContent = "Invalid username or password";
            message.style.color = "red";
        }

    } catch (error) {

        console.error(error);

        message.textContent = "Something went wrong";
        message.style.color = "red";
    }

});
