import { supabase } from "@/utils/db/supabase";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "@nextui-org/react";
import { IoArrowBack } from "react-icons/io5";
import { setStep } from "@/stores/slices/stepSlice";
import { Login } from "@/components/login";
import { ProgramActions, UniversityActions } from "@/components/login/actions";
import { Registration } from "@/components/login/registration";
import { Inter } from "next/font/google";
import { useDispatch, useSelector } from "react-redux";
import { Redirection } from "@/components/login/registration/redirect";
import { Confirm } from "@/components/login/registration/confirm";
import { LogoLoading } from "@/components/loading/LogoLoading";
import { useRouter } from "next/router";
import { setLoading } from "@/stores/slices/loadingSlice";
import { setLoginData } from "@/stores/slices/loginSlice";
import alertModal from "@/utils/assistants/alertModal";
import { Divider } from "@/components/utils/Divider";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const dispatch = useDispatch();
  const { no, auth } = useSelector((state) => state.step);
  const {
    email,
    id,
    avatar,
    name,
    city,
    university,
    program,
    age,
    status,
    phone,
    address,
  } = useSelector((state) => state.login);
  const [session, setSession] = useState(null);
  const router = useRouter();

  const handleStudent = () => {
    const max = 4;
    dispatch(
      setStep({
        auth: "student",
        no: max !== no ? no + 1 : max,
      })
    );
  };

  const handleAdmin = () => {
    dispatch(setStep({ no: 1, auth: "admin" }));
  };

  const handleBack = () => {
    const min = 0;
    dispatch(
      setStep({
        auth: auth,
        no: min !== no ? no - 1 : no,
      })
    );
  };

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const { data: userSession, error } = await supabase.auth.session();
        if (error) throw error;
        setSession(userSession);

        if (!userSession) {
          dispatch(
            setLoginData({
              login: false,
              auth: auth,
              email,
              id,
              avatar,
              name,
              city,
              university,
              program,
              age,
              status,
              phone,
              address,
            })
          );
        }
      } catch (err) {
        err.message === "Email rate limit exceeded" &&
          alertModal({
            toastIcon: "warning",
            toastTitle:
              "Çok fazla email isteği gönderdiğiniz için email limiti aşıldı, lütfen 5 dakika sonra tekrar deneyin",
          });
      } finally {
        dispatch(setLoading({ loading: false }));
      }
    };

    fetchSession();

    const { data: authSubscription } = supabase.auth.onAuthStateChange(
      (_event, userSession) => {
        setSession(userSession);
      }
    );

    return () => {
      if (authSubscription && authSubscription.unsubscribe) {
        authSubscription.unsubscribe();
      }
    };
  }, []);

  useEffect(() => {
    if (session) {
      dispatch(
        setLoginData({
          login: true,
          auth: auth,
          email,
          id,
          avatar,
          name,
          city,
          university,
          program,
          age,
          status,
          phone,
          address,
        })
      );
      router.push("/dashboard");
    }
  }, [session, router]);

  return (
    <main className={`w-full h-screen flex ${inter.className}`}>
      <Divider />

      <div className="relative flex-1 hidden items-center justify-center h-screen bg-transparent lg:flex">
        <div className="relative  w-full max-w-lg z-20 p-20   rounded-3xl ">
          <Image
            src={"/edu-logo.png"}
            width={125}
            height={125}
            alt="Olympos Edu Logo"
            className=" brightness-0  -mt-8"
          />
          <div className="space-y-3">
            <h3 className={`text-black text-4xl font-bold tracking-tight`}>
              OLYMPOS <span className="text-rose-600">PORTAL</span>
            </h3>
            <p className="text-slate-800 tracking-tight">
              Olympos Eğitim Danışmanlığı olarak, her adımda öğrencilerimizin
              yanında olmayı ve onların geleceğe güvenle adım atmalarını
              sağlamayı amaçlıyoruz.
            </p>
          </div>
        </div>
        <div
          className="w-full h-full object-cover inset-0 absolute bg-center bg-cover z-10 bg-black/90"
          style={{ backgroundImage: "url('/indexbg.svg')" }}
        ></div>
      </div>
      <div className="flex flex-1 items-center justify-center min-h-screen bg-slate-950 text-white ">
        {no !== 6 ? (
          <div className="w-full h-full overflow-y-scroll mx-auto lg:max-w-xl max-w-lg flex flex-col items-center justify-center gap-3 p-4">
            <div
              className={`w-full ${inter.className} h-auto mx-auto lg:max-w-xl max-w-lg flex flex-col items-start justify-center gap-2 mb-4`}
            >
              {no !== 0 && (
                <Button
                  onPress={handleBack}
                  color="default"
                  variant="bordered"
                  size="md"
                  aria-label="Back Button"
                  className="w-auto  dark my-8 "
                >
                  <IoArrowBack className=" w-6 h-6" />
                </Button>
              )}

              <h3 className="lg:text-4xl text-2xl font-semibold tracking-tighter text-white flex items-center justify-center gap-2">
                <span className="text-rose-600">OLYMPOS</span>{" "}
                {no >= 2 ? "PORTAL KAYIT" : "PORTAL GİRİŞ"}
              </h3>

              <h2 className="lg:text-md text-sm text-slate-200 tracking-tight">
                {no <= 2 &&
                  "Email hesabınızı kullanarak tek seferde şifreye ihtiyaç olmadan giriş yapın!"}
                {no === 3 &&
                  "Lütfen sağa kaydırarak üniversite seçimini yapın."}
                {no === 4 &&
                  "Kayıdınızın tamamlanmasına çok az kaldı! Lütfen aşağıdan bölüm seçin."}
                {no === 5 && (
                  <span className="text-amber-200">
                    Lütfen bilgilerinizi tekrar kontrol edin ve kayıt
                    işlemlerini bitirin. Eğer bilgileriniz yanlış ise geri
                    gelerek gerekli düzenlemeleri yapabilirsiniz.
                  </span>
                )}
                {no === 2 && (
                  <span className="text-amber-200 text-sm pl-2">
                    Lütfen kayıt olurken geçerli email kullanın. Olymposedu
                    olarak şifrelerinizin korurken sadece email kullanıyoruz.
                    Hesabınıza sadece email yoluyla ulaşabildiğinizi unutmayın.
                  </span>
                )}
              </h2>
            </div>
            {no === 0 && (
              <>
                <div
                  className="bg-cover cursor-pointer bg-center mx-auto max-w-lg w-full h-1/5 flex items-center justify-center rounded-xl text-black "
                  style={{
                    backgroundImage: "url(/assets/button-student-bg.jpg)",
                  }}
                  onClick={handleStudent}
                >
                  <div className="w-full h-full bg-black/50 flex items-center justify-center rounded-xl hover:backdrop-brightness-90">
                    <h2 className="text-3xl text-white tracking-tighter">
                      ÖĞRENCİ GİRİŞ
                    </h2>
                  </div>
                </div>
                <Button
                  color="danger"
                  className="mx-auto  max-w-lg w-full h-1/5 text-white "
                  onClick={handleAdmin}
                >
                  <h2 className="text-3xl tracking-tighter">YETKİLİ GİRİŞ</h2>
                </Button>
              </>
            )}
            {no === 1 && <Login />}
            {no === 2 && <Registration />}
            {no === 3 && <UniversityActions />}
            {no === 4 && <ProgramActions />}
            {no === 5 && <Confirm />}
          </div>
        ) : (
          <Redirection />
        )}
      </div>
      <LogoLoading h={75} w={75} />
    </main>
  );
}
