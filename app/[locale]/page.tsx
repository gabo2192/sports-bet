import { MainLayout } from "@/components/layouts/main-layout";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

export default function Home() {
  const t = useTranslations("homepage");

  return (
    <MainLayout>
      <section className="flex gap-4 flex-col items-start mt-10 border-b pb-10">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          {t("title")}
        </h1>
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
          {t("subtitle")}
        </h3>
        <Button>Comenzar ahora!</Button>
      </section>
      <section className="mt-10">
        <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">
          {t("feature.title")}
        </h2>
        <ul className="scroll-m-20"></ul>
      </section>
    </MainLayout>
  );
}
