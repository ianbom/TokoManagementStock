# Product Requirements Document (PRD)
# TokoStockManagement

**Versi:** 1.0  
**Status:** Draft MVP  
**Jenis Produk:** Website mobile-friendly  
**Tujuan:** Prototype lomba  
**Target Pengguna:** Admin, Supplier, dan Toko  

---

## 1. Ringkasan Produk

TokoStockManagement adalah website manajemen stok yang membantu toko dan supplier mencatat barang masuk, melakukan transaksi barang keluar melalui sistem POS sederhana, melihat persediaan, membeli produk dari supplier, memindahkan stok secara otomatis antar-usaha, melihat riwayat pergerakan barang, dan berkomunikasi melalui fitur obrolan.

Sistem memiliki tiga role utama:

1. **Admin**
2. **Supplier**
3. **Toko**

Admin hanya digunakan untuk memantau aktivitas sistem. Supplier dan toko memiliki fitur operasional yang hampir sama. Perbedaan utamanya adalah supplier dapat menjual produknya kepada toko atau supplier lain melalui halaman katalog supplier.

Website tidak menggunakan payment gateway. Setiap transaksi pembelian antar-usaha langsung dianggap berhasil setelah dikonfirmasi dan stok penjual serta pembeli langsung diperbarui.

Karena produk dibuat untuk prototype lomba, fokus utama sistem adalah demonstrasi alur bisnis yang jelas, tampilan mobile-friendly, proses stok yang konsisten, dan interaksi antarpengguna yang mudah dipahami.

---

## 2. Latar Belakang Masalah

Banyak toko kecil dan supplier masih melakukan pencatatan stok secara manual melalui buku, catatan telepon, aplikasi pesan, atau spreadsheet sederhana. Kondisi ini menimbulkan beberapa masalah:

- Pemilik usaha tidak mengetahui jumlah stok secara akurat.
- Barang masuk dan keluar sering tidak tercatat.
- Penjualan kepada pelanggan tidak otomatis mengurangi stok.
- Pembelian dari supplier dan pencatatan stok dilakukan secara terpisah.
- Riwayat pergerakan barang sulit dilacak.
- Toko kesulitan mencari supplier yang tersedia dalam satu sistem.
- Supplier sulit mengetahui produk apa yang telah dibeli toko.
- Komunikasi antara toko dan supplier tersebar di berbagai aplikasi.
- Admin atau pengelola platform tidak memiliki visibilitas terhadap aktivitas usaha.

TokoStockManagement menyelesaikan masalah tersebut dengan menyediakan satu platform terintegrasi untuk mengelola stok, transaksi POS, pembelian dari supplier, riwayat barang, dan komunikasi antar-usaha.

---

## 3. Tujuan Produk

### 3.1 Tujuan Utama

Membuat prototype website manajemen stok yang memungkinkan toko dan supplier mengelola persediaan dan melakukan transaksi antar-usaha dalam satu sistem.

### 3.2 Tujuan Khusus

- Mempermudah input barang masuk.
- Mempermudah penjualan barang melalui sistem POS.
- Mengurangi stok secara otomatis setelah transaksi.
- Menampilkan persediaan barang secara real-time.
- Memungkinkan toko membeli produk dari supplier.
- Memungkinkan supplier membeli produk dari supplier lain.
- Memindahkan stok penjual dan pembeli secara otomatis.
- Menyimpan riwayat setiap perubahan stok.
- Menyediakan fitur pencarian toko dan supplier.
- Menyediakan fitur chat antar-usaha.
- Memberikan dashboard monitoring kepada admin.
- Menyediakan antarmuka yang nyaman digunakan melalui perangkat mobile.

---

## 4. Batasan Produk

Produk ini ditujukan sebagai MVP dan prototype lomba, bukan sebagai aplikasi produksi penuh.

### 4.1 Termasuk dalam MVP

- Registrasi dan login.
- Role admin, supplier, dan toko.
- Profil bisnis sederhana.
- Dashboard.
- Input produk manual.
- Barang masuk.
- Persediaan barang.
- Pencarian produk.
- POS sederhana.
- Pengurangan stok otomatis.
- Daftar supplier.
- Detail supplier.
- Pembelian produk dari supplier.
- Pemindahan stok otomatis.
- Riwayat barang masuk dan keluar.
- Riwayat penjualan POS.
- Riwayat pembelian dan penjualan antar-usaha.
- Obrolan antar-toko dan supplier.
- Monitoring admin.
- Tampilan responsif dan mobile-friendly.

### 4.2 Tidak Termasuk dalam MVP

- Payment gateway.
- Integrasi rekening bank.
- Integrasi QRIS nyata.
- Sistem pengiriman atau kurir.
- Pelacakan pengiriman.
- Multi-gudang.
- Multi-cabang.
- Retur kompleks.
- Pajak dan invoice resmi.
- Laporan akuntansi lengkap.
- Integrasi perangkat kasir.
- Scanner barcode perangkat keras.
- Pengenalan produk dengan AI.
- Stok berdasarkan batch.
- Tanggal kedaluwarsa.
- Sistem hutang atau tempo.
- Banyak pegawai dalam satu toko.
- Sistem approval transaksi.
- Chat dengan file, voice note, atau panggilan.
- Notifikasi push.
- Sistem penilaian supplier.
- Verifikasi bisnis tingkat lanjut.

---

## 5. Istilah yang Digunakan

| Istilah | Penjelasan |
|---|---|
| Business | Entitas usaha berupa toko atau supplier |
| Toko | Pengguna yang mengelola stok dan menjual barang kepada pelanggan |
| Supplier | Pengguna yang mengelola stok dan dapat menjual kepada toko atau supplier lain |
| POS | Sistem transaksi barang keluar kepada pelanggan |
| Barang Masuk | Penambahan stok secara manual atau dari pembelian supplier |
| Barang Keluar | Pengurangan stok karena POS atau penjualan antar-usaha |
| Business Order | Transaksi pembelian antara toko/supplier dengan supplier |
| Stock Movement | Riwayat setiap perubahan stok |
| Produk Penjual | Produk yang dimiliki supplier sebelum transaksi |
| Produk Pembeli | Produk milik toko/supplier yang menerima stok hasil pembelian |
| Pelanggan | Pembeli umum pada transaksi POS yang tidak memiliki akun dalam sistem |

---

## 6. Target Pengguna

### 6.1 Admin

Admin adalah pengelola platform yang memantau seluruh aktivitas sistem.

Karakteristik:

- Tidak memiliki bisnis.
- Tidak memiliki stok.
- Tidak melakukan transaksi.
- Tidak menggunakan POS.
- Tidak membeli produk.
- Tidak melakukan chat sebagai toko atau supplier.
- Memiliki akses baca terhadap data sistem.

### 6.2 Toko

