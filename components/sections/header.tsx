import { LanguageToggle } from "../blocks/language-toggle";
import { ModeToggle } from "../blocks/theme-toggle";

export function Header() {
  return (
    <header className="flex w-[90vw] max-w-7xl mx-auto py-2">
      <div></div>
      <div className="ml-auto">
        <LanguageToggle />
        <ModeToggle />
      </div>
    </header>
  );
}
