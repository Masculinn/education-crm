import { FaUniversity } from "react-icons/fa";
import { HiDocument, HiHome, HiOutlineChatBubbleLeft } from "react-icons/hi2";
import { TbHelpSquare } from "react-icons/tb";

export default [
  {
    name: {
      title: "Genel",
      stateName: "StudentDashMain",
      ico: <HiHome className=" w-6 h-6" />,
      meta: "Genel Etkinlikler genel notlarım Randevularım Mentör programım ",
    },
  },
  {
    name: {
      title: "Profilim",
      stateName: "StudentDocumentManager",
      ico: <HiDocument className=" w-6 h-6" />,
      meta: "Döküman Yönetimim profilim adres şehir pasaport konaklama vize oturum döküman yükleme bilgilerim verilerim",
    },
  },
  {
    name: {
      title: "Okulum",
      stateName: "SchoolInfo",
      ico: <FaUniversity className=" w-6 h-6" />,
      meta: "Okulum okul bilgilerim hatırlatıcı okul notları üniversitei kartım program",
    },
  },
  {
    name: {
      title: "mesaj kanalı",
      stateName: "MessageChannel",
      ico: <HiOutlineChatBubbleLeft className=" w-6 h-6" />,
      meta: "Mesaj kanalı mesaj gönder mesajlaşma iletişim modülü",
    },
  },
  {
    name: {
      title: "yardım & bildirim",
      stateName: "Help",
      ico: <TbHelpSquare className="w-6 h-6" />,
      meta: "Yardım bildirim rapor hata uygulama rehberi",
    },
  },
];
