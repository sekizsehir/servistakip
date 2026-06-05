/* ══════════════════════════════════════════════════════════════
   SEED DATA — Tüm tablolar için başlangıç verisi (Türkçe)
══════════════════════════════════════════════════════════════ */

const now  = () => new Date().toISOString()
const past = (d) => { const dt = new Date(); dt.setDate(dt.getDate() - d); return dt.toISOString() }
const date = (d) => { const dt = new Date(); dt.setDate(dt.getDate() - d); return dt.toISOString().split('T')[0] }
const futureDate = (d) => { const dt = new Date(); dt.setDate(dt.getDate() + d); return dt.toISOString().split('T')[0] }

/* ─── 1. customers ───────────────────────────────────────── */
export const seedCustomers = [
  { id:1,  name:'Ahmet Yılmaz',   phone:'0532 111 22 33', email:'ahmet@mail.com',    address:'İstanbul, Kadıköy',   createdAt: past(90) },
  { id:2,  name:'Ayşe Kara',      phone:'0543 222 33 44', email:'ayse@mail.com',     address:'Ankara, Çankaya',     createdAt: past(85) },
  { id:3,  name:'Mustafa Demir',  phone:'0555 333 44 55', email:'mustafa@mail.com',  address:'İzmir, Konak',        createdAt: past(80) },
  { id:4,  name:'Fatma Çelik',    phone:'0561 444 55 66', email:'fatma@mail.com',    address:'Bursa, Osmangazi',    createdAt: past(75) },
  { id:5,  name:'Kemal Arslan',   phone:'0533 555 66 77', email:'kemal@mail.com',    address:'Antalya, Muratpaşa', createdAt: past(70) },
  { id:6,  name:'Selin Yıldız',   phone:'0546 666 77 88', email:'selin@mail.com',    address:'İzmir, Bornova',      createdAt: past(65) },
  { id:7,  name:'Emre Kaya',      phone:'0552 777 88 99', email:'emre@mail.com',     address:'İstanbul, Beşiktaş', createdAt: past(60) },
  { id:8,  name:'Zeynep Öz',      phone:'0537 888 99 00', email:'zeynep@mail.com',   address:'Ankara, Yenimahalle',createdAt: past(55) },
  { id:9,  name:'Orhan Tekin',    phone:'0544 999 00 11', email:'orhan@mail.com',    address:'İstanbul, Üsküdar',  createdAt: past(50) },
  { id:10, name:'Büşra Şahin',    phone:'0535 000 11 22', email:'busra@mail.com',    address:'Konya, Selçuklu',    createdAt: past(45) },
  { id:11, name:'Caner Doğan',    phone:'0542 111 33 55', email:'caner@mail.com',    address:'Adana, Seyhan',      createdAt: past(40) },
  { id:12, name:'Hülya Aslan',    phone:'0553 222 44 66', email:'hulya@mail.com',    address:'İstanbul, Maltepe',  createdAt: past(35) },
  { id:13, name:'Volkan Aydın',   phone:'0564 333 55 77', email:'volkan@mail.com',   address:'Mersin, Toroslar',   createdAt: past(30) },
  { id:14, name:'Pınar Özdemir',  phone:'0575 444 66 88', email:'pinar@mail.com',    address:'Eskişehir, Tepebaşı',createdAt: past(25) },
  { id:15, name:'Tarık Güneş',    phone:'0538 555 77 99', email:'tarik@mail.com',    address:'İstanbul, Ataşehir', createdAt: past(20) },
]

