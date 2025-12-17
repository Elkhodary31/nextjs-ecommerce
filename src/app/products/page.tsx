import Products from "@/components/products/Products";
import Sidebar from "@/components/sidebar/sidebar";

export default function page() {
  return (
    <>
      <div className="flex">
        <aside className="w-72 h-screen sticky top-0 border-r overflow-y-auto">
          <Sidebar />
        </aside>

        <main className="flex-1 p-6 overflow-y-auto">
          <Products />
        </main>
      </div>
    </>
  );
}
