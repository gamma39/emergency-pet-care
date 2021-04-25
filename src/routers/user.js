const express = require("express");
const router = new express.Router();
const User = require("../models/user");
const auth = require("../middleware/auth");
const path = require("path");


//backend page route for users
router.get("/dashboard", auth, async (req, res) => {
  res.render("dashboard");
});

//CREATE NEW USER ENDPOINT  
router.post("/users/register", async (req, res) => {
  const { firstName, lastName, email, password, confirmPassword, streetAddress, streetAddress2, city, state, zipCode } = req.body;
  let errors = [];
  

  //Check that all fields are filled out
  if (!firstName || !lastName || !email || !password || !confirmPassword|| !streetAddress || !city || !state || !zipCode) {
    errors.push({ msg: "Please fill in all fields" });
  }

  //Check that passwords match
  if (password !== confirmPassword) {
    errors.push({ msg: "Passwords do not match" });
  }

  //Check password length
  if (password.length < 7) {
    errors.push({ msg: "Password should be at least 7 characters" });
  }

  //Render errors to page if any exist
  if (errors.length > 0) {
    console.log(errors)
    res.render("register", {
      errors,
      firstName,
      lastName,
      email,
      streetAddress,
      streetAddress2,
      city,
      state,
      zipCode
      
    });
  } else {
    //validation passed then check if user exists
    const user = await User.findOne({ email });

    if (user) {
      console.log("fail 1")
      errors.push({ msg: "Email is already registered" });
      res.render("register", {
        errors,
        firstName,
        lastName,
        email,
        streetAddress,
        streetAddress2,
        city,
        state,
        zipCode
        
      });
    } else {
      console.log("success 1")
        //create new instance of user
      const newUser = new User({
        firstName,
        lastName,
        email,
        password,
        address: {
          streetAddress,
          streetAddress2,
          city,
          state,
          zipCode
        }
        
      });

      try {
        //save user to database
        await newUser.save();
        res.locals.user = newUser
        //create jwt
        const token = await newUser.generateAuthToken();
        //send token as cookie to browser
        res.cookie("auth_token", token);
        //redirect to dashboard on successful creation of user
        res.redirect("/dashboard");
      } catch (e) {
            req.flash('error_msg', "Unable to register. Please try again")
            res.status(400).send(e);
      }
    }
  }
 });


//login user endpoint
router.post("/users/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();
    res.cookie("auth_token", token);
    res.redirect("/dashboard");
  } catch (e) {
    res.status(400).send("Invalid user input");
  }
});

//Logout user
router.post("/users/logout", auth, async (req, res) => {
    try {
        req.user.tokens.splice(0, req.user.tokens.length)
        await req.user.save()
        res.clearCookie("auth_token")
        res.redirect("/")
    } catch (e) {
        res.status(500).send()
    }
} )

module.exports = router;
