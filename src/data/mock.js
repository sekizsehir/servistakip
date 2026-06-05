export const servisler = [
  { id: 1,  musteri: 'Ahmet Yılmaz',  telefon: '0532 111 22 33', cihazTuru: 'Cep Telefonu', marka: 'Apple',   model: 'iPhone 14',     ariza: 'Ekran kırık',          pin: '1234', durum: 'Beklemede',    tarih: '2024-01-15', tahminiTarih: '2024-01-18', teknisyen: 'Mehmet', teknisyenNotu: 'Ekran değişimi için parça bekleniyor.',      tutar: 1200, malzeme: 800,  odenen: 500,  gorsel: null },
  { id: 2,  musteri: 'Ayşe Kara',     telefon: '0543 222 33 44', cihazTuru: 'Cep Telefonu', marka: 'Samsung', model: 'Galaxy S23',    ariza: 'Şarj olmuyor',         pin: null,   durum: 'Tamirde',      tarih: '2024-01-16', tahminiTarih: '2024-01-17', teknisyen: 'Ali',    teknisyenNotu: 'Şarj soketi değiştiriliyor.',                tutar: 450,  malzeme: 200,  odenen: 0,    gorsel: null },
  { id: 3,  musteri: 'Mustafa Demir', telefon: '0555 333 44 55', cihazTuru: 'Laptop',       marka: 'Apple',   model: 'MacBook Pro',   ariza: 'Klavye sorunu',        pin: '9876', durum: 'Hazır',        tarih: '2024-01-14', tahminiTarih: '2024-01-14', teknisyen: 'Mehmet', teknisyenNotu: 'Klavye değişimi tamamlandı, teslime hazır.', tutar: 800,  malzeme: 350,  odenen: 800,  gorsel: null },
  { id: 4,  musteri: 'Fatma Çelik',   telefon: '0561 444 55 66', cihazTuru: 'Tablet',       marka: 'Apple',   model: 'iPad Air',      ariza: 'Batarya değişimi',     pin: '0000', durum: 'Teslim Edildi',tarih: '2024-01-13', tahminiTarih: '2024-01-14', teknisyen: 'Ali',    teknisyenNotu: null,                                          tutar: 650,  malzeme: 300,  odenen: 650,  gorsel: null },
  { id: 5,  musteri: 'Kemal Arslan',  telefon: '0533 555 66 77', cihazTuru: 'Cep Telefonu', marka: 'Apple',   model: 'iPhone 13 Pro', ariza: 'Ön kamera sorunu',     pin: '5555', durum: 'Randevu',      tarih: '2024-01-17', tahminiTarih: '2024-01-20', teknisyen: 'Mehmet', teknisyenNotu: null,                                          tutar: 950,  malzeme: 400,  odened: 0,    gorsel: null },
  { id: 6,  musteri: 'Selin Yıldız',  telefon: '0546 666 77 88', cihazTuru: 'Cep Telefonu', marka: 'Huawei',  model: 'P50',           ariza: 'Ses gelmiyor',         pin: null,   durum: 'Randevu',      tarih: '2024-01-17', tahminiTarih: '2024-01-19', teknisyen: 'Ali',    teknisyenNotu: null,                                          tutar: 350,  malzeme: 120,  odened: 0,    gorsel: null },
  { id: 7,  musteri: 'Emre Kaya',     telefon: '0552 777 88 99', cihazTuru: 'Tablet',       marka: 'Samsung', model: 'Tab S8',        ariza: 'Dokunmatik arızası',   pin: '1111', durum: 'Tamirde',      tarih: '2024-01-15', tahminiTarih: '2024-01-17', teknisyen: 'Mehmet', teknisyenNotu: 'Dokunmatik panel değişimi devam ediyor.',    tutar: 700,  malzeme: 280,  odened: 350,  gorsel: null },
  { id: 8,  musteri: 'Zeynep Öz',     telefon: '0537 888 99 00', cihazTuru: 'Laptop',       marka: 'Lenovo',  model: 'IdeaPad 5',     ariza: 'Açılmıyor',            pin: '2580', durum: 'Beklemede',    tarih: '2024-01-16', tahminiTarih: '2024-01-19', teknisyen: 'Ali',    teknisyenNotu: 'Arıza tespiti yapılıyor.',                   tutar: 500,  malzeme: 0,    odened: 0,    gorsel: null },
  { id: 9,  musteri: 'Ahmet Yılmaz',  telefon: '0532 111 22 33', cihazTuru: 'Kulaklık',     marka: 'Apple',   model: 'AirPods Pro',   ariza: 'Sol taraf ses yok',    pin: null,   durum: 'Hazır',        tarih: '2024-01-10', tahminiTarih: '2024-01-11', teknisyen: 'Mehmet', teknisyenNotu: null,                                          tutar: 300,  malzeme: 80,   odened: 300,  gorsel: null },
  { id: 10, musteri: 'Ahmet Yılmaz',  telefon: '0532 111 22 33', cihazTuru: 'Laptop',       marka: 'Apple',   model: 'MacBook Air',   ariza: 'Ekran titriyor',       pin: '1234', durum: 'Teslim Edildi',tarih: '2023-12-20', tahminiTarih: '2023-12-22', teknisyen: 'Ali',    teknisyenNotu: null,                                          tutar: 600,  malzeme: 250,  odened: 600,  gorsel: null },
  { id: 11, musteri: 'Mustafa Demir', telefon: '0555 333 44 55', cihazTuru: 'Cep Telefonu', marka: 'Samsung', model: 'Galaxy S22',    ariza: 'Cam kırık',            pin: null,   durum: 'Teslim Edildi',tarih: '2024-01-05', tahminiTarih: '2024-01-06', teknisyen: 'Ali',    teknisyenNotu: null,                                          tutar: 550,  malzeme: 220,  odened: 550,  gorsel: null },
  { id: 12, musteri: 'Selin Yıldız',  telefon: '0546 666 77 88', cihazTuru: 'Cep Telefonu', marka: 'Apple',   model: 'iPhone 12',     ariza: 'Tuş takımı sorunu',    pin: '4321', durum: 'İade',         tarih: '2024-01-08', tahminiTarih: null,         teknisyen: 'Mehmet', teknisyenNotu: 'Cihaz onarılamaz olarak iade edildi.',       tutar: 400,  malzeme: 0,    odened: 400,  gorsel: null },
]

