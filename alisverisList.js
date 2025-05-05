let hatirlatmalar = [];

const now = new Date();
const timeLabel = > [${now.toLocaleString('tr-TR')}]; // Örnek: [15.04.2025 21:12:45]

msg.payload.forEach(product => {
    const expiry = new Date(product.expiry_date + "T00:00:00");
    const kalanGun = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));

    let line = "";

    if (kalanGun > 0 && kalanGun <= 2) {
        line =  ${product.product_name.padEnd(15)} ➤ ${kalanGun} gün içinde tüketilmeli!;
    } else if (kalanGun === 0) {
        line =  ${product.product_name.padEnd(15)} ➤ Bugün son gün!;
    } else if (kalanGun < 0) {
        line = ⚠ ${product.product_name.padEnd(15)} ➤ ${Math.abs(kalanGun)} gün önce son kullanma tarihi geçti!;
    }

    if (line) {
        hatirlatmalar.push(line);
    }
});

if (hatirlatmalar.length > 0) {
    msg.payload = ${timeLabel}\n${hatirlatmalar.join("\n")}\n;  // Debug için
    msg.dashboard = ${timeLabel}<br>${hatirlatmalar.join("<br>")}<br><br>;  // Dashboard için
} else {
    msg.payload = ${timeLabel}\n Tüketilmesi gereken ürün yok.\n;
    msg.dashboard = ${timeLabel}<br> Tüketilmesi gereken ürün yok.<br><br>;
}

return msg;
