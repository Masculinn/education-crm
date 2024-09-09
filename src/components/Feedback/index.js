import { BiSolidMessageAltError } from "react-icons/bi";
import {
  Button,
  CircularProgress,
  Code,
  Input,
  Textarea,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import idGenerator from "@/utils/assistants/idGenerator";
import { getDate } from "@/utils/assistants/getDate";
import addFeedback from "@/utils/db/addFeedback";
import { IoWarning } from "react-icons/io5";
import { RotateBar } from "../utils/RotateBar";

export const Feedback = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const { email } = useSelector((state) => state.login);
  const [feedback, setFeedback] = useState({
    email: null,
    section: "",
    error_code: "",
    description: "",
  });

  const [error, setError] = useState({
    onError: false,
    msg: null,
  });

  useEffect(() => {
    setFeedback((prev) => ({
      ...prev,
      email: email,
    }));
  }, [email]);

  const handleSubmit = () => {
    if (feedback.section !== "") {
      if (feedback.description !== "") {
        const newId = idGenerator(16, "number");
        const date = getDate();

        const updatedFeedback = {
          ...feedback,
          id: newId,
          created_at: date,
        };

        setError({
          onError: false,
          msg: null,
        });

        const sendFeedback = async () => {
          setLoading(true);
          await addFeedback(updatedFeedback, dispatch).finally(() => {
            setLoading(false);
            setFeedback({
              email: feedback.email,
              id: "",
              created_at: "",
              section: "",
              error_code: "",
              description: "",
            });
          });
        };

        sendFeedback();
      } else {
        setError({
          onError: true,
          msg: "Lütfen ayrıntılı bilgi giriniz.",
        });
      }
    } else {
      setError({
        onError: true,
        msg: "Hata ile ilgili bölüm boş bırakılmamalıdır.",
      });
    }
  };

  return (
    <div className="container w-full h-auto mt-4">
      <h2 className="font-extrabold text-3xl tracking-tight text-slate-200">
        Teknik Hata Raporu Düzenle
      </h2>
      <aside className="w-full h-auto sitems-center justify-center flex flex-col mt-4 gap-2">
        <div className="w-full h-auto items-center justify-center flex flex-row gap-2">
          <Input
            className="dark w-3/5"
            color="default"
            variant="bordered"
            label="Hata ile İlgili Bölüm"
            placeholder="Ör: Genel, Profilim, Okulum..."
            value={feedback.section}
            onChange={(e) => {
              setFeedback((prev) => ({
                ...prev,
                section: e.target.value,
              }));
            }}
            onClear={() => {
              setFeedback((prev) => ({
                ...prev,
                section: "",
              }));
            }}
            errorMessage={"Bu kısım boş bırakılmamalıdır"}
            isClearable
            isRequired
            startContent={<BiSolidMessageAltError className="w-5 h-5" />}
          />
          <Input
            className="dark w-2/5"
            color="default"
            variant="bordered"
            value={feedback.error_code}
            placeholder="Ör: 101, 102..."
            label="Hata Kodu"
            isClearable
            startContent={<BiSolidMessageAltError className="w-5 h-5" />}
            onChange={(e) => {
              setFeedback((prev) => ({
                ...prev,
                error_code: e.target.value,
              }));
            }}
            onClear={() => {
              setFeedback((prev) => ({
                ...prev,
                error_code: "",
              }));
            }}
          />
        </div>
        <div className="w-full h-auto items-center justify-start flex flex-row">
          <Textarea
            className="dark w-full h-auto"
            variant="bordered"
            color="default"
            value={feedback.description}
            label="Ayrıntılı Bilgi Giriniz"
            startContent={<BiSolidMessageAltError className="w-5 h-5" />}
            disableAnimation
            placeholder="Tam olarak ne oldu?"
            disableAutosize
            isRequired
            classNames={{
              input: "resize-y min-h-[40px]",
            }}
            maxLength={512}
            onChange={(e) => {
              setFeedback((prev) => ({
                ...prev,
                description: e.target.value,
              }));
            }}
            onClear={() => {
              setFeedback((prev) => ({
                ...prev,
                description: "",
              }));
            }}
          />
        </div>
        {error?.onError && (
          <p className="text-warning-400 items-center justify-start flex flex-row gap-2 pt-1">
            <IoWarning className="w-5 h-5" /> <span>{error.msg}</span>
          </p>
        )}
        <Button
          className="w-1/4 dark self-start mt-2"
          color="success"
          variant="flat"
          size="lg"
          disabled={loading}
          onPress={handleSubmit}
        >
          {loading ? (
            <CircularProgress aria-label="Loading..." color="danger" />
          ) : (
            "Raporu Gönder"
          )}
        </Button>
      </aside>
      <div className="w-full h-auto mt-12">
        <h2 className="font-extrabold text-3xl tracking-tight text-slate-200">
          Uygulama Rehberi
        </h2>
        <RotateBar
          items={["Genel", "Etkinlikler"]}
          style={"mt-8"}
          error_code={"101"}
          description={` Bu bölümde sizler için Polonya'daki çeşitli etkinlikleri, kültürel ve
          sosyal faaliyetleri, kaçırılmayacak fırsatları ve ayrıca okullarla
          ilgili düzenlenen etkinlikleri detaylı bir şekilde görüntüleyebilmeniz
          ve takip edebilmeniz için kapsamlı bir bölüm oluşturduk. Okullarla
          ilgili güncel bilgileri alabilir aynı zamanda bazı kampanyalardan
          Olymposedu öğrencisi olarak yararlanabilirsiniz.`}
        />

        <RotateBar
          items={["Genel", "Notlarım"]}
          style="mt-8"
          description={`Olymposedu olarak uygulama içerisinde dilediğiniz gibi notlar almanızı sağlayacak bir bölüm tasarladık. 
            İstediğiniz herhangi bir notu bu bölüme kaydederek not defteri olarak kullanabilirsiniz. Kayıt ettiğiniz notları, üstüne tıkladıktan sonra 
            sil butonuna basarak silebilirsiniz. 
          `}
          error_code={"102"}
        />

        <RotateBar
          items={["Genel", "Randevularım"]}
          style="mt-8"
          description={`
        Bu bölümde danışman tarafından tarafınıza kayıt edilen randevu bilgilerini görebilirsiniz. İçerisinde toplantı linki de bulunan bu bölümde eğer 
        bir Olymposedu danışmanı sizin adınıza bir randevu programı eklerse bu bölümden takip edebilir ve katılım sağlayabilirsiniz.  
          `}
          error_code={"103"}
        />

        <RotateBar
          items={["Genel", "Mentör Programı"]}
          style="mt-8"
          description={`
          Olymposedu olarak, adınıza kayıtlı olan mentör bilgilerini ve oryantasyon ilerleminizi bu bölümde görüntüleyebilir, takip edebilirsiniz.
          `}
          error_code={"104"}
        />

        <RotateBar
          items={["Profilim", "Profil Görüntüleyici"]}
          style="mt-8"
          description={`
          Bu bölümde profiliniz bulunuyor ve değişiklik yapmak için sadece ilgili bölümlere tıklayarak yapmak istediğiniz 
          değişiklikleri kolayca yapabilirsiniz. Ayrıca bu bölümde sistemdeki kaydınınızın onay durumunu görüntüleyebilirsiniz 
          `}
        />

        <RotateBar items={["Profilim", "Döküman Görüntüleyici"]} style="mt-8" />

        <RotateBar items={["Okulum", "Hatırlatıcı"]} style="mt-8" />
      </div>
    </div>
  );
};
