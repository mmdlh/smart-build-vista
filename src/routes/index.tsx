import { createFileRoute } from "@tanstack/react-router";
import { SiteCommandCenter } from "@/components/site-command-center";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "智慧工地数字化综合监管平台" },
      { name: "description", content: "覆盖人员、安全、环境、设备、进度、视频和物资的一体化智慧工地监管中心。" },
      { property: "og:title", content: "智慧工地数字化综合监管平台" },
      { property: "og:description", content: "智慧工地全域数据感知与协同监管中心。" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return <SiteCommandCenter />;
}
