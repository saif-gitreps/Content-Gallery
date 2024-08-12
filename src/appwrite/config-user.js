import config from "../config/config";
import { Client, Databases, Storage } from "appwrite";

export class Service {
   client = new Client();
   databases;
   buckect;

   constructor() {
      this.client.setEndpoint(config.appwriteUrl).setProject(config.appwriteProjectId);
      this.databases = new Databases(this.client);
      this.bucket = new Storage(this.client);
   }

   async createUserProfile(userId, name, profilePicture = "/blank-dp.png", bio = "") {
      try {
         return await this.databases.createDocument(
            config.appwriteDatabaseId,
            config.appwriteUserCollectionId,
            userId,
            {
               name,
               profilePicture,
               bio,
            }
         );
      } catch (error) {
         console.log("Appwrite serive :: uploadProfilePicture :: error", error);
         return false;
      }
   }

   async updateProfileDetail(userId, name, profilePicture, bio) {
      try {
         // I am storing the URL not the id from bucket.
         return await this.databases.updateDocument(
            config.appwriteDatabaseId,
            config.appwriteUserCollectionId,
            userId,
            {
               name,
               profilePicture,
               bio,
            }
         );
      } catch (error) {
         console.log("Appwrite serive :: updateProfilePicture :: error", error);
         return false;
      }
   }

   async getUserProfile(userId) {
      try {
         return await this.databases.getDocument(
            config.appwriteDatabaseId,
            config.appwriteUserCollectionId,
            userId
         );
      } catch (error) {
         console.log("Appwrite serive :: getProfilePicture :: error", error);
         return false;
      }
   }
}

const service = new Service();

export default service;
