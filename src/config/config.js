const config = {
   appwriteUrl: String(import.meta.env.VITE_APPWRITE_URL),
   appwriteProjectId: String(import.meta.env.VITE_APPWRITE_PROJECT_ID),
   appwriteCollectionId: String(import.meta.env.VITE_APPWRITE_COLLECTION_ID),
   appwriteUserCollectionId: String(import.meta.env.VITE_APPWRITE_USER_COLLECTION_ID),
   appwriteCommentsCollectionId: String(
      import.meta.env.VITE_APPRWITE_COMMENTS_COLLECTION_ID
   ),
   appwriteDatabaseId: String(import.meta.env.VITE_APPWRITE_DATABASE_ID),
   appwriteBucketId: String(import.meta.env.VITE_APPWRITE_BUCKET_ID),
};

export default config;
