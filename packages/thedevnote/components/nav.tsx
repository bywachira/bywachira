import Link from "next/link";
import React from "react";

export default function Nav(): React.ReactElement {
  return (
    <nav className="w-full flex justify-center">
      <section>
        <Link href={`/`} passHref={true}>
          <section className="px-10 py-4">
            <img src="/logo.svg" className="max-w-xl w-full" alt="the-dev-note" />
          </section>
        </Link>
      </section>
    </nav>
  );
}
