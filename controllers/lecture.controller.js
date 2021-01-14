const Lecture = require('./../model/lecture.model');
const Course = require('./../model/course.model');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory')
const cloudinary = require('cloudinary');

exports.getAllLectures = factory.getAll(Lecture);

exports.getLecture = factory.getOne(Lecture);

exports.createLecture = async (req, res, next) => {
    try {
        const courseSlug = req.params.slug;
        const course = await Course.findOne({ slug: courseSlug });
       
        let reference = "";
        if (req.file) {
        
            
                let video = await cloudinary.v2.uploader.upload(req.file.path, {
                    resource_type: "video",
                    chunk_size: 6000000
                });
                reference = video.url || "";
               
            

        }

        if (course) {
            const courseContent = req.body.content;

            const isPreviwed = req.body.isPreviwed === "true" ? true : false;
            const lecture = await Lecture.create({ name: req.body.name, description: req.body.description, reference: reference, isPreviwed: isPreviwed });
            if (courseContent) {
                if (course.contents.length == 0) {
                    let temp = { name: courseContent, lectures: [lecture] };
                    course.contents.push(temp);
                }
                else {
                    let isContentExisted = false;
                    for (let i = 0; i < course.contents.length; i++) {
                        if (course.contents[i].name === courseContent) {
                            isContentExisted = true;
                            course.contents[i].lectures.push(lecture);
                            break;
                        }
                    }
                    // Chưa có course content
                    if (isContentExisted == false) {
                        let temp = { name: courseContent, lectures: [lecture] };
                        course.contents.push(temp);
                    }
                }
                course.lastUpdated = Date.now();
                await course.save();
            }
        }
        res.send(`
        <script>
            alert("Successfully")
            window.location.replace("/instructor");
        </script>

    `)
    } catch (error) {

        res.send(`
            <script>
                alert("${error.message}")
                window.location.replace("/course/${req.params.slug}/edit");
            </script>

        `)
        console.log(error);
    }
}

exports.editLecture = async (req, res) => {

    try {
        const course = await Course.findOne({ slug: req.params.slug });


        const changedContent = req.body.content;
        const isPreviewed = req.body.isPreviewed === "true" ? true : false;

        let reference = null;
        if (req.file) {
            let video = await cloudinary.v2.uploader.upload(req.file.path, {
                resource_type: "video",
                chunk_size: 6000000
            });
            reference = video.url || "";
        }
        let lecture = await Lecture.findById(req.params.lecture);

        // Đổi course content của lecture
        if (changedContent !== req.params.content) {
            let isRemoved = false;
            let isAdded = false;
            for (let i = 0; i < course.contents.length; i++) {
                // Xóa lecture ở course content cũ
                if (course.contents[i].name === req.params.content && !isRemoved) {
                    for (let j = 0; j < course.contents[i].lectures.length; j++) {
                        if (course.contents[i].lectures[j].equals(req.params.lecture)) {
                            console.log('ok');
                            course.contents[i].lectures.splice(j, 1);
                            isRemoved = true;
                            break;
                        }
                    }
                }
                // Thêm lecture ở course content mới
                else if (course.contents[i].name === changedContent && !isAdded) {
                    course.contents[i].lectures.push(lecture);
                    isAdded = true;
                }
                if (isAdded && isRemoved)
                    break;
            }
            // Nếu chưa có course content 
            if (!isAdded) {
                let temp = { name: changedContent, lectures: [lecture] };
                course.contents.push(temp);
            }

            course.lastUpdated = Date.now();
            await course.save();
        }
        if (reference)
            await lecture.update({ reference: reference, isPreviewed: isPreviewed, name: req.body.name, description: req.description })
        else {
            await lecture.update({ isPreviewed: isPreviewed, name: req.body.name, description: req.description })
        }
        res.redirect(`/course/${req.params.slug}`)



    } catch (error) {
        res.send(`
            <script>
                alert("${error.message}");
                window.history.back();
            </script>
        `)
    }
}