import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Chip,
  useDisclosure,
} from "@nextui-org/react";
import { FiBookOpen } from "react-icons/fi";
import { GiArchiveResearch } from "react-icons/gi";
import { Inter } from "next/font/google";
import { TicketEventGenerator } from "./TicketEventGenerator";
import eventModeData from "@/lib/eventModeData";
import { CardEventGenerator } from "./CardEventGenerator";
import { MediumCardEventGenerator } from "./MediumCardEventGenerator";
import { SmallCardEventGenerator } from "./SmallCardEventGenerator";
import { EventEditor } from "./EventEditor";

const font = Inter({
  subsets: ["latin"],
});

export const EventManager = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [step, setStep] = useState(1);
  const [node, setNode] = useState(null);

  useEffect(() => {
    onOpen();
  }, []);

  return (
    <>
      <Modal
        scrollBehavior="inside"
        isDismissable={false}
        isKeyboardDismissDisabled={false}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        className="dark text-white"
        backdrop="blur"
        classNames={{
          closeButton: "hidden",
        }}
        motionProps={{
          variants: {
            enter: {
              y: 0,
              opacity: 1,
              transition: {
                duration: 0.3,
                ease: "easeOut",
                bounce: 2,
              },
            },
            exit: {
              y: -20,
              opacity: 0,
              transition: {
                duration: 0.2,
                ease: "easeIn",
              },
            },
          },
        }}
      >
        <ModalContent className={`${font.className} tracking-tight`}>
          {(onClose) =>
            (step === 1 && (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  <Chip
                    color="danger"
                    className="dark mt-4"
                    variant="flat"
                    size="lg"
                    startContent={<FiBookOpen className="w-4 h-4 mx-2" />}
                  >
                    Etkinlik Oluşturucu Rehberi
                  </Chip>
                </ModalHeader>
                <ModalBody>
                  <p>
                    Etkinlik oluşturucu, olympos portalın admin ve öğrenci
                    panelleri arasında etkinlik düzenlemenizi sağlar ve
                    etkinliğin nerede ve nasıl gözükeceğini siz belirliyor
                    olacaksınız.{" "}
                    <Chip color="success" variant="flat">
                      Event Kurucu
                    </Chip>{" "}
                    rolüne sahip olan herkes etkinlik oluşturup düzenleyebilir.
                  </p>
                  <p>
                    Toplam 4 farklı etkinlik modu vardır. Etkinlikler ve detaylı
                    özelliklerine Yardım kısmından ulaşabilirsiniz.
                  </p>
                  <ul className="justify-start flex flex-wrap gap-1">
                    {[
                      "Ticket Event",
                      "Card Event",
                      "Medium Card Event",
                      "Small Card Event",
                    ].map((val, idx) => (
                      <li key={idx}>
                        <Chip color="warning" variant="dot">
                          {val}
                        </Chip>
                      </li>
                    ))}
                  </ul>
                </ModalBody>
                <ModalFooter>
                  <Button
                    color="primary"
                    variant="solid"
                    onPress={() => setStep((prev) => prev + 1)}
                  >
                    Sonraki
                  </Button>
                </ModalFooter>
              </>
            )) ||
            (step === 2 && (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  <Chip
                    color="danger"
                    className="dark mt-4"
                    variant="flat"
                    size="lg"
                    startContent={
                      <GiArchiveResearch className="w-4 h-4 mx-2 " />
                    }
                  >
                    Etkinlik Modu Belirle
                  </Chip>
                </ModalHeader>
                <ModalBody>
                  {eventModeData.map((val, idx) => (
                    <Button
                      startContent={val.y}
                      color="success"
                      variant="flat"
                      onClick={() => {
                        setNode(idx + 1);
                        onClose();
                      }}
                    >
                      {val.x}
                    </Button>
                  ))}
                </ModalBody>
              </>
            ))
          }
        </ModalContent>
      </Modal>
      {node === 1 && <TicketEventGenerator />}
      {node === 2 && <CardEventGenerator />}
      {node === 3 && <MediumCardEventGenerator />}{" "}
      {node === 4 && <SmallCardEventGenerator />}
      {node === 5 && <EventEditor />}
    </>
  );
};
