const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { promisify } = require("util");

const db = require("../database/connect");

exports.register = (req, res) => {
  console.log(req.body);

  const { name, email, password } = req.body;
  const verificatonQuery = `SELECT email FROM user_details WHERE email = ${email}`;
  db.query(verificatonQuery, async (error, results) => {
    if (error) {
      return res.render("index", {
        message: "something went wrong",
      });
    } else if (results.length > 0) {
      return res.render("index", {
        message: "That email is already in use",
      });
    }
    let hashedPassword = await bcrypt.hash(password, 3);
    console.log("hashed password = " + hashedPassword);

    const insetQuery = `INSERT INTO user_details(name,email,password) VALUES ('${name}','${email}','${hashedPassword}')`;
    db.query(insetQuery, (error, results) => {
      if (error) {
        return res.render("index", {
          message: "something went wrong",
        });
      } else {
        return res.status(200).render("index", {
          message: "login success",
        });
      }
    });
  });
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

    const verificatonQuery = `SELECT email FROM user_details WHERE email = ${email}`;
    db.query(verificatonQuery, async (err, results) => {
      if (!results || !(await bcrypt.compare(password, results[0].password))) {
        return res.status(401).render("index", {
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
        return res.status(200).redirect("/");
      }
    });
  } catch (err) {
    return res.render("index", {
      message: "something went wrong",
    });
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
      const idQuery = `SELECT * FROM users WHERE id = ${decoded.id}`;

      db.query(idQuery, (err, results) => {
        if (!results) {
          return next();
        }
        req.user = results[0];
        return next();
      });
    } catch (err) {
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
  req.logout();
  req.session.destroy();
  res.status(200).redirect("/");
};