Toko adalah usaha yang mengelola persediaan dan menjual produk kepada pelanggan.

Karakteristik:

- Memiliki satu akun.
- Memiliki satu profil bisnis.
- Dapat menambahkan produk.
- Dapat melakukan barang masuk.
- Dapat menjual melalui POS.
- Dapat membeli dari supplier.
- Dapat melihat stok dan riwayat.
- Dapat chat dengan toko dan supplier lain.
- Tidak dapat menjual melalui katalog antar-usaha.

### 6.3 Supplier

Supplier adalah usaha yang memasok barang kepada toko atau supplier lain.

Karakteristik:

- Memiliki satu akun.
- Memiliki satu profil bisnis.
- Dapat menambahkan produk.
- Dapat melakukan barang masuk.
- Dapat menjual melalui POS kepada pelanggan.
- Dapat menjual kepada toko atau supplier lain.
- Dapat membeli dari supplier lain.
- Seluruh produknya dapat dilihat sebagai produk yang dijual.
- Dapat melihat riwayat siapa yang membeli produknya.
- Dapat chat dengan toko dan supplier lain.

---

## 7. Role dan Hak Akses

| Fitur | Admin | Toko | Supplier |
|---|:---:|:---:|:---:|
| Login | Ya | Ya | Ya |
| Registrasi | Tidak | Ya | Ya |
| Melihat dashboard sendiri | Ya | Ya | Ya |
| Mengelola profil bisnis | Tidak | Ya | Ya |
| Menambah produk | Tidak | Ya | Ya |
| Mengubah produk | Tidak | Ya | Ya |
| Menghapus produk | Tidak | Ya | Ya |
| Menambah stok manual | Tidak | Ya | Ya |
| Melihat persediaan | Semua data | Milik sendiri | Milik sendiri |
| Melakukan POS | Tidak | Ya | Ya |
| Membeli dari supplier | Tidak | Ya | Ya |
| Menjual ke toko/supplier lain | Tidak | Tidak | Ya |
| Melihat daftar supplier | Ya | Ya | Ya |
| Melihat detail supplier | Ya | Ya | Ya |
| Melihat riwayat stok | Semua data | Milik sendiri | Milik sendiri |
| Chat antar-usaha | Tidak | Ya | Ya |
| Monitoring pengguna | Ya | Tidak | Tidak |
| Monitoring transaksi | Ya | Tidak | Tidak |

---

## 8. Alur Utama Produk

### 8.1 Alur Registrasi Toko

1. Pengguna membuka halaman registrasi.
2. Pengguna memilih role `Toko`.
3. Pengguna mengisi data akun:
   - Nama pengguna.
   - Email.
   - Password.
   - Konfirmasi password.
4. Pengguna mengisi data bisnis:
   - Nama toko.
   - Nama pemilik.
   - Alamat.
5. Sistem membuat akun user dengan role `store`.
6. Sistem membuat business dengan business type `store`.
7. Sistem menghubungkan user dengan business.
8. Pengguna diarahkan ke dashboard toko.

### 8.2 Alur Registrasi Supplier

1. Pengguna membuka halaman registrasi.
2. Pengguna memilih role `Supplier`.
3. Pengguna mengisi data akun.
4. Pengguna mengisi data bisnis.
5. Sistem membuat akun dengan role `supplier`.
6. Sistem membuat business dengan business type `supplier`.
7. Pengguna diarahkan ke dashboard supplier.

### 8.3 Alur Input Barang Masuk

1. Toko atau supplier membuka menu `Barang Masuk`.
2. Pengguna memilih:
   - Tambah produk baru; atau
   - Tambah stok produk yang sudah ada.
3. Pengguna mengisi:
   - Foto produk.
   - Nama produk.
   - Jumlah masuk.
   - Harga beli.
   - Harga jual.
4. Sistem memvalidasi data.
5. Jika produk baru:
   - Sistem membuat data produk.
   - Stok awal sama dengan jumlah masuk.
6. Jika produk sudah ada:
   - Sistem menambahkan stok produk.
7. Sistem menyimpan riwayat stock movement dengan tipe `stock_in`.
8. Sistem menampilkan notifikasi berhasil.

### 8.4 Alur Barang Keluar melalui POS

1. Pengguna membuka menu `POS`.
2. Sistem menampilkan produk milik business yang stoknya tersedia.
3. Pengguna mencari atau memilih produk.
4. Pengguna memasukkan jumlah produk ke keranjang.
5. Sistem menghitung subtotal per produk.
6. Sistem menghitung total transaksi.
7. Pengguna mengisi nama pelanggan secara opsional.
8. Pengguna menekan `Selesaikan Transaksi`.
9. Sistem memeriksa stok seluruh produk.
10. Sistem membuat transaksi penjualan.
11. Sistem membuat detail item penjualan.
12. Sistem mengurangi stok setiap produk.
13. Sistem membuat stock movement `stock_out`.
14. Sistem mengubah status transaksi menjadi `completed`.
15. Sistem menampilkan ringkasan transaksi.

### 8.5 Alur Toko Membeli dari Supplier

1. Toko membuka halaman `Supplier`.
2. Sistem menampilkan daftar business dengan tipe supplier.
3. Toko memilih salah satu supplier.
4. Sistem menampilkan seluruh produk supplier yang memiliki stok.
5. Toko memilih produk dan jumlah pembelian.
6. Produk dimasukkan ke keranjang.
7. Toko menekan `Beli Sekarang`.
8. Sistem memeriksa stok supplier.
9. Sistem membuat business order.
10. Sistem membuat business order items.
11. Sistem mengurangi stok produk supplier.
12. Sistem mencari produk yang sama pada toko.
13. Jika produk sudah ada, stok toko ditambah.
14. Jika produk belum ada, sistem membuat produk baru pada toko.
15. Harga beli toko menggunakan harga jual supplier saat transaksi.
16. Sistem membuat dua stock movement:
    - Supplier: `stock_out`, sumber `business_sale`.
    - Toko: `stock_in`, sumber `business_purchase`.
17. Sistem mengubah order menjadi `completed`.
18. Toko dan supplier dapat melihat riwayat transaksi.

### 8.6 Alur Supplier Membeli dari Supplier Lain

Alurnya sama dengan toko membeli dari supplier. Perbedaannya hanya pembeli memiliki business type `supplier`.

### 8.7 Alur Chat

1. Pengguna membuka menu `Obrolan`.
2. Sistem menampilkan daftar percakapan.
3. Pengguna menekan tombol cari.
4. Pengguna mencari berdasarkan nama bisnis.
5. Sistem menampilkan toko dan supplier yang sesuai.
6. Pengguna memilih business tujuan.
7. Sistem mencari conversation yang sudah ada.
8. Jika belum ada, sistem membuat conversation baru.
9. Pengguna mengirim pesan.
10. Sistem menyimpan pesan.
11. Sistem memperbarui `last_message_at`.
12. Ketika penerima membuka pesan, sistem mengisi `read_at`.

