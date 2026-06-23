import { FormEvent, useState } from "react";
import {
  ArrowRight,
  Bell,
  Building2,
  CalendarClock,
  CheckCircle2,
  ClipboardCheck,
  Hospital,
  Mail,
  RefreshCcw,
  ShieldCheck,
  Sparkles,
  UsersRound,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const contactEndpoint = (import.meta.env.VITE_CONTACT_ENDPOINT as string | undefined) ?? "/api/contact";

const benefits = [
  {
    icon: CalendarClock,
    title: "Planning des gardes centralisé",
    text: "Les facultés visualisent les rotations, les sites hospitaliers et les contraintes académiques dans une même interface.",
  },
  {
    icon: RefreshCcw,
    title: "Échanges encadrés",
    text: "Les demandes de permutation restent traçables, avec validation et historique pour éviter les arrangements invisibles.",
  },
  {
    icon: ClipboardCheck,
    title: "Suivi administratif propre",
    text: "Quotas, justificatifs, absences et validations sont consolidés pour les équipes de scolarité et les responsables de stage.",
  },
];

const metrics = [
  { label: "gardes planifiées", value: "12 480" },
  { label: "permutations traitées", value: "94%" },
  { label: "facultés pilotées", value: "8" },
];

const faculties = ["Scolarité", "Responsables de stage", "Étudiants", "Terrains hospitaliers"];

function App() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error" | "missing-config">("idle");

  async function handleContactSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!email.trim()) {
      setStatus("error");
      return;
    }

    setStatus("loading");

    try {
      const response = await fetch(contactEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "super-garde-landing" }),
      });

      if (response.status === 503) {
        setStatus("missing-config");
        return;
      }

      if (!response.ok) {
        throw new Error("Contact request failed");
      }

      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
    }
  }

  return (
    <main className="min-h-screen overflow-hidden bg-background text-foreground">
      <header className="border-b border-border/70 bg-background/90 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <a className="flex items-center gap-3 font-semibold" href="#top" aria-label="Super-Garde">
            <SuperGardeLogo className="h-10 w-10" />
            <span>Super-Garde</span>
          </a>
          <nav className="hidden items-center gap-7 text-sm text-muted-foreground md:flex" aria-label="Navigation">
            <a className="transition-colors hover:text-foreground" href="#plateforme">
              Plateforme
            </a>
            <a className="transition-colors hover:text-foreground" href="#benefices">
              Bénéfices
            </a>
            <a className="transition-colors hover:text-foreground" href="#contact">
              Contact
            </a>
          </nav>
          <Button asChild size="sm">
            <a href="#contact">
              Être recontacté
              <Mail className="h-4 w-4" aria-hidden="true" />
            </a>
          </Button>
        </div>
      </header>

      <section id="top" className="relative border-b border-border/70 bg-[#f7fbfa]" aria-labelledby="hero-title">
        <div className="container grid min-h-[calc(100vh-4rem)] items-center gap-10 py-12 lg:grid-cols-[0.88fr_1.12fr] lg:py-16">
          <div className="max-w-2xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-md border border-[#b9ddd4] bg-white px-3 py-1.5 text-sm font-medium text-[#18685b] shadow-sm">
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              Conçu pour les facultés de médecine
            </div>
            <div className="flex items-center gap-4">
              <SuperGardeLogo className="hidden h-16 w-16 sm:block" />
              <h1 id="hero-title" className="max-w-3xl text-4xl font-semibold tracking-normal text-balance sm:text-5xl lg:text-6xl">
                Super-Garde
              </h1>
            </div>
            <p className="mt-5 max-w-xl text-lg leading-8 text-muted-foreground">
              Le logiciel qui simplifie la gestion des gardes des étudiants en médecine, de la planification aux
              permutations, sans perdre le contrôle administratif.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <a href="#contact">
                  Demander une présentation
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </a>
              </Button>
              <Button asChild variant="outline" size="lg">
                <a href="#plateforme">Voir la plateforme</a>
              </Button>
            </div>
            <div className="mt-10 grid max-w-xl grid-cols-3 gap-3">
              {metrics.map((metric) => (
                <div key={metric.label} className="rounded-lg border border-border bg-white p-3 shadow-sm">
                  <div className="text-lg font-semibold text-[#153e3a]">{metric.value}</div>
                  <div className="mt-1 text-xs leading-4 text-muted-foreground">{metric.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div id="plateforme" className="relative">
            <div className="absolute -left-6 top-8 hidden h-24 w-24 rounded-full bg-[#dff2ec] blur-2xl lg:block" />
            <ProductPreview />
          </div>
        </div>
      </section>

      <section id="benefices" className="bg-white py-16 sm:py-20" aria-labelledby="benefices-title">
        <div className="container">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-[#c65a3d]">Une scolarité plus fluide</p>
            <h2 id="benefices-title" className="mt-3 text-3xl font-semibold tracking-normal sm:text-4xl">
              Remplacer les fichiers dispersés par un pilotage lisible.
            </h2>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {benefits.map((benefit) => (
              <Card key={benefit.title} className="rounded-lg border-[#d8e3e0] shadow-soft">
                <CardContent className="p-6">
                  <div className="flex h-11 w-11 items-center justify-center rounded-md bg-[#e5f4ef] text-[#18685b]">
                    <benefit.icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold">{benefit.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">{benefit.text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-border/70 bg-[#162d2b] py-14 text-white" aria-labelledby="adoption-title">
        <div className="container grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-[#f2b08e]">Adoption terrain</p>
            <h2 id="adoption-title" className="mt-3 text-3xl font-semibold tracking-normal">
              Chaque acteur garde son niveau de lecture.
            </h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {faculties.map((item) => (
              <div key={item} className="flex items-center gap-3 rounded-lg border border-white/12 bg-white/7 p-4">
                <CheckCircle2 className="h-5 w-5 shrink-0 text-[#8bd7c7]" aria-hidden="true" />
                <span className="text-sm font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="bg-[#f7fbfa] py-16 sm:py-20" aria-labelledby="contact-title">
        <div className="container grid gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-[#c65a3d]">Contact</p>
            <h2 id="contact-title" className="mt-3 text-3xl font-semibold tracking-normal sm:text-4xl">
              Parlons de vos rotations de garde.
            </h2>
            <p className="mt-4 max-w-xl leading-7 text-muted-foreground">
              Laissez un email et l’équipe Super-Garde vous recontacte pour échanger sur votre organisation, vos
              contraintes et une démonstration adaptée à votre faculté.
            </p>
          </div>

          <form
            className="rounded-lg border border-[#d8e3e0] bg-white p-5 shadow-soft sm:p-6"
            onSubmit={handleContactSubmit}
          >
            <label className="text-sm font-medium" htmlFor="email">
              Email
            </label>
            <div className="mt-3 flex flex-col gap-3 sm:flex-row">
              <Input
                id="email"
                name="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder="prenom.nom@université.fr"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
              <Button className="shrink-0" type="submit" disabled={status === "loading"}>
                {status === "loading" ? "Envoi..." : "Me recontacter"}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>
            <p className="mt-3 min-h-5 text-sm text-muted-foreground" aria-live="polite">
              {status === "success" && "Merci, votre demande a bien été envoyée."}
              {status === "error" && "Impossible d’envoyer la demande pour le moment."}
              {status === "missing-config" && "Ajoutez DISCORD_WEBHOOK_URL côté serveur pour activer l’envoi Discord."}
            </p>
          </form>
        </div>
      </section>
    </main>
  );
}

function ProductPreview() {
  const rows = [
    ["Urgences adultes", "Lun. 08:00", "M. Bernard", "Validée"],
    ["Pédiatrie", "Mar. 20:00", "A. Morel", "Échange"],
    ["Réanimation", "Jeu. 08:00", "S. Diallo", "À revoir"],
  ];

  return (
    <div className="relative rounded-lg border border-[#bdd5cf] bg-white p-3 shadow-soft sm:p-4">
      <div className="overflow-hidden rounded-md border border-[#d8e3e0] bg-[#fbfdfc]">
        <div className="flex items-center justify-between border-b border-[#d8e3e0] bg-white px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[#e5f4ef] text-[#18685b]">
              <Hospital className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <div className="text-sm font-semibold">Rotation externes - Juin</div>
              <div className="text-xs text-muted-foreground">Faculté de médecine</div>
            </div>
          </div>
          <Button variant="outline" size="icon" aria-label="Notifications">
            <Bell className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>

        <div className="grid gap-0 lg:grid-cols-[220px_1fr]">
          <aside className="hidden border-r border-[#d8e3e0] bg-[#f4faf8] p-4 lg:block">
            <div className="mb-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Pilotage</div>
            {[
              [Building2, "Terrains"],
              [UsersRound, "Promotions"],
              [ShieldCheck, "Validations"],
            ].map(([Icon, label]) => (
              <div key={label as string} className="mb-2 flex items-center gap-2 rounded-md bg-white px-3 py-2 text-sm">
                <Icon className="h-4 w-4 text-[#18685b]" aria-hidden="true" />
                <span>{label as string}</span>
              </div>
            ))}
          </aside>

          <div className="p-4">
            <div className="mb-4 grid gap-3 sm:grid-cols-3">
              {["Couverture 98%", "12 sites", "31 demandes"].map((item) => (
                <div key={item} className="rounded-md border border-[#d8e3e0] bg-white p-3">
                  <div className="text-sm font-semibold">{item}</div>
                  <div className="mt-2 h-2 rounded-full bg-[#e8eeec]">
                    <div className="h-2 rounded-full bg-[#2b8a78]" style={{ width: item === "31 demandes" ? "58%" : "78%" }} />
                  </div>
                </div>
              ))}
            </div>

            <div className="overflow-hidden rounded-md border border-[#d8e3e0] bg-white">
              {rows.map(([site, date, student, state]) => (
                <div key={`${site}-${date}`} className="grid grid-cols-[1fr_auto] gap-3 border-b border-[#eef3f1] px-4 py-3 last:border-b-0 sm:grid-cols-[1.1fr_0.8fr_0.8fr_auto]">
                  <div className="text-sm font-medium">{site}</div>
                  <div className="hidden text-sm text-muted-foreground sm:block">{date}</div>
                  <div className="hidden text-sm text-muted-foreground sm:block">{student}</div>
                  <span className="rounded-md bg-[#fff0e8] px-2 py-1 text-xs font-semibold text-[#a4462e]">{state}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SuperGardeLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" role="img" aria-label="Logo Super-Garde">
      <rect width="64" height="64" rx="14" fill="#18685B" />
      <path
        d="M16 18.5C16 16.6 17.6 15 19.5 15H44.5C46.4 15 48 16.6 48 18.5V43.5C48 45.4 46.4 47 44.5 47H19.5C17.6 47 16 45.4 16 43.5V18.5Z"
        fill="#F7FBFA"
      />
      <path d="M23 15V11.5M41 15V11.5M16 25H48" stroke="#F2A078" strokeWidth="4" strokeLinecap="round" />
      <path
        d="M25 36.5L30.2 41.5L41 29"
        stroke="#18685B"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M20 54L32 47L44 54" stroke="#F2A078" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default App;
