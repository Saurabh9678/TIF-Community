const { Snowflake } = require("@theinternetfolks/snowflake");
const Community = require("../models/communityModel");
const Member = require("../models/memberModel");
const Role = require("../models/roleModel");
const { getRoleId, getSlugName } = require("../utils/helper");

// Create Community
exports.createCommunity = async (req, res, next) => {
  const { name } = req.body;
  try {
    const comid = Snowflake.generate();

    const slug = await getSlugName(name);

    let roleId = await getRoleId("Community Admin");

    if (roleId === 0) {
      const rId = Snowflake.generate();
      const role = await Role.create({
        _id: rId,
        name: "Community Admin",
        scopes: ["admin", "moderator", "member"],
      });
      roleId = role.id;
    }

    const userId = req.user.id;

    const community = await Community.create({
      _id: comid,
      name,
      slug,
      owner: userId,
    });

    const memId = Snowflake.generate();

    await Member.create({
      _id: memId,
      community: community.id,
      user: userId,
      role: roleId,
    });

    return res.status(200).json({
      status: true,
      content: {
        data: {
          _id: community._id,
          name: community.name,
          slug: community.slug,
          owner: community.owner,
          created_at: community.created_at,
          updated_at: community.updated_at,
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

//Get all Communities
exports.getAllCommunity = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const totalCommunities = await Community.countDocuments();
    const pages = Math.ceil(totalCommunities / limit);

    const communities = await Community.find()
      .populate({
        path: "owner",
        model: "User",
        select: "name",
      })
      .skip(skip)
      .limit(limit)
      .exec();

    return res.status(200).json({
      status: true,
      content: {
        meta: {
          total: totalCommunities,
          pages: pages,
          page,
        },
        data: communities,
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      error: String(error),
    });
  }
};

exports.getAllMembersInCommunity = async (req, res, next) => {
  const comId = req.params.id;
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const members = await Member.find({ community: comId })
      .populate({
        path: "user",
        model: "User",
        select: "name",
      })
      .populate({
        path: "role",
        model: "Role",
        select: "name",
      })
      .skip(skip)
      .limit(limit)
      .exec();

    const totalMembers = members.length;
    const pages = Math.ceil(totalMembers / limit);

    return res.status(200).json({
      status: true,
      content: {
        meta: {
          total: totalMembers,
          pages: pages,
          page,
        },
        data: members,
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      error: String(error),
    });
  }
};

exports.getOwnCommunities = async (req, res, next) => {
  const userId = req.user._id;
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const communities = await Community.find({ owner: userId })
      .skip(skip)
      .limit(limit)
      .exec();

    const totalCommunities = communities.length;
    const pages = Math.ceil(totalCommunities / limit);
    return res.status(200).json({
      status: true,
      content: {
        meta: {
          total: totalCommunities,
          pages: pages,
          page,
        },
        data: communities,
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      error: String(error),
    });
  }
};

//Community where user is  member
exports.getMemberCommunity = async (req, res, next) => {
  const userId = req.user._id;
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const roleId = await getRoleId("Community Admin");

    const memberedCommunities = await Member.find({
      $and: [{ user: userId }, { role: { $ne: roleId } }],
    })
      .skip(skip)
      .limit(limit)
      .exec();
    let communities = [];
    if (memberedCommunities.length !== 0) {
      const communityIds = memberedCommunities.map(
        (member) => member.community
      );
      communities = await Community.find({ _id: { $in: communityIds } })
        .populate({
          path: "owner",
          model: "User",
          select: "name",
        })
        .exec();
    }
    const totalCommunities = communities.length;
    const pages = Math.ceil(totalCommunities / limit);
    return res.status(200).json({
      status: true,
      content: {
        meta: {
          total: totalCommunities,
          pages: pages,
          page,
        },
        data: communities,
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      error: String(error),
    });
  }
};