---

## 9. Kebutuhan Fungsional

## 9.1 Autentikasi

### FR-AUTH-001 — Login

Sistem harus menyediakan login menggunakan:

- Email.
- Password.

Validasi:

- Email wajib diisi.
- Password wajib diisi.
- Email harus terdaftar.
- Password harus sesuai.
- Akun yang dihapus tidak dapat login.

Hasil:

- Admin diarahkan ke dashboard admin.
- Toko diarahkan ke dashboard toko.
- Supplier diarahkan ke dashboard supplier.

### FR-AUTH-002 — Registrasi

Registrasi hanya tersedia untuk toko dan supplier.

Data wajib:

- Role.
- Nama pengguna.
- Email.
- Password.
- Konfirmasi password.
- Nama bisnis.
- Nama pemilik.
- Alamat.

Validasi:

- Email harus unik.
- Password dan konfirmasi harus sama.
- Role hanya boleh `store` atau `supplier`.
- Nama bisnis wajib diisi.
- Nama pemilik wajib diisi.
- Alamat wajib diisi.

### FR-AUTH-003 — Logout

Pengguna dapat keluar dari sistem dan sesi harus dihapus.

---

## 9.2 Profil Bisnis

### FR-BUS-001 — Melihat Profil

Toko dan supplier dapat melihat:

- Kode bisnis.
- Nama bisnis.
- Jenis bisnis.
- Nama pemilik.
- Alamat.

### FR-BUS-002 — Mengubah Profil

Pengguna dapat mengubah:

- Nama bisnis.
- Nama pemilik.
- Alamat.

Pengguna tidak dapat mengubah:

- Kode bisnis.
- Jenis bisnis secara langsung.

### FR-BUS-003 — Pembuatan Kode Bisnis

Sistem harus membuat kode otomatis.

Contoh:

- Toko: `TOKO-0001`
- Supplier: `SUP-0001`

Kode harus unik.

---

## 9.3 Dashboard Toko dan Supplier

### FR-DASH-001 — Ringkasan Persediaan

Dashboard harus menampilkan:

- Total jenis produk.
- Total jumlah stok.
- Jumlah produk dengan stok habis.
- Jumlah produk dengan stok rendah.
- Jumlah barang masuk hari ini.
- Jumlah barang keluar hari ini.

### FR-DASH-002 — Ringkasan Transaksi

Dashboard harus menampilkan:

- Total transaksi POS hari ini.
- Total nilai penjualan POS hari ini.
- Total pembelian dari supplier.
- Transaksi terbaru.
- Riwayat stok terbaru.

### FR-DASH-003 — Akses Cepat

Dashboard harus menyediakan tombol:

- Tambah barang masuk.
- Buka POS.
- Lihat persediaan.
- Cari supplier.
- Lihat riwayat.
- Buka obrolan.

### FR-DASH-004 — Dashboard Supplier

Supplier juga harus melihat:

- Jumlah transaksi dibeli toko.
- Jumlah transaksi dibeli supplier lain.
- Produk yang paling sering dibeli.
- Pesanan antar-usaha terbaru.

---

## 9.4 Input Barang Masuk

### FR-IN-001 — Tambah Produk Baru

Form produk baru berisi:

- Foto produk.
- Nama produk.
- Jumlah masuk.
- Harga beli.
- Harga jual.

Validasi:

- Nama wajib diisi.
- Jumlah masuk minimal 1.
- Harga beli tidak boleh negatif.
- Harga jual tidak boleh negatif.
- Foto bersifat opsional.
- Produk hanya boleh dibuat untuk business pengguna yang login.

### FR-IN-002 — Tambah Stok Produk yang Sudah Ada

Pengguna dapat memilih produk yang sudah ada dan memasukkan:

- Jumlah masuk.
- Harga beli terbaru.
- Harga jual terbaru atau tetap.

Sistem harus:

- Menyimpan stok sebelum perubahan.
- Menambahkan jumlah masuk ke stok.
- Menyimpan stok setelah perubahan.
- Membuat stock movement.

### FR-IN-003 — Riwayat Barang Masuk Manual

Setiap input manual harus menghasilkan data stock movement:

- `movement_type = stock_in`
- `source = manual_input`
- Jumlah.
- Stok sebelum.
- Stok sesudah.
- Pengguna.
- Waktu.
- Deskripsi.

---

## 9.5 Produk dan Persediaan

### FR-PROD-001 — Daftar Produk

Halaman persediaan harus menampilkan:

- Foto.
- Nama produk.
- Stok.
- Harga beli.
- Harga jual.
- Nilai stok.
- Status stok.

Nilai stok:

`stock × purchase_price`

### FR-PROD-002 — Pencarian Produk

Pengguna dapat mencari berdasarkan nama produk.

Pencarian harus:

- Tidak case-sensitive.
- Menampilkan hasil sesuai business pengguna.
- Tidak menampilkan produk yang sudah dihapus.

### FR-PROD-003 — Filter Produk

Filter minimum:

- Semua produk.
- Stok tersedia.
- Stok habis.
- Stok rendah.

Untuk MVP, stok rendah dapat menggunakan batas tetap, misalnya stok kurang dari atau sama dengan 5.

### FR-PROD-004 — Detail Produk

Detail produk harus menampilkan:

- Foto.
- Nama.
- Stok.
- Harga beli.
- Harga jual.
- Nilai stok.
- Riwayat pergerakan stok.
- Tanggal dibuat.
- Tanggal terakhir diperbarui.

### FR-PROD-005 — Edit Produk

Pengguna dapat mengubah:

- Nama.
- Harga beli.
- Harga jual.
- Foto.

Stok tidak boleh diubah langsung melalui edit produk. Perubahan stok harus dilakukan melalui barang masuk, POS, pembelian supplier, atau mekanisme penyesuaian stok jika ditambahkan.

### FR-PROD-006 — Hapus Produk

Produk dapat dihapus secara soft delete.

Ketentuan:

- Produk dengan transaksi lama tetap dapat muncul dalam riwayat.
- Produk yang dihapus tidak muncul pada persediaan aktif.
- Produk yang dihapus tidak dapat digunakan di POS.
- Produk supplier yang dihapus tidak muncul pada halaman supplier.

### FR-PROD-007 — Produk Unik per Business

Untuk MVP, satu business sebaiknya tidak memiliki dua produk aktif dengan nama yang sama.

Pencocokan produk saat pembelian antar-usaha dapat berdasarkan kombinasi:

- `business_id`
- `name`

---

## 9.6 POS dan Barang Keluar

### FR-POS-001 — Daftar Produk POS

POS harus menampilkan produk:

