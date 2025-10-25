// Ses efektleri
const sounds = {
    buttonClick: new Audio('https://cdn.pixabay.com/download/audio/2021/08/04/audio_0625c6c682.mp3?filename=click-21156.mp3'),
    transition: new Audio('https://cdn.pixabay.com/download/audio/2021/08/04/audio_12b0c6dd4d.mp3?filename=response-38105.mp3'),
    complete: new Audio('https://cdn.pixabay.com/download/audio/2021/08/04/audio_8042789f32.mp3?filename=success-1-6297.mp3'),
    questionChange: new Audio('https://cdn.pixabay.com/download/audio/2022/03/10/audio_2b8e3c8355.mp3?filename=popup-3-84865.mp3'),
    background: new Audio('https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0c6ff1ecd.mp3?filename=ambient-piano-123903.mp3')
};

// Arka plan müziği ayarları
sounds.background.loop = true;
sounds.background.volume = 0.3;

// Particles.js yapılandırması
particlesJS("particles-js", {
    particles: {
        number: { value: 80, density: { enable: true, value_area: 800 } },
        color: { value: "#ffffff" },
        shape: { type: "circle" },
        opacity: { value: 0.5, random: true },
        size: { value: 3, random: true },
        move: { enable: true, speed: 2 }
    }
});

// Arka plan müziği kontrolü
const bgMusic = document.getElementById('bgMusic');
let isMusicPlaying = false;

function toggleMusic() {
    if (isMusicPlaying) {
        bgMusic.pause();
    } else {
        bgMusic.play();
    }
    isMusicPlaying = !isMusicPlaying;
}

// Hoş geldin ekranı kontrolü
document.getElementById('start-journey').addEventListener('click', () => {
    document.getElementById('welcome-screen').classList.remove('active');
    document.getElementById('form-section').classList.add('active');
    if (!isMusicPlaying) {
        sounds.background.play();
        isMusicPlaying = true;
    }
});

let currentQuestion = 0;
const answers = {
    bilisim: 0,
    elektronik: 0,
    biyomedikal: 0
};

// Form işlemleri
const studentForm = document.getElementById('student-form');
let userName = '';

studentForm.addEventListener('submit', (e) => {
    e.preventDefault();
    userName = document.getElementById('name').value || 'Misafir';
    document.getElementById('form-section').classList.remove('active');
    document.getElementById('quiz-section').classList.add('active');
    sounds.transition.play();
    showQuestion();
    updateHeader();
});

// Header güncelleme fonksiyonu
function updateHeader() {
    const header = document.getElementById('quiz-header');
    header.innerHTML = `
        <div class="quiz-info">
            <span class="user-name">${userName}</span>
            <span class="app-name">Alan Seçim Rehberi</span>
            <span class="question-counter">Soru ${currentQuestion + 1}/${questions.length}</span>
        </div>
    `;
}

// Soru gösterme fonksiyonu
function showQuestion() {
    if (currentQuestion < questions.length) {
        const questionText = document.getElementById('question-text');
        questionText.style.opacity = '0';
        
        setTimeout(() => {
            questionText.textContent = questions[currentQuestion].text;
            questionText.style.opacity = '1';
            sounds.questionChange.play();
        }, 300);

        document.getElementById('progress').style.width = `${(currentQuestion / questions.length) * 100}%`;
        updateHeader();
    } else {
        sounds.complete.play();
        showResult();
    }
}

// Sertifika oluşturma ve indirme işlemleri
function generateCertificate(studentName, fieldName) {
    const today = new Date();
    const date = today.toLocaleDateString('tr-TR', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });

    document.getElementById('certificate-name').textContent = studentName;
    document.getElementById('certificate-field').textContent = fieldName;
    document.getElementById('certificate-date').textContent = date;
}

