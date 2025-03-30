"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui";
import { RiSearchLine } from "react-icons/ri";
import ui from "@/app/data/ui.json";

type Props = {
  categories: string[];
  categoryFilter: string | null;
  setCategoryFilter: (category: string | null) => void;
  searchTerm: string;
  setSearchTerm: (searchTerm: string) => void;
};

export default function Filter({
  categories,
  categoryFilter,
  setCategoryFilter,
  searchTerm,
  setSearchTerm,
}: Props) {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="w-full md:w-1/3">
        <Select
          value={categoryFilter === null ? "null" : categoryFilter}
          onValueChange={(value) => setCategoryFilter(value === "null" ? null : value)}
        >
          <SelectTrigger>
            <SelectValue placeholder={ui.global.all_categories} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem key="none" value="null">
              {ui.global.all_categories}
            </SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category || "null"}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="w-full md:w-2/3 relative">
        <RiSearchLine
          className="absolute opacity-50 top-3 left-3"
          style={{ width: "16px", height: "16px" }}
        />
        <Input
          className="pl-9"
          placeholder={ui.global.search_placeholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
    </div>
  );
}