- Milik business pengguna.
- Belum dihapus.
- Stok lebih dari 0.

### FR-POS-002 — Keranjang POS

Pengguna dapat:

- Menambah produk.
- Mengurangi jumlah.
- Menghapus produk dari keranjang.
- Mengubah kuantitas.
- Melihat subtotal.
- Melihat total.

Aturan:

- Satu produk hanya muncul satu kali di keranjang.
- Menambah produk yang sama harus menambah kuantitas.
- Kuantitas tidak boleh melebihi stok.

### FR-POS-003 — Checkout POS

Data transaksi:

- Nomor invoice.
- Business.
- User.
- Nama pelanggan opsional.
- Total.
- Catatan opsional.
- Status.
- Waktu selesai.

### FR-POS-004 — Detail Item Penjualan

Setiap item harus menyimpan snapshot:

- Product ID.
- Nama produk.
- Kuantitas.
- Harga saat transaksi.
- Subtotal.

Snapshot diperlukan agar transaksi lama tidak berubah ketika produk diedit.

### FR-POS-005 — Pengurangan Stok

Saat transaksi selesai:

- Stok setiap produk dikurangi.
- Stok tidak boleh menjadi negatif.
- Setiap pengurangan menghasilkan stock movement.
- Status transaksi menjadi `completed`.

### FR-POS-006 — Pembatalan

Untuk MVP:

- Transaksi yang masih `pending` dapat dibatalkan.
- Transaksi `completed` tidak perlu memiliki fitur refund otomatis.
- Jika transaksi gagal sebelum selesai, seluruh proses harus rollback.
- Status dapat menjadi `cancelled`.

### FR-POS-007 — Nomor Invoice

Nomor invoice harus unik.

Contoh:

`POS-20260724-0001`

---

## 9.7 Daftar Supplier

### FR-SUP-001 — Menampilkan Supplier

Sistem harus menampilkan seluruh business dengan:

- `business_type = supplier`
- Belum dihapus.
- Bukan business pengguna sendiri.

Informasi yang ditampilkan:

- Nama supplier.
- Kode supplier.
- Nama pemilik.
- Alamat.
- Jumlah produk tersedia.

### FR-SUP-002 — Pencarian Supplier

Pengguna dapat mencari supplier berdasarkan:

- Nama supplier.
- Kode supplier.
- Nama pemilik.
- Alamat.

### FR-SUP-003 — Detail Supplier

Halaman detail supplier harus menampilkan:

- Nama supplier.
- Kode.
- Nama pemilik.
- Alamat.
- Tombol chat.
- Daftar seluruh produk yang stoknya lebih dari 0.

### FR-SUP-004 — Produk Supplier

Produk supplier menampilkan:

- Foto.
- Nama.
- Stok tersedia.
- Harga jual.
- Input jumlah.
- Tombol tambah ke keranjang.

Karena tidak ada tabel katalog supplier, seluruh produk aktif supplier yang memiliki stok dianggap dapat dijual.

---

## 9.8 Pembelian Antar-Usaha

### FR-ORD-001 — Pembeli yang Diizinkan

Pembeli dapat berupa:

- Toko.
- Supplier.

Penjual wajib berupa:

- Supplier.

Toko tidak dapat menjadi penjual dalam business order.

### FR-ORD-002 — Keranjang Pembelian

Pengguna dapat:

- Memilih produk supplier.
- Menentukan kuantitas.
- Mengubah kuantitas.
- Menghapus produk.
- Melihat subtotal.
- Melihat total.

Aturan:

- Semua item dalam satu order harus berasal dari supplier yang sama.
- Kuantitas tidak boleh melebihi stok supplier.
- Supplier tidak dapat membeli dari dirinya sendiri.

### FR-ORD-003 — Membuat Business Order

Data order:

- Buyer business.
- Seller business.
- User pembuat.
- Nomor order.
- Total.
- Status.
- Catatan.
- Waktu selesai atau batal.

### FR-ORD-004 — Detail Business Order

Setiap item harus menyimpan:

- Business order ID.
- Produk supplier.
- Produk pembeli.
- Nama produk snapshot.
- Kuantitas.
- Harga.
- Subtotal.

### FR-ORD-005 — Pengurangan Stok Penjual

Saat order selesai:

- Sistem mengunci produk supplier.
- Sistem memvalidasi stok.
- Sistem mengurangi stok supplier.
- Sistem membuat stock movement `stock_out`.
- Sumber movement adalah `business_sale`.

### FR-ORD-006 — Penambahan Stok Pembeli

Sistem mencari produk pembeli berdasarkan nama produk dan business.

Jika produk ditemukan:

- Stok ditambah.
- Harga beli diperbarui menggunakan harga supplier.
- Harga jual pembeli tetap menggunakan nilai yang sudah ada.

Jika produk tidak ditemukan:

- Sistem membuat produk baru.
- Nama dan gambar disalin dari produk supplier.
- Stock sama dengan jumlah pembelian.
- Purchase price sama dengan harga jual supplier.
- Selling price sementara dapat sama dengan purchase price.
- Pengguna dapat mengubah selling price kemudian.

### FR-ORD-007 — Stock Movement Pembeli

Setiap produk yang diterima harus menghasilkan:

- `movement_type = stock_in`
- `source = business_purchase`
- Jumlah.
- Stok sebelum.
- Stok sesudah.
- Order terkait.
- Deskripsi supplier asal.

### FR-ORD-008 — Penyelesaian Otomatis

Karena tidak ada payment gateway dan pengiriman, order dapat langsung menjadi `completed` setelah stok berhasil dipindahkan.

### FR-ORD-009 — Transaksi Atomik

Seluruh proses wajib dijalankan dalam satu database transaction:

1. Memvalidasi supplier.
2. Memvalidasi pembeli.
3. Memvalidasi stok.
4. Membuat order.
5. Membuat item.
6. Mengurangi stok supplier.
7. Menambah stok pembeli.
8. Membuat stock movements.
9. Menyelesaikan order.

Jika satu langkah gagal, seluruh perubahan harus dibatalkan.

### FR-ORD-010 — Riwayat Penjual dan Pembeli

Supplier harus melihat:

- Nama pembeli.
- Produk.
- Jumlah.
- Total.
- Waktu.
- Status.
- Jenis pembeli: toko atau supplier.

Pembeli harus melihat:

- Nama supplier.
- Produk.
- Jumlah.
- Total.
- Waktu.
- Status.

### FR-ORD-011 — Nomor Order

Nomor order harus unik.

Contoh:

`ORD-20260724-0001`

---

## 9.9 Riwayat Stok

### FR-STOCK-001 — Semua Perubahan Wajib Dicatat

Perubahan stok yang wajib membuat stock movement:

- Barang masuk manual.
- Penjualan POS.
- Pembelian dari supplier.
- Penjualan supplier ke toko.
- Penjualan supplier ke supplier lain.

