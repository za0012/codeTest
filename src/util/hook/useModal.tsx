"use client";

import { useAtom } from "jotai";
import Modal from "@/components/ui/Modal";
import { modalAtom } from "@/lib/store/modalStore";

export function ModalManager() {
  const [modal, setModal] = useAtom(modalAtom);

  if (!modal) return null;

  return (
    <Modal
      title={modal.title}
      subTitle={modal.subTitle}
      onClose={() => setModal(null)}
    >
      {modal.children}
    </Modal>
  );
}
