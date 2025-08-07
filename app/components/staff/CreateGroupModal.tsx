'use client'

import React, { useState } from 'react'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { 
  staffRosterState, 
  staffGroupsState,
  addStaffGroupState,
  nextGroupIdState,
  StaffGroup,
  TipDistribution 
} from '../../atoms/staffAtoms'

interface CreateGroupModalProps {
  isOpen: boolean
  onClose: () => void
}

export const CreateGroupModal: React.FC<CreateGroupModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1)
  const [groupName, setGroupName] = useState('')
  const [selectedStaffIds, setSelectedStaffIds] = useState<number[]>([])
  const [collectsGratuities, setCollectsGratuities] = useState(false)
  const [distributesGratuities, setDistributesGratuities] = useState(false)
  const [tipDistributions, setTipDistributions] = useState<TipDistribution[]>([])

  const staffRoster = useAtomValue(staffRosterState)
  const existingGroups = useAtomValue(staffGroupsState)
  const nextGroupId = useAtomValue(nextGroupIdState)
  const addGroup = useSetAtom(addStaffGroupState)

  const eligibleGroupsForDistribution = existingGroups.filter(group => group.id !== nextGroupId)

  const resetForm = () => {
    setStep(1)
    setGroupName('')
    setSelectedStaffIds([])
    setCollectsGratuities(false)
    setDistributesGratuities(false)
    setTipDistributions([])
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  const handleStaffToggle = (staffId: number) => {
    setSelectedStaffIds(prev => 
      prev.includes(staffId) 
        ? prev.filter(id => id !== staffId)
        : [...prev, staffId]
    )
  }

  const handleNext = () => {
    if (step === 1 && groupName.trim() && selectedStaffIds.length > 0) {
      setStep(2)
    } else if (step === 2) {
      if (distributesGratuities && eligibleGroupsForDistribution.length === 0) {
        // No groups to distribute to, redirect to dashboard
        alert('No existing groups to distribute tips to. Please create more groups first.')
        handleClose()
        return
      }
      setStep(3)
    }
  }

  const handleBack = () => {
    if (step === 3) setStep(2)
    else if (step === 2) setStep(1)
  }

  const addTipDistribution = () => {
    if (eligibleGroupsForDistribution.length > 0) {
      setTipDistributions([...tipDistributions, {
        targetGroupId: eligibleGroupsForDistribution[0].id,
        percentage: 0
      }])
    }
  }

  const updateTipDistribution = (index: number, field: keyof TipDistribution, value: string | number) => {
    const updated = [...tipDistributions]
    updated[index] = { ...updated[index], [field]: value }
    setTipDistributions(updated)
  }

  const removeTipDistribution = (index: number) => {
    setTipDistributions(tipDistributions.filter((_, i) => i !== index))
  }

  const handleCreateGroup = () => {
    const totalPercentage = tipDistributions.reduce((sum, dist) => sum + dist.percentage, 0)
    
    if (distributesGratuities && totalPercentage > 100) {
      alert('Total distribution percentage cannot exceed 100%')
      return
    }

    const newGroup: StaffGroup = {
      id: nextGroupId,
      name: groupName.trim(),
      memberIds: selectedStaffIds,
      createdAt: new Date(),
      collectsGratuities,
      distributesGratuities,
      tipDistributions: distributesGratuities ? tipDistributions : []
    }

    addGroup(newGroup)
    handleClose()
  }

  if (!isOpen) return null
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Create Staff Group - Step {step} of 3</h2>
          <button onClick={handleClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>

        {/* Step 1: Basic Info */}
        {step === 1 && (
          <div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Group Name
              </label>
              <input
                type="text"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder="e.g., Servers, Bartenders, Kitchen Staff"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Staff Members
              </label>
              <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto border border-gray-200 rounded-md p-3">
                {staffRoster.map(staff => (
                  <label key={staff.id} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedStaffIds.includes(staff.id)}
                      onChange={() => handleStaffToggle(staff.id)}
                      className="rounded"
                    />
                    <span className="text-sm">
                      {staff.firstName} {staff.lastName}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleNext}
                disabled={!groupName.trim() || selectedStaffIds.length === 0}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Gratuity Settings */}
        {step === 2 && (
          <div>
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4">Gratuity Collection Settings</h3>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="collectsGratuities"
                    checked={collectsGratuities}
                    onChange={(e) => setCollectsGratuities(e.target.checked)}
                    className="rounded"
                  />
                  <label htmlFor="collectsGratuities" className="text-sm font-medium">
                    Will this group collect gratuities from sales?
                  </label>
                </div>
                {collectsGratuities && (
                  <p className="text-sm text-gray-600 ml-6">
                    This group will receive a share of cash tips, credit card tips, and cashier tips.
                  </p>
                )}

                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="distributesGratuities"
                    checked={distributesGratuities}
                    onChange={(e) => setDistributesGratuities(e.target.checked)}
                    className="rounded"
                  />
                  <label htmlFor="distributesGratuities" className="text-sm font-medium">
                    Will this group be distributing gratuities to other staff groups?
                  </label>
                </div>
                {distributesGratuities && (
                  <p className="text-sm text-gray-600 ml-6">
                    This group will tip out a percentage of their gratuities to other groups.
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-between">
              <button
                onClick={handleBack}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Back
              </button>
              <button
                onClick={handleNext}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Tip Distribution Setup */}
        {step === 3 && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Tip Distribution Setup</h3>
            
            {distributesGratuities ? (
              <>
                {eligibleGroupsForDistribution.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">
                      No existing groups available to distribute tips to.
                    </p>
                    <p className="text-sm text-gray-400">
                      You can edit this group later to add tip distributions after creating more groups.
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-sm font-medium">Tip Distributions</span>
                        <button
                          onClick={addTipDistribution}
                          className="text-sm bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                        >
                          Add Distribution
                        </button>
                      </div>

                      {tipDistributions.map((distribution, index) => (
                        <div key={index} className="flex items-center space-x-3 mb-3 p-3 border border-gray-200 rounded">
                          <select
                            value={distribution.targetGroupId}
                            onChange={(e) => updateTipDistribution(index, 'targetGroupId', e.target.value)}
                            className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm"
                          >
                            {eligibleGroupsForDistribution.map(group => (
                              <option key={group.id} value={group.id}>
                                {group.name}
                              </option>
                            ))}
                          </select>
                          <input
                            type="number"
                            value={distribution.percentage}
                            onChange={(e) => updateTipDistribution(index, 'percentage', parseFloat(e.target.value) || 0)}
                            min="0"
                            max="100"
                            step="0.1"
                            className="w-20 border border-gray-300 rounded px-2 py-1 text-sm"
                            placeholder="0"
                          />
                          <span className="text-sm">%</span>
                          <button
                            onClick={() => removeTipDistribution(index)}
                            className="text-red-600 hover:text-red-800 text-sm"
                          >
                            Remove
                          </button>
                        </div>
                      ))}

                      {tipDistributions.length > 0 && (
                        <div className="text-sm text-gray-600">
                          Total: {tipDistributions.reduce((sum, dist) => sum + dist.percentage, 0).toFixed(1)}%
                        </div>
                      )}
                    </div>
                  </>
                )}
              </>
            ) : (
              <p className="text-gray-500 text-center py-8">
                This group will not distribute tips to other groups.
              </p>
            )}

            <div className="flex justify-between">
              <button
                onClick={handleBack}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Back
              </button>
              <button
                onClick={handleCreateGroup}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Create Group
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}