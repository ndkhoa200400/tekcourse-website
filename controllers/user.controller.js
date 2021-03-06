const AppError = require('../utils/appError');
const User = require('./../model/user.model');
const catchAsync = require("./../utils/catchAsync");
const factory = require('./handlerFactory')

exports.getAllUsers = factory.getAll(User);

exports.getUser = factory.getOne(User);

exports.createUser = (req, res) => {
    res.status(500).json({
        status: 'error'
    })
}
// Do not update password with this
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);

const filterObj = (obj, ...allowedFields) => {
    // Remove some inappropriate fields 
    const newObj = {};
    Object.keys(obj).forEach(el => {
        if (!allowedFields.includes(el))
            newObj[el] = obj[el];
    })

    return newObj;
}

exports.getMe = (req, res, next) => {
    req.params.id = req.user.id; // From protect middleware
    next(); // pass to getUser function
}

exports.updateMe = (async (req, res, next) => {
    try {
        // Update authenticated-current user
        // 1) Create error if user POSTs password data

        if (req.body.password || req.body.passwordConfirm)
            return next(new AppError('This route is not for password update'), 400)


        // 3) Update user document
        const user = await User.findByIdAndUpdate(req.user.id, req.body, { new: true, runValidators: true });

        await user.save();
        res.locals.user = user;
        if (user.role === "teacher")
            res.redirect("/profile/edit");
        else if (user.role === "customer")
            res.redirect("/student-profile/edit");

    } catch (error) {
        console.log(error);
    }
});

exports.deleteMe = catchAsync(async (req, res, next) => {
    await User.findByIdAndUpdate(req.user.id, { active: false });

    res.status(204).json({
        status: 'success',
        data: null
    });
});


exports.beSeller = catchAsync(async (req, res, next) => {

    const user = await User.findByIdAndUpdate(req.user.id, { role: 'seller' }, { new: true, runValidators: true });


    await user.save();
    res.status(200).json({
        status: 'success'
    })
})