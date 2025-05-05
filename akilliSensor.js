let results = [];

msg.payload.forEach(product => {
    let warnings = [];
    let statusLevel = "normal"; // normal | warning | critical

    const now = new Date();
    const expiry = new Date(product.expiry_date);

    // Son kullanma tarihi kontrolü
    if (expiry < now) {
        warnings.push("Son kullanma tarihi geçti!");
        statusLevel = "critical";
    } else {
        const daysLeft = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));
        if (daysLeft <= 2) {
            warnings.push(`Son kullanma tarihine ${daysLeft} gün kaldı.`);
            if (statusLevel !== "critical") statusLevel = "warning";
        }
    }

    // Sıcaklık kontrolü
    if (product.temperature < 1 || product.temperature > 8) {
        warnings.push(`Sıcaklık uygun değil: ${product.temperature}°C`);
        if (statusLevel !== "critical") statusLevel = "warning";
        if (product.temperature < -5 || product.temperature > 25) {
            statusLevel = "critical";
        }
    }

    // Nem kontrolü
    if (product.humidity < 50 || product.humidity > 90) {
        warnings.push(`Nem seviyesi dengesiz: %${product.humidity}`);
        if (statusLevel !== "critical") statusLevel = "warning";
    }

    // Eğer hiçbir sorun yoksa durum normal
    if (warnings.length === 0) {
        warnings.push("Durum normal");
    }

    // Ürün durumunu ve sınıflandırmasını ekle
    const productStatus = {
        product_id: product.product_id,
        product_name: product.product_name,
        quantity: product.quantity,
        expiry_date: product.expiry_date,
        temperature: product.temperature,
        humidity: product.humidity,
        status: statusLevel,
        warnings: warnings
    };

    results.push(productStatus);

    // Log çıktısı
    const logHeader = {
        "critical": "[KRİTİK DURUM]",
        "warning": "[DİKKAT]",
        "normal": "[NORMAL]"
    }[statusLevel];

    const logMessage = `
----------------------------------------
${logHeader}
Ürün: ${product.product_name} (${product.product_id})
Son Kullanma Tarihi: ${product.expiry_date}
Sıcaklık: ${product.temperature}°C
Nem: %${product.humidity}
Durum:
- ${warnings.join("\n- ")}
----------------------------------------
    `.trim();

    if (statusLevel === "critical") {
        node.error(logMessage);
    } else if (statusLevel === "warning") {
        node.warn(logMessage);
    } else {
        node.log(logMessage);
    }
});

msg.payload = results;
return msg;
