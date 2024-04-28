# Node TS API

Node-TS-API is a TypeScript-based Node.js backend application serving as a foundational framework for building scalable and maintainable APIs. It follows a three-layer architecture to separate concerns and ensure clarity in code organization and maintainability.


## Technologies
- Node 18.13
- Express 4.18
- Sequelize 6.32
- Typescript 5.4
- Sequelize-Typescript 2.1
- Handlebars 4.7


## Features
- **Three-Layer Architecture**: Organizes the codebase into routes, controllers, and services, facilitating modular development and easier testing.
- Implements the **Express.js framework** for robust and efficient handling of HTTP requests and routing.
- Implements **JWT-based authentication** and **role-based access control** (RBAC) for user access management.
- Utilizes **Sequelize ORM**, offering seamless database interaction, migrations, and seeders. Additionall leverages **Sequelize-Typescript** for enhanced TypeScript compatibility and type safety.
- **Email Notifications** using **Handlebars** for template rendering.
- Security: Authentication with both **access token** and **refresh token** for enhanced security.
- **Separation of Concerns**: Divides routes and controllers into separate sections for admin and user interfaces, ensuring clarity and simplicity in the codebase.




## Getting Started

1. Clone the repository 
```
git clone https://github.com/David-Corona/Node-TS-API.git
```
2. Navigate to the project folder
```
cd Node-TS-API
```
3. Install the dependencies
```
npm install
```
4. Configure the environment by creating an .env file following the .env.template as example.

5. Run migrations and seeders
```
npm run migrate
npm run seed
```

6. Start the development server
```
npm run dev
```


## Authentication Workflow

![image](https://is.docs.wso2.com/en/5.10.0/assets/img/using-wso2-identity-server/oauth-refresh-token-diagram.png)

This authentication involves two types of tokens:

- Access Token: A short-lived token that grants access to protected server resources and is included in HTTP headers for authentication.

- Refresh Token: A long-lived token, stored as an HTTP cookie, that allows obtaining a new access token when the current one expires, maintaining user sessions without re-login (silent refresh).


## License
[MIT](https://choosealicense.com/licenses/mit/)