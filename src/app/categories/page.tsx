import Image from "next/image";
import { ICategory } from "@/lib/interfaces/category";
import { getAllCategories } from "@/lib/services/category.service";

export default async function Page() {
  const { data }: { data: ICategory[] } = await getAllCategories();

  return (
    <div className="py-32 bg-gray-200 cursor-pointer">
      <div className="my-container grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 shadow-4xl ">
        {data.map((category) => (
          <div
            key={category._id}
            className="
          group  rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-2
        "
          >
            <div className="overflow-hidden w-full h-72 group">
              <Image
                src={category.image}
                alt={category.name}
                width={400}
                height={100}
                className="h-72 transition-all duration-300 group-hover:scale-110"
              />
            </div>

            <div className="p-6 text-center bg-gray-100 shadow-2xl">
              <h3 className="text-xl font-semibold text-gray-800  w-fit mx-auto text-center px-5 py-1 transition-all duration-300 bg-gray-200 rounded-lg">
                {category.name}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
