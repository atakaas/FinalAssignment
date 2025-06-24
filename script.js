function hitungTotal() {
  const nama = document.getElementById("namaPelanggan").value.trim();
  if (!nama) return alert("Masukkan nama pelanggan dulu!");

  const daftarMobil = document.querySelectorAll(".mobil");
  let total = 0;
  let ringkasanHTML = `<h3>Ringkasan untuk ${nama}:</h3>`;
  let dataSewa = [];

  daftarMobil.forEach(mobil => {
    const checkbox = mobil.querySelector("input[type='checkbox']");
    if (checkbox.checked) {
      const harga = parseInt(checkbox.dataset.harga);
      const namaMobil = mobil.querySelector("h3").textContent;
      const tanggal = mobil.querySelector(".tanggal-sewa").value;
      const durasi = parseInt(mobil.querySelector(".durasi-sewa").value);

      if (!tanggal || !durasi || durasi < 1) return alert(`Lengkapi tanggal dan durasi untuk ${namaMobil}`);

      const subtotal = harga * durasi;
      total += subtotal;

      ringkasanHTML += `<p>${namaMobil} - ${durasi} hari = Rp ${subtotal.toLocaleString()}</p>`;
      dataSewa.push({ namaMobil, tanggal, durasi, subtotal });
    }
  });

  ringkasanHTML += `<h4>Total: Rp ${total.toLocaleString()}</h4>`;
  document.getElementById("ringkasan").innerHTML = ringkasanHTML;

  sessionStorage.setItem("sewaSementara", JSON.stringify({ nama, dataSewa, total }));
}

function simpanPemesanan() {
  const data = JSON.parse(sessionStorage.getItem("sewaSementara"));
  if (!data) return alert("Silakan hitung total terlebih dahulu.");

  const semua = JSON.parse(localStorage.getItem("pemesanan")) || [];
  const waktu = new Date().toLocaleString();
  semua.push({ ...data, waktu });
  localStorage.setItem("pemesanan", JSON.stringify(semua));

  alert("Pemesanan berhasil disimpan!");
  tampilkanPemesanan();
}

function tampilkanPemesanan() {
  const daftar = JSON.parse(localStorage.getItem("pemesanan")) || [];
  const container = document.getElementById("daftarPemesanan");
  container.innerHTML = "";

  daftar.forEach((item, index) => {
    const div = document.createElement("div");
    div.innerHTML = `
      <p><strong>${item.nama}</strong> - ${item.waktu}</p>
      <ul>
        ${item.dataSewa.map(m => `<li>${m.namaMobil} - ${m.durasi} hari - Rp ${m.subtotal.toLocaleString()}</li>`).join("")}
      </ul>
      <p><strong>Total:</strong> Rp ${item.total.toLocaleString()}</p>
      <button onclick="hapusPemesanan(${index})">Hapus</button>
    `;
    container.appendChild(div);
  });
}

function hapusPemesanan(index) {
  let daftar = JSON.parse(localStorage.getItem("pemesanan")) || [];
  daftar.splice(index, 1);
  localStorage.setItem("pemesanan", JSON.stringify(daftar));
  
    alert("Pemesanan berhasil dihapus!");
  tampilkanPemesanan();
}

window.onload = tampilkanPemesanan;