### FR-STOCK-002 — Data Stock Movement

Setiap movement menyimpan:

- Business.
- Produk.
- User.
- Sale terkait jika ada.
- Business order terkait jika ada.
- Jenis movement.
- Sumber movement.
- Kuantitas.
- Stok sebelum.
- Stok sesudah.
- Deskripsi.
- Waktu.

### FR-STOCK-003 — Halaman Riwayat

Halaman riwayat harus menampilkan:

- Tanggal.
- Nama produk.
- Jenis masuk atau keluar.
- Sumber.
- Jumlah.
- Stok sebelum.
- Stok setelah.
- Deskripsi.

### FR-STOCK-004 — Filter Riwayat

Filter minimum:

- Semua.
- Barang masuk.
- Barang keluar.
- Manual input.
- POS.
- Pembelian supplier.
- Penjualan antar-usaha.
- Rentang tanggal.
- Nama produk.

### FR-STOCK-005 — Riwayat Tidak Dapat Diedit

Stock movement bersifat catatan audit dan tidak boleh diedit atau dihapus dari antarmuka pengguna.

---

## 9.10 Obrolan

### FR-CHAT-001 — Daftar Percakapan

Daftar percakapan menampilkan:

- Nama business lawan bicara.
- Jenis business.
- Pesan terakhir.
- Waktu pesan terakhir.
- Jumlah pesan belum dibaca.

Urutan berdasarkan `last_message_at` terbaru.

### FR-CHAT-002 — Mencari Business

Pengguna dapat mencari:

- Toko.
- Supplier.

Pencarian berdasarkan nama business.

Business pengguna sendiri tidak boleh muncul.

### FR-CHAT-003 — Satu Percakapan per Pasangan Business

Hanya boleh ada satu conversation untuk pasangan dua business.

Aturan penyimpanan:

- ID lebih kecil disimpan sebagai `business_one_id`.
- ID lebih besar disimpan sebagai `business_two_id`.

### FR-CHAT-004 — Mengirim Pesan

Pesan MVP hanya berupa teks.

Validasi:

- Pesan wajib diisi.
- Pesan tidak boleh hanya berisi spasi.
- Pengirim harus merupakan anggota dari conversation.
- Penerima harus business lain.

### FR-CHAT-005 — Status Dibaca

Saat penerima membuka conversation:

- Pesan dari lawan bicara yang `read_at` masih null diperbarui.
- `read_at` diisi waktu saat dibaca.

### FR-CHAT-006 — Membuka Chat dari Detail Supplier

Halaman detail supplier harus memiliki tombol `Chat Supplier`.

Jika conversation sudah ada, buka conversation tersebut.

Jika belum ada, buat conversation baru.

### FR-CHAT-007 — Penghapusan Pesan

Untuk MVP, pesan tidak perlu dapat dihapus dari antarmuka pengguna.

---

## 9.11 Dashboard Admin

### FR-ADMIN-001 — Ringkasan Sistem

Admin harus melihat:

- Total pengguna.
- Total toko.
- Total supplier.
- Total produk.
- Total transaksi POS.
- Total business order.
- Total barang masuk.
- Total barang keluar.
- Total nilai transaksi.

### FR-ADMIN-002 — Daftar Pengguna

Admin dapat melihat:

- Nama user.
- Email.
- Role.
- Nama business.
- Jenis business.
- Tanggal registrasi.

Admin hanya memiliki akses baca untuk MVP.

### FR-ADMIN-003 — Daftar Business

Admin dapat melihat:

- Kode.
- Nama.
- Jenis.
- Nama pemilik.
- Alamat.
- Total produk.
- Total stok.
- Total transaksi.

### FR-ADMIN-004 — Monitoring Produk

Admin dapat melihat produk seluruh business:

- Business pemilik.
- Nama produk.
- Stok.
- Harga beli.
- Harga jual.
- Tanggal pembaruan.

### FR-ADMIN-005 — Monitoring POS

Admin dapat melihat:

- Nomor invoice.
- Business.
- User.
- Pelanggan.
- Total.
- Status.
- Waktu.

### FR-ADMIN-006 — Monitoring Business Order

Admin dapat melihat:

- Nomor order.
- Pembeli.
- Penjual.
- Total.
- Status.
- Waktu.

### FR-ADMIN-007 — Monitoring Stock Movement

Admin dapat melihat seluruh perubahan stok dengan filter:

- Business.
- Produk.
- Jenis movement.
- Sumber.
- Tanggal.

### FR-ADMIN-008 — Batasan Admin

Admin tidak boleh:

- Mengubah stok.
- Membuat transaksi POS.
- Membeli produk.
- Menjual produk.
- Mengirim chat sebagai business.
- Mengubah transaksi.

---

## 10. Struktur Halaman

## 10.1 Halaman Umum

- Landing page.
- Login.
- Registrasi.
- Pilih role.
- Halaman tidak ditemukan.
- Halaman akses ditolak.

## 10.2 Halaman Toko

- Dashboard.
- Profil bisnis.
- Barang masuk.
- Persediaan.
- Detail produk.
- Edit produk.
- POS.
- Keranjang POS.
- Hasil transaksi POS.
- Daftar supplier.
- Detail supplier.
- Keranjang pembelian.
- Konfirmasi pembelian.
- Riwayat pembelian.
- Detail business order.
- Riwayat stok.
- Riwayat POS.
- Daftar obrolan.
- Detail obrolan.
- Pengaturan akun.

## 10.3 Halaman Supplier

- Dashboard.
- Profil bisnis.
- Barang masuk.
- Persediaan.
- Detail produk.
- Edit produk.
- POS.
- Daftar supplier.
- Detail supplier.
- Keranjang pembelian.
- Riwayat pembelian.
- Riwayat penjualan antar-usaha.
- Detail order masuk.
- Riwayat stok.
- Daftar obrolan.
- Detail obrolan.
- Pengaturan akun.

## 10.4 Halaman Admin

- Dashboard admin.
- Daftar user.
- Detail user.
- Daftar business.
- Detail business.
- Daftar produk.
- Daftar transaksi POS.
- Detail transaksi POS.
- Daftar business order.
- Detail business order.
- Daftar stock movement.

---

## 11. Navigasi Mobile

### 11.1 Navigasi Toko

Bottom navigation:

1. Beranda.
2. Stok.
3. POS.
4. Supplier.
5. Akun.

Akses obrolan dapat ditempatkan:

- Di header; atau
- Sebagai tombol mengambang.

### 11.2 Navigasi Supplier

Bottom navigation:

1. Beranda.
2. Stok.
3. POS.
4. Pesanan.
5. Akun.

Menu supplier lain dan chat dapat diakses dari dashboard atau header.

### 11.3 Navigasi Admin

