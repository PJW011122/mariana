import { useState } from "react";

export function useModal() {
  const [isModalOpen, setModalOpen] = useState(false);

  const openModal = () => {
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
  };
  const reloadModal = () => {
    setModalOpen(false);
    window.location.reload();
  };

  return {
    isModalOpen,
    openModal,
    closeModal,
    reloadModal,
  };
}
