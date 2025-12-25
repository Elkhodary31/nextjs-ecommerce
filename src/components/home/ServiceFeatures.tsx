import { Truck, Headphones, DollarSign } from "lucide-react";

export default function ServiceFeatures() {
  const features = [
    {
      icon: Truck,
      title: "Fast Delivery",
      description: "Get your orders delivered quickly and safely to your doorstep",
    },
    {
      icon: Headphones,
      title: "24/7 Customer Service",
      description: "Our support team is available around the clock to help you",
    },
    {
      icon: DollarSign,
      title: "Money Back Guarantee",
      description: "100% refund if you're not satisfied with your purchase",
    },
  ];

  return (
    <section className="my-container py-12 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl my-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <div
              key={index}
              className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Icon className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-800">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-600">{feature.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
