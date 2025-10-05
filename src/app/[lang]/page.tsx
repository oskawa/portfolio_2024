"use client";
import { useParams } from "next/navigation";
import { Computer } from "../components/computer";

export default function Home() {
  const { lang } = useParams(); //

  return (
    
      <Computer lang={lang} />
  );
}
