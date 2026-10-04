const registerForm = document.getElementById("registerForm");

registerForm.addEventListener("submit", async function(event) {

    event.preventDefault();

    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const message = document.getElementById("message");

    try {

        const response = await fetch("/auth/register", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                username: username,
                email: email,
                password: password
            })

        });

        if (response.ok) {

            message.textContent =
                "Registration successful! Redirecting to login...";

            message.style.color = "green";

            setTimeout(function() {

                window.location.href = "/index.html";

            }, 1500);

        } else {

            const error = await response.text();

            message.textContent =
                error || "Registration failed";

            message.style.color = "red";

        }

    } catch (error) {

        console.error(error);

        message.textContent =
            "Something went wrong";

        message.style.color = "red";
    }

});