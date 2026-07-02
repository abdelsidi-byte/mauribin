import type { Metadata } from "next";
import { NotificationsClient } from "./NotificationsClient";

export const metadata: Metadata = {
  title: "🔔 إشعارات المباريات - Mauribin",
  description: "فعّل إشعارات المباريات لتعرف فوراً عند بدء أي مباراة",
};

export default function NotificationsPage() {
  return <NotificationsClient />;
}