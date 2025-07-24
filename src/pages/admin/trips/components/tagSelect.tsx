import { X, Check, ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface TagSelectProps {
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
}

const availableTags = [
  'Adventure',
  'Cultural',
  'Nature',
  'City Break',
  'Beach',
  'Mountain',
  'Historic',
  'Food & Drink',
  'Wildlife',
  'Photography',
  'Family Friendly',
  'Romantic',
  'Budget Friendly',
  'Luxury',
  'Solo Travel',
  'Group Travel'
];

const TagSelect: React.FC<TagSelectProps> = ({ selectedTags = [], onTagsChange }) => {
  const [isTagsDropdownOpen, setIsTagsDropdownOpen] = useState(false);
  const tagsDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (tagsDropdownRef.current && !tagsDropdownRef.current.contains(event.target as Node)) {
        setIsTagsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleTag = (tag: string) => {
    const newTags = selectedTags.includes(tag)
      ? selectedTags.filter(t => t !== tag)
      : [...selectedTags, tag];
    onTagsChange(newTags);
  };

  const removeTag = (tag: string) => {
    onTagsChange(selectedTags.filter(t => t !== tag));
  };

  return (
    <div className="relative" ref={tagsDropdownRef}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Tags
      </label>
      
      {/* Selected tags display */}
      {selectedTags && selectedTags?.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {selectedTags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
            >
              {tag}
              <button
                onClick={() => removeTag(tag)}
                className="ml-1 hover:text-blue-600"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Dropdown trigger */}
      <button
        type="button"
        onClick={() => setIsTagsDropdownOpen(!isTagsDropdownOpen)}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-left flex items-center justify-between"
      >
        <span className="text-gray-500">
          {selectedTags.length === 0 
            ? 'Select tags...' 
            : `${selectedTags.length} tag${selectedTags.length === 1 ? '' : 's'} selected`
          }
        </span>
        <ChevronDown 
          className={`w-4 h-4 text-gray-400 transition-transform ${
            isTagsDropdownOpen ? 'rotate-180' : ''
          }`} 
        />
      </button>

      {/* Dropdown menu */}
      {isTagsDropdownOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {availableTags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => toggleTag(tag)}
              className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center justify-between"
            >
              <span className="text-gray-900">{tag}</span>
              {selectedTags.includes(tag) && (
                <Check className="w-4 h-4 text-blue-600" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default TagSelect;