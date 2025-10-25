const bgMusic = document.getElementById("bgMusic");
const toggleBtn = document.getElementById("musicToggle");

// Kullanıcının önceki tercihlerini hatırla
if (localStorage.getItem("musicState") === "off") {
  bgMusic.pause();
  toggleBtn.innerText = "🔇 Müzik: Kapalı";
}

toggleBtn.addEventListener("click", () => {
  if (bgMusic.paused) {
    bgMusic.play();
    toggleBtn.innerText = "🔊 Müzik: Açık";
    localStorage.setItem("musicState", "on");
  } else {
    bgMusic.pause();
    toggleBtn.innerText = "🔇 Müzik: Kapalı";
    localStorage.setItem("musicState", "off");
  }
});