Admin lebih cocok menggunakan:

- Sidebar pada desktop.
- Drawer menu pada mobile.

---

## 12. Detail UI dan UX

### 12.1 Prinsip Desain

- Mobile-first.
- Tombol besar dan mudah ditekan.
- Teks berbahasa Indonesia.
- Informasi stok mudah dibaca.
- Warna status konsisten.
- Proses transaksi maksimal beberapa langkah.
- Form sederhana.
- Tampilan kartu untuk mobile.
- Tabel responsif untuk desktop.

### 12.2 Status Stok

| Kondisi | Status |
|---|---|
| Stok > 5 | Tersedia |
| Stok 1–5 | Stok Menipis |
| Stok 0 | Habis |

### 12.3 Status Transaksi

| Status | Penjelasan |
|---|---|
| Pending | Transaksi sedang diproses |
| Completed | Transaksi berhasil |
| Cancelled | Transaksi dibatalkan |

### 12.4 Konfirmasi Aksi

Sistem harus meminta konfirmasi sebelum:

- Menyelesaikan POS.
- Membeli dari supplier.
- Menghapus produk.
- Membatalkan transaksi.

### 12.5 Feedback Pengguna

Sistem harus memberikan:

- Loading state.
- Empty state.
- Success message.
- Error message.
- Validation message.
- Skeleton atau indikator saat memuat data.

---

## 13. Aturan Bisnis

### BR-001

Admin tidak memiliki business.

### BR-002

Satu user hanya memiliki satu business.

### BR-003

Role user harus sesuai dengan business type.

- Role store → business type store.
- Role supplier → business type supplier.
- Role admin → business null.

### BR-004

Satu produk dimiliki oleh satu business.

### BR-005

Toko dan supplier hanya boleh mengelola produk milik business sendiri.

### BR-006

Penjual dalam business order wajib supplier.

### BR-007

Pembeli dalam business order boleh toko atau supplier.

### BR-008

Business tidak boleh membeli produknya sendiri.

### BR-009

Stok tidak boleh negatif.

### BR-010

Kuantitas transaksi minimal 1.

### BR-011

Harga tidak boleh negatif.

### BR-012

Transaksi POS dan business order harus menggunakan database transaction.

### BR-013

Setiap perubahan stok wajib membuat stock movement.

### BR-014

Stock movement tidak boleh diubah melalui UI.

### BR-015

Produk yang sudah digunakan dalam transaksi tidak boleh dihapus permanen.

### BR-016

Harga pada detail transaksi harus berupa snapshot saat transaksi.

### BR-017

Semua produk aktif supplier dengan stok lebih dari 0 dapat dibeli.

### BR-018

Satu keranjang business order hanya boleh berisi produk dari satu supplier.

### BR-019

Saat toko membeli produk yang belum dimiliki, sistem membuat produk baru.

### BR-020

Saat toko membeli produk yang sudah dimiliki, sistem menambahkan stok produk yang ada.

### BR-021

Untuk MVP, produk yang sama ditentukan berdasarkan nama pada business pembeli.

### BR-022

Saat harga supplier berubah setelah order, riwayat order lama tidak berubah.

### BR-023

Hanya business yang terlibat dalam conversation yang dapat membaca pesan.

### BR-024

Satu pasangan business hanya boleh memiliki satu conversation.

---

## 14. Validasi Utama

### 14.1 Produk

- Nama wajib.
- Nama maksimal 255 karakter.
- Stok integer.
- Stok minimal 0.
- Harga beli minimal 0.
- Harga jual minimal 0.
- Foto harus berupa gambar jika diunggah.
- Ukuran gambar dapat dibatasi, misalnya 2 MB.

### 14.2 POS

- Keranjang tidak boleh kosong.
- Setiap kuantitas minimal 1.
- Kuantitas tidak boleh melebihi stok.
- Product harus milik business pengguna.
- Product tidak boleh deleted.
- Total dihitung di backend.
- Harga diambil dari database, bukan dipercaya dari frontend.

### 14.3 Business Order

- Supplier wajib valid.
- Supplier tidak boleh sama dengan pembeli.
- Produk wajib milik supplier yang dipilih.
- Semua item berasal dari supplier yang sama.
- Kuantitas tidak boleh melebihi stok.
- Total dihitung di backend.
- Harga menggunakan selling price supplier.
- Penjual wajib business type supplier.

### 14.4 Chat

- Pesan tidak boleh kosong.
- Pengguna harus memiliki business.
- Lawan chat tidak boleh business sendiri.
- Pengguna harus termasuk dalam conversation.

---

## 15. Struktur Database MVP

### 15.1 users

Menyimpan akun dan role.

Kolom utama:

- id
- business_id
- name
- email
- password
- role
- timestamps
- deleted_at

### 15.2 businesses

Menyimpan data toko atau supplier.

Kolom utama:

- id
- code
- name
- business_type
- owner_name
- address
- timestamps
- deleted_at

### 15.3 products

Menyimpan produk dan stok per business.

Kolom utama:

- id
- business_id
- name
- stock
- purchase_price
- selling_price
- image
- timestamps
- deleted_at

### 15.4 sales

Menyimpan transaksi POS.

Kolom utama:

- id
- business_id
- user_id
- invoice_number
- total_amount
- status
- customer_name
- notes
- completed_at
- cancelled_at
- timestamps

### 15.5 sale_items

Menyimpan detail produk pada POS.

Kolom utama:

- id
- sale_id
- product_id
- product_name
- quantity
- price
- subtotal
- timestamps

### 15.6 business_orders

Menyimpan transaksi antar-usaha.

Kolom utama:

- id
- buyer_business_id
- seller_business_id
- created_by_user_id
- order_number
- total_amount
- status
- notes
- completed_at
- cancelled_at
- timestamps

### 15.7 business_order_items

Menyimpan detail item business order.

Kolom utama:

- id
- business_order_id
- seller_product_id
- buyer_product_id
- product_name
- quantity
- price
- subtotal
- timestamps

### 15.8 stock_movements

Menyimpan riwayat seluruh perubahan stok.

Kolom utama:

- id
- business_id
- product_id
- user_id
- sale_id
- business_order_id
- movement_type
- source
- quantity
- stock_before
- stock_after
- description
- created_at

### 15.9 conversations

Menyimpan ruang obrolan antar-business.

Kolom utama:

- id
- business_one_id
- business_two_id
- last_message_at
- timestamps
- deleted_at

### 15.10 messages

Menyimpan pesan.

Kolom utama:

- id
- conversation_id
- sender_business_id
- sender_user_id
- message
- read_at
- timestamps
- deleted_at

---

## 16. Kebutuhan Non-Fungsional

## 16.1 Responsivitas

