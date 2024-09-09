import { setStep } from "@/stores/slices/stepSlice";
import { useSpring, animated } from "@react-spring/web";
import { Button, Input } from "@nextui-org/react";
import { CiMail } from "react-icons/ci";
import { useEffect, useState } from "react";
import { setLoginData } from "@/stores/slices/loginSlice";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "@/stores/slices/loadingSlice";
import { supabase } from "@/utils/db/supabase";
import { emailDbValidator } from "@/utils/db/emailDbValidator";
import alertModal from "@/utils/assistants/alertModal";
import { emailChecker } from "@/utils/db/adminQueries/emailChecker";

export const Login = () => {
  const dispatch = useDispatch();
  const { id, avatar, name, perms } = useSelector((state) => state.login);
  const { no, auth: stepAuth } = useSelector((state) => state.step);
  const [userEmail, setUserEmail] = useState("");
  const [logError, setLogError] = useState(undefined);
  const [queryLoading, setQueryLoading] = useState(false);

  const handleRegister = () => {
    dispatch(
      setStep({
        auth: "student",
        no: no + 1,
      })
    );
  };

  const handleLogin = async (email) => {
    if (stepAuth === "student") {
      setQueryLoading(true);
      try {
        const val = await emailDbValidator(email);
        if (val) {
          try {
            dispatch(
              setLoading({
                loading: true,
              })
            );
            const { error } = await supabase.auth.signInWithOtp({
              email,
              options: { emailRedirectTo: "/" },
            });
            if (error) throw error;
            alertModal({
              toastIcon: "success",
              toastTitle:
                "Lütfen mail ve spam kutunuzu ve kontrol edin. Email Spam'a düşmüş olabilir",
            });
          } catch (error) {
            alertModal({
              toastIcon: "error",
              toastTitle: `Email yollarken problem yaşadık: ${
                error.error_description || error.message
              }`,
            });
          } finally {
            dispatch(
              setLoading({
                loading: false,
              })
            );
          }
          setLogError(false);
        } else {
          setLogError(true);
          alertModal({
            toastIcon: "error",
            toastTitle: "Email sistemde kayıtlı değil.",
          });
        }
      } catch (error) {
        alertModal({
          toastIcon: "error",
          toastTitle: `${error.message || error.message.description}`,
        });
      } finally {
        setQueryLoading(false);
      }
    }

    if (stepAuth === "admin") {
      setQueryLoading(true);
      const checkEmail = await emailChecker(email).finally(() => {
        setQueryLoading(false);
      });

      if (checkEmail) {
        try {
          dispatch(
            setLoading({
              loading: true,
            })
          );
          const { error } = await supabase.auth.signInWithOtp({
            email,
            options: { emailRedirectTo: "/" },
          });

          if (error) throw error;
          alertModal({
            toastIcon: "success",
            toastTitle:
              "Lütfen mail ve spam kutunuzu ve kontrol edin. Email Spam'a düşmüş olabilir",
          });
        } catch (error) {
          alertModal({
            toastIcon: "error",
            toastTitle: `Email yollarken problem yaşadık: ${
              error.error_description || error.message
            }`,
          });
        } finally {
          dispatch(
            setLoading({
              loading: false,
            })
          );
        }
        setLogError(false);
      } else {
        setLogError(true);
        alertModal({
          toastIcon: "error",
          toastTitle: "Email sistemde kayıtlı değil.",
        });
      }
    }
  };

  useEffect(() => {
    if (userEmail) {
      dispatch(
        setLoginData({
          login: true,
          email: userEmail,
          auth: stepAuth,
          id,
          avatar,
          name,
          perms,
        })
      );
    }
  }, [userEmail, dispatch, stepAuth, id, avatar, name, perms]);

  const animation = useSpring({
    from: { opacity: 0, transform: "translateY(-10px)" },
    to: { opacity: 1, transform: "translateY(0)" },
    config: { duration: 500 },
  });

  return (
    <>
      <Input
        type="email"
        color="default"
        variant="bordered"
        className="dark text-white"
        radius="sm"
        label={"Email"}
        classNames={{
          errorMessage: "font-semibold tracking-tighter",
        }}
        errorMessage={
          stepAuth === "admin"
            ? "Email sistemde kayıtlı değil."
            : "Email sistemde kayıtlı değil. Giriş yapmak için önce kayıt olun."
        }
        isInvalid={logError}
        disabled={queryLoading}
        startContent={<CiMail className="w-5 h-5 " />}
        value={userEmail}
        onChange={(e) => {
          setUserEmail(e.target.value);
        }}
      />
      <Button
        className={`w-full dark text-xl`}
        color="danger"
        size="lg"
        variant="solid"
        onPress={() => {
          handleLogin(userEmail);
        }}
      >
        {!queryLoading ? "GİRİŞ" : "Yükleniyor"}
      </Button>
      {stepAuth !== "admin" && (
        <animated.button
          className={`underline-offset-4 text-sm underline tracking-tight hover:text-slate-300 text-white`}
          onClick={handleRegister}
          style={animation}
        >
          Bir hesabınız yok mu? Buraya tıklayarak hemen bir hesap oluşturun!
        </animated.button>
      )}
    </>
  );
};
