import SectionHeading from "./SectionHeading";
import { FOOD_MENU } from "../../constants/content";

export default function FoodDining() {
  const { timings, days, notes } = FOOD_MENU;
  return (
    <section className="section container-page">
      <SectionHeading
        eyebrow="Food & Dining"
        title="Weekly Food Menu"
        description="Three times homestyle food, complimentary for everyone staying with us."
      />
      <div className="card overflow-x-auto">
        <table className="w-full text-sm min-w-[640px]">
          <thead>
            <tr className="bg-secondary/40 text-left">
              <th className="px-4 py-3 w-28"></th>
              <th className="px-4 py-3">
                Breakfast
                <span className="block text-xs font-normal text-ink/60">{timings.breakfast}</span>
              </th>
              <th className="px-4 py-3">
                Lunch
                <span className="block text-xs font-normal text-ink/60">{timings.sunday}</span>
              </th>
              <th className="px-4 py-3">
                Dinner
                <span className="block text-xs font-normal text-ink/60">{timings.dinner}</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {days.map(([day, b, l, d]) => (
              <tr key={day} className="border-t border-secondary/60">
                <td className="px-4 py-3 font-medium text-ink">{day}</td>
                <td className="px-4 py-3 text-ink/70">{b}</td>
                <td className="px-4 py-3 text-ink/70">{l}</td>
                <td className="px-4 py-3 text-ink/70">{d}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ul className="mt-4 text-sm text-ink/60 space-y-1">
        {notes.map((n) => (
          <li key={n}>• {n}</li>
        ))}
      </ul>
    </section>
  );
}
