import {
  Button,
  Input,
  useDisclosure,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Tabs,
  Tab,
  Chip,
} from "@nextui-org/react";
import { MdEmojiEmotions, MdSearch } from "react-icons/md";
import { GoPlus } from "react-icons/go";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import Image from "next/image";
import { getDate } from "@/utils/assistants/getDate";
import { MessageBoxPlaceHolder } from "./MessageBoxPlaceholder";
import { MessageBox } from "./MessageBox";
import { ReceiverInfo } from "./ReceiverInfo";
import findAdmins from "@/utils/db/adminQueries/findAdmins";
import { ChatBox } from "./ChatBox";
import viewAllStudents from "@/utils/db/adminQueries/viewAllStudents";
import { Error } from "../utils/Error";
import viewHistory from "@/utils/db/adminQueries/messaging_module/viewHistory";
import findStudent from "@/utils/db/adminQueries/findStudent";
import sendMessage from "@/utils/db/adminQueries/messaging_module/sendMessage";
import { supabase } from "@/utils/db/supabase";
import startNewChat from "@/utils/db/adminQueries/messaging_module/startNewChat";
import idGenerator from "@/utils/assistants/idGenerator";
import addToMessageArchive from "./addToMessageArchive";

export const Module = () => {
  const { email, id, auth, name } = useSelector((state) => state.login);
  const { state } = useSelector((state) => state.responsive);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const messageContainer = useRef(null);
  const [currentChatID, setCurrentChatID] = useState(null);
  const [receiver, setReceiver] = useState(null);
  const [selectedMessageArchive, setSelectedMessageArchive] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selected, setSelected] = useState("students");
  const [messageText, setMessageText] = useState("");
  const [adminList, setAdminList] = useState([]);
  const [studentList, setStudentList] = useState([]);
  const [chatLoading, setChatLoading] = useState(false);
  const [asideList, setAsideList] = useState([]);
  const [originalAsideList, setOriginalAsideList] = useState([]);
  const audio = useRef(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setChatLoading(true);
      const students = await viewAllStudents("name, id, avatar, program");
      const admins = await findAdmins(email, "FIND_ALL");
      setStudentList(students);
      setAdminList(admins);

      const chatboxHistory = await viewHistory(id).finally(() => {
        setChatLoading(false);
      });

      if (chatboxHistory) {
        const messageArchive = addToMessageArchive(chatboxHistory, id);
        setSelectedMessageArchive(messageArchive);
        const filtered = chatboxHistory.map((val) => {
          return val.sender === id ? val.receiver : val.sender;
        });

        if (filtered) {
          Promise.all(
            filtered.map(async (val) => {
              const length = val.length;
              const deploySideList =
                length > 16
                  ? await findAdmins(email, "FIND_ONE", val)
                  : await findStudent(val);
              return {
                id: deploySideList?.id,
                name: deploySideList?.name,
                avatar: deploySideList?.avatar,
                program:
                  length > 16
                    ? deploySideList?.perms[0]
                    : deploySideList?.program,
              };
            })
          ).then((res) => {
            setAsideList([...res]);
            setOriginalAsideList([...res]);
          });
        }
      }
    };

    fetchUsers();
  }, []);

  const handleSendMessage = async () => {
    const { current } = audio;
    if (messageText && messageText !== "") {
      const newMessage = {
        text: messageText,
        receiver: receiver?.id.toString(),
        isEnd: true,
        sender: id,
        time: getDate(),
      };
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setSelectedMessageArchive((prev) => [...prev, newMessage]);

      if (current) current.play();
      setMessageText("");

      await sendMessage({
        chatID: currentChatID,
        sender: id,
        msg: newMessage.text,
        time: newMessage.time,
      });
    }
  };

  useLayoutEffect(() => {
    if (messageContainer.current) {
      messageContainer.current.scrollTop =
        messageContainer.current.scrollHeight;
    }
  }, [messages]);

  const handleUserSearch = (e) => {
    const { value } = e.target;
    if (value.trim() !== "") {
      const filtered = originalAsideList.filter((user) =>
        user.name.toLowerCase().includes(value.toLowerCase())
      );
      setAsideList(filtered);
    } else {
      setAsideList(originalAsideList);
    }
  };

  const startChat = async (generatedID) => {
    setChatLoading(true);
    const date = getDate();
    const newChat = {
      id: generatedID,
      sender: id,
      receiver: receiver?.id,
      time: date,
      metadata: [
        {
          msg: `Sohbet ${name} tarafından başlatıldı`,
          time: date,
          user_id: id,
        },
      ],
    };

    const res = await startNewChat(newChat);

    if (res) {
      const chatboxHistory = await viewHistory(id).finally(() =>
        setChatLoading(false)
      );
      if (chatboxHistory) {
        const msgArchive = addToMessageArchive(chatboxHistory, id);
        setSelectedMessageArchive(msgArchive);
        setCurrentChatID(generatedID);
      }
      const isReceiverInAsideList = originalAsideList.some(
        (chat) => chat.id === receiver.id
      );
      if (!isReceiverInAsideList) {
        const newAsideEntry = {
          id: receiver.id,
          name: receiver.name,
          avatar: receiver.avatar,
          program: receiver.program,
        };

        setAsideList((prev) => [...prev, newAsideEntry]);
        setOriginalAsideList((prev) => [...prev, newAsideEntry]);
      }
    }

    setChatLoading(false);
  };

  useEffect(() => {
    if (receiver) {
      const receiverId = receiver.id.toString();

      const messagesForReceiver = selectedMessageArchive.filter(
        (message) =>
          message.receiver === receiverId || message.sender === receiverId
      );

      if (messagesForReceiver.length === 0 && !currentChatID) {
        const generatedID = idGenerator(9, "number");
        startChat(generatedID);
      } else if (messagesForReceiver.length > 0) {
        setCurrentChatID(messagesForReceiver[0]?.chatID);
        const formattedMessages = messagesForReceiver.map((chat) => ({
          text: chat.text,
          receiver: chat.receiver,
          sender: chat.sender,
          time: chat.time,
          isEnd: chat.isEnd,
        }));
        setMessages(formattedMessages);
      }
    }
  }, [receiver, selectedMessageArchive]);

  useEffect(() => {
    if (!currentChatID) return;
    const subscription = supabase
      .channel("public:messages")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "messages" },
        (payload) => {
          const { new: newMessage } = payload;

          if (newMessage.id === currentChatID) {
            const newMetadataMessages = newMessage.metadata.map((msg) => ({
              text: msg.msg,
              receiver: msg.receiver,
              sender: newMessage.sender,
              time: msg.time,
              isEnd: msg.user_id === id,
            }));

            setMessages((prevMessages) => {
              const existingMessages = new Set(
                prevMessages.map((m) => m.time + m.text)
              );
              const uniqueMessages = newMetadataMessages.filter(
                (m) => !existingMessages.has(m.time + m.text)
              );
              return [...prevMessages, ...uniqueMessages];
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [currentChatID, id, messages]);

  return (
    <section className="w-full relative lg:h-[74vh] h-full lg:mt-0 -mt-8 rounded-2xl overflow-hidden flex shadow-xl">
      <Image
        className="object-cover inset-0 absolute w-full h-full z-0 rounded-2xl"
        height={600}
        alt="Background"
        width={800}
        src="/assets/messagemodule-bg.jpg"
      />
      <aside className="relative z-10 w-1/4 h-full bg-slate-950/50 border-r border-slate-800 backdrop-blur-sm backdrop-brightness-50 rounded-l-2xl">
        <div className="w-full lg:h-24 h-auto top-0 left-0 absolute">
          <Input
            color="primary"
            variant="flat"
            className="dark tracking-tight ring-0"
            placeholder={`${!state ? "Geçmişinizde arayın..." : ""}`}
            classNames={{
              input: "text-white hover:bg-transparent rounded-none",
              inputWrapper: "rounded-r-none rounded-bl-none h-12",
            }}
            onChange={handleUserSearch}
            startContent={<MdSearch className="w-5 h-5 self-center" />}
          />
        </div>
        <div className="w-full h-full z-50 pt-10 items-center justify-center flex px-4">
          <div className="w-full top-12 fixed" style={{ zIndex: 999 }}>
            <Button
              className="mb-2 w-full rounded-none "
              size="md"
              color="success"
              variant="flat"
              startContent={<GoPlus className="lg:w-5 lg:h-5 w-8 h-8" />}
              onPress={() => {
                setCurrentChatID(null);
                onOpen();
              }}
            >
              {!state && "Sohbet Başlat"}
            </Button>
          </div>
          <div className="w-full h-[62vh] mt-20 leading-tight overflow-y-scroll items-center justify-start flex flex-col gap-2">
            {chatLoading
              ? Array.from({ length: 12 }).map((_, idx) => (
                  <MessageBoxPlaceHolder key={idx} />
                ))
              : asideList?.map((val, idx) => (
                  <ChatBox
                    name={val.name}
                    text={val.program}
                    imgSrc={val.avatar}
                    email={email}
                    key={idx}
                    handleClick={() => {
                      setReceiver({
                        id: val.id,
                        name: val.name,
                        avatar: val.avatar,
                        program: val.program,
                      });
                    }}
                    id={val.id}
                  />
                ))}
          </div>
        </div>
      </aside>
      <div className="relative z-10 w-3/4 h-full bg-slate-950/50 backdrop-blur-sm backdrop-brightness-50 rounded-r-2xl flex flex-col ">
        <div className="flex-grow ">
          <div className="w-full h-full flex items-start flex-col">
            {receiver && (
              <ReceiverInfo
                avatar={receiver.avatar}
                id={receiver.id}
                program={receiver.program}
                name={receiver.name}
              />
            )}
            <div
              ref={messageContainer}
              className="overflow-y-scroll w-full top-12 absolute right-0 flex flex-col min-h-min h-full pb-24"
            >
              {messages.length > 0 && currentChatID ? (
                messages.map((message, index) => (
                  <MessageBox
                    key={index}
                    isEnd={message.isEnd}
                    text={message.text}
                    time={message.time}
                  />
                ))
              ) : (
                <Error
                  errorNote="Lütfen bir sohbet seçin veya başlatın."
                  header="Oops, Sohbet Yok."
                  style="lg:scale-75 scale-90"
                />
              )}
            </div>
          </div>
        </div>
        <div className="w-full h-12">
          <Input
            color="primary"
            variant="flat"
            size="lg"
            placeholder={`${
              receiver
                ? "Mesajınızı yazın"
                : "Lütfen mesaj yazmak için bir sohbet seçin"
            }`}
            className="dark w-full h-12 tracking-tight ring-0"
            classNames={{
              input: "text-white hover:bg-transparent rounded-none",
              inputWrapper: "rounded-l-none",
            }}
            startContent={
              <MdEmojiEmotions className="w-8 h-8 cursor-pointer text-blue" />
            }
            endContent={
              <Button
                color="success"
                variant="flat"
                size="lg"
                className="-mr-3 rounded-tr-none rounded-l-none"
                onClick={() => {
                  if (receiver && currentChatID) handleSendMessage();
                }}
              >
                Send
              </Button>
            }
            type="text"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && receiver && currentChatID) {
                handleSendMessage();
              }
            }}
          />
        </div>
      </div>
      <Modal
        isOpen={isOpen}
        placement="auto"
        backdrop="blur"
        className="dark text-slate-200"
        onOpenChange={onOpenChange}
        scrollBehavior="inside"
      >
        <ModalContent>
          {(onclose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <Chip color="success" variant="flat" size="lg" className="dark">
                  Sohbet Başlat
                </Chip>
              </ModalHeader>
              <ModalBody>
                <div className="w-full h-auto items-start justify-start flex flex-col gap-2">
                  <Tabs
                    fullWidth
                    className="dark"
                    size="md"
                    aria-label="User List"
                    selectedKey={selected}
                    onSelectionChange={setSelected}
                  >
                    {auth === "admin" && (
                      <Tab key={"students"} title="Student List">
                        {studentList
                          .filter(
                            (s) =>
                              !originalAsideList.some(
                                (aside) => aside.id === s.id
                              )
                          )
                          ?.map((val, idx) => (
                            <button
                              key={idx}
                              className="relative z-10 bg-transparent w-full h-auto"
                              onClick={onclose}
                            >
                              <ChatBox
                                name={val.name}
                                imgSrc={val.avatar}
                                text={val.program}
                                handleClick={() => {
                                  setReceiver({
                                    id: val.id,
                                    name: val.name,
                                    avatar: val.avatar,
                                    program: val.program,
                                  });
                                }}
                              />
                            </button>
                          ))}
                      </Tab>
                    )}
                    <Tab key={"admins"} title="Admin List">
                      {adminList
                        .filter(
                          (admin) =>
                            !originalAsideList.some(
                              (aside) => aside.id === admin.id
                            )
                        ) // Check if admin exists in asideList
                        .map((val, idx) => {
                          if (val.id === id) return null; // Skip the current user (admin) based on id
                          return (
                            <button
                              key={idx}
                              className="relative z-10 bg-transparent w-full h-auto"
                              onClick={onclose}
                            >
                              <ChatBox
                                name={val.name}
                                text={val.perms[0]}
                                imgSrc={val.avatar}
                                handleClick={() => {
                                  setReceiver({
                                    id: val.id,
                                    name: val.name,
                                    avatar: val.avatar,
                                    program:
                                      val.id.length > 16
                                        ? val.perms[0]
                                        : val.program,
                                  });
                                }}
                              />
                            </button>
                          );
                        })}
                    </Tab>
                  </Tabs>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onPress={onclose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <audio ref={audio} src="/assets/sounds/message_sent.wav" />
    </section>
  );
};
