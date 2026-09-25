import { redirect } from "next/navigation";

export default function TestIndexPage() {
  redirect("/test/rdso-memory-figure-test-01?trial=true");
}
