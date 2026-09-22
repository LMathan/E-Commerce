import { Truck, RotateCcw, ShieldCheck, Headphones } from "lucide-react";

const BENEFITS = [
  {
    icon: Truck,
    title: "Free Shipping",
    description: "On orders over ₹999",
  },
  {
    icon: RotateCcw,
    title: "Easy Returns",
    description: "30-day hassle free",
  },
  {
    icon: ShieldCheck,
    title: "Secure Payment",
    description: "100% safe & secure",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "We're here to help",
  },
];

export function TrustBenefits() {
  return (
    <section className="py-8 bg-white border-b border-neutral-200/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {BENEFITS.map((b, idx) => {
            const Icon = b.icon;
            return (
              <div
                key={idx}
                className="flex items-center space-x-3.5 p-4 sm:p-5 rounded-2xl border border-neutral-200/80 bg-neutral-50/50 hover:bg-white hover:shadow-md hover:border-amber-400/60 transition-all"
              >
                <div className="p-2.5 rounded-xl bg-white border border-neutral-200 text-neutral-900 flex-shrink-0 shadow-xs">
                  <Icon className="h-5 w-5 stroke-[1.75]" />
                </div>
                <div>
                  <h4 className="font-extrabold text-xs sm:text-sm text-neutral-900">{b.title}</h4>
                  <p className="text-[11px] sm:text-xs text-neutral-500 mt-0.5">{b.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