/* ─── 2. services ────────────────────────────────────────── */
export const seedServices = [
  { id:1,  customerId:1,  deviceType:'Cep Telefonu', brand:'Apple',   model:'iPhone 14',      imei:'353879105556442', color:'Siyah',      memory:'128 GB', batteryHealth:78, fault:'Ekran kırık, dokunmatik çalışmıyor',         pin:'1234', accessories:['Kılıf'],                   price:1200, materialCost:800,  prepaid:500,  status:'Beklemede',    createdAt:past(5),  updatedAt:past(5),  estimatedDate:futureDate(2), technicianNote:'Ekran değişimi için parça bekleniyor.', technician:'Mehmet', image:null },
  { id:2,  customerId:2,  deviceType:'Cep Telefonu', brand:'Samsung', model:'Galaxy S23',     imei:'358749102345678', color:'Gri',        memory:'256 GB', batteryHealth:91, fault:'Şarj olmuyor, port hasarlı',                 pin:null,   accessories:[],                          price:450,  materialCost:200,  prepaid:0,    status:'Tamirde',      createdAt:past(4),  updatedAt:past(2),  estimatedDate:futureDate(1), technicianNote:'Şarj soketi değiştiriliyor.',           technician:'Ali',    image:null },
  { id:3,  customerId:3,  deviceType:'Laptop',       brand:'Apple',   model:'MacBook Pro M2', imei:'C02GH4K2MD6T',   color:'Uzay Grisi', memory:'256 GB', batteryHealth:96, fault:'Klavye bazı tuşlar çalışmıyor',              pin:'9876', accessories:['Şarj Aleti'],              price:800,  materialCost:350,  prepaid:800,  status:'Hazır',        createdAt:past(7),  updatedAt:past(1),  estimatedDate:date(1),       technicianNote:'Klavye değişimi tamamlandı.',           technician:'Mehmet', image:null },
  { id:4,  customerId:4,  deviceType:'Tablet',       brand:'Apple',   model:'iPad Air 5',     imei:'DMPXT2KFKL5F',   color:'Pembe',      memory:'64 GB',  batteryHealth:82, fault:'Batarya şişmiş, kısa sürede bitiyor',        pin:'0000', accessories:['Şarj Aleti','Kılıf'],      price:650,  materialCost:300,  prepaid:650,  status:'Teslim Edildi',createdAt:past(10), updatedAt:past(3),  estimatedDate:date(3),       technicianNote:null,                                    technician:'Ali',    image:null },
  { id:5,  customerId:5,  deviceType:'Cep Telefonu', brand:'Apple',   model:'iPhone 13 Pro',  imei:'359271088888882', color:'Altın',      memory:'256 GB', batteryHealth:88, fault:'Ön kamera bulanık görüntü',                  pin:'5555', accessories:[],                          price:950,  materialCost:400,  prepaid:0,    status:'Randevu',      createdAt:past(1),  updatedAt:past(1),  estimatedDate:futureDate(3), technicianNote:null,                                    technician:'Mehmet', image:null },
  { id:6,  customerId:6,  deviceType:'Cep Telefonu', brand:'Huawei',  model:'P50 Pro',        imei:'862946052345678', color:'Siyah',      memory:'128 GB', batteryHealth:76, fault:'Hoparlör sesi gelmiyor',                     pin:null,   accessories:[],                          price:350,  materialCost:120,  prepaid:0,    status:'Randevu',      createdAt:past(2),  updatedAt:past(2),  estimatedDate:futureDate(4), technicianNote:null,                                    technician:'Ali',    image:null },
  { id:7,  customerId:7,  deviceType:'Tablet',       brand:'Samsung', model:'Galaxy Tab S8',  imei:'352467981234567', color:'Siyah',      memory:'128 GB', batteryHealth:84, fault:'Dokunmatik ekran arızalı',                   pin:'1111', accessories:['Şarj Aleti','Kulaklık'],   price:700,  materialCost:280,  prepaid:350,  status:'Tamirde',      createdAt:past(6),  updatedAt:past(2),  estimatedDate:futureDate(1), technicianNote:'Dokunmatik panel değişimi devam ediyor.', technician:'Mehmet', image:null },
  { id:8,  customerId:8,  deviceType:'Laptop',       brand:'Lenovo',  model:'IdeaPad 5',      imei:'PF2H5SKL',       color:'Gri',        memory:'512 GB', batteryHealth:null, fault:'Açılmıyor, güç tuşuna basınca tepki yok', pin:'2580', accessories:['Şarj Aleti'],              price:500,  materialCost:0,    prepaid:0,    status:'Beklemede',    createdAt:past(3),  updatedAt:past(3),  estimatedDate:futureDate(2), technicianNote:'Arıza tespiti yapılıyor.',              technician:'Ali',    image:null },
  { id:9,  customerId:1,  deviceType:'Kulaklık',     brand:'Apple',   model:'AirPods Pro 2',  imei:null,             color:'Beyaz',      memory:null,     batteryHealth:71, fault:'Sol kulakta ses yok',                        pin:null,   accessories:['Kutu'],                    price:300,  materialCost:80,   prepaid:300,  status:'Hazır',        createdAt:past(8),  updatedAt:past(2),  estimatedDate:date(2),       technicianNote:null,                                    technician:'Mehmet', image:null },
  { id:10, customerId:1,  deviceType:'Laptop',       brand:'Apple',   model:'MacBook Air M2', imei:'C02GH4K2MD6T',   color:'Gece Yarısı',memory:'256 GB', batteryHealth:97, fault:'Ekran titriyor',                             pin:'1234', accessories:[],                          price:600,  materialCost:250,  prepaid:600,  status:'Teslim Edildi',createdAt:past(15), updatedAt:past(8),  estimatedDate:date(8),       technicianNote:null,                                    technician:'Ali',    image:null },
  { id:11, customerId:3,  deviceType:'Cep Telefonu', brand:'Samsung', model:'Galaxy S22',     imei:'354578091234567', color:'Bordo',      memory:'256 GB', batteryHealth:89, fault:'Cam kırık',                                  pin:null,   accessories:['Kılıf','Koruyucu Cam'],    price:550,  materialCost:220,  prepaid:550,  status:'Teslim Edildi',createdAt:past(12), updatedAt:past(5),  estimatedDate:date(5),       technicianNote:null,                                    technician:'Ali',    image:null },
  { id:12, customerId:6,  deviceType:'Cep Telefonu', brand:'Apple',   model:'iPhone 12',      imei:'358478901234567', color:'Mavi',       memory:'128 GB', batteryHealth:69, fault:'Tuş takımı çalışmıyor',                      pin:'4321', accessories:[],                          price:400,  materialCost:0,    prepaid:400,  status:'İade',         createdAt:past(9),  updatedAt:past(4),  estimatedDate:null,          technicianNote:'Cihaz onarılamaz, iade edildi.',        technician:'Mehmet', image:null },
  { id:13, customerId:9,  deviceType:'Oyun Konsolu', brand:'Sony',    model:'PlayStation 5',  imei:'D81234567890',   color:'Beyaz',      memory:'825 GB', batteryHealth:null, fault:'Disk okuyucu arızalı',                    pin:null,   accessories:['Kablo'],                   price:1500, materialCost:600,  prepaid:750,  status:'Tamirde',      createdAt:past(4),  updatedAt:past(1),  estimatedDate:futureDate(3), technicianNote:'Yedek parça temin edildi.',             technician:'Ali',    image:null },
  { id:14, customerId:10, deviceType:'Cep Telefonu', brand:'Xiaomi',  model:'13 Pro',         imei:'869876543210987', color:'Yeşil',      memory:'256 GB', batteryHealth:93, fault:'Kamera odaklanmıyor',                        pin:'6789', accessories:[],                          price:350,  materialCost:150,  prepaid:0,    status:'Beklemede',    createdAt:past(2),  updatedAt:past(2),  estimatedDate:futureDate(3), technicianNote:null,                                    technician:'Mehmet', image:null },
  { id:15, customerId:11, deviceType:'Laptop',       brand:'HP',      model:'Pavilion 15',    imei:'CNF1234567',     color:'Gümüş',      memory:'512 GB', batteryHealth:65, fault:'Batarya şarj almıyor',                       pin:null,   accessories:['Şarj Aleti'],              price:400,  materialCost:200,  prepaid:200,  status:'Hazır',        createdAt:past(6),  updatedAt:past(1),  estimatedDate:date(1),       technicianNote:'Batarya değişimi yapıldı.',             technician:'Ali',    image:null },
  { id:16, customerId:12, deviceType:'Akıllı Saat',  brand:'Apple',   model:'Watch Series 8', imei:'DNPLVGQ3N85D',   color:'Gece Yarısı',memory:null,     batteryHealth:77, fault:'Ekran renk sorunu',                          pin:null,   accessories:[],                          price:800,  materialCost:400,  prepaid:400,  status:'Tamirde',      createdAt:past(3),  updatedAt:past(1),  estimatedDate:futureDate(2), technicianNote:null,                                    technician:'Mehmet', image:null },
  { id:17, customerId:13, deviceType:'TV/Monitör',   brand:'Samsung', model:'QLED 55"',       imei:'SN123456789',    color:'Siyah',      memory:null,     batteryHealth:null, fault:'Görüntü gelmiyor, ışık yanıyor',          pin:null,   accessories:[],                          price:1200, materialCost:500,  prepaid:600,  status:'Beklemede',    createdAt:past(4),  updatedAt:past(4),  estimatedDate:futureDate(4), technicianNote:null,                                    technician:'Ali',    image:null },
  { id:18, customerId:14, deviceType:'Cep Telefonu', brand:'Oppo',    model:'Find X6',        imei:'863847051234567', color:'Altın',      memory:'256 GB', batteryHealth:86, fault:'Şarj hızı düşük',                            pin:'1357', accessories:['Şarj Aleti'],              price:280,  materialCost:100,  prepaid:280,  status:'Teslim Edildi',createdAt:past(11), updatedAt:past(6),  estimatedDate:date(6),       technicianNote:null,                                    technician:'Mehmet', image:null },
  { id:19, customerId:15, deviceType:'Laptop',       brand:'Dell',    model:'XPS 15',         imei:'DLLXPS12345',    color:'Gümüş',      memory:'1 TB',   batteryHealth:82, fault:'Klavye arka ışığı çalışmıyor',               pin:null,   accessories:[],                          price:350,  materialCost:150,  prepaid:0,    status:'Randevu',      createdAt:past(1),  updatedAt:past(1),  estimatedDate:futureDate(5), technicianNote:null,                                    technician:'Ali',    image:null },
  { id:20, customerId:2,  deviceType:'Cep Telefonu', brand:'Apple',   model:'iPhone 15 Pro',  imei:'354321098765432', color:'Titanyum Doğal',memory:'512 GB',batteryHealth:100,fault:'Garanti kapsamında yazılım güncellemesi',  pin:'9999', accessories:['Kutu','Şarj Aleti'],       price:0,    materialCost:0,    prepaid:0,    status:'Teslim Edildi',createdAt:past(14), updatedAt:past(9),  estimatedDate:date(9),       technicianNote:null,                                    technician:'Mehmet', image:null },
]

