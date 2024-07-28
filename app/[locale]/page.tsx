import { MainLayout } from "@/components/layouts/main-layout";
import { useTranslations } from "next-intl";

export default function Home() {
  const t = useTranslations("HomePage");

  return <MainLayout>{t("title")}</MainLayout>;
}
