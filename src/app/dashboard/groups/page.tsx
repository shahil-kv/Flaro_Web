import { redirect } from "next/navigation";

export default function CallsPage() {
  redirect("/dashboard/groups/manage-groups");
}
