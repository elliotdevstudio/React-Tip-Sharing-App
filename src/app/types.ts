export type StaffMemberType = {
  id: number;
  name: string;
  hours: number;
  tipOutAmount: number;
};

export type StaffData = {
  cashTips: number;
  creditCardTips: number;
  staff: StaffMemberType[];
}

export type StaffGroupProps = {
  title: string;
  staff: StaffMemberType[];
  isEditingStaffHours: boolean;
  onSaveStaffHours: (updatedStaff: StaffMemberType[]) => void;
  onEditStaffHours: () => void;
}
