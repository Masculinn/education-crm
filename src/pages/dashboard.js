import { setLoading } from "@/stores/slices/loadingSlice";
import { resetLoginData, setLoginData } from "@/stores/slices/loginSlice";
import { supabase } from "@/utils/db/supabase";
import {
  Button,
  Image,
  Avatar,
  Skeleton,
  Tooltip,
  Chip,
} from "@nextui-org/react";
import { useRouter } from "next/router";
import { useEffect, useState, startTransition } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Inter } from "next/font/google";
import { DM_Sans } from "next/font/google";
import studentSidebar from "@/lib/studentSidebar";
import { setComponentNumber } from "@/stores/slices/componentSlice";
import { MdLogout } from "react-icons/md";
import dynamic from "next/dynamic";
import { emailChecker } from "@/utils/db/adminQueries/emailChecker";
import adminSidebar from "@/lib/adminSidebar";
import Head from "next/head";
import permdb from "@/lib/permdb";
import { FaArrowRight } from "react-icons/fa6";
import { setModal } from "@/stores/slices/modalSlice";
import { GrantList } from "@/components/utils/GrantList";
import { useMediaQuery } from "react-responsive";
import { setResponsiveChecker } from "@/stores/slices/responsiveCheckerSlice";

const inter = Inter({
  subsets: ["latin"],
});

const sidebarFont = DM_Sans({
  subsets: ["latin"],
});

const StudentDashMain = dynamic(
  () => import("@/components/sidebar/student/StudentDashMain"),
  {
    ssr: false,
  }
);
const SchoolInfo = dynamic(
  () => import("@/components/sidebar/student/SchoolInfo"),
  {
    ssr: false,
  }
);

const MessageChannel = dynamic(() => import("@/components/MessageChannel"), {
  ssr: false,
});
const StudentDocumentManager = dynamic(
  () => import("@/components/sidebar/student/StudentDocumentManager"),
  { ssr: false }
);

const Help = dynamic(() => import("@/components/sidebar/student/Help"), {
  ssr: false,
});

const AdminDashboard = dynamic(
  () => import("@/components/sidebar/admin/AdminDashboard"),
  {
    ssr: false,
  }
);

const Events = dynamic(() => import("@/components/sidebar/admin/Events"), {
  ssr: false,
});

const Finances = dynamic(() => import("@/components/sidebar/admin/Finances"), {
  ssr: false,
});

const Settings = dynamic(() => import("@/components/sidebar/admin/Settings"), {
  ssr: false,
});

const StudentEdit = dynamic(
  () => import("@/components/sidebar/admin/StudentEdit"),
  {
    ssr: false,
  }
);

const StudentManager = dynamic(
  () => import("@/components/sidebar/admin/StudentManager"),
  {
    ssr: false,
  }
);

