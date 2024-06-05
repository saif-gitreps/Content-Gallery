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
         console.log("post creation error: ", error);
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
         console.log("post update error: ", error);
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
         console.log("post retrieval error: ", error);
         throw error;
      }
   }

   async getPosts(queries, offset = 0, limit = 5) {
      try {
         return await this.databases.listDocuments(
            config.appwriteDatabaseId,
            config.appwriteCollectionId,
            [Query.limit(limit), Query.offset(offset), ...queries]
         );
      } catch (error) {
         console.log("post retrieval error: ", error);
         throw error;
      }
   }

   // async searchPosts(query) {
   //    try {
   //       return await this.databases.listDocuments(
   //          config.appwriteDatabaseId,
   //          config.appwriteCollectionId,
   //          [Query.or([Query.contains("title", query), Query.contains("content", query)])]
   //       );
   //    } catch (error) {
   //       console.log("post search error: ", error);
   //       throw error;
   //    }
   // }

   async getSavedPosts(queries, offset = 0, limit = 5) {
      try {
         return await this.databases.listDocuments(
            config.appwriteDatabaseId,
            config.appwriteSavedCollectionId,
            [Query.limit(limit), Query.offset(offset), ...queries]
         );
      } catch (error) {
         console.log("saved posts retrieval error: ", error);
         throw error;
      }
   }

   async unsavePost(saveId) {
      try {
         return await this.databases.deleteDocument(
            config.appwriteDatabaseId,
            config.appwriteSavedCollectionId,
            saveId
         );
      } catch (error) {
         console.log("post unsave error: ", error);
         throw error;
      }
   }

   async savePost(userId, articleId) {
      try {
         return await this.databases.createDocument(
            config.appwriteDatabaseId,
            config.appwriteSavedCollectionId,
            ID.unique(),
            {
               userId,
               articles: articleId,
            }
         );
      } catch (error) {
         console.log("post save error: ", error);
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
}

const service = new Service();

export default service;
