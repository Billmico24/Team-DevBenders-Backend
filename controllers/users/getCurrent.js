const { User } = require("../../models");

const getCurrent = async (req, res) => {
    const { name, email, infouser } = req.user;

    res.json({
        status: "success",
        code: 200,
        data: {
            user: {
                name,
                email,
                infouser
            }
        }
    })
};

module.exports = getCurrent; 
