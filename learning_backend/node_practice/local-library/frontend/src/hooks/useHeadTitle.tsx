import { useEffect } from "react";

export function useHeadTitle(title: string) {
  useEffect(() => {
    document.title = title;
  }, [title]);
}