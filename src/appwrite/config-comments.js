import config from "../config/config";
import { ID, Client, Databases, Storage, Query } from "appwrite";

export class Service {
   client = new Client();
   databases;
   buckect;

   constructor() {
      this.client.setEndpoint(config.appwriteUrl).setProject(config.appwriteProjectId);
      this.databases = new Databases(this.client);
      this.bucket = new Storage(this.client);
   }

   async addComment(content, avatar, articleId, userName) {
      try {
         return await this.databases.createDocument(
            config.appwriteDatabaseId,
            config.appwriteCommentsCollectionId,
            ID.unique(),
            {
               content,
               avatar,
               articleId,
               userName,
            }
         );
      } catch (error) {
         console.log("comment creation error: ", error);
         throw error;
      }
   }

   async getComments(articleId) {
      try {
         return await this.databases.listDocuments(
            config.appwriteDatabaseId,
            config.appwriteCommentsCollectionId,
            [Query.equal("articleId", articleId)]
         );
      } catch (error) {
         console.log("comment retrieval error: ", error);
         throw error;
      }
   }

   async deleteComment(commentId) {
      try {
         return await this.databases.deleteDocument(
            config.appwriteDatabaseId,
            config.appwriteCommentsCollectionId,
            commentId
         );
      } catch (error) {
         console.log("comment deletion error: ", error);
         throw error;
      }
   }
}

const service = new Service();

export default service;
