'use client'

import  { 
  atom
} from 'jotai';
import { StaffMember, AnyStaffGroup, StaffGroupFormState, NestedGroupCreationState } from '../../types';
import { mockStaffMembers } from '../lib/mock-data';


// Staff roster (master list of all staff)
export const staffMembersAtom = atom(mockStaffMembers)

// All staff groups created
export const staffGroupsAtom = atom<AnyStaffGroup[]>([])

export const staffGroupFormAtom = atom<StaffGroupFormState>({
  name: '',
  description: '',
  selectedStaffMemberIds: [],
  distributesGratuities: undefined,
  sourceGroupIds: undefined,
  distributionType: undefined,
  fixedAmount: undefined,
  percentage: undefined,
  isCreatingSourceGroup: false,
  showGratuityModal: false,
  step: 'basic'
});

// Nested group creation state
export const nestedGroupCreationAtom = atom<NestedGroupCreationState>({
  isOpen: false,
  parentGroupFormState: {
    name: '',
    description: '',
    selectedStaffMemberIds: [],
    isCreatingSourceGroup: false,
    showGratuityModal: false,
    step: 'basic'
  },
  currentGroupFormState: {
    name: '',
    description: '',
    selectedStaffMemberIds: [],
    isCreatingSourceGroup: false,
    showGratuityModal: false,
    step: 'basic'
  }
});

// UI state atoms
export const isLoadingAtom = atom<boolean>(false);
export const errorMessageAtom = atom<string | null>(null);

