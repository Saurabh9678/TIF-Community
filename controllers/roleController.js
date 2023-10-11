const { Snowflake } = require("@theinternetfolks/snowflake");
const Role = require("../models/roleModel");
const { getScopes } = require("../utils/helper");

// Create Role
exports.createRole = async (req, res, next) => {
  const { name } = req.body;
  try {
    const id = Snowflake.generate();
    const tempName = name.toLowerCase();
    const scopes = getScopes(tempName);
    const role = await Role.create({
      id,
      name,
      scopes,
    });

    return res.status(200).json({
      status: true,
      content: {
        data: {
          id: role.id,
          name: role.name,
          created_at: role.created_at,
          updated_at: role.updated_at,
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

//Get all role
exports.getAllRoles = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const totalRoles = await Role.countDocuments();
    const pages = Math.ceil(totalRoles / limit);

    const role = await Role.find()
      .skip(skip)
      .limit(limit)
      .select("id name created_at updated_at -_id")
      .exec();

    return res.status(200).json({
      status: true,
      content: {
        meta: {
          total: totalRoles,
          pages: pages,
          page,
        },
        data: role,
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      error: String(error),
    });
  }
};
