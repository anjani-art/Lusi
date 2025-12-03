// Data Pohon Keputusan (Decision Tree) yang diperluas
const decisionTree = {
    step1: {
        title: "LANGKAH 1: ANALISIS KANDUNGAN",
        question: "Apa karakteristik dominan sampel lumpur?",
        choices: {
            silika: {
                label: "Dominan Silika (SiO2) & Alumina",
                next: 'step2_silika'
            },
            rare_earth: {
                label: "Mengandung Logam Langka (Li/REE)",
                next: 'step2_rare_earth'
            },
            organic: {
                label: "Campuran Organik & Tanah Liat",
                next: 'step2_organic_contaminant' 
            }
        }
    },
    
    // --- Cabang Silika ---
    step2_silika: {
        title: "LANGKAH 2: TUJUAN",
        question: "Apa prioritas produk akhir?",
        choices: {
            mass_construction: {
                label: "Bahan Konstruksi Massal",
                recommendation: {
                    method: "Pembuatan Bata Merah/Interlock",
                    description: "Kandungan Silika dan Alumina lumpur mirip dengan tanah liat. Melalui sintering (pembakaran), partikel menyatu menjadi keramik yang kuat.",
                    process: "BrickSintering", 
                    temp_range: "900-1000°C"
                }
            },
            aesthetic: {
                label: "Material Estetik/Keramik",
                recommendation: {
                    method: "Produksi Geopolimer",
                    description: "Dengan aktivator alkali (NaOH), lumpur bereaksi membentuk ikatan polimer anorganik, lebih ramah lingkungan daripada semen konvensional.",
                    process: "GeopolymerSintering", 
                    temp_range: "900-1200°C" 
                }
            }
        }
    },
    
    // --- Cabang Logam Langka (Li/REE) ---
    step2_rare_earth: {
        title: "LANGKAH 2: TUJUAN",
        question: "Apa target ekstraksi utama?",
        choices: {
            lithium: {
                label: "Lithium (Baterai)",
                recommendation: {
                    method: "Ekstraksi Lithium (Leaching)",
                    description: "Menggunakan pelarut asam untuk melarutkan logam dari matriks lumpur, kemudian dipisahkan melalui presipitasi kimia.",
                    process: "LithiumLeaching", 
                    temp_range: "Suhu lingkungan"
                }
            },
            rare_earth_mag: {
                label: "Logam Tanah Jarang (Magnet)",
                recommendation: {
                    method: "Ekstraksi Rare Earth Elements",
                    description: "Logam Tanah Jarang (REE) diekstraksi menggunakan metode hidrometalurgi bertahap untuk memurnikan Stronsium atau Cerium.",
                    process: "REEExtraction", 
                    temp_range: "Suhu lingkungan"
                }
            }
        }
    },

    // --- Cabang Organik & Tanah Liat ---
    step2_organic_contaminant: {
        title: "LANGKAH 2: TINGKAT KONTAMINASI",
        question: "Tingkat kontaminasi logam berat lumpur?",
        choices: {
            low_contaminant: {
                label: "Rendah (Aman)",
                recommendation: {
                    method: "Campuran Media Tanam",
                    description: "Jika bebas racun, lumpur dicampur kompos untuk memperbaiki struktur tanah berpasir karena kemampuan menahan airnya tinggi (soil amendment).",
                    process: "SoilAmendment", 
                    temp_range: "Suhu lingkungan"
                }
            },
            high_contaminant: {
                label: "Tinggi (Berbahaya)",
                recommendation: {
                    method: "Solidifikasi & Landfill",
                    description: "Limbah dicampur semen untuk mengikat racun agar tidak larut ke air tanah, lalu ditimbun di lahan pembuangan aman.",
                    process: "Solidification", 
                    temp_range: "Suhu lingkungan"
                }
            }
        }
    }
};

let currentStep = 'step1';
const appContent = document.getElementById('app-content');
const simulatorContainer = document.getElementById('simulator-container');

