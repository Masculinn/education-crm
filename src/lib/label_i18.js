export default {
  name: { label: "Öğrencinin Adı Soyadı", isRequired: true, isEditable: true },
  age: { labe1l: "Öğrencinin Yaşı", isRequired: true, isEditable: true },
  university: {
    label: "Üniversite Tercihi",
    isRequired: true,
    placeholder: "Lütfen bir üniversite seçiniz",
  },
  program: {
    label: "Öğrencinin Bölümü",
    placeholder: "Lütfen önce üniversite Seçin",
    isRequired: true,
  },
  city: {
    label: "Oturduğu Şehir",
    isRequired: true,
    placeholder: "Lütfen şehir seçin",
  },
  phone: { label: "Telefon Numarası", isRequired: true, isEditable: true },
  address: {
    label: "Öğrencinin Ev Adresi",
    isRequired: false,
    isEditable: true,
  },
  email: {
    label: "Öğrencinin Emaili",
    isRequired: true,
  },
  passport_expire_date: {
    label: "Pasaport Bitiş Tarihi",
    isRequired: false,
    isEditable: true,
  },
  passport_no: {
    label: "Pasaport Numarası",
    isRequired: false,
    isEditable: true,
  },
  visa_appointment_date: {
    label: "Vize Randevu Tarihi",
    description:
      "Vizeye randevu tarihi belli olan öğrencilerin randevu tarihlerini buradan görüntüleyebilirsiniz.",
    isRequired: false,
    isEditable: true,
  },
  visa_expert: {
    label: "Vize Sorumlusu",
    isRequired: false,
    isEditable: true,
  },
  ispassportTaken: {
    label: "Pasaport Durumu",
    description:
      "Öğrencinin pasaportunun olup olmadığını buradan değiştirip görüntüleyebilirsiniz",
    selectItems: [
      {
        key: "true",
        label: "Alınmış",
      },
      {
        key: "false",
        label: "Alınmamış",
      },
    ],
    isRequired: false,
    isEditable: true,
  },
  visa_expiration_date: {
    label: "Vize Bitiş Tarihi",
    isRequired: false,
    isEditable: true,
  },
  isRegisteredToVisa: {
    label: "Vizeye kayıt",
    isRequired: false,
    isEditable: true,
    selectItems: [
      {
        key: "true",
        label: "Yapılmış",
      },
      {
        key: "false",
        label: "Yapılmamış",
      },
    ],
  },
  isVisaRejected: {
    label: "Vize reddi",
    description: "Vizenin red durumunu buradan değiştirebilirsiniz.",
    selectItems: [
      {
        key: "true",
        label: "Vize Onaylanmış",
      },
      {
        key: "false",
        label: "Vize Reddedilmiş",
      },
    ],
    isRequired: false,
    isEditable: true,
  },
  isVisaAppointmentTake: {
    label: "Vize randevusu",
    isRequired: false,
    isEditable: true,
    selectItems: [
      {
        key: "true",
        label: "Alınmış",
      },
      {
        key: "false",
        label: "Alınmamış",
      },
    ],
  },
  isVisaDocsVerified: {
    label: "Vize dökümanları",
    description:
      "Vize dökümanlarının hükümet tarafından onay durumunu değiştirebilirsiniz.",
    isRequired: false,
    isEditable: true,
    selectItems: [
      {
        key: "true",
        label: "Onaylanmış",
      },
      {
        key: "false",
        label: "Onaylanmamış",
      },
    ],
  },
  fingerprint_date: {
    label: "Parmak İzi Tarihi",
    isRequired: false,
    isEditable: true,
  },
  isFingerprintConfirmed: {
    label: "Parmak İzi",
    description: "Oturum için parmak izi durumu",
    selectItems: [
      {
        key: "true",
        label: "Tamamlanmış",
      },
      {
        key: "false",
        label: "Tamamlanmamış",
      },
    ],
    isRequired: false,
    isEditable: true,
  },
  isTranscriptConfirmed: {
    label: "Transkript",
    description: "Vize için apostilli transkript durumu.",
    isRequired: false,
    selectItems: [
      {
        key: "true",
        label: "Onaylanmış",
      },
      {
        key: "false",
        label: "Onaylanmamış",
      },
    ],
    isEditable: true,
  },
  isContractConfirmed: {
    label: "Ev kontraktı",
    description:
      "Vize için yetkililere gösterilmesi gerekilen kontrakt durumu.",
    selectItems: [
      {
        key: "true",
        label: "Teslim Edilmiş",
      },
      {
        key: "false",
        label: "Teslim edilmemiş",
      },
    ],
    isRequired: false,
    isEditable: true,
  },
  isBalancedConfirmed: {
    label: "Para gösterme onaylanmış",
    description: "Vize için yetkililere gösterilmesi gerekilen durum.",
    selectItems: [
      {
        key: "true",
        label: "Gösterilmiş",
      },
      {
        key: "false",
        label: "Gösterilmemiş",
      },
    ],
    isRequired: false,
    isEditable: true,
  },
  semester: {
    label: "Üniversite semestr",
    isRequired: true,
    isEditable: true,
  },
  university_email: {
    label: "Üniversite email",
    isRequired: false,
    isEditable: true,
  },
  isEnglishCourse: {
    label: "İngilizce Hazırlık",
    description: "Öğrenci ingilizce hazırlık mı okuyor.",
    selectItems: [
      {
        key: "true",
        label: "Evet",
      },
      {
        key: "false",
        label: "Hayır",
      },
    ],
    isRequired: false,
    isEditable: true,
  },
  isSchoolRequireInterview: {
    label: "Üniversite mülakat gereksinimi",
    selectItems: [
      {
        key: "true",
        label: "Gerekli",
      },
      {
        key: "false",
        label: "Gerekli değil",
      },
    ],
    isRequired: false,
    isEditable: true,
  },
  isSchoolInterviewCompleted: {
    label: "Üniversite mülakat durumu",
    description:
      "Öğrenci eğer mülakat gerektiren bir okulda okumak istiyor ise mülakat durumunu buradan değiştirebilirsiniz",
    selectItems: [
      {
        key: "true",
        label: "Başarılı",
      },
      {
        key: "false",
        label: "Başarısız",
      },
    ],
    isRequired: false,
    isEditable: true,
  },
  isSchoolPaymentComplete: {
    label: "Okul ödemesi durumu",
    selectItems: [
      {
        key: "true",
        label: "Ödeme Yapılmış",
      },
      {
        key: "false",
        label: "Ödeme Yapılmamış",
      },
    ],
    isRequired: true,
    isEditable: true,
  },
  isTranscriptGiven: {
    label: "Transkript durumu",
    selectItems: [
      {
        key: "true",
        label: "Teslim edilmiş",
      },
      {
        key: "false",
        label: "Teslim edilmemiş",
      },
    ],
    isRequired: true,
    isEditable: true,
  },
  isSchoolRegistered: {
    label: "Okula kayıt durumu",
    selectItems: [
      {
        key: "true",
        label: "Yapılmış",
      },
      {
        key: "false",
        label: "Yapılmamış",
      },
    ],
    isRequired: true,
    isEditable: true,
  },
  isDocumentsVerified: {
    label: "Tüm döküman durumu",
    description:
      "Öğrencinin tüm döküman durumlarının onaylanıp onaylanmadığını temsil eder.",
    selectItems: [
      {
        key: "true",
        label: "Onaylanmış",
      },
      {
        key: "false",
        label: "Onaylanmamış",
      },
    ],
    isRequired: true,
    isEditable: true,
  },
  mentor_id: {
    label: "Mentör ID",
    isRequired: false,
  },
  mentor_note: {
    label: "Mentör Notu",
    isRequired: false,
    isEditable: true,
    description:
      "Mentörün öğrenci hakkındaki notunu buradan görüntüleyip değiştirebilirsiniz.",
  },
  mentor_phone: {
    label: "Mentör Tel No",
    isRequired: false,
    isEditable: true,
  },
  isTransportationCardCreated: {
    label: "Ulaşım Kartı",
    isRequired: false,
    isEditable: true,
    selectItems: [
      {
        key: "true",
        label: "Çıkarılmış",
      },
      {
        key: "false",
        label: "Çıkarılmamış",
      },
    ],
  },
  isBankAccountCreated: {
    label: "Banka Hesabı",
    isRequired: false,
    isEditable: true,
    selectItems: [
      {
        key: "true",
        label: "Açılmış",
      },
      {
        key: "false",
        label: "Açılmamış",
      },
    ],
  },
  isAirportPickupCompleted: {
    label: "Havaalanı karşılaması",
    isRequired: false,
    isEditable: true,
    selectItems: [
      {
        key: "true",
        label: "Yapılmış",
      },
      {
        key: "false",
        label: "Yapılmamış",
      },
    ],
  },
  isAccommodationCompleted: {
    label: "Konaklama işlemleri",
    isRequired: false,
    isEditable: true,
    selectItems: [
      {
        key: "true",
        label: "Tamamlanmış",
      },
      {
        key: "false",
        label: "Tamamlanmamış",
      },
    ],
  },
  isSimCardCompleted: {
    label: "Sim Kart",
    isRequired: false,
    isEditable: true,
    selectItems: [
      {
        key: "true",
        label: "Alınmış",
      },
      {
        key: "false",
        label: "Alınmamış",
      },
    ],
  },
  isVisaCompleted: {
    label: "Vize İşlemleri",
    isRequired: true,
    isEditable: true,
    description: "Tüm vize işlemlerini temsil eder.",
    selectItems: [
      {
        key: "true",
        label: "Tamamlanmış",
      },
      {
        key: "false",
        label: "Tamamlanmamış",
      },
    ],
  },
  isTrcCompleted: {
    label: "TRC işlemleri",
    isRequired: true,
    isEditable: true,
    selectItems: [
      {
        key: "true",
        label: "Tamamlanmış",
      },
      {
        key: "false",
        label: "Tamamlanmamış",
      },
    ],
  },
  isUniversityRegistrationProcessCompleted: {
    label: "Okul Kayıt işlemleri",
    isRequired: true,
    isEditable: true,
    description: "Tüm  Okul kayıt işlemlerini temsil eder.",
    selectItems: [
      {
        key: "true",
        label: "Tamamlanmış",
      },
      {
        key: "false",
        label: "Tamamlanmamış",
      },
    ],
  },
  isMentorShipCompleted: {
    label: "Mentör programı",
    isRequired: true,
    isEditable: true,
    selectItems: [
      {
        key: "true",
        label: "Tamamlanmış",
      },
      {
        key: "false",
        label: "Tamamlanmamış",
      },
    ],
  },
  mentor_name: {
    label: "Mentör Adı",
    description:
      "Mentör otomatik olarak atanır, ancak mentörü değiştirmek isterseniz lütfen bu kutucuğa mentör adı ve soy adını tam olarak yazın.",
    isRequired: false,
    isEditable: true,
  },
  passport_docs: {
    label: "Pasaport Dökümanları",
    isRequired: false,
    isEditable: true,
  },
  visa_docs: {
    label: "Vize Dökümanları",
    isRequired: false,
    isEditable: true,
  },
  trc_docs: {
    label: "TRC Dökümanları",
    isRequired: false,
    isEditable: true,
  },
  accommodation_docs: {
    label: "Konaklama Dökümanları",
    isRequired: false,
    isEditable: true,
  },
  university_docs: {
    label: "Üniversite Dökümanları",
    isRequired: false,
    isEditable: true,
  },
  isTrcIncluded: {
    label: "Oturum Paketi",
    description: "Öğrenci oturum kartı işlemleri paketi durumu",
    selectItems: [
      {
        key: "true",
        label: "Paket dahil",
      },
      {
        key: "false",
        label: "Paket dahil değil",
      },
    ],
    isRequired: true,
    isEditable: true,
  },
  isFingerprintConfirmed: {
    selectItems: [
      {
        key: "true",
        label: "Tamamlanmış",
      },
      {
        key: "false",
        label: "Tamamlanmamış",
      },
    ],
    label: "Parmak izi Onaylanmış",
    isRequired: true,
    isEditable: true,
  },
};
