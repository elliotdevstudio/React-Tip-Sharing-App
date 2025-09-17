import { ObjectId } from "mongodb";
import { GratuityDistributionType } from "../../../types"; 

export interface GratuityConfigDocument {
  distributesGratuities: boolean;
  sourceGroupId?: ObjectId;  // ← ObjectId for database
  distributionType?: GratuityDistributionType;
  fixedAmount?: number;
  percentage?: number;
}

export interface StaffGroupDocument {
  _id?: ObjectId;
  name: string;
  description?: string;
  staffMemberIds: ObjectId[];
  dateCreated: Date;
  dateUpdated: Date;
  gratuityConfig: GratuityConfigDocument;
}

export interface StaffGroupWithId {
  id: string;
  name: string;
  description?: string;
  staffMemberIds: string[];
  dateCreated: Date;
  dateUpdated: Date;
  gratuityConfig: {
    distributesGratuities: boolean;
    sourceGroupId?: string;  // String for frontend
    distributionType?: GratuityDistributionType;
    fixedAmount?: number;
    percentage?: number;
  };
}

export function transformStaffGroup(doc: StaffGroupDocument): StaffGroupWithId {
  return {
    id: doc._id!.toString(),
    name: doc.name,
    description: doc.description,
    staffMemberIds: doc.staffMemberIds.map(id => id.toString()),
    dateCreated: doc.dateCreated,
    dateUpdated: doc.dateUpdated,
    gratuityConfig: {
      ...doc.gratuityConfig,
      sourceGroupId: doc.gratuityConfig.sourceGroupId 
      ? doc.gratuityConfig.sourceGroupId.toString() 
      : undefined
    }
  };
}