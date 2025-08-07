'use client'

import { useAtom } from 'jotai';
import { useState } from 'react';
import { staffGroupFormAtom, staffGroupsAtom, nestedGroupCreationAtom } from '../../atoms/staffAtoms';
import { CreateStaffGroupRequest } from '../../../types';
import StaffMemberSelector from './StaffMemberSelector';
import GratuityConfigStep from './GratuityConfigStep';
import DistributionConfigStep from './DistributionConfigStep';

interface StaffGroupFormProps {
  onSubmit: (request: CreateStaffGroupRequest) => Promise<void>;
  onCancel: () => void;
}

export default function StaffGroupForm({ onSubmit, onCancel }: StaffGroupFormProps) {
  const [formState, setFormState] = useAtom(staffGroupFormAtom);
  const [staffGroups] = useAtom(staffGroupsAtom);
  const [nestedState, setNestedState] = useAtom(nestedGroupCreationAtom);

  const updateForm = (updates: Partial<typeof formState>) => {
    setFormState(prev => ({ ...prev, ...updates}));
  }

  const handleSubmit = async () => {
    const request: CreateStaffGroupRequest = {
      name: formState.name,
      description: formState.description,
      staffMemberIds: formState.selectedStaffMemberIds,
      gratuityConfig: {
        distributesGratuities: formState.distributesGratuities || false,
        receivesGratuities: formState.receivesGratuities || false,
        sourceGroupIds: formState.sourceGroupIds,
        distributionType: formState.distributionType,
        fixedAmount: formState.fixedAmount,
        percentage: formState.percentage
      }
    };

    await onSubmit(request);
  };

  const renderCurrentStep = () => {
    switch (formState.step) {
      case 'basic':
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Basic Information</h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Group Name"
                value={formState.name}
                onChange={(e) => updateForm({ name: e.target.value })}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
              <textarea
                placeholder="Description (optional)"
                value={formState.description || ''}
                onChange={(e) => updateForm({ description: e.target.value })}
                className="w-full border border-gray-300 rounded px-3 py-2"
                rows={3}
              />
              <StaffMemberSelector
                selectedIds={formState.selectedStaffMemberIds}
                onSelectionChange={(ids) => updateForm({ selectedStaffMemberIds: ids })}
              />
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => updateForm({ step: 'gratuity-setup' })}
                disabled={!formState.name || formState.selectedStaffMemberIds.length === 0}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        );

      case 'gratuity-setup':
        return (
          <GratuityConfigStep
            formState={formState}
            availableGroups={staffGroups}
            onUpdateForm={updateForm}
            onNext={() => {
              if (formState.distributesGratuities) {
                updateForm({ step: 'review' });
              } else {
                updateForm({ step: 'distribution-config' });
              }
            }}
            onBack={() => updateForm({ step: 'basic' })}
          />
        );

      case 'distribution-config':
        return (
          <DistributionConfigStep
            formState={formState}
            onUpdateForm={updateForm}
            onNext={() => updateForm({ step: 'review' })}
            onBack={() => updateForm({ step: 'gratuity-setup' })}
          />
        );

      case 'review':
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Review & Submit</h2>
            <div className="bg-gray-50 p-4 rounded space-y-2">
              <p><strong>Name:</strong> {formState.name}</p>
              <p><strong>Description:</strong> {formState.description || 'None'}</p>
              <p><strong>Staff Members:</strong> {formState.selectedStaffMemberIds.length} selected</p>
              <p><strong>Distributes Gratuities:</strong> {formState.distributesGratuities ? 'Yes' : 'No'}</p>
              {!formState.distributesGratuities && (
                <>
                  <p><strong>Source Group:</strong> {formState.sourceGroupIds}</p>
                  <p><strong>Distribution Type:</strong> {formState.distributionType}</p>
                  {formState.distributionType === 'fixed' && (
                    <p><strong>Fixed Amount:</strong> ${formState.fixedAmount}</p>
                  )}
                  {formState.distributionType === 'percentage' && (
                    <p><strong>Percentage:</strong> {formState.percentage}%</p>
                  )}
                </>
              )}
            </div>
            <div className="flex justify-between">
              <button
                onClick={() => updateForm({ step: formState.distributesGratuities ? 'gratuity-setup' : 'distribution-config' })}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
              >
                Back
              </button>
              <div className="space-x-2">
                <button
                  onClick={onCancel}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Create Group
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
      {renderCurrentStep()}
    </div>
  );
}
