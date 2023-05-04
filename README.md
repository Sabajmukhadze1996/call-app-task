# call-app-task

I made a table of users here is the data of users on the second page there is a chart of users in
percentage and total number of users, for example if two different citizens live in the same city
the data chart also shows how many users are from the same particular city.
I used one directory (folder) where I placed two sides of the application, the client side (React.js/TypeScript) and the server side (Node.js/express.js).
   I created the appropriate endpoints on the server side and let React.js manipulate those endpoints. The data is dynamically updated according to the updating or addition of users, (with modals and validations), we go to the second (Chart-Page) page with the specified button. I used Ant Design, axios, react-router-dom and Styled Components libraries.

When we download this project, we need to install the corresponding Node modules, it is better to use npm install --legacy-peer-deps so that there are no conflicts in the versions of the libraries.
 Then run the command ( npm start ) in the terminal in both directories
---React will run at localhost:3000
---Server - localhost:4000 - localhost:4000/users - the data of all existing users.