/* ─── 3. stock_items ─────────────────────────────────────── */
export const seedStockItems = [
  { id:1,  name:'iPhone 14 Ekranı (OLED)',      brand:'Apple',   model:'iPhone 14',     category:'Ekran',    quantity:4,  buyPrice:720,  sellPrice:1100, barcode:'8680123456781', createdAt:past(30), image:null },
  { id:2,  name:'Samsung S23 Bataryası',        brand:'Samsung', model:'Galaxy S23',    category:'Batarya',  quantity:7,  buyPrice:180,  sellPrice:280,  barcode:'8680123456782', createdAt:past(25), image:null },
  { id:3,  name:'iPhone 13 Pro Ön Kamera',      brand:'Apple',   model:'iPhone 13 Pro', category:'Kamera',   quantity:3,  buyPrice:350,  sellPrice:520,  barcode:'8680123456783', createdAt:past(20), image:null },
  { id:4,  name:'USB-C to Lightning Kablo 1m',  brand:'Genel',   model:null,            category:'Aksesuar', quantity:25, buyPrice:35,   sellPrice:75,   barcode:'8680123456784', createdAt:past(15), image:null },
  { id:5,  name:'MacBook Pro M2 Klavye',        brand:'Apple',   model:'MacBook Pro',   category:'Klavye',   quantity:1,  buyPrice:550,  sellPrice:850,  barcode:'8680123456785', createdAt:past(10), image:null },
  { id:6,  name:'Samsung Galaxy Tab S8 Ekranı', brand:'Samsung', model:'Tab S8',        category:'Ekran',    quantity:2,  buyPrice:600,  sellPrice:950,  barcode:'8680123456786', createdAt:past(8),  image:null },
  { id:7,  name:'iPad Air 5 Bataryası',         brand:'Apple',   model:'iPad Air',      category:'Batarya',  quantity:3,  buyPrice:250,  sellPrice:400,  barcode:'8680123456787', createdAt:past(7),  image:null },
  { id:8,  name:'iPhone 12 Şarj Soketi',        brand:'Apple',   model:'iPhone 12',     category:'Şarj',     quantity:5,  buyPrice:120,  sellPrice:200,  barcode:'8680123456788', createdAt:past(6),  image:null },
  { id:9,  name:'Temizleme Kiti (5\'li)',        brand:'Genel',   model:null,            category:'Aksesuar', quantity:15, buyPrice:15,   sellPrice:40,   barcode:'8680123456789', createdAt:past(5),  image:null },
  { id:10, name:'AirPods Pro 2 Sol Kulaklık',   brand:'Apple',   model:'AirPods Pro 2', category:'Kulaklık', quantity:2,  buyPrice:650,  sellPrice:950,  barcode:'8680123456790', createdAt:past(4),  image:null },
  { id:11, name:'HP Pavilion Batarya 65Wh',     brand:'HP',      model:'Pavilion 15',   category:'Batarya',  quantity:3,  buyPrice:165,  sellPrice:280,  barcode:'8680123456791', createdAt:past(3),  image:null },
  { id:12, name:'Ekran Koruyucu Cam (Evrensel)',brand:'Genel',   model:null,            category:'Aksesuar', quantity:30, buyPrice:20,   sellPrice:55,   barcode:'8680123456792', createdAt:past(2),  image:null },
  { id:13, name:'MacBook Şarj Adaptörü 67W',   brand:'Apple',   model:'MacBook',       category:'Şarj',     quantity:4,  buyPrice:380,  sellPrice:580,  barcode:'8680123456793', createdAt:past(2),  image:null },
  { id:14, name:'Samsung S22 Arka Cam',         brand:'Samsung', model:'Galaxy S22',    category:'Gövde',    quantity:5,  buyPrice:200,  sellPrice:330,  barcode:'8680123456794', createdAt:past(1),  image:null },
  { id:15, name:'Huawei P50 Hoparlör',          brand:'Huawei',  model:'P50 Pro',       category:'Ses',      quantity:2,  buyPrice:90,   sellPrice:165,  barcode:'8680123456795', createdAt:past(1),  image:null },
]

