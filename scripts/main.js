document.addEventListener('DOMContentLoaded', () => {
  console.log("DOM loaded. Initializing camera and form events.");

  const phoneInput = document.getElementById("phone");
  const prefix = "+27 ";
  const SHEET_API_URL = "https://script.google.com/macros/s/AKfycbyNLTz4E-_KxWt8EZLcfk34YFgzEjAhQyoIHgygz2H9ga6tTD8Rdp1Tt9XF1gsrFW_c/exec";


  // Phone number formatting
  phoneInput.addEventListener("focus", () => {
    if (!phoneInput.value.startsWith(prefix)) {
      phoneInput.value = prefix;
    }
  });

  phoneInput.addEventListener("input", function() {
    let current = this.value;
    if (!current.startsWith(prefix)) {
      current = prefix + current.replace(/\D/g, '');
    }

    let rawDigits = current.substring(prefix.length).replace(/\D/g, '');
    if (rawDigits.length > 9) rawDigits = rawDigits.substring(0, 9);

    let formatted = prefix;
    if (rawDigits.length > 0) formatted += rawDigits.substring(0, 2);
    if (rawDigits.length > 2) formatted += " " + rawDigits.substring(2, 5);
    if (rawDigits.length > 5) formatted += " " + rawDigits.substring(5, 9);
    
    this.value = formatted;
  });

  // Camera setup
  const openCameraBtn = document.getElementById("open-camera");
  const cameraSection = document.getElementById("camera-section");
  const video = document.getElementById("video");
  const capturePhotoBtn = document.getElementById("capture-photo");
  const canvas = document.getElementById("canvas");
  const signupForm = document.getElementById("signup-form");
  const paymentCheckbox = document.getElementById("payment-confirm");
  let capturedImageData = null;

  cameraSection.style.display = "none";

  openCameraBtn.addEventListener("click", () => {
    cameraSection.style.display = "block";
    capturedImageData = null;

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
          video.srcObject = stream;
          video.play();
          video.stream = stream;
        })
        .catch((err) => {
          alert("Unable to access camera: " + err);
        });
    } else {
      alert("Camera not supported by your browser.");
    }
  });

  capturePhotoBtn.addEventListener("click", () => {
    const context = canvas.getContext("2d");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    capturedImageData = canvas.toDataURL("image/png");

    if (video.stream) {
      video.stream.getTracks().forEach(track => track.stop());
    }

    cameraSection.style.display = "none";
    alert("Photo captured successfully!");
  });

  // Form submission
  signupForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const surname = document.getElementById("surname").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const email = document.getElementById("email").value.trim();
    const idNumber = document.getElementById("id_number").value.trim();

    if (idNumber.length !== 13 || isNaN(idNumber)) {
      alert("Invalid South African ID number. It must be 13 digits.");
      return;
    }

    if (!capturedImageData) {
      alert("You must capture a photo to register.");
      return;
    }

    if (!paymentCheckbox.checked) {
      alert("You must confirm payment of the membership fee.");
      return;
    }

    try {
      const response = await fetch(SHEET_API_URL, {
        method: "POST",
        body: JSON.stringify({
          name,
          surname,
          phone,
          email,
          id_number: idNumber,
          photoBase64: capturedImageData
        }),
        headers: { "Content-Type": "application/json" }
      });

      const result = await response.json();

      if (result.success) {
        showSuccessPopup();
        signupForm.reset();
        capturedImageData = null;
        phoneInput.value = prefix;
      } else if (result.error) {
        alert(result.error);
      } else {
        alert("Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Network error. Please check your connection and try again.");
    }
  });

  function showSuccessPopup() {
    const popup = document.getElementById("popup");
    if (popup) {
      popup.style.display = "block";
      setTimeout(() => {
        popup.style.display = "none";
      }, 3000);
    }
  }
});