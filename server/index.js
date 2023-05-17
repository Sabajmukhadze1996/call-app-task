const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");

const app = express();


app.use(cors());
app.use(bodyParser.json());


app.get("/users", (req, res) => {
    fs.readFile("./data.json", (err, data) => {
        if (err) throw err;
        const users = JSON.parse(data);
        res.send(users);
    });
});

app.post("/users", (req, res) => {
    fs.readFile("./data.json", (err, data) => {
        if (err) throw err;
        const users = JSON.parse(data);
        const newUser = {
            id: users.length + 1,
            name: req.body.name,
            email: req.body.email,
            gender: req.body.gender,
            address: {
                street: req.body.address.street,
                city: req.body.address.city,
            },
            phone: req.body.phone,
        };
        users.push(newUser);
        fs.writeFile("./data.json", JSON.stringify(users), (err) => {
            if (err) throw err;
            res.send(newUser);
        });
    });
});


app.put("/users/:id", (req, res) => {
    const userId = parseInt(req.params.id);
    fs.readFile("./data.json", (err, data) => {
        if (err) throw err;
        const users = JSON.parse(data);
        const userIndex = users.findIndex((user) => user.id === userId);
        if (userIndex === -1) {
            return res.status(404).send("user not found or does not exist...");
        }
        const updatedUser = {
            id: userId,
            name: req.body.name || users[userIndex].name,
            email: req.body.email || users[userIndex].email,
            gender: req.body.gender || users[userIndex].gender,
            address: {
                street: req.body.address?.street || users[userIndex].address.street,
                city: req.body.address?.city || users[userIndex].address.city,
            },
            phone: req.body.phone || users[userIndex].phone,
        };
        users[userIndex] = updatedUser;
        fs.writeFile("./data.json", JSON.stringify(users), (err) => {
            if (err) throw err;
            res.send(updatedUser);
        });
    });
});


app.delete("/users/:id", (req, res) => {
    const userId = parseInt(req.params.id);
    fs.readFile("./data.json", (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).send("internal server error.!");
        }
        let users = JSON.parse(data);
        users = users.filter((user) => user.id !== userId);
        fs.writeFile("./data.json", JSON.stringify(users), (err) => {
            if (err) {
                console.error(err);
                return res.status(500).send("internal server error");
            }
            res.status(200).send(`User ${userId} deleted successfully`);
        });
    });
});



const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`server api running on localhost:4000 on port ${PORT}`));