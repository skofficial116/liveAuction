import React from "react";

const SearchFilter = ({ search, setSearch, roleFilter, setRoleFilter }) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
      <input
        type="text"
        placeholder="Search players..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="px-3 py-2 border rounded w-full md:w-1/2"
      />
      <select
        value={roleFilter}
        onChange={(e) => setRoleFilter(e.target.value)}
        className="px-3 py-2 border rounded w-full md:w-1/3"
      >
        <option value="All">All Roles</option>
        <option value="Batsman">Batsman</option>
        <option value="Bowler">Bowler</option>
        <option value="All-rounder">All-rounder</option>
        <option value="Wicketkeeper">Wicketkeeper</option>
      </select>
    </div>
  );
};

export default SearchFilter;
