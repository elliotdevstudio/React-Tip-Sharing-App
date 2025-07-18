// base staffmember type
export interface StaffMember {
  id: number;
  firstName: string;
  lastName: string;
  dateCreated: Date;
}

// gratuity dist. types
export type GratuityDistributionType = 'fixed' | 'percentage';

// gratuity configuration interface
export interface GratuityConfig {
  distributesGratuities: boolean;
  sourceGroupId?: string;
  distributionType?: GratuityDistributionType
  fixedAmount?: number;
  percentage?: number;
}

// base staff group interface
export interface StaffGroup  {
  id: number
  name: string
  description?: string;
  staffMemberIds: number[];
  dateCreated: Date;
  dateUpdated: Date;
  gratuityConfig: GratuityConfig;
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
  recipientGroups?: string[];// IDs of groups that receive gratuities from this group
}

// union type for all possible group types
export type AnyStaffGroup = StaffGroup | GratuityRecipientGroup | GratuityDistributorGroup;

// form state interfaces for the creation process
export interface StaffGroupFormState {
  name: string;
  description?: string;
  selectedStaffMemberIds: number[];

  // gratuity configuration state
  distributesGratuities?: boolean;
  sourceGroupId?: number;
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
export interface CreatesStaffGroupRequest {
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



//Utility types for type checking
export type GroupWithGratuityDistribution = Extract<AnyStaffGroup, { gratuityConfig: { distributesGratuities: true } }>;
export type GroupWithGratuityReceipt = Extract<AnyStaffGroup, { gratuityConfig: { distributesGratuities: false } }>;

// type guards for runtime type checking
export function isGratuityDistributionGroup(group: AnyStaffGroup): group is GratuityDistributorGroup {
  return group.gratuityConfig.distributesGratuities === true;
}

export function isGratuityRecipientGroup(group: AnyStaffGroup): group is GratuityRecipientGroup {
  return group.gratuityConfig.distributesGratuities === false && 
         group.gratuityConfig.sourceGroupId !== undefined;
}

export function hasfixedGratuityAmount(group: GratuityRecipientGroup): group is GratuityRecipientGroup & { gratuityConfig: { distributionType: 'fixed'; fixedAmount: number} } {
  return group.gratuityConfig.distributionType === 'fixed';
}

export function hasPercentageGratuity(group: GratuityRecipientGroup): group is GratuityRecipientGroup & { gratuityConfig: { distributionType: 'percentage'; percentage: number} } {
  return group.gratuityConfig.distributionType === 'percentage';
}

// Hours tracking interfaces 
// ** this first instance is geared for a flat structure (SQL) 
// initial demo will favor a nested structure for 
// export interface HoursEntry {
//   id: string;
//   staffMemberId: string;
//   groupId: string;
//   date: Date;
//   hoursWorked: number;
//   overtime?: number;
//   notes?: string;
//   createdAt: Date;
//   updatedAt: Date;
// }

export interface DailyHoursEntry {
  id: number;
  date: Date;
  groups: {
    [groupId: number]:{
      [staffId: number]: {
        hoursWorked: number;
        overtime?: number;
      };
    };
  };
  createdAt: Date;
  UpdatedAt: Date;
}

// extended staff member interface with hour relationship
export interface StaffMemberWithHours extends StaffMember {
  totalHoursThisWeek?: number;
  totalHoursThisMonth?: number;
  lastWorkedDate?: Date;
}
// hours query interfaces
export interface HoursQuery {
  startDate: Date;
  endDate: Date;
  staffMemberIds?: number[];
  groupIds?: number[];
  includeOvertime?: boolean;
}

export interface HoursQueryResult {
  entries: DailyHoursEntry[];
  totalHours: number;
  totalOvertime: number;
  staffMemberSummaries: Array<{
    staffMemberId: number;
    staffMemberName: string;
    totalHours: number;
    totalOvertime: number;
    daysWorked: number;
  }>;
  groupSummaries: Array<{
    groupId: number;
    groupName: string;
    totalHours: number;
    totalOvertime: number;
    staffCount: number;
  }>;
}

// daily hours form state
export interface DailyHoursFormState {
  date: Date;
  entries: Array<{
    staffMemberId: number;
    groupId: number;
    hoursWorked: number;
    overtime?: number;
  }>;
}

// Bulk hours entry interface (for multiple staff/multiple days)
export interface BulkHoursEntry {
  staffMemberId: number;
  groupId: number;
  dateEntries: Array<{
    date: Date;
    hoursWorked: number;
    overtime?: number;
  }>;
}

// API interfaces for hours management
export interface CreateHoursEntryRequest {
  staffMemberId: number; 
  groupId: number;
  date: Date;
  hoursWorked: number;
  overtime?: number;
}

export interface UpdateHoursEntryRequest {
  id: number;
  hoursWorked?: number;
  overtime?: number;
  updatedAt: Date;
}

export interface HoursReportRequest {
  query: HoursQuery;
  reportType: 'summary' | 'detailed' | 'payroll';
  groupBy?: 'staff' | 'group' | 'date';
}

// Example usage in component props
export interface StaffGroupFormProps {
  availableStaffMembers: StaffMember[];
  exitingGroups: AnyStaffGroup[];
  onCreateGroup: (request: CreatesStaffGroupRequest) => Promise<CreateStaffGroupResponse>;
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

export interface HoursEntryFormProps {
  staffMembers: StaffMember[];
  groups: AnyStaffGroup[];
  selectedDate: Date;
  onSubmitHours: (entries: CreateHoursEntryRequest[]) => Promise<void>;
  existingEntries?: DailyHoursEntry[];
}

export interface HoursReportProps {
  onRunQuery: (query: HoursQuery) => Promise<HoursQueryResult>;
  staffMembers: StaffMember[];
  groups: AnyStaffGroup[];
}