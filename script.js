// Fungsi untuk mengecek waktu sebelum menjalankan konversi
function checkTimeAndConvert() {
    const currentTime = new Date();
    const currentHour = currentTime.getHours();

    // Jika waktu berada di luar jam 22:00 - 05:00, tampilkan alert dan nonaktifkan tombol download
    if (currentHour < 22 && currentHour >= 5) {
        alert("Aplikasi ini hanya bisa digunakan antara jam 22:00 sampai 05:00.");
        document.getElementById('vcfOutput').value = '';  // Hapus hasil konversi
        document.getElementById('downloadButton').disabled = true;  // Disable tombol download
        return;
    } else {
        convertTxtToVcf();  // Jalankan fungsi konversi jika waktu sesuai
    }
}

// Fungsi untuk menampilkan hasil konversi TXT ke VCF
function convertTxtToVcf() {
    const fileInput = document.getElementById('txtFile');
    const vcfOutput = document.getElementById('vcfOutput');

    if (fileInput.files.length === 0) {
        alert('Pilih file TXT terlebih dahulu!');
        return;
    }

    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = function(event) {
        const text = event.target.result;
        const numbers = text.split(/\r?\n/); // Pisahkan nomor berdasarkan baris
        let vcfDisplay = '';

        numbers.forEach((number) => {
            if (number.trim() !== '') {  // Abaikan baris kosong
                vcfDisplay += `${number.trim()}\n`;
            }
        });

        vcfOutput.value = vcfDisplay; // Tampilkan nomor telepon di textarea
        document.getElementById('downloadButton').disabled = false;  // Aktifkan tombol download
    };

    reader.readAsText(file);
}

// Fungsi untuk mengunduh file VCF dengan nama kontak
function downloadVCF() {
    const vcfOutput = document.getElementById('vcfOutput').value;
    const numbers = vcfOutput.split(/\r?\n/); // Dapatkan nomor telepon dari textarea
    const baseContactNameInput = document.getElementById('baseContactName').value || 'Contact';
    const vcfFileName = document.getElementById('vcfFileName').value || 'contacts'; // Nama file default jika kosong

    if (vcfOutput.trim() === '') {
        alert('Tidak ada konten VCF untuk diunduh!');
        return;
    }

    let vcfContent = '';
    numbers.forEach((number, index) => {
        if (number.trim() !== '') {  // Abaikan baris kosong
            const contactName = `${baseContactNameInput} ${index + 1}`;
            vcfContent += `BEGIN:VCARD\nVERSION:3.0\nFN:${contactName}\nTEL:${number.trim()}\nEND:VCARD\n\n`;
        }
    });

    // Buat dan unduh file VCF
    const blob = new Blob([vcfContent], { type: 'text/vcard' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${vcfFileName}.vcf`;
    link.click();
}