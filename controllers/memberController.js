const { Snowflake } = require("@theinternetfolks/snowflake");
const Community = require("../models/communityModel");
const Member = require("../models/memberModel");
const Role = require("../models/roleModel");
const { getRoleId } = require("../utils/helper");

// Add member
exports.addMember = async (req, res, next) => {
  const { community, user, role } = req.body;
  const userId = req.user._id;
  try {
    const adminRoleId = await getRoleId("Community Admin");
    const member = await Member.findOne({
      $and: [{ community: community }, { user: userId }, { role: adminRoleId }],
    });

    if (!member)
      return res.status(400).json({
        status: false,
        errors: [
          {
            message: "You are not authorized to perform this action.",
            code: "NOT_ALLOWED_ACCESS",
          },
        ],
      });

    const memberExist = await Member.findOne({
      $and: [{ community: community }, { user: user }],
    });

    if (memberExist)
      return res.status(400).json({
        status: false,
        errors: [
          {
            message: "User is already added in the community.",
            code: "RESOURCE_EXISTS",
          },
        ],
      });

    const memId = Snowflake.generate();
    const addMember = await Member.create({
      _id: memId,
      community,
      user,
      role,
    });

    return res.status(200).json({
      status: true,
      content: {
        data: {
          _id: addMember._id,
          community: addMember.community,
          user: addMember.user,
          role: addMember.role,
          created_at: addMember.created_at,
        },
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      error: String(error),
    });
  }
};

exports.deleteMember = async (req, res, next) => {
  const userId = req.params.id;
  const communityId = req.params.comId;
  const signedInUserId = req.user._id;
  try {
    const checkMember = await Member.findOne({
      $and: [{ community: communityId }, { user: userId }],
    });

    if (!checkMember)
      return res.status(400).json({
        status: false,
        errors: [
          {
            message: "Member not found.",
            code: "RESOURCE_NOT_FOUND",
          },
        ],
      });

    const adminRoleId = await getRoleId("Community Admin");
    const isAdmin = await Member.findOne({
      $and: [
        { community: communityId },
        { user: signedInUserId },
        { role: adminRoleId },
      ],
    });
    if (!isAdmin) {
      const moderatorRoleId = await getRoleId("Community Moderator");
      if (checkMember.role === isAdmin && req.user.role === moderatorRoleId)
        return res.status(400).json({
          status: false,
          errors: [
            {
              message: "You are not authorized to perform this action.",
              code: "NOT_ALLOWED_ACCESS",
            },
          ],
        });
      const isModerator = await Member.findOne({
        $and: [
          { community: communityId },
          { user: signedInUserId },
          { role: moderatorRoleId },
        ],
      });
      if (!isModerator)
        return res.status(400).json({
          status: false,
          errors: [
            {
              message: "You are not authorized to perform this action.",
              code: "NOT_ALLOWED_ACCESS",
            },
          ],
        });
    }

    await checkMember.deleteOne();
    return res.status(200).json({
      status: true,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      error: String(error),
    });
  }
};
