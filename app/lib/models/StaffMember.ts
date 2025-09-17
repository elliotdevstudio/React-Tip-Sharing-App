import { ObjectId } from "bson";

export interface StaffMemberDocument {
  _id?: ObjectId;
  firstName: string;
  lastName: string;
  dateCreated: Date;
}

export interface StaffMemberWithId {
  id: string; 
  firstName: string;
  lastName: string;
  dateCreated: Date;
}

// transform MongoDB doc to frontend format

export function transformStaffMember(doc: StaffMemberDocument): StaffMemberWithId {
  return {
    id: doc._id!.toString(),
    firstName: doc.firstName,
    lastName: doc.lastName,
    dateCreated: doc.dateCreated
  }
}

