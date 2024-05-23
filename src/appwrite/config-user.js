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

   async createUserProfile(userId, name, email, profilePicture) {
      try {
         return await this.databases.createDocument(
            config.appwriteDatabaseId,
            config.appwriteUserCollectionId,
            userId,
            {
               name,
               email,
               profilePicture,
            }
         );
      } catch (error) {
         console.log("Appwrite serive :: uploadProfilePicture :: error", error);
         return false;
      }
   }

   async updateProfilePicture(userId, profilePicture) {
      try {
         // keep in mind i am storing the URL not the id from bucket.
         const updatedProfilePic = await this.databases.updateDocument(
            config.appwriteDatabaseId,
            config.appwriteUserCollectionId,
            userId,
            {
               profilePicture,
            }
         );
         if (!updatedProfilePic) {
            return await this.createUserProfile(userId, profilePicture);
         }
      } catch (error) {
         console.log("Appwrite serive :: updateProfilePicture :: error", error);
         return false;
      }
   }

   async getUserProfileData(userId) {
      try {
         const userProfile = await this.databases.getDocument(
            config.appwriteDatabaseId,
            config.appwriteUserCollectionId,
            userId
         );
         return userProfile.profilePicture;
      } catch (error) {
         console.log("Appwrite serive :: getProfilePicture :: error", error);
         return false;
      }
   }
}

const service = new Service();

export default service;
