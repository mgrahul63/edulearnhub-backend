import mongoose from "mongoose";

const courseDetailsSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
      unique: true,
    },

    fullDescription: [
      {
        type: {
          type: String,
          enum: ["paragraph", "list"],
          required: true,
        },
        text: String, // for paragraph
        items: [String], // for list
      },
    ],

    requirements: {
      type: [String],
      default: [],
    },

    whatYouWillLearn: {
      type: [String],
      default: [],
    },
    targetAudience: {
      type: [String],
      default: [],
    },
    totalDuration: {
      type: Number, // minutes
    },
    totalLessons: Number,
    language: {
      type: String,
      required: true,
      trim: true,
    },
    level: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
    },
    promoVideoUrl: {
      type: String,
      trim: true,
    },
    certificate: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const CourseDetailsModel =
  mongoose.models.CourseDetail ||
  mongoose.model("CourseDetail", courseDetailsSchema);

export default CourseDetailsModel;

// {
//   courseId: ObjectId("64f123abc123abc123abc123"), // replace with real Course _id

//   fullDescription: [
//     {
//       type: "paragraph",
//       text: "This complete Web Development course is designed to guide learners from the very basics to building real-world, production-ready web applications."
//     },
//     {
//       type: "paragraph",
//       text: "You will start by understanding how the web works, including browsers, servers, and HTTP. Gradually, you will move into frontend development, backend development, and finally full-stack application design."
//     },
//     {
//       type: "list",
//       items: [
//         "Learn how websites and web applications work",
//         "Build responsive layouts using HTML and CSS",
//         "Write clean and modern JavaScript",
//         "Understand frontend frameworks and component-based UI",
//         "Create REST APIs and backend services",
//         "Work with databases and authentication systems"
//       ]
//     },
//     {
//       type: "paragraph",
//       text: "This course emphasizes hands-on learning. Each section includes practical exercises and projects that reinforce the concepts and prepare you for real development work."
//     },
//     {
//       type: "list",
//       items: [
//         "Portfolio website using HTML, CSS, and JavaScript",
//         "Backend API using Node.js and Express",
//         "Full-stack application with authentication",
//         "Final capstone project"
//       ]
//     },
//     {
//       type: "paragraph",
//       text: "By the end of the course, you will have the confidence and skills to apply for junior web developer roles or build your own web projects."
//     }
//   ],

//   requirements: [
//     "Basic computer knowledge",
//     "Access to a computer with internet connection",
//     "Willingness to learn and practice"
//   ],

//   whatYouWillLearn: [
//     "Structure web pages using semantic HTML",
//     "Style applications with modern CSS techniques",
//     "Use JavaScript for dynamic user interfaces",
//     "Build RESTful APIs with Node.js",
//     "Store and manage data using databases",
//     "Deploy web applications to production"
//   ],

//   targetAudience: [
//     "Students who want to learn web development",
//     "Beginners with no prior programming experience",
//     "Career switchers entering the tech industry",
//     "Developers who want to strengthen full-stack skills"
//   ],

//   totalDuration: 1800, // minutes (30 hours)

//   totalLessons: 120,

//   language: "English",

//   level: "beginner",

//   promoVideoUrl: "https://www.youtube.com/watch?v=example_promo_video",

//   certificate: true
// }

// {courseId: "696398aab97b325716437c21",…}
// certificate
// : 
// true
// courseId
// : 
// "696398aab97b325716437c21"
// fullDescription
// : 
// [{type: "paragraph",…}, {type: "paragraph",…}, {type: "paragraph",…}, {type: "list",…},…]
// 0
// : 
// {type: "paragraph",…}
// text
// : 
// "This complete Web Development course is designed to guide learners from the very basics to building real-world, production-ready web applications."
// type
// : 
// "paragraph"
// 1
// : 
// {type: "paragraph",…}
// 2
// : 
// {type: "paragraph",…}
// 3
// : 
// {type: "list",…}
// 4
// : 
// {type: "paragraph",…}
// 5
// : 
// {type: "list",…}
// 6
// : 
// {type: "paragraph",…}
// language
// : 
// "Bangla"
// level
// : 
// "beginner"
// promoVideoUrl
// : 
// "https://www.youtube.com/watch?v=example_promo_video"
// requirements
// : 
// ["Basic computer knowledge", "Access to a computer with internet connection",…]
// targetAudience
// : 
// ["Students who want to learn web development", "Beginners with no prior programming experience",…]
// totalDuration
// : 
// "2000"
// totalLessons
// : 
// "120"
// whatYouWillLearn
// : 
// ["Structure web pages using semantic HTML", "Style applications with modern CSS techniques",…]