/* ─── 4. device_records (ikinci el) ─────────────────────── */
export const seedDeviceRecords = [
  { id:1,  deviceType:'Cep Telefonu', brand:'Apple',   model:'iPhone 12',      imei:'354890123456781', color:'Kırmızı',    memory:'128 GB', batteryHealth:79, transactionType:'Satıldı', buyPrice:7200,  sellPrice:8800,  personName:'Mehmet Yılmaz', phone:'0532 111 22 33', date:date(10), saleDate:date(8),  salePersonName:'Ali Demir', image:null, notes:'' },
  { id:2,  deviceType:'Cep Telefonu', brand:'Samsung', model:'Galaxy S21',     imei:'356789012345678', color:'Fantom Gri',  memory:'256 GB', batteryHealth:88, transactionType:'Satıldı', buyPrice:6000,  sellPrice:7400,  personName:'Ayşe Kara',     phone:'0543 222 33 44', date:date(15), saleDate:date(12), salePersonName:'Fatma Çelik', image:null, notes:'Kutu dahil' },
  { id:3,  deviceType:'Tablet',       brand:'Apple',   model:'iPad Air 4',     imei:'DLMPXT2KFKL',    color:'Uzay Grisi',  memory:'64 GB',  batteryHealth:72, transactionType:'Depoda',  buyPrice:8500,  sellPrice:null,  personName:'Tedarikçi AS',  phone:'0212 111 22 33', date:date(5),  saleDate:null,     salePersonName:null, image:null, notes:'Temiz' },
  { id:4,  deviceType:'Cep Telefonu', brand:'Apple',   model:'iPhone 13 Pro',  imei:'358271098765432', color:'Altın',       memory:'256 GB', batteryHealth:91, transactionType:'Satıldı', buyPrice:13000, sellPrice:15500, personName:'Orhan Tekin',   phone:'0544 999 00 11', date:date(8),  saleDate:date(5),  salePersonName:'Zeynep Öz', image:null, notes:'' },
  { id:5,  deviceType:'Laptop',       brand:'Apple',   model:'MacBook Air M2', imei:'C02GH4K2MD6T',   color:'Gece Yarısı', memory:'256 GB', batteryHealth:98, transactionType:'Depoda',  buyPrice:30000, sellPrice:null,  personName:'Ahmet Aksoy',   phone:'0535 444 55 66', date:date(3),  saleDate:null,     salePersonName:null, image:null, notes:'Kutulu, şarjlı' },
  { id:6,  deviceType:'Cep Telefonu', brand:'Xiaomi',  model:'13T Pro',        imei:'869761234567890', color:'Siyah',       memory:'512 GB', batteryHealth:95, transactionType:'Alındı',  buyPrice:9500,  sellPrice:null,  personName:'Büşra Şahin',   phone:'0535 000 11 22', date:date(2),  saleDate:null,     salePersonName:null, image:null, notes:'Az kullanılmış' },
  { id:7,  deviceType:'Oyun Konsolu', brand:'Sony',    model:'PS5 Digital',    imei:'SN987654321',    color:'Beyaz',       memory:'825 GB', batteryHealth:null, transactionType:'Satıldı', buyPrice:16000, sellPrice:18000, personName:'Caner Doğan',   phone:'0542 111 33 55', date:date(20), saleDate:date(17), salePersonName:'Volkan Aydın', image:null, notes:'1 kol ile' },
  { id:8,  deviceType:'Akıllı Saat',  brand:'Apple',   model:'Watch Ultra 2',  imei:'DNPLVGQ3N',      color:'Titanium',    memory:null,     batteryHealth:96, transactionType:'Depoda',  buyPrice:24000, sellPrice:null,  personName:'İkinci El Dükkanı', phone:'0216 333 44 55', date:date(4), saleDate:null, salePersonName:null, image:null, notes:'Kutu ve bilekliği var' },
  { id:9,  deviceType:'Cep Telefonu', brand:'Samsung', model:'Galaxy Z Fold 5',imei:'352890123456789', color:'Krem',        memory:'256 GB', batteryHealth:87, transactionType:'Alındı',  buyPrice:22000, sellPrice:null,  personName:'Hülya Aslan',   phone:'0553 222 44 66', date:date(1),  saleDate:null,     salePersonName:null, image:null, notes:'Küçük çizik' },
  { id:10, deviceType:'Laptop',       brand:'Dell',    model:'XPS 13',         imei:'DLLXPS98765',    color:'Gümüş',       memory:'512 GB', batteryHealth:82, transactionType:'Satıldı', buyPrice:18000, sellPrice:20500, personName:'Pınar Özdemir', phone:'0575 444 66 88', date:date(25), saleDate:date(22), salePersonName:'Tarık Güneş', image:null, notes:'Şarj adaptörü dahil' },
  { id:11, deviceType:'Cep Telefonu', brand:'Apple',   model:'iPhone 14 Plus', imei:'354123456789012', color:'Mor',         memory:'128 GB', batteryHealth:84, transactionType:'Depoda',  buyPrice:11000, sellPrice:null,  personName:'Ali Yılmaz',    phone:'0534 555 66 77', date:date(6),  saleDate:null,     salePersonName:null, image:null, notes:'' },
  { id:12, deviceType:'Tablet',       brand:'Samsung', model:'Galaxy Tab S9',  imei:'354678901234567', color:'Grafiti',     memory:'128 GB', batteryHealth:99, transactionType:'Satıldı', buyPrice:12000, sellPrice:14000, personName:'Tedarikçi AS',  phone:'0212 111 22 33', date:date(18), saleDate:date(15), salePersonName:'Büşra Şahin', image:null, notes:'Kalem dahil' },
]

