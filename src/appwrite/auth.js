/* eslint-disable no-useless-catch */
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
         console.log("Appwrite serive :: createAccount :: error", error);
         return null;
      }
   }

   async login({ email, password }) {
      try {
         return await this.account.createEmailSession(email, password);
      } catch (error) {
         console.log("Appwrite serive :: login :: error", error);
         return null;
      }
   }

   async getCurrentUser() {
      try {
         return await this.account.get();
      } catch (error) {
         console.log("Appwrite serive :: getCurrentUser :: error", error);
         return null;
      }
   }

   async updateProfile({ name, email, password, phone }) {
      try {
         return await this.account.updateEmail(name, email, password, phone);
      } catch (error) {
         console.log("Appwrite serive :: update :: error", error);
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
