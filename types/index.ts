// base staffmember type
export interface StaffMember {
  id: string;
  firstName: string;
  lastName: string;
  dateCreated: Date;
}


// gratuity dist. types
export type GratuityDistributionType = 'fixed' | 'percentage';

// gratuity configuration interface
export interface GratuityConfig {
  distributesGratuities: boolean;
  receivesGratuities: boolean;
  sourceGroupIds?: string[];
  recipientGroupIds?: string[];
  distributionType?: GratuityDistributionType
  fixedAmount?: number;
  percentage?: number;
}
// base staff group interface
export interface StaffGroup  {
  id: string;
  name: string;
  description?: string;
  staffMemberIds: number[];
  dateUpdated: Date;
  gratuityConfig: GratuityConfig;
}

// Individual staff member's collected tips for a specific day/session
export interface StaffMemberTips {
  staffId: string;
  groupId: string;
  creditCardTips: number
  // Track when these tips were recorded
  recordedAt: Date
}

// extended interface for groups that RECEIVE gratuities 
export interface GratuityRecipientGroup extends StaffGroup {
  gratuityConfig: GratuityConfig & {
    distributesGratuities: false; // group receives, does not distribute
    sourceGroupId: string;
    distributionType: GratuityDistributionType; // required
  } & (
    | { distributionType: 'fixed'; fixedAmount: number}
    | { distibutionType: 'percentage'; percentage: number }
  );
}

// extended interface for groups that distribute gratuities
export interface GratuityDistributorGroup extends StaffGroup {
  gratuityConfig: GratuityConfig & {
    distributesGratuities: true;
  };
  recipientGroups?: number[];// IDs of groups that receive gratuities from this group
}

// union type for all possible group types
export type AnyStaffGroup = StaffGroup | GratuityRecipientGroup | GratuityDistributorGroup;

export interface StaffGroupFormState {
  name: string;
  description?: string;
  selectedStaffMemberIds: string[];

  // gratuity configuration state
  distributesGratuities?: boolean;
  receivesGratuities?: boolean;
  sourceGroupIds?: string[];
  recipientGroupIds?: string[];
  distributionType?: GratuityDistributionType;
  fixedAmount?: number;
  percentage?: number;

  // UI state
  isCreatingSourceGroup: boolean;
  showGratuityModal: boolean;
  step: 'basic' | 'gratuity-setup' | 'distribution-config' | 'review';
}

// Modal state for nested group creation 
export interface NestedGroupCreationState {
  isOpen: boolean;
  parentGroupFormState: StaffGroupFormState;
  currentGroupFormState: StaffGroupFormState;
}

//API response types
export interface CreateStaffGroupRequest {
  name: string;
  description?: string;
  staffMemberIds: string[];
  gratuityConfig: GratuityConfig;
}

export interface CreateStaffGroupResponse {
  group: StaffGroup;
  success: boolean;
  message?: string;
}

//Utility types for type chekcing
export type GroupWithGratuityDistribution = Extract<AnyStaffGroup, { gratuityConfig: {distributesGratuities: true} }>;
export type GroupWithGratuityReceipt = Extract<AnyStaffGroup, { gratuityConfig: { distributesGratuities: false } }>;

// type guards for runtime type checking
export function isGratuityDistributionGroup(group: AnyStaffGroup): group is GratuityDistributorGroup {
  return group.gratuityConfig.distributesGratuities === true;
}

export function isGratuityRecipientGroup(group: AnyStaffGroup): group is GratuityRecipientGroup {
  return group.gratuityConfig.distributesGratuities === false && 
         group.gratuityConfig.sourceGroupIds !== undefined;
}

export function hasfixedGratuityAmount(group: GratuityRecipientGroup): group is GratuityRecipientGroup & { gratuityConfig: { distributionType: 'fixed'; fixedAmount: number} } {
  return group.gratuityConfig.distributionType === 'fixed';
}

export function hasPercentageGratuity(group: GratuityRecipientGroup): group is GratuityRecipientGroup & { gratuityConfig: { distributionType: 'percentage'; percentage: number} } {
  return group.gratuityConfig.distributionType === 'percentage';
}

// example usage in component props
export interface StaffGroupFormProps {
  availableStaffMembers: StaffMember[];
  existingGroups: AnyStaffGroup[];
  onCreateGroup: (request: CreateStaffGroupRequest) => Promise<CreateStaffGroupResponse>;
  onUpdateFormState: (state: Partial<StaffGroupFormState>) => void;
  formState: StaffGroupFormState;
}

export interface GratuityModalProps {
  isOpen: boolean;
  existingGroups: AnyStaffGroup[];
  onSelectExistingGroup: (groupId: string) => void;
  onCreateNewGroup: () => void;
  onClose: () => void;
}