/* ─── 5. tasks ───────────────────────────────────────────── */
const td = date(0)
export const seedTasks = [
  { id:1,  title:'Faturalar ödenmeli',              dueDate:td,             dueTime:'10:00', priority:'acil',   tags:['finans'],   isCompleted:false, createdAt:past(2) },
  { id:2,  title:'Stok sayımı yap',                 dueDate:td,             dueTime:null,    priority:'orta',   tags:['stok'],     isCompleted:false, createdAt:past(2) },
  { id:3,  title:'Müşteri takibi — Ahmet Yılmaz',   dueDate:td,             dueTime:'15:30', priority:'yuksek', tags:['müşteri'],  isCompleted:true,  createdAt:past(3) },
  { id:4,  title:'Servis tekliflerini güncelle',     dueDate:futureDate(1),  dueTime:'09:00', priority:'orta',   tags:['servis'],   isCompleted:false, createdAt:past(1) },
  { id:5,  title:'Yeni parça siparişi ver',          dueDate:futureDate(1),  dueTime:'14:00', priority:'yuksek', tags:['stok'],     isCompleted:false, createdAt:past(1) },
  { id:6,  title:'KDV beyannamesi hazırla',          dueDate:futureDate(3),  dueTime:null,    priority:'acil',   tags:['finans','muhasebe'], isCompleted:false, createdAt:past(5) },
  { id:7,  title:'Teknisyen eğitim planı',           dueDate:futureDate(5),  dueTime:null,    priority:'dusuk',  tags:['ekip'],     isCompleted:false, createdAt:past(3) },
  { id:8,  title:'Web sitesi güncelleme',            dueDate:futureDate(7),  dueTime:null,    priority:'orta',   tags:['dijital'],  isCompleted:false, createdAt:past(4) },
  { id:9,  title:'Haftalık ciro raporu',             dueDate:date(1),        dueTime:'18:00', priority:'yuksek', tags:['finans'],   isCompleted:true,  createdAt:past(7) },
  { id:10, title:'Samsung parça teslim al',          dueDate:futureDate(2),  dueTime:'11:00', priority:'yuksek', tags:['stok','tedarik'], isCompleted:false, createdAt:past(2) },
  { id:11, title:'Müşteri memnuniyet anketi gönder', dueDate:futureDate(4),  dueTime:null,    priority:'dusuk',  tags:['müşteri'],  isCompleted:false, createdAt:past(1) },
  { id:12, title:'Garanti kapsamı kontrolü',         dueDate:date(2),        dueTime:null,    priority:'orta',   tags:['servis'],   isCompleted:true,  createdAt:past(8) },
]

