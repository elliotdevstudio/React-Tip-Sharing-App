import { ObjectId } from "mongodb";
import { GratuityDistributionType } from "../../../types"; 

export interface GratuityConfigDocument {
  distributesGratuities: boolean;
  sourceGroupIds?: ObjectId[];  // ← ObjectId array for database
  distributionType?: GratuityDistributionType;
  fixedAmount?: number;
  percentage?: number;
  recipientGroupIds?: ObjectId[];
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
    sourceGroupIds?: string[];  // String for frontend
    recipientGroupIds?: string[];
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
      distributesGratuities: doc.gratuityConfig.distributesGratuities,
      sourceGroupIds: doc.gratuityConfig.sourceGroupIds?.map(id => id.toString()) || [],  // Changed
      distributionType: doc.gratuityConfig.distributionType,
      fixedAmount: doc.gratuityConfig.fixedAmount,
      percentage: doc.gratuityConfig.percentage,
      recipientGroupIds: doc.gratuityConfig.recipientGroupIds?.map(id => id.toString()) || []
    }
  };
}