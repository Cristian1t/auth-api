import { DocumentType, getModelForClass, modelOptions, pre, prop, Severity } from '@typegoose/typegoose';
import argon2 from 'argon2';
import { nanoid } from 'nanoid';
import log from '../utils/logger';

// pre is used to has the password before saving it to the database using argon2
@pre<User>('save', async function () {
  if (!this.isModified('password')) {
    return
  }

  this.password = await argon2.hash(this.password);
  return;
})
// modelOptions is used to set the schema options and add the timestamp
@modelOptions({
  schemaOptions: {
    timestamps: true,
  },
  options: {
    allowMixed: Severity.ALLOW,
  },
})
export class User {
  @prop({ lowercase: true, required: true, unique: true })
  email: string;

  @prop({ required: true })
  firstName: string;

  @prop({ required: true })
  lastName: string;

  @prop({ required: true })
  password: string;

  @prop({ required: true, default: () => nanoid() })
  verificationCode: string;

  @prop()
  passwordResetCode: string | null;

  @prop({ default: false })
  verified: boolean;

  // function to check if the password is correct
  async validatePassword(this: DocumentType<User>, candidatePassword: string) {
    try {
      return await argon2.verify(this.password, candidatePassword);
    } catch (e) {
      log.error(e, "Error validating password");
      return false;
    }
  }
}

const UserModel = getModelForClass(User);

export default UserModel;