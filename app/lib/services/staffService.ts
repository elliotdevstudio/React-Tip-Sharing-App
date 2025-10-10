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
        sourceGroupIds: request.gratuityConfig.sourceGroupIds?.map(id => new ObjectId(id)) || [],    // Map array
        recipientGroupIds: request.gratuityConfig.recipientGroupIds?.map(id => new ObjectId(id)) || [] // Map array
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

  static async updateGroupConnections(
    sourceGroupId: string, 
    recipientGroupId: string, 
    action: 'add' | 'remove'
  ): Promise<void> {
    console.log(`🔗 ${action === 'add' ? 'Adding' : 'Removing'} connection:`, { sourceGroupId, recipientGroupId });
    const db = await this.getDb();

    if (action === 'add') {
    // Add recipientGroupId to source group's recipientGroupIds array
      await db.collection('staff_groups').updateOne(
        { _id: new ObjectId(sourceGroupId) },
        { $addToSet: { 'gratuityConfig.recipientGroupIds': new ObjectId(recipientGroupId) } } as any
      );

    // Add sourceGroupId to recipient group's sourceGroupIds array
      await db.collection('staff_groups').updateOne(
        { _id: new ObjectId(recipientGroupId) },
        { $addToSet: { 'gratuityConfig.sourceGroupIds': new ObjectId(sourceGroupId) } } as any
      );
    } else {
    // Remove recipientGroupId from source group's recipientGroupIds array
      await db.collection('staff_groups').updateOne(
        { _id: new ObjectId(sourceGroupId) },
        { $pull: { 'gratuityConfig.recipientGroupIds': new ObjectId(recipientGroupId) } } as any
      );

    // Remove sourceGroupId from recipient group's sourceGroupIds array
      await db.collection('staff_groups').updateOne(
        { _id: new ObjectId(recipientGroupId) },
        { $pull: { 'gratuityConfig.sourceGroupIds': new ObjectId(sourceGroupId) } } as any
      );
    }

    console.log(`✅ Successfully ${action === 'add' ? 'added' : 'removed'} bidirectional connection`);
  }

  static async updateStaffGroup(groupId: string, updates: {
    name?: string;
    description?: string;
    staffMemberIds?: string[];
    gratuityConfig?: any;
  }): Promise<StaffGroupWithId> {
    console.log('📝 Updating staff group:', groupId);
    const db = await this.getDb();
  
    // Get current group to compare connections
    const currentGroup = await db.collection<StaffGroupDocument>('staff_groups').findOne({_id: new ObjectId(groupId)});

    if (!currentGroup) {
     throw new Error('Group not found')
    }


    // Prepare the update document
    const updateDoc: any = {
      dateUpdated: new Date()
    };
  
    if (updates.name !== undefined) updateDoc.name = updates.name;
    if (updates.description !== undefined) updateDoc.description = updates.description;
    if (updates.staffMemberIds) {
      updateDoc.staffMemberIds = updates.staffMemberIds.map(id => new ObjectId(id));
    }
    if (updates.gratuityConfig) {
      updateDoc.gratuityConfig = {
        ...updates.gratuityConfig,
        sourceGroupIds: updates.gratuityConfig.sourceGroupIds?.map(id => new ObjectId(id)) || [],
        recipientGroupIds: updates.gratuityConfig.recipientGroupIds?.map(id => new ObjectId(id)) || []
      };

    // HANDLE BIDIRECTIONAL CONNECTION UPDATES
      const currentRecipients = currentGroup.gratuityConfig.sourceGroupIds?.map(id => id.toString()) || [];
      const newRecipients = updates.gratuityConfig.recipientGroupIds || [];

      const currentSources = currentGroup.gratuityConfig.sourceGroupIds?.map(id => id.toString()) || [];
      const newSources = updates.gratuityConfig.sourceGroupIds || [];

      // UPDATE RECIPIENT CONNECTIONS
      const recipientsToAdd = newRecipients.filter(id => !currentRecipients.includes(id));
      const recipientsToRemove = currentRecipients.filter(id => !newRecipients.includes(id));

      // UPDATE SOURCE CONNECTIONS
      const sourcesToAdd = newSources.filter(id => !currentSources.includes(id));
      const sourcesToRemove = currentSources.filter(id => !newSources.includes(id));

      // Apply bidirectional updates
      for (const recipientId of recipientsToAdd) {
        await this.updateGroupConnections(groupId, recipientId, 'add');
      }
      for (const recipientId of recipientsToRemove) {
        await this.updateGroupConnections(groupId, recipientId, 'remove');
      }
      for (const sourceId of sourcesToAdd) {
        await this.updateGroupConnections(sourceId, groupId, 'add');
      }
      for (const sourceId of sourcesToRemove) {
        await this.updateGroupConnections(sourceId, groupId, 'remove');
      }
    }

    const result = await db.collection<StaffGroupDocument>('staff_groups')
      .updateOne({ _id: new ObjectId(groupId) }, { $set: updateDoc });
    
    if (result.matchedCount === 0) {
      throw new Error('Group not found');
    }
  
    // Return the updated group
    const updatedGroup = await db.collection<StaffGroupDocument>('staff_groups')
      .findOne({ _id: new ObjectId(groupId) });
    
    if (!updatedGroup) {
      throw new Error('Failed to retrieve updated group');
    }

    console.log('✅ Successfully updated staff group with bidirectional connections');
    return transformStaffGroup(updatedGroup);
  }

  static async deleteStaffGroup(groupId: string): Promise<void> {
    console.log('🗑️ Deleting staff group:', groupId);
    const db = await this.getDb();
    
    const result = await db.collection('staff_groups').deleteOne({ 
      _id: new ObjectId(groupId) 
    });
    
    if (result.deletedCount === 0) {
      throw new Error('Group not found or already deleted');
    }
    
    console.log('✅ Successfully deleted staff group');
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







