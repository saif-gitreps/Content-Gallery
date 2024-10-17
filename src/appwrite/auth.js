import config from "../config/config";
import { Client, Account, ID } from "appwrite";

export class AuthService {
   client = new Client();
   account;

   constructor() {
      this.client.setEndpoint(config.appwriteUrl).setProject(config.appwriteProjectId);
      this.account = new Account(this.client);
   }

   async createAccount({ email, password, name }) {
      try {
         return await this.account.create(ID.unique(), email, password, name);
      } catch (error) {
         console.error("Error creating account:", error);
         throw error;
      }
   }

   async login({ email, password }) {
      try {
         return await this.account.createEmailPasswordSession(email, password);
      } catch (error) {
         console.error("Error during login:", error);
         throw error;
      }
   }

   async getCurrentUser() {
      try {
         return await this.account.get();
      } catch (error) {
         console.error("Error getting current user:", error);
         throw error;
      }
   }

   async updateName(name) {
      try {
         return await this.account.updateName(name);
      } catch (error) {
         console.error("Error updating name:", error);
         throw error;
      }
   }

   async updateEmail(email, password) {
      try {
         return await this.account.updateEmail(email, password);
      } catch (error) {
         console.error("Error updating email:", error);
         throw error;
      }
   }

   async updatePassword(password, oldPassword) {
      try {
         if (password !== oldPassword) throw new Error("Passwords do not match");

         return await this.account.updatePassword(password, oldPassword);
      } catch (error) {
         console.error("Error updating password:", error);
         throw error;
      }
   }

   async createPasswordRecovery(email) {
      try {
         return await this.account.createRecovery(
            email,
            "http://localhost:5173/password-recovery-step-two"
         );
      } catch (error) {
         console.error("Error creating password recovery:", error);
         throw error;
      }
   }

   async confirmPasswordRecovery(userId, secret, password, confirmPassword) {
      try {
         return await this.account.updateRecovery(
            userId,
            secret,
            password,
            confirmPassword
         );
      } catch (error) {
         console.error("Error confirming password recovery:", error);
         throw error;
      }
   }

   async logout() {
      try {
         await this.account.deleteSessions();
      } catch (error) {
         console.error("Error during logout:", error);
         throw error;
      }
   }
}

const authService = new AuthService();
export default authService;
