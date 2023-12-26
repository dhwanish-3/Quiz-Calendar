const mysql = require("mysql");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { promisify } = require("util");

const db = require("../routes/db_connection");

exports.register = (req, res) => {
  console.log(req.body);
  // const name=req.body.name;
  // const email=req.body.email;
  // const password=req.body.password;
  const { name, email, password } = req.body;

  db.query(
    "SELECT email FROM user_details WHERE email = ?",
    [email],
    async (error, results) => {
      if (error) {
        console.log(error);
      } else if (results.length > 0) {
        // res.status(200).redirect("/");
        // alert("Email already exists. Please choose a different email");
        return res.render("index", {
          message: "That email is already in use",
        });
      }
      let hashedPassword = await bcrypt.hash(password, 3);
      console.log(hashedPassword);
      let sqlquery = `INSERT INTO user_details(name,email,password) VALUES ('${name}','${email}','${hashedPassword}')`;
      db.query(sqlquery, (error, results) => {
        if (error) {
          console.log(error);
        } else {
          console.log(results);
          res.status(200).redirect("/");
          // alert("Successfully Registered");
          // return res.status(200).redirect('/',{
          //     message:'Successfully registered'
          // });
        }
      });
      console.log("Register happy now..?");
    }
  );
};

exports.login = async (req, res) => {
  console.log(req.body);
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).render("index", {
        message: "Please Provide an email and password",
      });
    }
    db.query(
      "SELECT * FROM user_details WHERE email = ?",
      [email],
      async (err, results) => {
        console.log(results);
        if (
          !results ||
          !(await bcrypt.compare(password, results[0].password))
        ) {
          res.status(401).render("index", {
            message: "Email or Password is incorrect",
          });
        } else {
          const id = results[0].id;

          const token = jwt.sign({ id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN,
          });

          console.log("the token is " + token);

          const cookieOptions = {
            expires: new Date(
              Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
            ),
            httpOnly: true,
          };
          res.cookie("userSave", token, cookieOptions);
          res.status(200).redirect("/");
        }
      }
    );
  } catch (err) {
    console.log(err);
  }
};

exports.isLoggedIn = async (req, res, next) => {
  if (req.cookies.userSave) {
    try {
      // 1. Verify the token
      const decoded = await promisify(jwt.verify)(
        req.cookies.userSave,
        process.env.JWT_SECRET
      );
      console.log(decoded);

      // 2. Check if the user still exist
      db.query(
        "SELECT * FROM users WHERE id = ?",
        [decoded.id],
        (err, results) => {
          console.log(results);
          if (!results) {
            return next();
          }
          req.user = results[0];
          return next();
        }
      );
    } catch (err) {
      console.log(err);
      return next();
    }
  } else {
    next();
  }
};
exports.logout = (req, res) => {
  res.cookie("userSave", "logout", {
    expires: new Date(Date.now() + 2 * 1000),
    httpOnly: true,
  });
  res.status(200).redirect("/");
};
