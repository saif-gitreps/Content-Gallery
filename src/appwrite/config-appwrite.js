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

   async createPost({ title, slug, content, featuredImage, status, userId }) {
      try {
         return await this.databases.createDocument(
            config.appwriteDatabaseId,
            config.appwriteCollectionId,
            slug,
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

   async updatePost(slug, { title, content, featuredImage, status }) {
      try {
         return await this.databases.updateDocument(
            config.appwriteDatabaseId,
            config.appwriteCollectionId,
            slug,
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

   async deletePost(slug) {
      try {
         await this.databases.deleteDocument(
            config.appwriteDatabaseId,
            config.appwriteCollectionId,
            slug
         );
         return true;
      } catch (error) {
         return false;
      }
   }

   async getPost(slug) {
      try {
         return await this.databases.getDocument(
            config.appwriteDatabaseId,
            config.appwriteCollectionId,
            slug
         );
      } catch (error) {
         throw error;
      }
   }

   async getPosts(queries = [Query.equal("status", "active")]) {
      try {
         return await this.databases.listDocuments(
            config.appwriteDatabaseId,
            config.appwriteCollectionId,
            queries
         );
      } catch (error) {
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
         await this.buckect.deleteFile(config.appwriteBucketId, fileId);
         return true;
      } catch (error) {
         return false;
      }
   }

   async getFilePreview(fileId) {
      try {
         return await this.buckect.getFilePreview(config.appwriteBucketId, fileId);
      } catch (error) {
         throw error;
      }
   }
}

const service = new Service();

export default service;
