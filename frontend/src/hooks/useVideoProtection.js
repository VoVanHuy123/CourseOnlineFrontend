import { useEffect } from "react";

const useVideoProtection = () => {
  useEffect(() => {
    const preventDownload = (e) => {
      // Ngăn chặn Ctrl+S, Cmd+S
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        return false;
      }
    };

    const preventContextMenu = (e) => {
      e.preventDefault();
      return false;
    };

    // Thêm event listeners
    document.addEventListener("keydown", preventDownload);
    document.addEventListener("contextmenu", preventContextMenu);

    // Cleanup function
    return () => {
      document.removeEventListener("keydown", preventDownload);
      document.removeEventListener("contextmenu", preventContextMenu);
    };
  }, []);
};

export default useVideoProtection;