/* ─── 6. cari_customers ──────────────────────────────────── */
export const seedCariCustomers = [
  { id:1,  name:'Ahmet Yılmaz',  phone:'0532 111 22 33', totalDebt:700,   createdAt:past(90) },
  { id:2,  name:'Ayşe Kara',     phone:'0543 222 33 44', totalDebt:450,   createdAt:past(85) },
  { id:3,  name:'Mustafa Demir', phone:'0555 333 44 55', totalDebt:0,     createdAt:past(80) },
  { id:4,  name:'Fatma Çelik',   phone:'0561 444 55 66', totalDebt:0,     createdAt:past(75) },
  { id:5,  name:'Kemal Arslan',  phone:'0533 555 66 77', totalDebt:950,   createdAt:past(70) },
  { id:6,  name:'Selin Yıldız',  phone:'0546 666 77 88', totalDebt:350,   createdAt:past(65) },
  { id:7,  name:'Emre Kaya',     phone:'0552 777 88 99', totalDebt:0,     createdAt:past(60) },
  { id:8,  name:'Zeynep Öz',     phone:'0537 888 99 00', totalDebt:-200,  createdAt:past(55) },
  { id:9,  name:'TechParts AŞ',  phone:'0212 111 22 33', totalDebt:3000,  createdAt:past(50) },
  { id:10, name:'Mobitech Ltd.',  phone:'0312 222 33 44', totalDebt:1200,  createdAt:past(45) },
]

