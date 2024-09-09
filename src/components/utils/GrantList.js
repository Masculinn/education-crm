import React from "react";
import {
  ModalBody,
  ModalContent,
  Modal,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import permdb from "@/lib/permdb";
import { useDispatch, useSelector } from "react-redux";
import { setModal } from "@/stores/slices/modalSlice";

export const GrantList = () => {
  const { state: isOpen } = useSelector((state) => state.modal);
  const dispatch = useDispatch();

  const sortedPerms = permdb.sort((a, b) => {
    const colorOrder = { danger: 0, warning: 1, success: 2 };
    return colorOrder[a.color] - colorOrder[b.color];
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => dispatch(setModal({ state: false }))}
      placement="auto"
      backdrop="blur"
      size="2xl"
      className={`dark text-slate-200 `}
      scrollBehavior="inside"
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
      <ModalContent>
        <ModalBody>
          <Table
            className="dark max-h-96 overflow-y-scroll text-white my-8"
            aria-label="Perm Listesi"
            classNames={{
              base: "border border-stone-700 rounded-lg",
            }}
            selectionMode="none"
          >
            <TableHeader>
              <TableColumn>Yetki</TableColumn>
              <TableColumn>Yetki Açıklaması</TableColumn>
            </TableHeader>
            <TableBody>
              {sortedPerms.map((val, idx) => (
                <TableRow key={idx}>
                  <TableCell>
                    <Chip variant="flat" color={val.color}>
                      {val.perm}
                    </Chip>
                  </TableCell>
                  <TableCell className="text-xs">{val.desc}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
