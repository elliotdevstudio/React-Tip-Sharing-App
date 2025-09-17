import { DatabaseConnection } from '../mongodb';
import { ObjectId } from 'bson';
import { 
  StaffMemberDocument, 
  StaffMemberWithId, 
  transformStaffMember 
} from '../models/StaffMember';
import { 
  StaffGroupDocument, 
  StaffGroupWithId, 
  transformStaffGroup 
} from '../models/StaffGroup';
import { CreateStaffGroupRequest } from '../../../types';

export class StaffService {
  private static async getDb() {
    return DatabaseConnection.getDatabase('staff_management');
  }

  static async getAllStaffMembers(): Promise<StaffMemberWithId[]> {
    console.log('📋 Fetching all staff members...');
    
    try {
      const db = await this.getDb();
      const members = await db.collection<StaffMemberDocument>('staff_members')
        .find({})
        .sort({ dateCreated: -1 })
        .toArray();
      
      console.log(`✅ Found ${members.length} members in database`);
      
      return members.map(transformStaffMember);
    } catch (error) {
      console.error('❌ Error getting members:', error);
      throw error;
    }
  }
  static async getAllStaffGroups(): Promise<StaffGroupWithId[]> {
    console.log('📋 Fetching all staff groups...');
    const db = await this.getDb();
    const groups = await db.collection<StaffGroupDocument>('staff_groups')
      .find({})
      .sort({ dateCreated: -1 })
      .toArray();
    
    console.log(`✅ Found ${groups.length} staff groups`);
    return groups.map(transformStaffGroup);
  }

  static async createStaffMember(firstName: string, lastName: string): Promise<StaffMemberWithId> {
    console.log(`📝 Creating staff member: ${firstName} ${lastName}`);
    const db = await this.getDb();
    
    const memberDoc: StaffMemberDocument = {
      firstName,
      lastName,
      dateCreated: new Date()
    };

    const result = await db.collection<StaffMemberDocument>('staff_members').insertOne(memberDoc);
    const createdMember = await db.collection<StaffMemberDocument>('staff_members')
      .findOne({ _id: result.insertedId });
    
    if (!createdMember) {
      throw new Error('Failed to create staff member');
    }

    console.log('✅ Successfully created staff member');
    return transformStaffMember(createdMember);
  }
  
  static async createStaffGroup(request: CreateStaffGroupRequest): Promise<StaffGroupWithId> {
    console.log('📝 Creating staff group:', request.name);
    const db = await this.getDb();
    
    const staffMemberObjectIds = request.staffMemberIds.map(id => new ObjectId(id));
    
    const groupDoc: StaffGroupDocument = {
      name: request.name,
      description: request.description,
      staffMemberIds: staffMemberObjectIds,
      dateCreated: new Date(),
      dateUpdated: new Date(),
      gratuityConfig: {
        ...request.gratuityConfig,
        sourceGroupId: request.gratuityConfig.sourceGroupId 
          ? new ObjectId(request.gratuityConfig.sourceGroupId) 
          : undefined
      }
    };

    const result = await db.collection<StaffGroupDocument>('staff_groups').insertOne(groupDoc);
    const createdGroup = await db.collection<StaffGroupDocument>('staff_groups')
      .findOne({ _id: result.insertedId });
    
    if (!createdGroup) {
      throw new Error('Failed to create staff group');
    }

    console.log('✅ Successfully created staff group');
    return transformStaffGroup(createdGroup);
  }

  static async seedInitialData(): Promise<void> {
    console.log('🌱 === STARTING SEED CHECK ===');
    
    try {
      const db = await this.getDb();
      console.log('✅ Database connected');
      
      // Check existing data
      const existingCount = await db.collection('staff_members').countDocuments();
      console.log(`📊 Existing members: ${existingCount}`);
      
      if (existingCount > 0) {
        console.log('✅ Data already exists, skipping seed');
        return;
      }

      console.log('🌱 No data found, starting seeding...');
      
      // Try to import mock data
      let mockStaffMembers;
      try {
        console.log('📁 Attempting to load mock-data.ts...');
        const mockData = await import('../../../mock-data');
        mockStaffMembers = mockData.mockStaffMembers;
        console.log(`✅ Loaded ${mockStaffMembers.length} members from mock data`);
      } catch (importError) {
        console.error('❌ Failed to import mock-data.ts:', importError);
        
        // Fallback: Create some test data
        console.log('📝 Creating fallback test data...');
        mockStaffMembers = [
          { firstName: 'John', lastName: 'Doe', dateCreated: new Date() },
          { firstName: 'Jane', lastName: 'Smith', dateCreated: new Date() },
          { firstName: 'Mike', lastName: 'Johnson', dateCreated: new Date() }
        ];
      }
      
      // Prepare documents for insertion
      const membersToInsert: StaffMemberDocument[] = mockStaffMembers.map(member => ({
        firstName: member.firstName,
        lastName: member.lastName,
        dateCreated: member.dateCreated
      }));

      console.log(`💾 Inserting ${membersToInsert.length} members...`);
      
      const result = await db.collection<StaffMemberDocument>('staff_members')
        .insertMany(membersToInsert);
      
      console.log(`✅ SUCCESS! Inserted ${result.insertedCount} members`);
      console.log(`🔑 Sample IDs: ${Object.values(result.insertedIds).slice(0, 3).join(', ')}`);

    } catch (error) {
      console.error('❌ SEEDING FAILED:', error);
      throw error;
    }
  }

  static async forceSeedData(): Promise<void> {
    console.log('🔄 === FORCE SEEDING ===');
    
    try {
      const db = await this.getDb();
      
      // Clear existing
      console.log('🗑️ Clearing existing data...');
      const deleted = await db.collection('staff_members').deleteMany({});
      console.log(`🗑️ Deleted ${deleted.deletedCount} existing members`);
      
      // Re-seed
      await this.seedInitialData();
      
    } catch (error) {
      console.error('❌ Force seeding failed:', error);
      throw error;
    }
  }
}







