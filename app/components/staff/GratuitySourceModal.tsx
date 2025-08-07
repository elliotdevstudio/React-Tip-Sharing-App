'use client'
import { AnyStaffGroup } from "../../../types"

interface GratuitySourceModalProps {
  isOpen: boolean;
  availableGroups: AnyStaffGroup[];
  onSelectGroup: (groupId: string) => void;
  onCreateNewGroup: () => void;
  onClose: () => void;
}

export default function GratuitySourceModal({
  isOpen,
  availableGroups,
  onSelectGroup,
  onCreateNewGroup,
  onClose
}: GratuitySourceModalProps) {
  if (!isOpen) return null;

  const distributorGroups = availableGroups.filter(group =>
    group.gratuityConfig.distributesGratuities
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 className="text-lg font-semibold mb-4">Select Gratuity Source</h3>
        
        <div className="space-y-3 mb-6">
          {distributorGroups.length > 0 ? (
            distributorGroups.map((group) => (
              <button
                key={group.id}
                onClick={() => onSelectGroup(group.id)}
                className="w-full text-left p-3 border border-gray-200 rounded hover:bg-gray-50"
              >
                <div className="font-medium">{group.name}</div>
                {group.description && (
                  <div className="text-sm text-gray-600">{group.description}</div>
                )}
              </button>
            ))
          ) : (
            <p className="text-gray-500 italic">No groups available that distribute gratuities</p>
          )}
        </div>

        <div className="flex justify-between">
          <button
            onClick={onCreateNewGroup}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Create New Group
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
  }