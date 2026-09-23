// REGISTER
const registerForm = document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener("submit", async function (e) {

        e.preventDefault();

        const name =
            document.getElementById("registerName").value.trim();

        const email =
            document.getElementById("registerEmail").value.trim();

        const password =
            document.getElementById("registerPassword").value;

        const confirmPassword =
            document.getElementById("confirmPassword").value;


        // Check password
        if (password !== confirmPassword) {

            alert("Passwords do not match ❌");

            return;
        }


        // Prevent multiple clicks
        const submitButton =
            registerForm.querySelector("button[type='submit']");

        if (submitButton.disabled) {
            return;
        }

        submitButton.disabled = true;

        submitButton.textContent = "Creating Account...";


        try {

            const response = await fetch(
                "http://localhost:5000/api/auth/register",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        name: name,
                        email: email,
                        password: password
                    })
                }
            );


            const data = await response.json();


            if (!response.ok) {

                alert(
                    data.message ||
                    "Registration failed ❌"
                );

                submitButton.disabled = false;

                submitButton.textContent =
                    "Create Account";

                return;
            }


            console.log(
                "REGISTER SUCCESS"
            );

            alert(
                "Account created successfully 🎉"
            );

            window.location.href =
                "login.html";


        } catch (error) {

            console.error(
                "Registration Error:",
                error
            );

            alert(
                "Server connection failed ❌"
            );

            submitButton.disabled = false;

            submitButton.textContent =
                "Create Account";
        }

    });

}
// LOGIN
const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", async function (e) {

        e.preventDefault();

        const email =
            document.getElementById("loginEmail").value.trim();

        const password =
            document.getElementById("loginPassword").value;

        const submitButton =
            loginForm.querySelector("button[type='submit']");

        submitButton.disabled = true;
        submitButton.textContent = "Logging in...";

        try {

            const response = await fetch(
                "http://localhost:5000/api/auth/login",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        email: email,
                        password: password
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {

                alert(
                    data.message ||
                    "Login failed ❌"
                );

                submitButton.disabled = false;
                submitButton.textContent = "Login";

                return;
            }

            // Save login data
            localStorage.setItem(
                "jobtrackToken",
                data.token
            );

            localStorage.setItem(
                "jobtrackUser",
                JSON.stringify(data.user)
            );

            console.log("LOGIN SUCCESS ✅");

            // Go to dashboard
            window.location.href = "dashboard.html";

        } catch (error) {

            console.error(
                "Login Error:",
                error
            );

            alert(
                "Server connection failed ❌"
            );

            submitButton.disabled = false;
            submitButton.textContent = "Login";
        }

    });

}