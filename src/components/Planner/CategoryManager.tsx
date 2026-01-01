import { useState } from 'react';
import type { Category } from '../../types';

interface CategoryManagerProps {
  categories: Category[];
  onAdd: (category: Omit<Category, 'id'>) => void;
  onUpdate: (id: string, updates: Partial<Omit<Category, 'id'>>) => void;
  onDelete: (id: string) => void;
}

const PRESET_COLORS = [
  '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899',
  '#6B7280', '#EF4444', '#14B8A6', '#F97316', '#06B6D4',
];

export function CategoryManager({
  categories,
  onAdd,
  onUpdate,
  onDelete,
}: CategoryManagerProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newName, setNewName] = useState('');
  const [newColor, setNewColor] = useState(PRESET_COLORS[0]);
  const [addAttempted, setAddAttempted] = useState(false);

  const isNewNameValid = newName.trim().length > 0;
  const showNewNameError = addAttempted && !isNewNameValid;

  const handleAdd = () => {
    setAddAttempted(true);
    if (!isNewNameValid) return;

    onAdd({ name: newName.trim(), color: newColor });
    setNewName('');
    setNewColor(PRESET_COLORS[0]);
    setIsAdding(false);
    setAddAttempted(false);
  };

  const handleCancelAdd = () => {
    setIsAdding(false);
    setNewName('');
    setAddAttempted(false);
  };

  const handleUpdate = (id: string, name: string, color: string) => {
    if (!name.trim()) return;
    onUpdate(id, { name: name.trim(), color });
    setEditingId(null);
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Categories</h3>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg transition-colors flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add
          </button>
        )}
      </div>

      {/* Add new category form */}
      {isAdding && (
        <div className="mb-4 p-3 rounded-lg border border-blue-500 bg-blue-500/10">
          <p className="text-xs text-blue-400 mb-2 font-medium">New Category</p>
          <div className="flex items-center gap-2">
            <div className="relative" title="Click to pick color">
              <div
                className="w-8 h-8 rounded-full cursor-pointer border-2 border-gray-500 hover:border-white transition-colors"
                style={{ backgroundColor: newColor }}
              />
              <input
                type="color"
                value={newColor}
                onChange={(e) => setNewColor(e.target.value)}
                className="absolute inset-0 w-8 h-8 opacity-0 cursor-pointer"
              />
            </div>
            <div className="flex-1">
              <input
                type="text"
                placeholder="Category name *"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                className={`w-full px-2 py-1.5 bg-gray-700 border rounded text-white text-sm placeholder-gray-500 focus:outline-none transition-colors ${
                  showNewNameError
                    ? 'border-red-500 focus:border-red-500'
                    : 'border-gray-600 focus:border-blue-500'
                }`}
                autoFocus
              />
              {showNewNameError && (
                <p className="text-red-400 text-xs mt-1">Name is required</p>
              )}
            </div>
            <button
              onClick={handleAdd}
              className={`p-1.5 rounded transition-colors ${
                isNewNameValid
                  ? 'text-green-400 hover:text-green-300 hover:bg-green-500/20'
                  : 'text-gray-500 cursor-not-allowed'
              }`}
              title="Save category"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </button>
            <button
              onClick={handleCancelAdd}
              className="p-1.5 text-gray-400 hover:text-gray-300 hover:bg-gray-600/50 rounded transition-colors"
              title="Cancel"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">Click the colored circle to change the color</p>
        </div>
      )}

      {/* Category list */}
      {categories.length === 0 ? (
        <div className="text-center py-4 border border-dashed border-gray-600 rounded-lg">
          <svg className="w-8 h-8 mx-auto text-gray-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
          <p className="text-gray-500 text-sm">No categories yet</p>
          <p className="text-gray-600 text-xs mt-1">Add one to organize your activities</p>
        </div>
      ) : (
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {categories.map((category) => (
            <div
              key={category.id}
              className={`flex items-center gap-3 p-2 rounded-lg border transition-colors ${
                editingId === category.id
                  ? 'border-blue-500 bg-blue-500/10'
                  : 'border-gray-600 hover:border-gray-500'
              }`}
            >
              {editingId === category.id ? (
                <EditCategoryRow
                  category={category}
                  onSave={handleUpdate}
                  onCancel={() => setEditingId(null)}
                />
              ) : (
                <>
                  <div
                    className="w-6 h-6 rounded-full flex-shrink-0"
                    style={{ backgroundColor: category.color }}
                  />
                  <span className="flex-1 text-white text-sm truncate">
                    {category.name}
                  </span>
                  <button
                    onClick={() => setEditingId(category.id)}
                    className="p-1 text-gray-400 hover:text-white transition-colors"
                    title="Edit category"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => onDelete(category.id)}
                    className="p-1 text-gray-400 hover:text-red-400 transition-colors"
                    title="Delete category"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

interface EditCategoryRowProps {
  category: Category;
  onSave: (id: string, name: string, color: string) => void;
  onCancel: () => void;
}

function EditCategoryRow({ category, onSave, onCancel }: EditCategoryRowProps) {
  const [name, setName] = useState(category.name);
  const [color, setColor] = useState(category.color);
  const [saveAttempted, setSaveAttempted] = useState(false);

  const isNameValid = name.trim().length > 0;
  const showNameError = saveAttempted && !isNameValid;

  const handleSave = () => {
    setSaveAttempted(true);
    if (!isNameValid) return;
    onSave(category.id, name, color);
  };

  return (
    <>
      <div className="relative" title="Click to pick color">
        <div
          className="w-6 h-6 rounded-full cursor-pointer border-2 border-gray-500 hover:border-white transition-colors"
          style={{ backgroundColor: color }}
        />
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="absolute inset-0 w-6 h-6 opacity-0 cursor-pointer"
        />
      </div>
      <div className="flex-1">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSave()}
          className={`w-full px-2 py-1 bg-gray-700 border rounded text-white text-sm focus:outline-none transition-colors ${
            showNameError
              ? 'border-red-500 focus:border-red-500'
              : 'border-gray-600 focus:border-blue-500'
          }`}
          autoFocus
        />
        {showNameError && (
          <p className="text-red-400 text-xs mt-0.5">Name is required</p>
        )}
      </div>
      <button
        onClick={handleSave}
        className={`p-1 rounded transition-colors ${
          isNameValid
            ? 'text-green-400 hover:text-green-300'
            : 'text-gray-500 cursor-not-allowed'
        }`}
        title="Save changes"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </button>
      <button
        onClick={onCancel}
        className="p-1 text-gray-400 hover:text-gray-300 transition-colors"
        title="Cancel"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </>
  );
}
