/* eslint-disable no-useless-catch */
import config from "../config/config";
import { ID, Client, Databases, Query, Storage } from "appwrite";

export class Service {
   client = new Client();
   databases;
   buckect;

   constructor() {
      this.client.setEndpoint(config.appwriteUrl).setProject(config.appwriteProjectId);
      this.databases = new Databases(this.client);
      this.bucket = new Storage(this.client);
   }

   async createPost({ title, content, featuredImage, status, userId }) {
      try {
         return await this.databases.createDocument(
            config.appwriteDatabaseId,
            config.appwriteCollectionId,
            ID.unique(),
            {
               title,
               content,
               featuredImage,
               status,
               userId,
            }
         );
      } catch (error) {
         throw error;
      }
   }

   async updatePost(id, { title, content, featuredImage, status }) {
      try {
         return await this.databases.updateDocument(
            config.appwriteDatabaseId,
            config.appwriteCollectionId,
            id,
            {
               title,
               content,
               featuredImage,
               status,
            }
         );
      } catch (error) {
         throw error;
      }
   }

   async deletePost(id) {
      try {
         await this.databases.deleteDocument(
            config.appwriteDatabaseId,
            config.appwriteCollectionId,
            id
         );
         return true;
      } catch (error) {
         return false;
      }
   }

   async getPost(id) {
      try {
         return await this.databases.getDocument(
            config.appwriteDatabaseId,
            config.appwriteCollectionId,
            id
         );
      } catch (error) {
         throw error;
      }
   }

   async getPosts() {
      try {
         return await this.databases.listDocuments(
            config.appwriteDatabaseId,
            config.appwriteCollectionId,
            [Query.equal("status", "active")]
         );
      } catch (error) {
         console.log("post retrieval error: ", error);
         throw error;
      }
   }

   async getUserPosts(userId) {
      try {
         return await this.databases.listDocuments(
            config.appwriteDatabaseId,
            config.appwriteCollectionId,
            [Query.equal("userId", userId)]
         );
      } catch (error) {
         console.log("user posts retrieval error: ", error);
         throw error;
      }
   }

   async uploadFile(file) {
      try {
         return await this.bucket.createFile(config.appwriteBucketId, ID.unique(), file);
      } catch (error) {
         console.log("Appwrite serive :: uploadFile :: error", error);
         return false;
      }
   }
   async deleteFile(fileId) {
      try {
         return await this.buckect.deleteFile(config.appwriteBucketId, fileId);
      } catch (error) {
         console.log("Appwrite serive :: deleteFile :: error", error);
         return false;
      }
   }

   async getFilePrev(fileId) {
      return this.bucket.getFilePreview(config.appwriteBucketId, fileId);
   }

   async createUserProfile(userId, profilePicture) {
      try {
         return await this.databases.createDocument(
            config.appwriteDatabaseId,
            config.appwriteUserCollectionId,
            userId,
            {
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