// PDF İndirme
document.getElementById('download-pdf').addEventListener('click', () => {
    const element = document.getElementById('certificate');
    const opt = {
        margin: [10, 10],
        filename: 'alan-secim-belgesi.pdf',
        image: { type: 'jpeg', quality: 1 },
        html2canvas: { 
            scale: 2,
            useCORS: true,
            logging: true,
            width: 842, // A4 yatay genişlik (mm cinsinden)
            height: 595 // A4 yatay yükseklik (mm cinsinden)
        },
        jsPDF: { 
            unit: 'mm', 
            format: 'a4', 
            orientation: 'landscape',
            compress: true
        }
    };

    sounds.buttonClick.play();
    html2pdf().set(opt).from(element).save();
});

// ODT İndirme
function downloadODT() {
    const certificateContent = document.getElementById('certificate');
    const studentName = document.getElementById('certificate-name').textContent;
    const fieldName = document.getElementById('certificate-field').textContent;
    const date = document.getElementById('certificate-date').textContent;
    
    // ODT formatında içerik oluştur
    const odtContent = `<?xml version="1.0" encoding="UTF-8"?>
<office:document-content xmlns:office="urn:oasis:names:tc:opendocument:xmlns:office:1.0">
    <office:body>
        <office:text>
            <text:h>Alan Seçim Başarı Belgesi</text:h>
            <text:p>Öğrenci Adı: ${studentName}</text:p>
            <text:p>Uygun Alan: ${fieldName}</text:p>
            <text:p>Tarih: ${date}</text:p>
        </office:text>
    </office:body>
</office:document-content>`;

    // ODT dosyasını oluştur ve indir
    const blob = new Blob([odtContent], { type: 'application/vnd.oasis.opendocument.text' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'alan-secim-belgesi.odt';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
}

// E-posta Gönderme
document.getElementById('send-email').addEventListener('click', () => {
    const userEmail = document.getElementById('email').value;
    if (!userEmail) {
        alert('Lütfen form kısmında e-posta adresinizi belirtiniz.');
        return;
    }

    sounds.buttonClick.play();
    const certificateContent = document.getElementById('certificate').innerHTML;
    const mailBody = `
        Sayın ${userName},
        
        Alan Seçim Rehberi değerlendirmenizin sonuç belgesini ekte bulabilirsiniz.
        
        Saygılarımızla,
        Alan Seçim Rehberi Ekibi
    `;

    window.location.href = `mailto:${userEmail}?subject=Alan Seçim Rehberi - Sonuç Belgesi&body=${encodeURIComponent(mailBody)}`;
});

// Yazdırma
document.getElementById('print-certificate').addEventListener('click', () => {
    sounds.buttonClick.play();
    window.print();
});

// Cevap işleme
document.querySelectorAll('.option').forEach(button => {
    button.addEventListener('click', (e) => {
        sounds.buttonClick.play();
        const value = parseInt(e.target.dataset.value);
        const category = questions[currentQuestion].category;
        answers[category] += value;
        currentQuestion++;
        showQuestion();
    });
});

// Sonuç gösterme
function showResult() {
    document.getElementById('quiz-section').classList.remove('active');
    document.getElementById('result-section').classList.add('active');

    // En yüksek puanı alan alanı bulma
    let maxScore = Math.max(answers.bilisim, answers.elektronik, answers.biyomedikal);
    let result = '';

    if (answers.bilisim === maxScore) {
        result = 'Bilişim Teknolojileri';
    } else if (answers.elektronik === maxScore) {
        result = 'Elektrik Elektronik';
    } else {
        result = 'Biyomedikal Cihaz Teknolojileri';
    }

    // Sonuç animasyonunu başlat
    const circle = document.querySelector('.circle');
    circle.style.animation = 'none';
    circle.offsetHeight; // Reflow
    circle.style.animation = null;

    // Sertifika oluştur
    generateCertificate(userName, result);

    // Sonuç metnini güncelle
    document.getElementById('result-text').innerHTML = `
        <h3>Size en uygun alan:</h3>
        <h2 style="color: #667eea; margin-top: 20px;">${result}</h2>
        <p style="margin-top: 20px;">Bu sonuç, verdiğiniz cevaplara göre sizin ilgi ve yeteneklerinize en uygun alanı göstermektedir. 
        Ancak bu sadece bir öneridir ve kesin karar sizin tercihlerinize bağlıdır.</p>
    `;
}