// Fungsi untuk merender tampilan langkah saat ini
function renderStep(stepKey) {
    const stepData = decisionTree[stepKey];
    if (!stepData) return;

    // Reset konten dan status simulator
    appContent.innerHTML = '';
    simulatorContainer.innerHTML = `
        <p>Simulator Standby</p>
        <p>Selesaikan pohon keputusan di sebelah kiri untuk memilih alat dan proses yang akan dijalankan.</p>
    `;
    simulatorContainer.className = 'simulator-standby';

    // Buat card langkah
    const stepCard = document.createElement('div');
    stepCard.className = 'step-card';
    stepCard.innerHTML = `
        <div class="step-title">${stepData.title}</div>
        <p>${stepData.question}</p>
    `;

    // Tambahkan tombol-tombol pilihan
    for (const key in stepData.choices) {
        const choice = stepData.choices[key];
        const button = document.createElement('button');
        button.className = 'choice-button';
        button.textContent = choice.label;
        button.dataset.choiceKey = key;

        // Gunakan fungsi pembungkus untuk event listener
        button.addEventListener('click', (event) => {
            // Hilangkan status "selected" dari semua tombol pada langkah saat ini
            document.querySelectorAll('.step-card .choice-button').forEach(btn => {
                btn.classList.remove('selected');
            });
        
            // Tambahkan status "selected" pada tombol yang diklik
            event.target.classList.add('selected');

            handleChoice(stepKey, key, choice);
        });
        stepCard.appendChild(button);
    }

    appContent.appendChild(stepCard);
}

// Fungsi untuk menangani klik pilihan
function handleChoice(currentStepKey, choiceKey, choiceData) {
    // Jika ada langkah berikutnya, render langkah itu
    if (choiceData.next) {
        currentStep = choiceData.next;
        // Penundaan kecil untuk animasi transisi CSS
        setTimeout(() => renderStep(currentStep), 300);
    } 
    // Jika tidak ada langkah berikutnya, tampilkan rekomendasi
    else if (choiceData.recommendation) {
        displayRecommendation(choiceData.recommendation);
    } else {
        simulatorContainer.innerHTML = `<p>Proses Selesai. Tidak ada simulasi spesifik yang tersedia untuk pilihan ini.</p>`;
        simulatorContainer.className = 'step-card';
    }
}

// Fungsi untuk menampilkan rekomendasi dan tombol simulator
function displayRecommendation(reco) {
    simulatorContainer.innerHTML = `
        <div class="step-title">REKOMENDASI METODE</div>
        <h3>${reco.method}</h3>
        <p>${reco.description}</p>
        <button class="choice-button" onclick="runSimulator('${reco.process}', '${reco.temp_range}')">Jalankan Simulasi: ${reco.process.replace(/([A-Z])/g, ' $1').trim()}</button>
    `;
    simulatorContainer.className = 'step-card'; 
}


// --- FUNGSI PEMBANTU SIMULASI ---

// 1. Fungsi untuk simulasi Sintering (Pembakaran: BrickSintering, GeopolymerSintering)
function renderSinteringControl(processName, selectedTempStatus = 'PROCESSING') {
    let status = selectedTempStatus;
    let tempValue;
    let warning = '';
    let outputImage;
    let processTitle = (processName === 'BrickSintering') ? 'SINTERING BATA MERAH' : 'SINTERING GEOPOLIMER';

    if (processName === 'BrickSintering') {
        outputImage = '[Gambar: Bata merah solid yang sudah dibakar]'; 
        if (status === 'IDLE') {
            tempValue = '572°C'; 
            warning = 'Suhu belum cukup. Panaskan hingga >850°C.';
        } else if (status === 'PROCESSING') {
            tempValue = '878°C'; 
            warning = 'Suhu Optimal Sintering tercapai. Partikel menyatu menjadi keramik padat.';
        } else if (status === 'OVERHEAT') {
            tempValue = '1114°C'; 
            warning = 'PERINGATAN: Suhu terlalu tinggi! Material meleleh (Vitrification berlebih). Bata akan gagal.';
        }
    } else if (processName === 'GeopolymerSintering') {
        outputImage = '[Gambar: Keramik Geopolimer padat]'; 
        if (status === 'IDLE') {
            tempValue = '331°C'; 
            warning = 'Suhu belum cukup. Panaskan hingga >850°C.';
        } else if (status === 'PROCESSING') {
            tempValue = '982°C'; 
            warning = 'Suhu Optimal Sintering tercapai. Partikel menyatu menjadi keramik padat.';
        } else if (status === 'OVERHEAT') {
            tempValue = '1151°C'; 
            warning = 'PERINGATAN: Suhu terlalu tinggi! Material meleleh (Vitrification berlebih). Produk akan gagal.';
        }
    }

    // HTML Kontrol Sintering
    const htmlContent = `
        <div class="step-title">${processTitle}</div>
        <p>SUHU SAAT INI: ${tempValue} | STATUS: **${status}**</p>
        
        <div class="visualizer-sintering ${status.toLowerCase()}">
            <!-- Visualisasi Proses Pembakaran (Animasi CSS) -->
        </div>

        <div class="sintering-control">
            <p class="step-title">KONTROL SUHU PEMBAKARAN</p>
            <p>Target: 900-1000°C</p>
            <p class="warning-text ${status === 'OVERHEAT' || status === 'IDLE' ? 'critical' : ''}">${warning}</p>
        </div>

        <div class="output-product">
            <p class="step-title">Output Produk</p>
            <p>Proses Selesai: Struktur lumpur telah berubah menjadi keramik padat yang stabil.</p>
            <div class="product-image">${outputImage}</div>
        </div>
        
        <!-- Tombol untuk mengubah status simulasi (interaktif) -->
        <div class="dose-buttons" style="margin-top: 20px;">
            <button class="dose-btn" onclick="renderSinteringControl('${processName}', 'IDLE')">572°C (IDLE)</button>
            <button class="dose-btn" onclick="renderSinteringControl('${processName}', 'PROCESSING')">878°C (OPTIMAL)</button>
            <button class="dose-btn" onclick="renderSinteringControl('${processName}', 'OVERHEAT')">1114°C (OVERHEAT)</button>
        </div>
    `;

    simulatorContainer.innerHTML = htmlContent;
    simulatorContainer.className = 'step-card';
}


