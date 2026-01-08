import Link from "next/link";

export default function Header() {
  return (
    <header className="w-full border-b">
      <nav className="max-w-6xl mx-auto p-4 flex gap-6">
        <Link href="/" className="font-bold">
          Ensitec
        </Link>

        <Link href="/bi-para-escolas">
          BI para Escolas
        </Link>
      </nav>
    </header>
  );
}
