document.getElementById("join").addEventListener("click",function(){
    console.log("Button clicked!");
    let emailInput = document.getElementById("email");
    let email = emailInput.value;
    console.log(email);
    let text = document.getElementById("form-area");
    text.innerHTML = "<p>Thanks for joining!</p>";
    text.style.color = "rgba(29, 94, 29, 1)";
    text.style.fontSize = "14px";
    text.style.border = "2px solid rgba(29, 94, 29, 1)";
    text.style.padding = "2px";
    text.style.borderRadius = "5px";
    text.style.backgroundColor = "rgba(88, 243, 135, 1)";
    const backendUrl = window.location.hostname === "localhost"
        ? "http://localhost:3000"
        : "https://waitlist-backend-h04k.onrender.com";
    fetch(`${backendUrl}/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
    })
    .then(res => res.json())
    .then(data => {
        console.log("Server says:", data.message);
    });
});