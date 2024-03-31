/* eslint-disable no-useless-catch */
import config from "../config/config";

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
         const user = await this.account.create(ID.unique(), email, password, name);

         if (user) {
            this.login({ email, password });
            return user;
         } else {
            return null;
         }
      } catch (error) {
         console.log("error related to create account", error);
         return null;
      }
   }

   async login({ email, password }) {
      try {
         return await this.account.createEmailPasswordSession(email, password);
      } catch (error) {
         console.log("error related to login", error);
         return null;
      }
   }

   async getCurrentUser() {
      try {
         return await this.account.get();
      } catch (error) {
         console.log("error related to get account", error);
         return null;
      }
   }

   async logout() {
      try {
         // we can also give a deleteSession("current") but good practise is to delete all sessions.
         return await this.account.deleteSessions();
      } catch (error) {
         console.log("error related to log out", error);
         return null;
      }
   }
}

// when this object is created, the methods will be called just how the docs mentioned.
const authService = new AuthService();

export default authService;
