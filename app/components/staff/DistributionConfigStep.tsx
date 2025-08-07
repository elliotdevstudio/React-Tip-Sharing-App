'use client'
import { StaffGroupFormState } from "../../../types";

interface DistributionConfigStepProps {
  formState: StaffGroupFormState;
  onUpdateForm: (updates: Partial<StaffGroupFormState>) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function DistributionConfigStep({
  formState,
  onUpdateForm,
  onNext,
  onBack
}: DistributionConfigStepProps) {
  const handleDistributionTypeChange = (type: 'fixed' | 'percentage') => {
    onUpdateForm({
      distributionType: type,
      fixedAmount: type === 'fixed' ? formState.fixedAmount : undefined,
      percentage: type === 'percentage' ? formState.percentage : undefined
    });
  };

  const canProceed = formState.distributionType && (
    (formState.distributionType === 'fixed' && formState.fixedAmount !== undefined) ||
    (formState.distributionType === 'percentage' && formState.percentage !== undefined)
  );

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Distribution Configuration</h2>
      
      <div className="space-y-4">
        <p className="text-gray-700">How should this group receive gratuities?</p>
        
        <div className="space-y-3">
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="distributionType"
              checked={formState.distributionType === 'fixed'}
              onChange={() => handleDistributionTypeChange('fixed')}
              className="text-blue-600"
            />
            <span>Fixed Amount</span>
          </label>
          
          {formState.distributionType === 'fixed' && (
            <div className="ml-6">
              <input
                type="number"
                placeholder="Enter dollar amount"
                value={formState.fixedAmount || ''}
                onChange={(e) => onUpdateForm({ fixedAmount: parseFloat(e.target.value) || undefined })}
                className="border border-gray-300 rounded px-3 py-2 w-full"
                min="0"
                step="0.01"
              />
            </div>
          )}
          
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="distributionType"
              checked={formState.distributionType === 'percentage'}
              onChange={() => handleDistributionTypeChange('percentage')}
              className="text-blue-600"
            />
            <span>Percentage</span>
          </label>
          
          {formState.distributionType === 'percentage' && (
            <div className="ml-6">
              <input
                type="number"
                placeholder="Enter percentage"
                value={formState.percentage || ''}
                onChange={(e) => onUpdateForm({ percentage: parseFloat(e.target.value) || undefined })}
                className="border border-gray-300 rounded px-3 py-2 w-full"
                min="0"
                max="100"
                step="0.1"
              />
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-between">
        <button
          onClick={onBack}
          className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
        >
          Back
        </button>
        <button
          onClick={onNext}
          disabled={!canProceed}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}