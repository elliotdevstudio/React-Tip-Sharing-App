'use client'

import { useAtom } from 'jotai';
import { useAtomValue } from 'jotai';
import { useState, useEffect } from 'react';
import { staffGroupFormAtom, staffGroupsAtom, nestedGroupCreationAtom } from '../../atoms/staffAtoms';
import { AnyStaffGroup, CreateStaffGroupRequest, StaffGroupFormState } from '../../../types';
import StaffMemberSelector from './StaffMemberSelector';
import GratuityConfigStep from './GratuityConfigStep';
import DistributionConfigStep from './DistributionConfigStep';

interface StaffGroupFormProps {
  onSubmit: (request: CreateStaffGroupRequest) => Promise<void>;
  onCancel: () => void;
  initialData?: AnyStaffGroup;
}

export default function StaffGroupForm({ onSubmit, onCancel, initialData }: StaffGroupFormProps) {
  const availableGroups = useAtomValue(staffGroupsAtom);
  const [formState, setFormState] = useState<StaffGroupFormState>({
    name: '',
    description: '',
    selectedStaffMemberIds: [],
    distributesGratuities: undefined,
    sourceGroupIds: undefined,
    distributionType: undefined,
    fixedAmount: undefined,
    percentage: undefined,
    recipientGroupIds: [],
    isCreatingSourceGroup: false,
    showGratuityModal: false,
    step: 'basic'
  });

  // const [nestedState, setNestedState] = useAtom(nestedGroupCreationAtom);


  // Initialize form when component mounts or initialData changes
  useEffect(() => {
     if (initialData) {
      console.log('🔧 Initializing form for editing:', initialData);
      setFormState({
        name: initialData.name,
        description: initialData.description || '',
        selectedStaffMemberIds: initialData.staffMemberIds,
        distributesGratuities: initialData.gratuityConfig.distributesGratuities,
        sourceGroupIds: initialData.gratuityConfig.sourceGroupIds || [],
        distributionType: initialData.gratuityConfig.distributionType,
        fixedAmount: initialData.gratuityConfig.fixedAmount,
        percentage: initialData.gratuityConfig.percentage,
        recipientGroupIds: initialData.gratuityConfig.recipientGroupIds || [],
        isCreatingSourceGroup: false,
        showGratuityModal: false,
        step: 'basic'
      });
    } else {
      console.log('🆕 Initializing form for new group');
      setFormState({
        name: '',
        description: '',
        selectedStaffMemberIds: [],
        distributesGratuities: undefined,
        sourceGroupIds: [],
        distributionType: undefined,
        fixedAmount: undefined,
        percentage: undefined,
        recipientGroupIds: [],
        isCreatingSourceGroup: false,
        showGratuityModal: false,
        step: 'basic'
      });
    }
  }, [initialData]);

  const updateForm = (updates: Partial<StaffGroupFormState>) => {
    setFormState(prev => ({ ...prev, ...updates }));
  }

  const handleNext = () => {
    console.log('📝 handleNext called from step:', formState.step);

    if (formState.step === 'basic') {
      updateForm({ step: 'gratuity-setup' });
    } else if (formState.step === 'gratuity-setup') {
      updateForm({ step: 'connection-setup' });
    } else if (formState.step === 'connection-setup') {
      updateForm({ step: 'review' });
    }
  };

  const handleBack = () => {
    console.log('📝 handleBack called from step:', formState.step);

    if (formState.step === 'gratuity-setup') {
      updateForm({ step: 'basic' });
    } else if (formState.step === 'connection-setup') {
    updateForm({ step: 'gratuity-setup' });
    } else if (formState.step === 'review') {
      updateForm({ step: 'connection-setup' });
    }
  };

  const handleSubmit = async () => {
    console.log('📤 Submitting form:', { isEdit: !!initialData, formState });

    const request: CreateStaffGroupRequest = {
      name: formState.name,
      description: formState.description,
      staffMemberIds: formState.selectedStaffMemberIds,
      gratuityConfig: {
        distributesGratuities: formState.distributesGratuities || false,
        sourceGroupIds: formState.sourceGroupIds || [],
        distributionType: formState.distributionType,
        fixedAmount: formState.fixedAmount,
        percentage: formState.percentage,
        recipientGroupIds: formState.recipientGroupIds || []
      }
    };

    await onSubmit(request);
  };

  const canProceedFromBasic = formState.name.trim() !== '' && formState.selectedStaffMemberIds.length > 0;
  const canProceedFromGratuity = formState.distributesGratuities !== undefined;
  const canSubmit = canProceedFromBasic && canProceedFromGratuity;
  
  // RENDER THE DIFFERENT STEPS OF GRAT CONFIGURATION

  const renderBasicStep = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Basic Information</h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Group Name *
        </label>
        <input
          type="text"
          value={formState.name}
          onChange={(e) => updateForm({ name: e.target.value })}
          className="w-full border border-gray-300 rounded px-3 py-2"
          placeholder="Enter group name"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description (optional)
        </label>
        <textarea
          value={formState.description || ''}
          onChange={(e) => updateForm({ description: e.target.value })}
          className="w-full border border-gray-300 rounded px-3 py-2"
          rows={3}
          placeholder="Enter description"
        />
      </div>

      <StaffMemberSelector
        selectedIds={formState.selectedStaffMemberIds}
        onSelectionChange={(ids) => updateForm({ selectedStaffMemberIds: ids })}
      />

      <div className="flex justify-end space-x-4">
        <button onClick={onCancel} className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50">
          Cancel
        </button>
        <button
          onClick={handleNext}
          disabled={!canProceedFromBasic}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );

  const renderGratuityStep = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Gratuity Configuration</h3>
      
      <div>
        <p className="mb-3 text-gray-700">Does this group distribute or receive gratuities?</p>
        <div className="space-y-3">
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="gratuityType"
              checked={formState.distributesGratuities === true}
              onChange={() => updateForm({ 
                distributesGratuities: true,
                sourceGroupIds: [], // clears opposite connections
                distributionType: undefined,
                fixedAmount: undefined,
                percentage: undefined
              })}
              className="text-blue-600"
            />
            <span>This group distributes gratuities to other groups</span>
          </label>
          
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="gratuityType"
              checked={formState.distributesGratuities === false}
              onChange={() => updateForm({ 
                distributesGratuities: false,
                recipientGroupIds: [],
                showGratuityModal: true 
              })}
              className="text-blue-600"
            />
            <span>This group receives gratuities from another group</span>
          </label>
        </div>
      </div>

      <div className="flex justify-between">
        <button onClick={handleBack} className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50">
          Back
        </button>
        <button
          onClick={handleNext}
          disabled={formState.distributesGratuities === undefined}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
  // For distributors: show groups that can receive (distributesGratuities: false)
  // For receivers: show groups that can distribute (distributesGratuities: true)

  const renderConnectionStep = () => {
    const availableConnections = formState.distributesGratuities 
      ? availableGroups.filter(group => 
          group.gratuityConfig.distributesGratuities === false && 
          group.id !== (initialData?.id)
        )
      : availableGroups.filter(group => 
          group.gratuityConfig.distributesGratuities === true && 
          group.id !== (initialData?.id)
        );

    const currentConnections = formState.distributesGratuities 
      ? (formState.recipientGroupIds || [])
      : (formState.sourceGroupIds || []);
    
    const handleConnectionToggle = (groupId: string) => {
      const newConnections = currentConnections.includes(groupId)
        ? currentConnections.filter(id => id !== groupId)
        : [...currentConnections, groupId];
      
      if (formState.distributesGratuities) {
        updateForm({ recipientGroupIds: newConnections });
      } else {
        updateForm({ sourceGroupIds: newConnections });
      }
    };

    return (
      <div className="space-y-6">
        <h3 className="text-lg font-medium">Group Connections</h3>
        
        <div>
          <p className="mb-3 text-gray-700">
            {formState.distributesGratuities 
              ? 'Select which groups will receive gratuities from this group:'
              : 'Select which groups will distribute gratuities to this group:'
            }
          </p>
          
          {availableConnections.length > 0 ? (
            <div className="space-y-2 p-4 bg-gray-50 rounded max-h-60 overflow-y-auto">
              {availableConnections.map(group => (
                <label key={group.id} className="flex items-center space-x-2 p-2 hover:bg-white rounded">
                  <input
                    type="checkbox"
                    checked={currentConnections.includes(group.id)}
                    onChange={() => handleConnectionToggle(group.id)}
                    className="rounded border-gray-300"
                  />
                  <div className="flex-1">
                    <span className="font-medium">{group.name}</span>
                    {group.description && (
                      <div className="text-sm text-gray-500">{group.description}</div>
                    )}
                    <div className="text-xs text-gray-400">
                      {group.gratuityConfig.distributesGratuities ? 'Distributes gratuities' : 'Receives gratuities'}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          ) : (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
              <p className="text-yellow-800">
                No available groups to connect with. 
                {formState.distributesGratuities 
                  ? ' Create groups that receive gratuities first.'
                  : ' Create groups that distribute gratuities first.'
                }
              </p>
            </div>
          )}
          
          {currentConnections.length > 0 && (
            <div className="mt-3 p-3 bg-blue-50 rounded">
              <p className="text-blue-800 font-medium">
                {formState.distributesGratuities ? 'Distributing to' : 'Receiving from'} {currentConnections.length} group{currentConnections.length !== 1 ? 's' : ''}
              </p>
              <div className="text-sm text-blue-600 mt-1">
                {currentConnections.map(connectionId => {
                  const connectedGroup = availableGroups.find(g => g.id === connectionId);
                  return connectedGroup ? connectedGroup.name : connectionId;
                }).join(', ')}
              </div>
            </div>
          )}
        </div>

        {/* Add Distribution Method Selection for Receiver Groups */}
        {!formState.distributesGratuities && currentConnections.length > 0 && (
          <div className="space-y-4 p-4 bg-white rounded border-2 border-blue-200">
            <h4 className="font-medium text-blue-900">Distribution Method</h4>
            <p className="text-sm text-gray-600">How should this group receive gratuities?</p>
            
            <div className="space-y-3">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="distributionType"
                  checked={formState.distributionType === 'fixed'}
                  onChange={() => updateForm({ 
                    distributionType: 'fixed',
                    percentage: undefined 
                  })}
                  className="text-blue-600"
                />
                <span>Fixed Amount ($)</span>
              </label>
              
              {formState.distributionType === 'fixed' && (
                <div className="ml-6">
                  <input
                    type="number"
                    placeholder="Enter dollar amount"
                    value={formState.fixedAmount || ''}
                    onChange={(e) => updateForm({ fixedAmount: parseFloat(e.target.value) || undefined })}
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
                  onChange={() => updateForm({ 
                    distributionType: 'percentage',
                    fixedAmount: undefined 
                  })}
                  className="text-blue-600"
                />
                <span>Percentage (%)</span>
              </label>
              
              {formState.distributionType === 'percentage' && (
                <div className="ml-6">
                  <input
                    type="number"
                    placeholder="Enter percentage"
                    value={formState.percentage || ''}
                    onChange={(e) => updateForm({ percentage: parseFloat(e.target.value) || undefined })}
                    className="border border-gray-300 rounded px-3 py-2 w-full"
                    min="0"
                    max="100"
                    step="0.1"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        <div className="flex justify-between">
          <button onClick={handleBack} className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50">
            Back
          </button>
          <button
            onClick={handleNext}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Next
          </button>
        </div>
      </div>
    );
  };


  const renderReviewStep = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Review & Submit</h3>
      
      <div className="bg-gray-50 p-4 rounded space-y-3">
        <div><strong>Name:</strong> {formState.name}</div>
        <div><strong>Description:</strong> {formState.description || 'None'}</div>
        <div><strong>Staff Members:</strong> {formState.selectedStaffMemberIds.length} selected</div>
        <div><strong>Gratuity Role:</strong> {formState.distributesGratuities ? 'Distributes gratuities' : 'Receives gratuities'}</div>
        
        {/* Show connections for distributor groups */}
        {formState.distributesGratuities && (formState.recipientGroupIds || []).length > 0 && (
          <div>
            <strong>Distributing To:</strong>
            <ul className="ml-4 list-disc">
              {(formState.recipientGroupIds || []).map(groupId => {
                const group = availableGroups.find(g => g.id === groupId);
                return <li key={groupId}>{group ? group.name : groupId}</li>;
              })}
            </ul>
          </div>
        )}
        
        {/* Show connections and distribution method for receiver groups */}
        {!formState.distributesGratuities && (formState.sourceGroupIds || []).length > 0 && (
          <>
            <div>
              <strong>Receiving From:</strong>
              <ul className="ml-4 list-disc">
                {(formState.sourceGroupIds || []).map(groupId => {
                  const group = availableGroups.find(g => g.id === groupId);
                  return <li key={groupId}>{group ? group.name : groupId}</li>;
                })}
              </ul>
            </div>
            
            {formState.distributionType && (
              <div className="mt-2 p-3 bg-blue-50 rounded">
                <strong>Distribution Method:</strong>
                <div className="ml-2">
                  {formState.distributionType === 'fixed' && (
                    <span>Fixed Amount: ${formState.fixedAmount?.toFixed(2)}</span>
                  )}
                  {formState.distributionType === 'percentage' && (
                    <span>Percentage: {formState.percentage}%</span>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <div className="flex justify-between">
        <button onClick={handleBack} className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50">
          Back
        </button>
        <div className="space-x-2">
          <button onClick={onCancel} className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
          >
            {initialData ? 'Update Group' : 'Create Group'}
          </button>
        </div>
      </div>
    </div>
  );

  console.log('🔍 Current form step:', formState.step);
  console.log('🔍 Gratuity setting:', formState.distributesGratuities);
  console.log('🔍 Available groups:', availableGroups.length);


  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-6">
        {initialData ? `Edit "${initialData.name}"` : 'Create New Staff Group'}
      </h2>
      {/* Step indicator */}
      <div className="flex items-center mb-6">
        <div className={`flex items-center ${formState.step === 'basic' ? 'text-blue-600' : 'text-gray-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
            formState.step === 'basic' ? 'bg-blue-600 text-white' : 'bg-gray-200'
          }`}>1</div>
          <span className="ml-2">Basic Info</span>
        </div>
        <div className="flex-1 h-px bg-gray-200 mx-4"></div>
                {/* Step 2: Gratuities */}
        <div className={`flex items-center ${formState.step === 'gratuity-setup' ? 'text-blue-600' : 'text-gray-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
            formState.step === 'gratuity-setup' ? 'bg-blue-600 text-white' : 'bg-gray-200'
          }`}>2</div>
          <span className="ml-2">Gratuities</span>
        </div>
        <div className="flex-1 h-px bg-gray-200 mx-4"></div>
        {/* Step 3: Connections */}
        <div className={`flex items-center ${formState.step === 'connection-setup' ? 'text-blue-600' : 'text-gray-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
            formState.step === 'connection-setup' ? 'bg-blue-600 text-white' : 'bg-gray-200'
          }`}>3</div>
          <span className="ml-2 text-sm">Connections</span>
        </div>
        <div className="flex-1 h-px bg-gray-200 mx-2"></div>
                {/* Step 4: Review */}
        <div className={`flex items-center ${formState.step === 'review' ? 'text-blue-600' : 'text-gray-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
            formState.step === 'review' ? 'bg-blue-600 text-white' : 'bg-gray-200'
          }`}>3</div>
          <span className="ml-2">Review</span>
        </div>
      </div>

      {/* Render current step */}
      {formState.step === 'basic' && renderBasicStep()}
      {formState.step === 'gratuity-setup' && renderGratuityStep()}
      {formState.step === 'connection-setup' && renderConnectionStep()}
      {formState.step === 'review' && renderReviewStep()}
    
      
    </div>
  );
}

