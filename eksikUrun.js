let data = msg.payload;
let eksikListesi = [];

data.forEach(item => {
    if (item.level <= 30) {
        eksikListesi.push(• ${item.product_name});
    }
});

if (eksikListesi.length === 0) {
    msg.payload = " Tüm ürünlerin seviyesi yeterli!";
} else {
    msg.payload = eksikListesi.join("<br>");
}

return msg;
