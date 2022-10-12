//every nodemon server restart regenerates the database

//import modules downloaded ; make variables ;
require("dotenv").config(); // call env file
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express(); // express application; app =object to handle requests
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
//const app= express();

const PORT = process.env.PORT || 8000; // gave an optional port and hidden one port in env
// connecting to mongodb - hidden uri in env
mongoose
  .connect(process.env.MONGOURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })

  .then(() => {
    //listen to a particular port for requests

    app.listen(PORT, () => {
      console.log("Listening on port 3001.");
      console.log("Mongodb connected.");
    });
  })
  .catch((e) => {
    console.log(e);
  });

const Client = require("./models/Client");
const Record = require("./models/Records");
const UserLogs = require("./models/UserLogs");
const roles = require("./middleware/roles");
const auth = require("./middleware/auth2.js");
app.use(bodyParser.json()); // allows 'app' to use body-parser

//API to fetch all clients with their loan status (Only accessed by the Admin)
app.get("/get-all-users", auth, async (req, res) => {
  try {
    //Extract the adminId from the JWT token
    const adminId = req.user.id;

    //Checks whether the extracted ID from JWT is Admin or not
    const adminData = await UserLogs.findOne({ idnum: adminId }).lean();

    //If it is an Admin
    if (adminData.Role === "Admin") {
      //Extracts all the data from the records while populating the clients details via idnum
      const clientData = await Record.find({}).populate("idmun");
      return res.status(200).json({ status: true, data: clientData });
    } else
      return res.status(401).json({ status: false, message: "Not an Admin" });
  } catch (err) {
    //If it is not an Admin,returning response as unauthorized.
    return res.status(503).json({ status: false, message: err.message });
  }
});

app.get("/fetch-loan-status", auth, async (req, res) => {
  //get: get request; "/" : req sent to root ;
  // you can also send msg in html

  try {
    const cli = await UserLogs.findOne({
      Username: req.body.Username,
      Password: req.body.Password,
    });
    console.log("The client" + cli.idnum);
    const rec = await Record.findOne({ idnum: cli.idnum });

    //rec will contain idnum and your lonestat
    if (cli.Role === "Admin" || cli.Role === "Client") {
      // Verify if client or admin
      console.log(rec);
      if (rec === undefined) {
        return res.status(404).send({ msg: "Client not found in database!" });
      }

      return res
        .status(200)
        .send("The following is the loan status of the client:" + rec.loanstat);
    }

    // Return Record
    return res.status(200).send({ msg: "HTTP GET -Success!!!!!" });
  } catch (err) {
    console.log(err.message);
    return res.status(404).send({ msg: "Client not found in database!" });
  }
});

// app.post("/create-new-client",async(req,res)=>{
//     try{

//     }catch(err){
//         return res.status(503).json({data:err.message});
//     }
// })

// // to create a new client record
app.post("/create-new-client", async (req, res) => {
  //post: post request; "/" : req sent to root ;
  try {
    const cli = await UserLogs.findOne({
      Username: req?.body?.UsernameAdmin,
      Password: req?.body?.PasswordAdmin,
    });

    if (
      req.body.refferalCode === "AdminPass" ||
      (cli && cli.Role === "Admin")
    ) {
      let newUser = await Client.create({
        firstname: req.body["firstname"],
        lastname: req.body["lastname"],
        phnum: req.body["phnum"],
      });
      await newUser.save();

      let newRec = await Record.create({
        loanstat: req.body["loanstat"],
        idnum: newUser._id,
      });
      await newRec.save();

      await jwt.sign(
        { id: newUser.id },
        process.env.JWT_SECRET,
        async (err, token) => {
          if (err) return res.status(501).json({ error: err.message });

          const salt = await bcrypt.genSalt(15);
          console.log(await bcrypt.hash(req.body.Password, salt));
          const hashedPassword = await bcrypt.hash(req.body.Password, salt);
          const UserLogss = await UserLogs.create({
            idnum: newUser._id,
            Username: req.body.Username,
            Password: req.body.Password,
            Role: req.body.Role,
            hashedPassword,
          });
          await UserLogss.save();

          return res.status(201).json({
            message: "Successfully Created",
            user: newUser,
            token: token, //perm token in db
          });
        }
      );
    }
  } catch (err) {
    console.log("We r hereeeeeeeeeeeeeeeeeee");
    return res.status(404).json({ error: err.message });
  }
});

//to update client info

app.put("/update-user-info", auth, async (req, res) => {
  //put: put request; "/" : req sent to root ;

  //login
  const cli = await UserLogs.findOne({
    Username: req.body.Username,
    Password: req.body.Password,
  });
  try {
    if (cli.Role === "Admin" || req.body.refferalCode === "AdminPass") {
      //send entire data with updated data as well
      const upd = await Client.updateOne(
        { _id: req.body.idnum },
        {
          $set: {
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            phnum: req.body.phnum,
          },
        }
      );
      return res.status(200).send(upd);
    } else return res.status(404).json({ message: "No Cli found" });
  } catch (err) {
    return res.status(501).send(err.msg);
  }
});

app.put("/update-user-log", auth, async (req, res) => {
  //put: put request; "/" : req sent to root ;

  //login
  const cli = await UserLogs.findOne({
    Username: req.body.Username,
    Password: req.body.Password,
  });
  try {
    if (cli.Role === "Admin" || req.body.refferalCode === "AdminPass") {
      //if person is admin

      //send entire data with updated data as well
      const upd = await UserLogs.updateOne(
        { idnum: req.body.idnum },
        {
          $set: {
            Username: req.body.Username,
            Password: req.body.Password,
            Role: req.body.Role,
          },
        }
      );
      //updating username, pass, role of a specific client as per provided idnum of theirs

      return res.status(200).send(upd);
    }
  } catch (err) {
    return res.status(501).send(err.msg);
  }
});

//to delete client info

app.delete("/delete-client-data", auth, async (req, res) => {
  //Delete: delete request; "/" : req sent to root ;

  try {
    const cli = await UserLogs.findOne({
      Username: req.body.Username,
      Password: req.body.Password,
    });

    if (cli.Role === "Admin") {
      //delete client history as per id provided
      console.log(req.body.idnum);
      const del3 = await UserLogs.deleteOne({ idnum: req.body.idnum });
      const del2 = await Record.deleteOne({ idnum: req.headers.idnum });
      const del = await Client.deleteOne({ idnum: req.body.idnum });

      return res.status(200).send({ img: "The record has been deleted. " });
    }
  } catch (err) {
    return res.status(501).send(err.msg);
  }
});

//delete client record only
app.delete("/delete-client-record", auth, async (req, res) => {
  //Delete: delete request; "/" : req sent to root ;

  try {
    const cli = await UserLogs.findOne({
      Username: req.body.Username,
      Password: req.body.Password,
    });

    if (cli.Role === "Admin") {
      //delete client history as per id provided

      const del3 = await Record.deleteOne({ idnum: req.body.idnum });

      return res.status(200).send({ img: "The record has been deleted. " });
    }
  } catch (err) {
    return res.status(501).send(err.msg);
  }
});
