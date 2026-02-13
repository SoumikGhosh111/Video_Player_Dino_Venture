// components/CategoryBar.jsx
import { Badge } from "@/components/ui/badge";

const CategoryBar = ({ categories, selected, onSelect }) => {
  return (
    <div className="flex gap-2 overflow-x-auto p-4 no-scrollbar bg-background sticky top-0 z-10">
      <Badge 
        variant={selected === "All" ? "default" : "secondary"}
        className="cursor-pointer px-4 py-1.5 rounded-full whitespace-nowrap"
        onClick={() => onSelect("All")}
      >
        All
      </Badge>
      {categories.map((cat) => (
        <Badge
          key={cat.category.slug}
          variant={selected === cat.category.name ? "default" : "secondary"}
          className="cursor-pointer px-4 py-1.5 rounded-full whitespace-nowrap"
          onClick={() => onSelect(cat.category.name)}
        >
          {cat.category.name}
        </Badge>
      ))}
    </div>
  );
};


export default CategoryBar; 