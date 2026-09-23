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
// ===============================
// FORGOT PASSWORD
// ===============================

const forgotPasswordForm = document.getElementById("forgotPasswordForm");

if (forgotPasswordForm) {

    forgotPasswordForm.addEventListener("submit", async function (e) {

        e.preventDefault();

        const email =
            document.getElementById("forgotEmail").value.trim();


        if (!email) {

            alert("Please enter your email.");

            return;
        }


        try {

            const response = await fetch(
                "http://localhost:5000/api/auth/forgot-password",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        email: email
                    })
                }
            );


            const data = await response.json();


            if (response.ok) {

                // Save email for reset page
                localStorage.setItem(
                    "resetEmail",
                    email
                );

                alert(
                    data.message ||
                    "Email verified successfully."
                );

                window.location.href =
                    "reset-password.html";

            } else {

                alert(
                    data.message ||
                    "Something went wrong."
                );

            }


        } catch (error) {

            console.error(
                "Forgot Password Error:",
                error
            );

            alert(
                "Unable to connect to server."
            );

        }

    });

}

// ===============================
// RESET PASSWORD
// ===============================

const resetPasswordForm = document.getElementById("resetPasswordForm");

if (resetPasswordForm) {

    resetPasswordForm.addEventListener("submit", async function (e) {

        e.preventDefault();

        const email = localStorage.getItem("resetEmail");

        const newPassword =
            document.getElementById("newPassword").value;

        const confirmPassword =
            document.getElementById("confirmPassword").value;


        // Check email
        if (!email) {

            alert("Reset session expired. Please try Forgot Password again.");

            window.location.href = "forgot-password.html";

            return;
        }


        // Check passwords
        if (newPassword !== confirmPassword) {

            alert("Passwords do not match ❌");

            return;
        }


        try {

            const response = await fetch(
                "http://localhost:5000/api/auth/reset-password",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        email: email,
                        newPassword: newPassword
                    })
                }
            );


            const data = await response.json();


          if (response.ok) {

    alert("Password reset successfully ✅");

    localStorage.removeItem("resetEmail");

    window.location.href = "login.html";

} else {

    alert(
        data.message ||
        "Password reset failed ❌"
    );

}

        } catch (error) {

            console.error(
                "Reset Password Error:",
                error
            );

            alert(
                "Unable to connect to server ❌"
            );

        }

    });

}
function togglePassword(inputId) {
    const input = document.getElementById(inputId);

    if (input.type === "password") {
        input.type = "text";
    } else {
        input.type = "password";
    }
}