/* ─── 7. cari_transactions ───────────────────────────────── */
export const seedCariTransactions = [
  { id:1,  customerId:1,  type:'borc',  amount:1200, date:date(20), dueDate:futureDate(10), description:'iPhone 14 ekran tamiri' },
  { id:2,  customerId:1,  type:'odeme', amount:500,  date:date(15), dueDate:null,           description:'Nakit ödeme' },
  { id:3,  customerId:2,  type:'borc',  amount:450,  date:date(18), dueDate:date(3),        description:'Samsung S23 şarj soketi' },
  { id:4,  customerId:5,  type:'borc',  amount:950,  date:date(10), dueDate:futureDate(5),  description:'iPhone 13 Pro tamir' },
  { id:5,  customerId:6,  type:'borc',  amount:350,  date:date(8),  dueDate:date(2),        description:'Huawei P50 hoparlör' },
  { id:6,  customerId:7,  type:'borc',  amount:700,  date:date(12), dueDate:date(2),        description:'Samsung Tab S8 dokunmatik' },
  { id:7,  customerId:7,  type:'odeme', amount:700,  date:date(5),  dueDate:null,           description:'Tam ödeme yapıldı' },
  { id:8,  customerId:8,  type:'borc',  amount:0,    date:date(7),  dueDate:null,           description:'Fazla ödeme iadesi' },
  { id:9,  customerId:8,  type:'odeme', amount:200,  date:date(6),  dueDate:null,           description:'Avans ödeme' },
  { id:10, customerId:9,  type:'borc',  amount:5000, date:date(30), dueDate:date(15),       description:'Ocak ekran siparişi' },
  { id:11, customerId:9,  type:'odeme', amount:2000, date:date(20), dueDate:null,           description:'Kısmi ödeme' },
  { id:12, customerId:10, type:'borc',  amount:1200, date:date(25), dueDate:date(10),       description:'Batarya siparişi' },
  { id:13, customerId:3,  type:'borc',  amount:800,  date:date(14), dueDate:date(7),        description:'MacBook Pro klavye' },
  { id:14, customerId:3,  type:'odeme', amount:800,  date:date(8),  dueDate:null,           description:'Tam ödeme' },
  { id:15, customerId:4,  type:'borc',  amount:650,  date:date(16), dueDate:date(9),        description:'iPad Air batarya' },
  { id:16, customerId:4,  type:'odeme', amount:650,  date:date(10), dueDate:null,           description:'Kredi kartı ödeme' },
]

/* ─── 8. extra_transactions ──────────────────────────────── */
export const seedExtraTransactions = [
  { id:1,  type:'gider', amount:8500,  date:date(30), description:'Aylık kira' },
  { id:2,  type:'gider', amount:1200,  date:date(29), description:'Elektrik faturası' },
  { id:3,  type:'gider', amount:450,   date:date(28), description:'Su + doğalgaz' },
  { id:4,  type:'gider', amount:800,   date:date(27), description:'İnternet + telefon' },
  { id:5,  type:'gelir', amount:500,   date:date(25), description:'Ek danışmanlık geliri' },
  { id:6,  type:'gider', amount:2500,  date:date(20), description:'Parça alımı (Samsung)' },
  { id:7,  type:'gider', amount:350,   date:date(18), description:'Kırtasiye ve sarf malzeme' },
  { id:8,  type:'gelir', amount:300,   date:date(15), description:'Cihaz bakım sözleşmesi' },
  { id:9,  type:'gider', amount:1800,  date:date(10), description:'Aylık kira (peşin)' },
  { id:10, type:'gelir', amount:750,   date:date(8),  description:'Atık cihaz satışı' },
  { id:11, type:'gider', amount:600,   date:date(5),  description:'Temizlik ve bakım' },
  { id:12, type:'gider', amount:950,   date:date(3),  description:'Muhasebe ücreti' },
  { id:13, type:'gelir', amount:200,   date:date(2),  description:'Aksesuar komisyonu' },
  { id:14, type:'gider', amount:300,   date:date(1),  description:'Reklam (sosyal medya)' },
  { id:15, type:'gelir', amount:1200,  date:date(0),  description:'Şirket servis sözleşmesi' },
]