// 2. Fungsi untuk simulasi Leaching/Ekstraksi Asam (LithiumLeaching, REEExtraction, SoilAmendment)
function renderAcidDoseControl(processName, selectedDose = 'Optimal') {
    let visualClass = ''; 
    let outputDescription;
    let pHWarning = '';
    let outputImage;
    let processTitle;

    if (processName === 'LithiumLeaching' || processName === 'REEExtraction') {
        processTitle = (processName === 'LithiumLeaching') ? 'EKSTRAKSI LITHIUM' : 'EKSTRAKSI RARE EARTH';
        outputImage = '[Gambar: Produk akhir konsentrat logam murni]';
        outputDescription = 'Presipitasi berhasil. Endapan adalah konsentrat logam berharga (Lithium Karbonat atau REE).';

        if (selectedDose === 'Rendah') {
            pHWarning = 'Dosis kurang. Reaksi lambat, yield ekstraksi sangat rendah. Sebagian besar logam masih dalam lumpur.';
            visualClass = 'low-dose';
        } else if (selectedDose === 'Optimal') {
            pHWarning = 'Dosis Samourous Asam optimal. Melarutkan logam berharga tanpa melarutkan pengotor berlebih.';
            visualClass = 'optimal-dose';
        } else if (selectedDose === 'Overdosis') {
            pHWarning = 'pH terlalu rendah! Asam berlebih melarutkan pengotor lain (Silika/Aluminium/Besi), merusak kemurnian produk.';
            visualClass = 'over-dose';
        }
    } else if (processName === 'SoilAmendment') {
        processTitle = 'SOIL AMENDMENT (MEDIA TANAM)';
        outputImage = '[Gambar: Tumpukan media tanam subur yang dicampur lumpur]';
        outputDescription = 'Lumpur telah diproses menjadi bahan campuran yang dapat meningkatkan kualitas dan porositas tanah.';

        if (selectedDose === 'Rendah') {
            pHWarning = 'Kontrol Kualitas: Dosis pencampur rendah, produk akhir tidak homogen dan kurang efektif.';
            visualClass = 'low-dose';
        } else if (selectedDose === 'Optimal') {
            pHWarning = 'Kontrol Kualitas Optimal. Pencampuran homogen menghasilkan produk media tanam berkualitas tinggi.';
            visualClass = 'optimal-dose';
        } else if (selectedDose === 'Overdosis') {
            pHWarning = 'Kontrol Kualitas: Overdosis bahan pengikat/pengurai menyebabkan pH terlalu ekstrem. Produk tidak aman untuk tanaman.';
            visualClass = 'over-dose';
        }
    }
    
    // HTML Kontrol Dosis
    const htmlContent = `
        <div class="step-title">${processTitle}</div>
        <p>TEMP: Suhu Lingkungan | STATUS: **REACTION**</p>
        
        <div class="visualizer-leaching ${visualClass}">
            <!-- Visualisasi Proses Pelarutan/Pencampuran (Animasi CSS) -->
        </div>

        <div class="dose-control">
            <p class="step-title">KONTROL DOSIS PELARUT/BAHAN CAMPURAN</p>
            <div class="dose-buttons">
                <button class="dose-btn ${selectedDose === 'Rendah' ? 'selected' : ''}" onclick="renderAcidDoseControl('${processName}', 'Rendah')">Dosis Rendah</button>
                <button class="dose-btn ${selectedDose === 'Optimal' ? 'selected' : ''}" onclick="renderAcidDoseControl('${processName}', 'Optimal')">Dosis Optimal</button>
                <button class="dose-btn ${selectedDose === 'Overdosis' ? 'selected' : ''}" onclick="renderAcidDoseControl('${processName}', 'Overdosis')">Overdosis</button>
            </div>
            <p class="warning-text ${selectedDose !== 'Optimal' ? 'critical' : ''}">${pHWarning}</p>
        </div>

        <div class="output-product">
            <p class="step-title">Output Produk</p>
            <p>${outputDescription}</p>
            <div class="product-image">${outputImage}</div>
        </div>
    `;

    simulatorContainer.innerHTML = htmlContent;
    simulatorContainer.className = 'step-card';
}

