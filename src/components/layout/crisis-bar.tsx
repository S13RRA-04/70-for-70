/**
 * Site-wide help strip above the header, on every host. Help blue is
 * reserved for exactly this kind of element (see the palette note in
 * globals.css), so it reads as "help" without needing an icon.
 */
export function CrisisBar() {
  return (
    <div className="bg-help text-white">
      <div className="mx-auto flex max-w-[1240px] flex-wrap items-center justify-center gap-x-6 gap-y-1.5 px-6 py-2.5 text-[15px]">
        <span className="font-bold">Help is available 24/7.</span>
        <a href="tel:988" className="font-bold text-white underline underline-offset-2">
          Call 988, press 1
        </a>
        <a href="sms:838255" className="text-white underline underline-offset-2">
          Text 838255
        </a>
        <span>
          In immediate danger,{" "}
          <a href="tel:911" className="text-white underline underline-offset-2">
            call 911
          </a>
        </span>
      </div>
    </div>
  );
}
