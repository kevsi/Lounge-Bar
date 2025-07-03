import { Search, Calendar, Filter, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface MenuFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export function MenuFilters({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
}: MenuFiltersProps) {
  return (
    <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 lg:p-6">
      {/* Mobile: Stacked layout */}
      <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-4">
        {/* Filter buttons row */}
        <div className="flex flex-wrap items-center gap-2 lg:gap-3">
          {/* Category Filter */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="bg-gray-300 border-0 text-black font-inter text-xs lg:text-sm"
            >
              Catégorie
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="bg-slate-50 border-gray-300 shadow-sm h-8 w-8 lg:h-10 lg:w-10"
            >
              <ChevronDown className="w-3 h-3 lg:w-4 lg:h-4" />
            </Button>
          </div>

          {/* Name Filter */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="bg-gray-300 border-0 text-black font-inter text-xs lg:text-sm"
            >
              Noms
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="bg-slate-50 border-gray-300 shadow-sm h-8 w-8 lg:h-10 lg:w-10"
            >
              <Calendar className="w-3 h-3 lg:w-4 lg:h-4" />
            </Button>
          </div>

          {/* Price Filter */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="bg-gray-300 border-0 text-black font-inter text-xs lg:text-sm"
            >
              Prix
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="bg-slate-50 border-gray-300 shadow-sm h-8 w-8 lg:h-10 lg:w-10"
            >
              <Filter className="w-3 h-3 lg:w-4 lg:h-4" />
            </Button>
          </div>
        </div>

        {/* Search Input */}
        <div className="flex-1 min-w-0">
          <div className="relative">
            <Search className="absolute left-3 lg:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 lg:w-5 lg:h-5 text-black" />
            <Input
              placeholder="Rechercher par nom, prix"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 lg:pl-12 bg-white border-gray-300 shadow-sm font-inter text-sm lg:text-base"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