// 3. Fungsi untuk Solidifikasi/Landfill (Solidification)
function renderSolidificationControl(processName, selectedMixStatus = 'PROCESSING') {
    let status = selectedMixStatus;
    let warning = '';
    let outputImage = '[Gambar: Blok solidifikasi padat yang siap ditimbun]'; 
    let description = 'Limbah terkontaminasi telah diikat secara permanen dalam matriks semen yang padat (solidifikasi).';
    let processTitle = 'SOLIDIFIKASI & LANDFILL AMAN';


    if (status === 'IDLE') {
        warning = 'Pencampuran kurang homogen. Risiko logam berat larut ke air tanah masih tinggi.';
    } else if (status === 'PROCESSING') {
        warning = 'Pencampuran optimal. Kontaminan terikat kuat dalam matriks semen yang stabil.';
    } else if (status === 'OVERHEAT') {
        warning = 'Semen terlalu banyak/terlalu cepat mengeras. Terdapat retakan internal yang dapat menyebabkan kebocoran kontaminan.';
    }

    
    // HTML Kontrol Solidifikasi
    const htmlContent = `
        <div class="step-title">${processTitle}</div>
        <p>TEKANAN: 552 kPa | STATUS: **${status}**</p>
        
        <div class="visualizer-sintering ${status.toLowerCase()}">
            <!-- Visualisasi Proses Solidifikasi (Menggunakan CSS Sintering untuk efek visual) -->
        </div>

        <div class="sintering-control">
            <p class="step-title">KONTROL PENCAMPURAN & PENGUATAN</p>
            <p>Target: Homogenitas Maksimal</p>
            <p class="warning-text ${status !== 'PROCESSING' ? 'critical' : ''}">${warning}</p>
        </div>

        <div class="output-product">
            <p class="step-title">Output Produk</p>
            <p>${description}</p>
            <div class="product-image">${outputImage}</div>
        </div>
        
        <!-- Tombol untuk mengubah status simulasi -->
        <div class="dose-buttons" style="margin-top: 20px;">
            <button class="dose-btn" onclick="renderSolidificationControl('${processName}', 'IDLE')">IDLE (Kurang Campur)</button>
            <button class="dose-btn" onclick="renderSolidificationControl('${processName}', 'PROCESSING')">OPTIMAL (Homogen)</button>
            <button class="dose-btn" onclick="renderSolidificationControl('${processName}', 'OVERHEAT')">OVERHEAT (Retak)</button>
        </div>
    `;

    simulatorContainer.innerHTML = htmlContent;
    simulatorContainer.className = 'step-card';
}


// --- FUNGSI UTAMA runSimulator() ---

function runSimulator(process, tempRange) {

    if (process === 'BrickSintering' || process === 'GeopolymerSintering') {
        renderSinteringControl(process, 'PROCESSING'); 
    } else if (process === 'LithiumLeaching' || process === 'REEExtraction' || process === 'SoilAmendment') {
        renderAcidDoseControl(process, 'Optimal'); 
    } else if (process === 'Solidification') {
        renderSolidificationControl(process, 'PROCESSING'); 
    } else {
        simulatorContainer.innerHTML = `<p>Simulasi proses ${process} tidak dikenali atau belum diimplementasikan.</p>`;
        simulatorContainer.className = 'step-card';
    }
}

// Inisialisasi aplikasi saat halaman dimuat
document.addEventListener('DOMContentLoaded', () => {
    renderStep('step1');
});

