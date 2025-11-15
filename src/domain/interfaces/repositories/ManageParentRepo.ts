import { CreateParentDto } from '../dto/parent/CreateParentDto';

export interface ManageParentRepo {
  register(
    createParentDto: CreateParentDto,
  ): Promise<{ parentId: number | null; error?: string }>;
  login(
    email: string,
    password: string,
  ): Promise<{
    parentId: number | null;
    childrenId: number | null;
    error?: string;
  }>;
  registerGoogle(
    createParentDto: CreateParentDto,
  ): Promise<{ parentId: number | null; error?: string }>;
  loginGoogle(email: string): Promise<{
    parentId: number | null;
    childrenId: number | null;
    error?: string;
  }>;
  securityPin(
    pinSecurity: string,
    parentId: number,
  ): Promise<{
    isValid: boolean;
    parentInfo?: { fullName: string };
  }>;
  validEmail(email: string): Promise<boolean>;
  updatePassword(email: string, hashedPassword: string): Promise<void>;
  getPinByIdParent(idParent: number): Promise<string>;
}
