import config from "../config/config";
import appwriteService from "./config-appwrite";

import { Client, Account, ID } from "appwrite";

/*
    This is the way it is done in documentation, the below one is more organized way.   

    const client = new Client()
    .setEndpoint(config.appwriteUrl)
    .setProject(config.appwriteProjectId);

    const account = new Account(client);
*/
export class AuthService {
   client = new Client();
   account;

   constructor() {
      this.client.setEndpoint(config.appwriteUrl).setProject(config.appwriteProjectId);
      this.account = new Account(this.client);
   }

   async createAccount({ email, password, name }) {
      try {
         const userAccount = await this.account.create(
            ID.unique(),
            email,
            password,
            name
         );
         if (userAccount) {
            // creating a user profile in dbs for pfp and other stuffs.
            await appwriteService.createUserProfile(userAccount.$id);
            return await this.login({ email, password });
         } else {
            return userAccount;
         }
      } catch (error) {
         console.log("Appwrite service :: creating account :: error", error);
         return null;
      }
   }

   async login({ email, password }) {
      try {
         return await this.account.createEmailPasswordSession(email, password);
      } catch (error) {
         console.log("Appwrite service :: login :: error", error);
         return null;
      }
   }

   async getCurrentUser() {
      try {
         return await this.account.get();
      } catch (error) {
         console.log("Appwrite service :: getting user :: error", error);
         return null;
      }
   }

   async updateName(name) {
      try {
         return await this.account.updateName(name);
      } catch (error) {
         console.log("Appwrite service :: update name :: error", error);
         return null;
      }
   }

   async updateEmail(email, password) {
      try {
         return await this.account.updateEmail(email, password);
      } catch (error) {
         console.log("Appwrite service :: update email :: error", error);
         return null;
      }
   }

   async createEmailVerification() {
      try {
         return await this.account.createVerification(
            "http://localhost:5173/email-confirmation"
         );
      } catch (error) {
         console.log("Appwrite service :: update email verification :: error", error);
         return null;
      }
   }

   async confirmEmailVerification(userId, secret) {
      try {
         return await this.account.updateVerification(userId, secret);
      } catch (error) {
         console.log("Appwrite service :: confirm email verification :: error", error);
         return null;
      }
   }

   async createPhoneVerification() {
      try {
         return await this.account.createPhoneVerification();
      } catch (error) {
         console.log("Appwrite service :: create phone verification :: error", error);
         return null;
      }
   }

   async confirmPhoneVerification(userId, secret) {
      try {
         return await this.account.updatePhoneVerification(userId, secret);
      } catch (error) {
         console.log("Appwrite service :: confirm phone verification :: error", error);
         return null;
      }
   }

   async updatePassword(password, oldPassword) {
      try {
         return await this.account.updatePassword(password, oldPassword);
      } catch (error) {
         console.log("Appwrite service :: update password :: error", error);
         return null;
      }
   }

   async updatePhone(email, password) {
      try {
         return await this.account.updatePhone(email, password);
      } catch (error) {
         console.log("Appwrite service :: update phone :: error", error);
         return null;
      }
   }

   async updateProfilePicture(profilePicture, profilePictureId) {
      try {
         return await this.account.updatePrefs({
            profilePicture: profilePicture,
            profilePictureId: profilePictureId,
         });
      } catch (error) {
         console.log("Appwrite service :: update profile pic :: error", error);
         return null;
      }
   }

   async getProfilePicture() {
      try {
         return await this.account.getPrefs();
      } catch (error) {
         console.log("Appwrite service :: getting profile picture :: error", error);
         return null;
      }
   }

   async createPasswordRecovery(email) {
      try {
         return await this.account.createRecovery(
            email,
            "http://localhost:5173//password-recovery-step-two"
         );
      } catch (error) {
         console.log("Appwrite service :: create password recovery :: error", error);
         return null;
      }
   }

   async confirmPasswordRecovery(userId, secret, password) {
      try {
         return await this.account.updateRecovery(userId, secret, password);
      } catch (error) {
         console.log("Appwrite service :: update password recovery :: error", error);
         return null;
      }
   }

   async logout() {
      try {
         await this.account.deleteSessions();
      } catch (error) {
         console.log("Appwrite serive :: logout :: error", error);
         return null;
      }
   }
}

const authService = new AuthService();

export default authService;
