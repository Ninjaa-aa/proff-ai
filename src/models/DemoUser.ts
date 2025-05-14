// models/DemoUser.ts
import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IDemoUser extends Document {
  email: string;
  password: string;
  expiresAt: Date;
  isAdmin: boolean;
  createdAt: Date;
  _id: mongoose.Types.ObjectId;
  comparePassword(candidatePassword: string): Promise<boolean>;
  isExpired(): boolean;
}

interface IDemoUserModel extends Model<IDemoUser> {
  cleanupDemos(): Promise<void>;
}

const EXPIRATION_HOURS = 12;
const MS_PER_HOUR = 60 * 60 * 1000;

const getExpirationDate = () => {
  return new Date(Date.now() + EXPIRATION_HOURS * MS_PER_HOUR);
};

const demoUserSchema = new Schema<IDemoUser>({
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  expiresAt: { 
    type: Date, 
    required: true,
    default: getExpirationDate
  },
  isAdmin: {
    type: Boolean,
    required: true,
    default: true
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now
  }
});

// TTL index for auto-deletion
demoUserSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

demoUserSchema.methods.comparePassword = async function(candidatePassword: string) {
  return this.password === candidatePassword;
};

demoUserSchema.methods.isExpired = function() {
  return new Date() > this.expiresAt;
};

const DemoUser = (mongoose.models.DemoUser as IDemoUserModel) || 
  mongoose.model<IDemoUser, IDemoUserModel>('DemoUser', demoUserSchema);

// Static method to clean up old demos
DemoUser.cleanupDemos = async function() {
  const now = new Date();
  
  // Delete expired demos
  await this.deleteMany({ expiresAt: { $lte: now } });
  
  // If we still have more than 10 active demos, remove oldest ones
  const totalActiveDemos = await this.countDocuments({ expiresAt: { $gt: now } });
  if (totalActiveDemos > 10) {
    const excess = totalActiveDemos - 10;
    const oldestDemos = await this.find({ expiresAt: { $gt: now } })
      .sort({ createdAt: 1 })
      .limit(excess);
      
    await this.deleteMany({ _id: { $in: oldestDemos.map(demo => demo._id) } });
  }
};

export default DemoUser;
