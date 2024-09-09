import {
  HiHome,
  HiUserGroup,
  HiUserCircle,
  HiUserPlus,
  HiOutlineCalendarDays,
  HiOutlineChatBubbleLeftRight,
  HiOutlineCurrencyDollar,
  HiWrenchScrewdriver,
} from "react-icons/hi2";
import { TbHelpSquare } from "react-icons/tb";

export default [
  {
    name: {
      title: "Genel",
      stateName: "AdminDashboard",
      ico: <HiHome className="w-5 h-5" />,
      meta: "Pano Notlar Etkinlikler Not ekle kayıt onay listesi grafikler randevu oluştur rendevu tablosu",
    },
  },
  {
    name: {
      title: "öğrenci bilgileri",
      stateName: "StudentInfo",
      ico: <HiUserGroup className="w-5 h-5" />,
    },
    child: [
      {
        title: "Öğrenci Genel",
        stateName: "StudentManager",
        ico: <HiUserCircle className="w-5 h-5" />,
        meta: "Öğrenci yönetim grafik dağılım öğrenci görüntüle ",
      },
      {
        title: "Öğrenci Kayıt Edit",
        stateName: "StudentEdit",
        ico: <HiUserPlus className="w-5 h-5" />,
        meta: "Öğrenci yönetim grafik dağılım öğrenci düzenle editle kaydet öğrenci ara  ",
      },
    ],
  },
  {
    name: {
      title: "Etkinlik & Duyuru",
      stateName: "Events",
      ico: <HiOutlineCalendarDays className="w-5 h-5" />,
      meta: "Etkinlik düzenle etkinlik oluştur duyuru oluştur etkinlik sil etkinlik yönet",
    },
  },
  {
    name: {
      title: "Mesaj Kanalı",
      stateName: "MessageChannel",
      ico: <HiOutlineChatBubbleLeftRight className=" w-5 h-5" />,
      meta: "Mesaj kanalı mesaj gönder mesajlaşma iletişim modülü",
    },
  },
  {
    name: {
      title: "finans",
      stateName: "Finances",
      ico: <HiOutlineCurrencyDollar className="w-5 h-5 " />,
      meta: "Finans gelir gider gelir tablosu gider tablosu rapor düzenle ",
    },
  },
  {
    name: {
      title: "yardım & bildirim",
      stateName: "Help",
      ico: <TbHelpSquare className="w-5 h-5" />,
      meta: "Yardım bildirim rapor hata uygulama rehberi",
    },
  },
  {
    name: {
      title: "ayarlar",
      stateName: "Settings",
      ico: <HiWrenchScrewdriver className="w-5 h-5" />,
    },
  },
];
