import type { ContentCategory } from "@/types";
import { categoryLabel } from "@/lib/utils/format";

export function CategoryBadges({ categories, compact = false }: { categories: ContentCategory[]; compact?: boolean }) {
  return (
    <div className="flex flex-wrap gap-1.5" aria-label={`Categories: ${categories.map((category) => categoryLabel[category]).join(", ")}`}>
      {categories.map((category) => (
        <span key={category} className={`category-badge category-${category} ${compact ? "category-badge-compact" : ""}`}>
          {categoryLabel[category]}
        </span>
      ))}
    </div>
  );
}
