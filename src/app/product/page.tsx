import { redirect } from "next/navigation";

export default function Page() {
  // If someone hits /product without an id or plural, send them to products list
  redirect("/products");
}