- Website harus nyaman digunakan pada lebar layar 360 px.
- Semua halaman utama harus responsif.
- Tabel pada mobile harus berubah menjadi kartu atau dapat digulir horizontal.
- Tombol utama minimal nyaman disentuh.
- Form tidak boleh melebihi lebar layar.

## 16.2 Performa

Target MVP:

- Halaman utama terbuka dalam waktu wajar.
- Pencarian produk memberikan hasil tanpa reload penuh jika memungkinkan.
- Daftar produk menggunakan pagination.
- Gambar produk dikompresi.
- Query harus dibatasi berdasarkan business pengguna.

## 16.3 Keamanan

- Password disimpan dalam bentuk hash.
- Setiap route harus menggunakan autentikasi.
- Setiap aksi harus memvalidasi role.
- User tidak boleh mengakses produk business lain.
- User tidak boleh mengakses order business lain.
- User tidak boleh membaca conversation yang bukan miliknya.
- Total transaksi harus dihitung di backend.
- Stok harus diperiksa di backend.
- Input harus divalidasi.
- Gunakan CSRF protection.
- Gunakan database transaction untuk perubahan stok.
- Gunakan row lock saat checkout.

## 16.4 Konsistensi Data

- Stok pada products adalah sumber stok terkini.
- Stock movement adalah catatan audit.
- Stok setelah transaksi harus sama dengan hasil movement terakhir.
- Penjualan tidak boleh selesai tanpa movement.
- Business order tidak boleh selesai tanpa movement penjual dan pembeli.
- Harga item transaksi tidak boleh bergantung pada harga produk setelah transaksi.

## 16.5 Kemudahan Penggunaan

- Bahasa antarmuka menggunakan Bahasa Indonesia.
- Label form harus jelas.
- Error harus mudah dipahami.
- Empty state harus memberikan tombol aksi.
- Pengguna harus dapat menyelesaikan input barang masuk dalam satu halaman.
- Pengguna harus dapat menyelesaikan POS tanpa navigasi yang rumit.

## 16.6 Kompatibilitas

Minimal mendukung:

- Google Chrome desktop.
- Google Chrome Android.
- Microsoft Edge.
- Safari mobile sebagai target sekunder.

---

## 17. Acceptance Criteria

## 17.1 Registrasi

- Pengguna dapat mendaftar sebagai toko.
- Pengguna dapat mendaftar sebagai supplier.
- User dan business berhasil dibuat.
- Role dan business type sesuai.
- Email duplikat ditolak.
- Admin tidak dapat dibuat melalui registrasi umum.

## 17.2 Barang Masuk

- Pengguna dapat membuat produk baru.
- Stok produk baru sesuai jumlah masuk.
- Pengguna dapat menambah stok produk lama.
- Stock movement tercatat.
- Business lain tidak dapat melihat atau mengubah produk tersebut.

## 17.3 POS

- Produk tersedia dapat masuk keranjang.
- Produk habis tidak dapat dijual.
- Checkout mengurangi stok.
- Sale dan sale items tersimpan.
- Stock movement tersimpan.
- Stok tidak menjadi negatif.
- Jika salah satu item gagal, seluruh transaksi rollback.

## 17.4 Pembelian Supplier

- Toko dapat melihat daftar supplier.
- Toko dapat melihat produk supplier.
- Toko dapat membeli produk.
- Stok supplier berkurang.
- Stok toko bertambah.
- Produk toko dibuat jika belum ada.
- Business order tersimpan.
- Dua stock movement tersimpan.
- Supplier dapat melihat pembeli.
- Supplier dapat membeli dari supplier lain.
- Toko tidak dapat menjadi penjual dalam business order.

## 17.5 Persediaan

- Pengguna hanya melihat produk miliknya.
- Pencarian nama berjalan.
- Filter stok berjalan.
- Detail produk menampilkan riwayat.
- Produk deleted tidak muncul.

## 17.6 Chat

- Pengguna dapat mencari business lain.
- Pengguna dapat membuat conversation.
- Conversation yang sama tidak dibuat dua kali.
- Pengguna dapat mengirim pesan.
- Pesan muncul berurutan.
- Status read diperbarui.
- User lain yang tidak terkait tidak dapat membaca conversation.

## 17.7 Admin

- Admin dapat melihat total toko dan supplier.
- Admin dapat melihat transaksi POS.
- Admin dapat melihat business order.
- Admin dapat melihat stock movement.
- Admin tidak dapat mengubah stok atau transaksi.

---

## 18. Edge Cases

### 18.1 POS Bersamaan

Dua kasir mencoba membeli stok terakhir secara bersamaan.

Penanganan:

- Produk dikunci dengan row lock.
- Transaksi pertama yang berhasil mengurangi stok.
- Transaksi kedua menerima error stok tidak cukup.

### 18.2 Pembelian Supplier Bersamaan

Dua toko membeli produk supplier yang stoknya terbatas.

Penanganan:

- Lock produk supplier.
- Validasi ulang stok saat checkout.
- Salah satu transaksi gagal jika stok tidak mencukupi.

### 18.3 Produk Pembeli Sudah Ada

Sistem harus menambah stok produk lama, bukan membuat duplikat.

### 18.4 Produk Pembeli Belum Ada

Sistem membuat product baru dengan data yang disalin dari supplier.

### 18.5 Harga Berubah Saat Keranjang Dibuka

Harga akhir harus menggunakan harga terbaru yang divalidasi di backend saat checkout.

### 18.6 Produk Dihapus Saat Berada di Keranjang

Checkout harus gagal dan meminta pengguna memperbarui keranjang.

### 18.7 Supplier Membeli Produk Sendiri

Sistem harus menolak.

### 18.8 Produk Supplier Habis

Produk tidak dapat ditambahkan atau checkout ditolak.

### 18.9 Percakapan Dibuka dari Dua Arah

Sistem tetap menggunakan satu conversation yang sama.

### 18.10 Pesan Kosong

Sistem menolak pesan kosong atau hanya spasi.

---

## 19. API Endpoint Rekomendasi

Struktur endpoint dapat disesuaikan dengan framework.

### 19.1 Auth

- `POST /api/register`
- `POST /api/login`
- `POST /api/logout`
- `GET /api/me`

### 19.2 Business

- `GET /api/business`
- `PUT /api/business`
- `GET /api/suppliers`
- `GET /api/suppliers/{id}`

### 19.3 Products

- `GET /api/products`
- `POST /api/products`
- `GET /api/products/{id}`
- `PUT /api/products/{id}`
- `DELETE /api/products/{id}`
- `POST /api/products/{id}/stock-in`

### 19.4 POS

- `GET /api/sales`
- `POST /api/sales`
- `GET /api/sales/{id}`
- `POST /api/sales/{id}/cancel`

### 19.5 Business Orders

