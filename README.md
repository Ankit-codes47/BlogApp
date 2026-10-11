# Fullstack Blog Project

A full-stack blog application built with Node.js, Express, MongoDB, and EJS. Users can register, log in, create blog posts with multiple images, add comments, update their profiles, and manage their own posts and account.

## Features

- User registration and login with Passport.js
- Session-based authentication using Express Session
- Blog post creation with image uploads
- Multiple post images supported via Cloudinary + Multer
- Post editing and deletion with authorization checks
- Comments on posts with edit/delete controls
- User profile page and profile image upload
- Delete account flow that removes associated posts, comments, and uploaded media
- Responsive EJS-based views

## Tech Stack

- Node.js
- Express.js
- MongoDB + Mongoose
- EJS templating
- Passport.js for authentication
- bcryptjs for password hashing
- Cloudinary for media storage
- Multer for file uploads
- Method-override for PUT/DELETE requests

## Project Structure

```text
BLOG_PROJECT/
├── app.js
├── .env
├── package.json
├── README.md
├── config/
│   ├── cloudinary.js
│   ├── multer.js
│   └── passport.js
├── controllers/
│   ├── authController.js
│   ├── commentControllers.js
│   ├── postController.js
│   └── userController.js
├── middlewares/
│   ├── auth.js
│   └── errorHandler.js
├── models/
│   ├── Comment.js
│   ├── File.js
│   ├── Post.js
│   └── User.js
├── routes/
│   ├── authRoutes.js
│   ├── commentRoutes.js
│   ├── postRoutes.js
│   └── userRoutes.js
├── utils/
├── public/
│   ├── css/
│   │   └── styles.css
│   ├── js/
│   │   └── site.js
│   └── favicon.svg
├── views/
│   ├── error.ejs
│   ├── home.ejs
│   ├── login.ejs
│   ├── register.ejs
│   ├── newPost.ejs
│   ├── posts.ejs
│   ├── postDetails.ejs
│   ├── editPost.ejs
│   ├── editComment.ejs
│   ├── profile.ejs
│   ├── editProfile.ejs
│   └── partials/
│       ├── header.ejs
│       └── footer.ejs
└── node_modules/
```

The `public/` directory contains the responsive presentation layer, lightweight
navigation and image-preview interactions, and the Public Blog favicon.

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
PORT=3000
MONGODB_URL=your_mongodb_connection_string
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

> The project also expects a MongoDB session store connection and uses the same `MONGODB_URL` value in the app configuration.

## Installation

1. Clone the repository.
2. Navigate to the project folder.
3. Install dependencies:

```bash
npm install
```

## Run the App

Start the server:

```bash
npm start
```

Then open:

```text
http://localhost:3000
```

## Authentication and Route Overview

### Auth Routes

- `GET /auth/login` — login page
- `POST /auth/login` — login logic
- `GET /auth/register` — registration page
- `POST /auth/register` — create a new user
- `GET /auth/logout` — log out

### Post Routes

- `GET /posts` — view all posts
- `GET /posts/add` — create post form
- `POST /posts/add` — create a new post
- `GET /posts/:id` — view a single post and its comments
- `GET /posts/:id/edit` — edit a post form
- `PUT /posts/:id` — update post
- `DELETE /posts/:id` — delete post

### Comment Routes

- `POST /posts/:id/comments` — add comment to a post
- `GET /comments/:id/edit` — edit comment form
- `PUT /comments/:id` — update comment
- `DELETE /comments/:id` — delete comment

### User Routes

- `GET /user/profile` — profile page
- `GET /user/edit` — edit profile page
- `POST /user/edit` — update profile info and profile picture
- `POST /user/delete` — delete user account

## Model Summary

### User

Fields include:

- username
- email
- password
- profilePicture
- bio
- posts
- comments

### Post

Fields include:

- title
- content
- author
- images
- comments

### Comment

Fields include:

- content
- post
- author

### File

Fields include:

- url
- public_id
- uploaded_by

## Notes

- The app uses `ensureAuthenticated` middleware to protect authenticated routes.
- Images are uploaded to Cloudinary and references are stored in MongoDB.
- Error handling is centralized in the middleware file and renders the `error.ejs` view.
- The app is intended for a simple blog experience rather than a production-grade multi-user CMS.

## License

This project is licensed under the ISC license.