export default function Dashboard() {
  const isResponsive = useMediaQuery({ query: "(max-width: 768px)" });
  const [isRes, setIsRes] = useState(null);

  const dispatch = useDispatch();
  const router = useRouter();
  const { auth, email, name, avatar, perms } = useSelector(
    (state) => state.login
  );
  const { no } = useSelector((state) => state.comp);
  const [isReady, setIsReady] = useState(false);
  const { state: isOpen } = useSelector((state) => state.modal);

  useEffect(() => {
    setIsRes(isResponsive);
    dispatch(setResponsiveChecker({ state: isResponsive }));
  }, [isResponsive]);

  useEffect(() => {
    dispatch(
      setComponentNumber({
        no: auth === "admin" ? "AdminDashboard" : "StudentDashMain",
      })
    );
    startTransition(() => {
      getProfile().finally(() => {
        setIsReady(true);
      });
    });
  }, [auth]);

  const getProfile = async () => {
    try {
      dispatch(
        setLoading({
          loading: true,
        })
      );
      const { data, error } = await supabase.auth.getUser();
      if (error || !data.user.id) {
        router.push("/404");
        return;
      } else {
        const check = await emailChecker(data.user.email);
        if (check) {
          const { data: adminData, error: adminError } = await supabase
            .from("admins")
            .select("*")
            .eq("email", data.user.email)
            .single();

          if (adminData) {
            dispatch(
              setLoginData({
                login: true,
                auth: "admin",
                id: adminData.id,
                email: adminData.email,
                name: adminData.name,
                avatar: adminData.avatar,
                perms: adminData.perms,
              })
            );
          } else if (adminError || !adminData) {
            dispatch(resetLoginData());
            router.push("/404");
          }
        } else {
          const { data: profileData, error: profileError } = await supabase
            .from("students")
            .select(
              "id, name, program, university, status, city, email, avatar,age, phone, address "
            )
            .eq("email", data.user.email)
            .single();
          if (profileData) {
            dispatch(
              setLoginData({
                login: true,
                auth: "student",
                id: profileData.id,
                email: profileData.email,
                name: profileData.name,
                city: profileData.city,
                university: profileData.university,
                program: profileData.program,
                age: profileData.age,
                status: profileData.status,
                phone: profileData.phone,
                address: profileData.address,
                avatar: profileData.avatar,
              })
            );
          } else if (profileError || !profileData) {
            dispatch(resetLoginData());
            router.push("/404");
          }
        }
      }
    } catch (error) {
      return;
    }
  };

  const studentComponent = {
    StudentDashMain: <StudentDashMain />,
    SchoolInfo: <SchoolInfo />,
    MessageChannel: <MessageChannel />,
    StudentDocumentManager: <StudentDocumentManager />,
    Help: <Help />,
  };

  const adminComponent = {
    AdminDashboard: <AdminDashboard />,
    StudentManager: <StudentManager />,
    StudentEdit: <StudentEdit />,
    Events: <Events />,
    MessageChannel: <MessageChannel />,
    Finances: <Finances />,
    Help: <Help />,
    Settings: <Settings />,
  };

  const sidebarComponents =
    auth === "admin" ? adminComponent : studentComponent;
  const sidebar = auth === "admin" ? adminSidebar : studentSidebar;
  return (
    <>
      <Head>
        <title>
          {auth === "admin" ? "Olympos Admin Portal" : "Olympos Öğrenci Portal"}
        </title>
      </Head>
      <div
        className={`w-full h-screen bg-slate-950 absolute items-center ${inter.className} justify-between flex flex-row`}
        suppressHydrationWarning
      >
        <div
          className={`flex h-screen flex-col justify-between border-gray-500 border-e bg-slate-950 lg:w-1/5 w-1/6 ${sidebarFont.className}`}
          suppressHydrationWarning
        >
          <div className="py-6">
            <div
              className={`px-2 items-center text-center justify-start flex flex-row gap-4 w-full`}
            >
              <Image
                src={"/edu-logo.png"}
                width={500}
                height={500}
                alt="Olympos Edu Logo"
                className=" w-auto lg:h-24 h-16  lg:rounded-none rounded-full brightness-0 invert"
              />
              <div className="lg:flex hidden items-center flex-row gap-1 justify-center  text-black tracking-tight text-center w-auto text-lg">
                <span className="text-sky-500 ">Olympos</span>
                <span className="text-rose-500  pt-0.5">Portal</span>
              </div>
            </div>
            <hr className="border-gray-500" />
            <ul className="mt-6 px-6 space-y-1 w-full h-auto">
              {sidebar?.map((val, idx) =>
                val.child ? (
                  <li key={idx} className="w-full h-auto">
                    <details className="group [&_summary::-webkit-details-marker]:hidden">
                      <summary className="flex cursor-pointer items-center justify-between rounded-lg lg:px-4 py-2 text-white lg:hover:bg-gray-100 hover:bg-gray-100 hover:text-gray-700 lg:hover:text-gray-700 capitalize">
                        <span className="text-sm font-medium text-center ">
                          {!isRes ? val.name.title : val.name.ico}
                        </span>
                        <span className="transition-all duration-300 group-open:-rotate-180">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 011.414 1.414l-4 4a1 1 01-1.414 0l-4-4a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </span>
                      </summary>
                      <ul className="mt-2 space-y-1 lg:px-4 px-1 w-full h-auto">
                        {val.child.map((childVal, idx) => (
                          <li key={idx} className="w-full h-auto capitalize ">
                            <button
                              className="block w-full h-auto text-start focus:translate-x-2 focus-within:scale-110 transition-all duration-200 rounded-lg lg:px-4 py-2  text-sm font-medium text-slate-200 lg:hover:bg-gray-100 lg:hover:text-gray-700"
                              onClick={() => {
                                dispatch(
                                  setComponentNumber({
                                    no: childVal.stateName,
                                  })
                                );
                              }}
                            >
                              {!isRes ? childVal.title : childVal.ico}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </details>
                  </li>
                ) : (
                  <li className="text-black capitalize w-full h-auto" key={idx}>
                    <button
                      className="block capitalize rounded-lg focus:translate-x-2 focus:scale-110 transition-all duration-200  lg:px-4 py-2 text-sm font-medium text-white lg:hover:bg-gray-100 lg:hover:text-gray-700 text-start w-full"
                      onClick={() => {
                        dispatch(
                          setComponentNumber({
                            no: val.name.stateName,
                          })
                        );
                      }}
                    >
                      {!isRes ? val.name.title : val.name.ico}
                    </button>
                  </li>
                )
              )}
            </ul>
          </div>
          <Tooltip
            offset={-5}
            className="dark"
            isDisabled={auth === "student" || isRes === true}
            content={
              <div className="px-1 py-2 w-60 h-auto">
                <div className="text-base tracking-tight py-2 text-white">
                  Yetkinliklerim
                </div>
                <div className="text-tiny items-center justify-start mt-2 flex flex-wrap gap-2 text-white">
                  {perms?.map((val, idx) => {
                    const chipColor = permdb.find((x) => x.perm === val);
                    return (
                      <Chip
                        showArrow={true}
                        variant={"flat"}
                        key={idx}
                        color={chipColor.color}
                      >
                        {val}
                      </Chip>
                    );
                  })}
                </div>
                <Button
                  className="mt-4 w-full"
                  color="primary"
                  onClick={() => {
                    dispatch(
                      setModal({
                        state: true,
                      })
                    );
                  }}
                >
                  <span>Yetkinlikler Listesi</span>
                  <FaArrowRight className="w-3 h-3" />
                </Button>
              </div>
            }
          >
            <div className="sticky inset-x-0 bottom-0 lg:border-t border-gray-500">
              {!isRes && (
                <figure className="items-center gap-2 bg-tranpsarent p-4 flex">
                  {!isReady ? (
                    <div className="max-w-[300px] w-full flex items-center gap-3">
                      <div>
                        <Skeleton className="flex rounded-full w-12 h-12 dark" />
                      </div>
                      <div className="w-full flex flex-col gap-2">
                        <Skeleton className="h-3 w-3/5 rounded-lg dark" />
                        <Skeleton className="h-3 w-4/5 rounded-lg dark" />
                      </div>
                    </div>
                  ) : (
                    <>
                      <Avatar
                        alt={name}
                        src={avatar}
                        height={50}
                        width={50}
                        className="size-10 rounded-full object-cover"
                      />
                      {!isRes && (
                        <div>
                          <p className="text-xs text-white">
                            <strong className="block text-sm font-medium">
                              {name}
                            </strong>
                            <span> {email} </span>
                          </p>
                        </div>
                      )}
                    </>
                  )}
                </figure>
              )}
              {!isRes ? (
                <Button
                  onPress={() => {
                    supabase.auth.signOut();
                    dispatch(resetLoginData());
                    router.push("/");
                  }}
                  className="dark w-full text tracking-tight"
                  color="danger"
                  variant="flat"
                  radius="none"
                  endContent={<MdLogout className="w-6 h-6" />}
                >
                  Çıkış Yap
                </Button>
              ) : (
                <button
                  onClick={() => {
                    supabase.auth.signOut();
                    dispatch(resetLoginData());
                    router.push("/");
                  }}
                  className="w-full text tracking-tight bg-danger-500 px-4 py-2 text-white items-center justify-center flex "
                  color="danger"
                  variant="flat"
                  radius="none"
                  endContent={<MdLogout className="w-6 h-6" />}
                >
                  <MdLogout className="w-6 h-6" />
                </button>
              )}
            </div>
          </Tooltip>
        </div>
        <div
          className="h-screen bg-slate-950 text-white w-4/5 -pt-4"
          suppressHydrationWarning
        >
          <div
            className="w-full text-white h-full bg-slate-950  overflow-y-scroll overflow-x-hidden "
            suppressHydrationWarning
          >
            {sidebarComponents[no]}
          </div>
        </div>
      </div>
      {isOpen && <GrantList />}
    </>
  );
}