- `GET /api/business-orders`
- `POST /api/business-orders`
- `GET /api/business-orders/{id}`
- `GET /api/business-orders/purchases`
- `GET /api/business-orders/sales`
- `POST /api/business-orders/{id}/cancel`

### 19.6 Stock Movements

- `GET /api/stock-movements`
- `GET /api/products/{id}/stock-movements`

### 19.7 Chat

- `GET /api/conversations`
- `POST /api/conversations`
- `GET /api/conversations/{id}/messages`
- `POST /api/conversations/{id}/messages`
- `POST /api/conversations/{id}/read`
- `GET /api/businesses/search`

### 19.8 Admin

- `GET /api/admin/dashboard`
- `GET /api/admin/users`
- `GET /api/admin/businesses`
- `GET /api/admin/products`
- `GET /api/admin/sales`
- `GET /api/admin/business-orders`
- `GET /api/admin/stock-movements`

---

## 20. Data Dummy untuk Demo

### 20.1 Supplier

**Supplier Sembako Jaya**

- Kode: SUP-0001
- Pemilik: Budi Santoso
- Alamat: Surabaya

Produk:

- Kopi Kapal Api — stok 100 — harga jual Rp10.000
- Gula 1 kg — stok 50 — harga jual Rp16.000
- Minyak Goreng 1 L — stok 75 — harga jual Rp15.000

### 20.2 Toko

**Ketintang Mart**

- Kode: TOKO-0001
- Pemilik: Ian Ale
- Alamat: Ketintang, Surabaya

Produk awal:

- Air Mineral — stok 30 — harga jual Rp5.000

### 20.3 Alur Demo Utama

1. Supplier login.
2. Supplier input Kopi Kapal Api sebanyak 100.
3. Toko login.
4. Toko membuka Supplier Sembako Jaya.
5. Toko membeli 10 Kopi Kapal Api.
6. Sistem menunjukkan stok supplier berubah dari 100 menjadi 90.
7. Sistem membuat produk Kopi Kapal Api pada toko dengan stok 10.
8. Toko membuka POS.
9. Toko menjual 2 Kopi Kapal Api kepada pelanggan.
10. Stok toko berubah dari 10 menjadi 8.
11. Riwayat menampilkan:
    - Supplier: barang keluar dibeli Ketintang Mart.
    - Toko: barang masuk dibeli dari Supplier Sembako Jaya.
    - Toko: barang keluar dibeli pelanggan.
12. Toko membuka chat dan mengirim pesan kepada supplier.
13. Admin membuka dashboard dan melihat transaksi tersebut.

---

## 21. Prioritas Implementasi

### Prioritas 1 — Alur Inti

- Auth.
- Role.
- Business.
- Products.
- Barang masuk.
- Persediaan.
- POS.
- Business order.
- Stock movement.

### Prioritas 2 — Interaksi Pengguna

- Daftar supplier.
- Detail supplier.
- Riwayat.
- Chat.
- Dashboard toko dan supplier.

### Prioritas 3 — Monitoring dan Penyempurnaan

- Dashboard admin.
- Filter lanjutan.
- Empty state.
- Loading state.
- Responsivitas.
- Data dummy.
- Penyempurnaan UI demo.

---

## 22. Risiko Produk

### Risiko 1 — Stok Tidak Konsisten

Penyebab:

- Checkout tidak menggunakan transaction.
- Dua transaksi berjalan bersamaan.
- Stock movement tidak dibuat.

Mitigasi:

- Database transaction.
- Row lock.
- Validasi ulang stok.
- Automated test.

### Risiko 2 — Produk Duplikat

Penyebab:

- Produk pembeli dibuat berulang saat pembelian.

Mitigasi:

- Cari produk berdasarkan business dan nama.
- Gunakan unique constraint jika dibutuhkan.

### Risiko 3 — Akses Data Business Lain

Penyebab:

- Endpoint hanya memvalidasi product ID.

Mitigasi:

- Semua query operasional wajib membatasi `business_id`.
- Gunakan policy atau authorization middleware.

### Risiko 4 — Harga Dimanipulasi dari Frontend

Mitigasi:

- Harga transaksi diambil ulang dari database.
- Total dihitung di backend.

### Risiko 5 — Chat Diakses Pihak Lain

Mitigasi:

- Validasi participant conversation.
- Jangan hanya memeriksa conversation ID.

---

## 23. Testing Minimum

### 23.1 Unit Test

- Perhitungan subtotal.
- Perhitungan total.
- Penambahan stok.
- Pengurangan stok.
- Validasi stok negatif.
- Generate nomor invoice.
- Generate nomor order.

### 23.2 Feature Test

- Registrasi toko.
- Registrasi supplier.
- Input produk.
- Tambah stok.
- Checkout POS.
- Pembelian supplier.
- Pembuatan produk pembeli.
- Penambahan stok produk pembeli.
- Stock movement penjual.
- Stock movement pembeli.
- Authorization produk.
- Authorization order.
- Membuat chat.
- Mengirim pesan.
- Menandai pesan dibaca.

### 23.3 UI Test Manual

- Tampilan mobile 360 px.
- Form registrasi.
- Form barang masuk.
- POS dengan beberapa produk.
- Keranjang supplier.
- Riwayat stok.
- Chat.
- Dashboard admin.

---

## 24. Indikator Keberhasilan MVP

MVP dianggap berhasil apabila:

- Toko dan supplier dapat registrasi dan login.
- Pengguna dapat menambahkan produk.
- Pengguna dapat menambah stok.
- Produk tampil pada persediaan.
- POS berhasil mengurangi stok.
- Toko dapat membeli produk supplier.
- Stok supplier berkurang.
- Stok toko bertambah.
- Riwayat kedua pihak tercatat.
- Supplier dapat melihat siapa yang membeli.
- Toko dan supplier dapat saling chat.
- Admin dapat memantau aktivitas.
- Seluruh alur dapat didemonstrasikan melalui perangkat mobile.

---

## 25. Kesimpulan

TokoStockManagement adalah platform manajemen stok sederhana yang menggabungkan empat fungsi utama:

1. Manajemen persediaan.
2. POS barang keluar.
3. Transaksi stok antar-usaha.
4. Komunikasi toko dan supplier.

Nilai utama produk terletak pada proses perpindahan stok otomatis. Ketika toko membeli produk dari supplier, sistem langsung mengurangi stok supplier, menambah stok toko, dan mencatat riwayat pada kedua pihak.

Alur tersebut menjadi fitur utama yang harus ditonjolkan dalam prototype lomba:

> Supplier menambahkan produk, toko membeli produk, stok supplier berkurang, stok toko bertambah, toko menjual produk melalui POS, dan seluruh perubahan tercatat secara otomatis.

Dokumen ini menjadi acuan utama untuk desain UI, pengembangan backend, pembuatan database, pengujian, dan penyusunan demo prototype TokoStockManagement.
