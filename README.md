# Content Gallery - Social Media Web App

A full-featured, modern social media platform where users can share their favorite pictures as posts, save others' shared posts, comment, and enjoy scrolling through high-quality content.

## Features

🎨 **Clean UI and Simple UX**
- 🔧 Built from scratch with modern technology using **React**.
- 🛠 Features a clean, modern, and compact design with a **dark mode** option using **Tailwind CSS**.
- ⚡️ Fast and responsive with smooth transitions and loading indicators between pages.

🧑🏻‍💻 **User Capabilities**
  - Browse through **content** and links without needing to be **authenticated**.
  - Sign up to create an account and start posting content.
  - Authenticated users can:
    - Create, update, and delete their posts.
    - Upload high-quality images.
    - **Crop**, **rotate**, and **adjust the aspect ratio** of images before posting.
    - Toggle the active status of uploaded posts.
    - Comment on and save posts they like.
    - Browse through their **saved** posts.
    - Update profile information, such as profile picture, bio, and more.

🔐 **Authentication and Security**
- Secure authentication using **Appwrite** email and password sessions for safe browsing.
- Email and phone number **verification**.
- Password reset for forgotten credentials using email verification.
- Passwords are hashed with **Argon2**, a resilient and secure password hashing algorithm.

💻 **Tech Stack and Features**
- 🖥  Fully written in **React**, following best coding practices for maintainability and scalability.
- 📜 Utilizes **React Hook Form** for strict form input validation and error handling.
- 🛢  Smooth integration of **Appwrite** database queries and authentication services.
- 🪝 Custom **hooks** for refactoring and reusing common functionality.
- 🌄 Infinite scrolling and paginated queries implemented with **Tanstack React Query**.
- 🦥 Lazy loading of images for fast and responsive rendering of bulk images using **React Lazy Load**.
- 🤞 **Optimistic** updates while adding/removing comments on a post, providing an uninterrupted UX using **Tanstack React Query**.
- 🖼️ Image cropping and rotating capabilities with **React Easy Crop**.
- 🚀 Efficient cache management and cache invalidation using **Tanstack React Query**.
- 📁 Simple authentication state management using **Redux**.
- 🔧 Seamless integration of data fetching, mutations, and error handling using **Tanstack React Query**.

🎁 **Additional Features**
- 🔄 Highly customizable and extendable, with more features planned for future updates.
- 📱 Fully responsive design for both mobile and desktop devices.
