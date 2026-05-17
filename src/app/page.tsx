import ContactForm from "@/components/ContactForm";

export default function Home() {
  return (
    <div className="space-y-12">
      <section className="space-y-3 pt-8">
        <h1 className="text-3xl font-bold">A hardened Next.js + Supabase starter.</h1>
        <p className="text-neutral-700">
          Auth on both sides of the server boundary. Row-Level Security policies in
          the database. Security headers in middleware. Honeypot-protected forms.
        </p>
      </section>

      <section>
        <h2 className="mb-2 text-xl font-semibold">Try the contact form</h2>
        <p className="mb-4 text-sm text-neutral-600">
          The form below has a hidden honeypot field. Real users never see it; bots fill it in.
          Submissions where the honeypot is non-empty are silently dropped on the server.
        </p>
        <ContactForm />
      </section>
    </div>
  );
}
