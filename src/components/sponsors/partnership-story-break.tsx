import Image from "next/image";

/**
 * Visual break between current-partner recognition and sponsorship
 * recruitment on /sponsors. Uses a real, existing campaign photo (the
 * donated race-bike frame — see /journal/building-the-bike) rather than
 * stock imagery, per the "no fake/generic content" convention this site
 * follows elsewhere (see README's Eliminating Placeholder Content).
 */
export function PartnershipStoryBreak() {
  return (
    <section className="relative overflow-hidden">
      <div className="relative h-[420px] w-full sm:h-[480px]">
        <Image
          src="/journal/building-the-bike/frame-hero.jpg"
          alt="The donated race-bike frame being built into Tri For the 22's IRONMAN 70.3 Chattanooga bike"
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-ink/10" />
      </div>

      <div className="absolute inset-0 flex items-end">
        <div className="mx-auto w-full max-w-[min(94vw,1560px)] px-4 pb-10 sm:px-6 sm:pb-14">
          <h2 className="max-w-2xl text-balance font-display text-3xl font-bold uppercase leading-tight tracking-tight text-off-white sm:text-4xl">
            These aren&apos;t logos on a page. They&apos;re parts of the mission.
          </h2>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-off-white/80">
            Every piece of equipment, service, and expertise represented here moves Tri For the 22 another
            step toward Chattanooga.
          </p>
        </div>
      </div>
    </section>
  );
}
