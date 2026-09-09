const Contact = require("../models/Contact");


// Submit Contact Form
const submitContact = async (req, res) => {

    try {

        const {
            name,
            email,
            subject,
            message
        } = req.body;


        // Validation
        if (!name || !email || !subject || !message) {

            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });

        }


        // Create contact
        const contact = await Contact.create({
            name,
            email,
            subject,
            message
        });


        res.status(201).json({
            success: true,
            message: "Message submitted successfully",
            data: contact
        });


    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });

    }
};


module.exports = {
    submitContact
};