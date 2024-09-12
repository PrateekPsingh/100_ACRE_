
![100ACRE](https://github.com/PrateekPsingh/100_ACRE_/assets/97173401/07a0f9b6-1c7c-432a-95e1-91ea502133a0)


# 100ACRE

100 Acre is a MERN stack application designed to help users search for properties to buy or rent. With advanced filtering options, user login functionality, and messaging capabilities, it provides a seamless experience for both property seekers and owners.


<!-- ## Deployed link

https://pennybase.vercel.app/ -->

## Features

### User Authentication
- **User Login:** Secure login for existing users.
- **User Register:** Easy registration for new users.

### User Profile Management
- **Profile Update:** Users can update their profile information including username and password.
- **Upload Avatar:** Users can upload their profile pictures using Cloudinary.

### Property Posts
- **Create Post:** Users can create posts for properties they want to sell or rent.
- **Upload Property Pictures:** Users can upload images of their properties via Cloudinary.

### Browsing and Interaction
- **Search Properties:** Users can search for properties based on location, number of bedrooms, and type.
- **View Posts:** All users can browse and view property posts.
- **Save Posts:** Users can save posts for future reference.
- **Send Message:** Each post has a "Send Message" button allowing users to send text messages to the post owner.
- **Chat:** Users can message each other and engage in real-time chat.


## Technologies Used

- **MERN:** MongoDB, Express, React, Node.js
- **Cloudinary:** For image uploads
- **Prisma:** For database management
- **Zustand:** For state management
- **Socket.io:** For real-time messaging

## Quick Use Guide

### Demo Users
For testing purposes, two dummy users have been created:

1. Admin Account
   - Username: admin
   - Password: 123

2. Regular User Account
   - Username: user
   - Password: 123

### Search Examples
To quickly test the search functionality:

1. Search for properties in Lucknow:
   - Enter "Lucknow" in the location field
   - Set price range from 0 to 1000

2. Search for properties in Jabalpur:
   - Enter "Jabalpur" in the location field
   - Set price range from 0 to 1000


## Local Installation Guide


### Installation Steps

1. Clone the repository
- git clone https://github.com/PrateekPsingh/100.git

2. Navigate to the project directory
- cd hundred-acre

3. Start the API server
- cd api
- npm install
- npm run dev
- The server will run on `http://localhost:8800`

4. Start the client application
- cd ../client
- npm install
- npm run dev
- The frontend will run on `http://localhost:5174`

5. Start the Socket.io server
- cd ../socket
- npm install
- npm run dev
- Socket.io will run on port 4000

6. Access the application
- Open your web browser and go to `http://localhost:5174`

### Usage
- You can now use the Hundred Acre application on your local machine.
- Search for properties, create listings, and interact with other users.



