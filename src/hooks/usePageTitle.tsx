import { useEffect } from "react";

const DEFAULT_TITLE = "Tax Records Portal";

const usePageTitle = (title: string) => {
  useEffect(() => {
    document.title = `${title} - ${DEFAULT_TITLE}`;

    return () => {
      document.title = DEFAULT_TITLE; // Reset to default title on unmount
    };
  }, []);
};

export default usePageTitle;
