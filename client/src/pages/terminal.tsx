import { useEffect } from "react";
import Terminal from "@/components/Terminal";

export default function TerminalPage() {
  useEffect(() => {
    // Set document title
    document.title = "Terminal of BONK";
  }, []);

  return <Terminal />;
}