/* ─── 9. quotes (teklifler) ──────────────────────────────── */
export const seedQuotes = [
  {
    id:1, customerId:1, customerName:'Ahmet Yılmaz', phone:'0532 111 22 33',
    jobType:'iPhone 14 ekran + cam değişimi',
    materials:[ { ad:'iPhone 14 Ekranı', adet:1, satisFiyati:1100, alisFiyati:720 } ],
    labor:200, vatRate:0.20, total:1560, notes:'3 gün garanti',
    createdAt:past(5),
  },
  {
    id:2, customerId:2, customerName:'Ayşe Kara', phone:'0543 222 33 44',
    jobType:'Samsung Galaxy S23 şarj soketi değişimi',
    materials:[ { ad:'S23 Şarj Soketi', adet:1, satisFiyati:180, alisFiyati:90 } ],
    labor:150, vatRate:0.10, total:363, notes:'',
    createdAt:past(8),
  },
  {
    id:3, customerId:5, customerName:'Kemal Arslan', phone:'0533 555 66 77',
    jobType:'iPhone 13 Pro ön kamera değişimi',
    materials:[ { ad:'iPhone 13 Pro Ön Kamera', adet:1, satisFiyati:520, alisFiyati:350 } ],
    labor:200, vatRate:0.20, total:864, notes:'',
    createdAt:past(3),
  },
  {
    id:4, customerId:9, customerName:'Orhan Tekin', phone:'0544 999 00 11',
    jobType:'PS5 disk okuyucu değişimi + temizlik',
    materials:[ { ad:'PS5 Disk Okuyucu', adet:1, satisFiyati:850, alisFiyati:500 } ],
    labor:300, vatRate:0.20, total:1380, notes:'1 ay garanti',
    createdAt:past(6),
  },
  {
    id:5, customerId:13, customerName:'Volkan Aydın', phone:'0564 333 55 77',
    jobType:'Samsung 55" QLED panel değişimi',
    materials:[
      { ad:'QLED Panel 55"', adet:1, satisFiyati:3500, alisFiyati:2200 },
      { ad:'T-Con Board', adet:1, satisFiyati:450, alisFiyati:280 },
    ],
    labor:500, vatRate:0.20, total:5340, notes:'Panel temininde 1 hafta bekleme',
    createdAt:past(2),
  },
  {
    id:6, customerId:15, customerName:'Tarık Güneş', phone:'0538 555 77 99',
    jobType:'Dell XPS 15 klavye arka ışık tamiri',
    materials:[ { ad:'Klavye Kontrol Kartı', adet:1, satisFiyati:280, alisFiyati:180 } ],
    labor:200, vatRate:0, total:480, notes:'',
    createdAt:past(1),
  },
  {
    id:7, customerId:11, customerName:'Caner Doğan', phone:'0542 111 33 55',
    jobType:'HP Pavilion batarya değişimi',
    materials:[ { ad:'HP Pavilion Batarya', adet:1, satisFiyati:280, alisFiyati:165 } ],
    labor:100, vatRate:0.10, total:418, notes:'6 ay batarya garantisi',
    createdAt:past(4),
  },
  {
    id:8, customerId:12, customerName:'Hülya Aslan', phone:'0553 222 44 66',
    jobType:'Apple Watch Series 8 ekran değişimi',
    materials:[ { ad:'Watch S8 Ekran Modülü', adet:1, satisFiyati:750, alisFiyati:480 } ],
    labor:250, vatRate:0.20, total:1200, notes:'',
    createdAt:past(3),
  },
]

/* ─── Toplu export ───────────────────────────────────────── */
export const ALL_SEEDS = {
  customers:          seedCustomers,
  services:           seedServices,
  stock_items:        seedStockItems,
  device_records:     seedDeviceRecords,
  tasks:              seedTasks,
  cari_customers:     seedCariCustomers,
  cari_transactions:  seedCariTransactions,
  extra_transactions: seedExtraTransactions,
  quotes:             seedQuotes,
}