// servisler'den türetilen cihaz adı yardımcısı
export const getCihaz = (s) => [s.marka, s.model].filter(Boolean).join(' ') || s.cihazTuru || '—'

export const cariler = [
  { id: 1, ad: 'Ahmet Yılmaz',  telefon: '0532 111 22 33', email: 'ahmet@mail.com',   adres: 'İstanbul', bakiye: -2100 },
  { id: 2, ad: 'Ayşe Kara',     telefon: '0543 222 33 44', email: 'ayse@mail.com',    adres: 'Ankara',   bakiye: -450  },
  { id: 3, ad: 'Mustafa Demir', telefon: '0555 333 44 55', email: 'mustafa@mail.com', adres: 'İzmir',    bakiye: 0     },
  { id: 4, ad: 'Fatma Çelik',   telefon: '0561 444 55 66', email: 'fatma@mail.com',   adres: 'Bursa',    bakiye: 0     },
  { id: 5, ad: 'Kemal Arslan',  telefon: '0533 555 66 77', email: 'kemal@mail.com',   adres: 'Antalya',  bakiye: -950  },
  { id: 6, ad: 'Selin Yıldız',  telefon: '0546 666 77 88', email: 'selin@mail.com',   adres: 'İzmir',    bakiye: -350  },
  { id: 7, ad: 'Emre Kaya',     telefon: '0552 777 88 99', email: 'emre@mail.com',    adres: 'İstanbul', bakiye: 0     },
  { id: 8, ad: 'Zeynep Öz',     telefon: '0537 888 99 00', email: 'zeynep@mail.com',  adres: 'Ankara',   bakiye: 200   },
]

export const stoklar = [
  { id: 1, ad: 'iPhone 14 Ekran',    kategori: 'Ekran',    stok: 5,  birimFiyat: 800, kritikStok: 3  },
  { id: 2, ad: 'Samsung S23 Batarya',kategori: 'Batarya',  stok: 2,  birimFiyat: 250, kritikStok: 5  },
  { id: 3, ad: 'USB-C Kablo',        kategori: 'Aksesuar', stok: 20, birimFiyat: 50,  kritikStok: 10 },
  { id: 4, ad: 'MacBook Klavye',     kategori: 'Klavye',   stok: 1,  birimFiyat: 600, kritikStok: 2  },
]

export const durumRenkleri = {
  'Randevu':      'info',
  'Beklemede':    'warning',
  'Tamirde':      'warning',
  'Hazır':        'success',
  'Teslim Edildi':'success',
  'İade':         'danger',
}
