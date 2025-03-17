const asyncHandler = (requestHandler)=>{
    (req, res, next) =>{
        Promise.resolve(requestHandler(req, res, next)).catch((err)=>next(err))
    }
}

export {asyncHandler}


//Method 02


//wrapper function to use multiple time
// const asyncHandler = (fu)=>{ //higher order function that can accept function
//     async (req, res, next)=>{
//         try {
//             await fu(req, res, next)
//         } catch (error) {
//             res.status(error.code || 500).json({
//                 success: false,
//                 message: error.message
//             })
//         }
//     }
// }