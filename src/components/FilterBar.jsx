import { Search, Filter, X } from 'lucide-react';

export default function FilterBar({ 
  searchQuery, 
  onSearchChange, 
  selectedBrands, 
  onBrandToggle, 
  brands,
  showUnassignedOnly,
  onToggleUnassigned
}) {
  const hasActiveFilters = selectedBrands.length > 0 || showUnassignedOnly || searchQuery;

  const clearFilters = () => {
    onSearchChange('');
    selectedBrands.forEach(brandId => onBrandToggle(brandId));
    if (showUnassignedOnly) onToggleUnassigned();
  };

  return (
    <div className="bg-white rounded-lg border-2 border-gray-200 p-4 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-5 h-5 text-gray-700" />
        <h3 className="text-lg font-bold text-gray-900">Filters</h3>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="ml-auto text-sm text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1"
          >
            <X className="w-4 h-4" />
            Clear All
          </button>
        )}
      </div>

      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search events by title or location..."
            className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <div className="text-sm font-bold text-gray-700 mb-2">Filter by Brand</div>
          <div className="flex flex-wrap gap-2">
            {brands.map(brand => {
              const isSelected = selectedBrands.includes(brand.id);
              return (
                <button
                  key={brand.id}
                  onClick={() => onBrandToggle(brand.id)}
                  className={`px-3 py-2 rounded-lg border-2 font-semibold text-sm transition-all ${
                    isSelected
                      ? `${brand.color} text-white`
                      : `${brand.badge} hover:opacity-80`
                  }`}
                >
                  {brand.name}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showUnassignedOnly}
              onChange={onToggleUnassigned}
              className="w-5 h-5 text-blue-600 border-2 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-sm font-semibold text-gray-700">
              Show only events with unassigned slots
            </span>
          </label>
        </div>
      </div>
    </div>
  );
}
