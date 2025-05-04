import tkinter as tk
from tkinter import messagebox
import paho.mqtt.client as mqtt
import random
import json
import threading
import time

# MQTT Ayarları
MQTT_BROKER = "broker.hivemq.com"
MQTT_PORT = 1883
TOPIC_STOCK = "smartfridge/stock"
TOPIC_TEMP = "smartfridge/temperature"

# MQTT Bağlantısı
client = mqtt.Client()

def on_connect(client, userdata, flags, rc):
    print("MQTT Bağlandı. Kod:", rc)

client.on_connect = on_connect
client.connect(MQTT_BROKER, MQTT_PORT, 60)

# GUI Penceresi
root = tk.Tk()
root.title("Akıllı Buzdolabı Simülasyonu")

# Envanter Listesi
stock = []

def update_stock():
    stock_list.delete(0, tk.END)
    for item in stock:
        stock_list.insert(tk.END, f"{item['name']} - {item['expiry']} gün")

def add_item():
    name = entry_name.get()
    expiry = entry_expiry.get()
    if name and expiry.isdigit():
        item = {"name": name, "expiry": int(expiry)}
        stock.append(item)
        update_stock()
        messagebox.showinfo("Eklendi", f"{name} başarıyla eklendi.")
        entry_name.delete(0, tk.END)
        entry_expiry.delete(0, tk.END)
        client.publish(TOPIC_STOCK, json.dumps(stock))
    else:
        messagebox.showwarning("Hata", "Geçerli ürün adı ve gün girin.")

def simulate_temperature():
    while True:
        temp = round(random.uniform(2.0, 8.0), 1)
        client.publish(TOPIC_TEMP, json.dumps({"temperature": temp}))
        time.sleep(5)

# Arayüz Elemanları
tk.Label(root, text="Ürün Adı:").grid(row=0, column=0)
entry_name = tk.Entry(root)
entry_name.grid(row=0, column=1)

tk.Label(root, text="SKT (gün):").grid(row=1, column=0)
entry_expiry = tk.Entry(root)
entry_expiry.grid(row=1, column=1)

tk.Button(root, text="Ekle", command=add_item).grid(row=2, column=0, columnspan=2, pady=5)

tk.Label(root, text="Stok Listesi:").grid(row=3, column=0, columnspan=2)
stock_list = tk.Listbox(root, width=40)
stock_list.grid(row=4, column=0, columnspan=2)

# Sıcaklık simülasyonu thread'i başlat
temperature_thread = threading.Thread(target=simulate_temperature, daemon=True)
temperature_thread.start()

# MQTT loop thread
mqtt_thread = threading.Thread(target=client.loop_forever, daemon=True)
mqtt_thread.start()

# Arayüzü çalıştır
root.mainloop()