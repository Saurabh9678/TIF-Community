const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

// exports.isAuthenticatedUser = async (req, res, next) => {
//   const headerToken = req.headers.authorization
//     let token;
//     if(headerToken){
//         const splited_token =  headerToken.toString().split(" ")
//         if(splited_token[0] === "Bearer"){
//             splited_token.map(async (inside_token) => {
//                 if(inside_token !== "Bearer"){
//                     token = inside_token;
//                 }
//             })
//         }
//         else{
//             return next(new ErrorHandler("Please login to access the resource", 401))
//         }
//         if(!token){
//           return next(new ErrorHandler("Please login to access the resource", 401))
//         }
//     }else{
//       return next(new ErrorHandler("Please login to access the resource", 401))
//     }

//   const decodedData = jwt.verify(token, process.env.JWT_SECRET);

//   req.user = await User.findById(decodedData.id);
//   next();
// };

exports.isAuthenticatedUser = async (req, res, next) => {
  const { token } = req.cookies;
  
  if (!token)
    return res.status(401).json({
      status: false,
      errors: [
        {
          message: "You need to sign in to proceed.",
          code: "NOT_SIGNEDIN",
        },
      ],
    });

  try {
    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
    
    req.user = await User.findById(decodedData.id);
    next();
  } catch (error) {
    return res.status(500).json({
      status: false,
      error: String(error),
    });
  }
};
