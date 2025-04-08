import { Router } from "express";
import {
  changeCurrentPassword,
  getcurrentUser,
  getUserChannelProfile,
  getWatchHistory,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
  updateAccountdetails,
  updateUserAvatar,
  updateUserCoverImage,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router();

router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  registerUser
);
// router.route("/login").post(login)
router.route("/login").post(loginUser);
// secured routes
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refresh-token").post(refreshAccessToken);

//           name display on link  method->verifyJWT->(only verify people can access)
router.route("/change-password").post(verifyJWT, changeCurrentPassword);

router.route("/current-user").get(verifyJWT, getcurrentUser);

router.route("/update-details").patch(verifyJWT, updateAccountdetails);

router
  .route("/avatar")
  .patch(verifyJWT, upload.single("avatar"), updateUserAvatar);
//patch because we are updating specific fields
router
  .route("/cover-image")
  .patch(verifyJWT, upload.single("cover-image"), updateUserCoverImage);

//taking data from param upper are comming from body

router.route("/c/:username").get(verifyJWT, getUserChannelProfile);

router, route("watch-history").get(verifyJWT, getWatchHistory);

export default router;
