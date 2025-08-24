import { Course } from "../models/course.model.js";
import { v2 as cloudinary } from "cloudinary";
import { Purchase } from "../models/purchase.model.js";

const uploadToCloudinary = async (file, resourceType = 'image') => {
  try {
    const options = {
      resource_type: resourceType,
      folder: resourceType === 'video' ? 'course_videos' : 'course_files',
      chunk_size: resourceType === 'video' ? 6000000 : undefined, // 6MB chunks for videos
      timeout: resourceType === 'video' ? 120000 : undefined, // 2 minutes timeout for videos
    };

    const cloud_response = await cloudinary.uploader.upload(file.tempFilePath, options);
    return cloud_response;
  } catch (error) {
    console.error(`Error uploading ${resourceType}:`, error);
    throw new Error(`Failed to upload ${resourceType}: ${error.message}`);
  }
};

export const createCourse = async (req, res) => {
  const adminId = req.adminId;
  const { title, description, price } = req.body;

  try {
    if (!title || !description || !price) {
      return res.status(400).json({ errors: "All fields are required" });
    }

    // Handle course image
    if (!req.files?.image) {
      return res.status(400).json({ errors: "Course image is required" });
    }

    const allowedImageFormats = ["image/png", "image/jpeg"];
    if (!allowedImageFormats.includes(req.files.image.mimetype)) {
      return res.status(400).json({ errors: "Invalid image format. Only PNG and JPG are allowed" });
    }

    const imageResponse = await uploadToCloudinary(req.files.image);

    // Handle course content (videos and PDFs)
    const content = [];
    if (req.files.content) {
      const contentFiles = Array.isArray(req.files.content) ? req.files.content : [req.files.content];
      const contentMetadataArray = Array.isArray(req.body.contentMetadata) ? req.body.contentMetadata : [req.body.contentMetadata];
      
      for (let i = 0; i < contentFiles.length; i++) {
        const file = contentFiles[i];
        const metadata = contentMetadataArray[i] ? JSON.parse(contentMetadataArray[i]) : null;
        
        try {
          // Validate file size (max 500MB for videos)
          if (file.mimetype.startsWith('video/') && file.size > 500 * 1024 * 1024) {
            throw new Error("Video file size exceeds 500MB limit");
          }

          // Validate file formats
          const allowedVideoFormats = ["video/mp4", "video/quicktime", "video/x-msvideo"];
          const allowedPdfFormats = ["application/pdf"];
          
          if (file.mimetype.startsWith('video/') && !allowedVideoFormats.includes(file.mimetype)) {
            throw new Error("Invalid video format. Only MP4, MOV, and AVI are allowed");
          }
          
          if (file.mimetype === 'application/pdf' && !allowedPdfFormats.includes(file.mimetype)) {
            throw new Error("Invalid PDF format");
          }

          const resourceType = file.mimetype.startsWith('video/') ? 'video' : 'raw';
          const fileResponse = await uploadToCloudinary(file, resourceType);
          
          content.push({
            type: resourceType === 'video' ? 'video' : 'pdf',
            title: metadata?.title || `Lecture ${i + 1}`,
            description: metadata?.description || '',
            file: {
              public_id: fileResponse.public_id,
              url: fileResponse.url,
              size: fileResponse.bytes,
              format: fileResponse.format
            }
          });
        } catch (error) {
          console.error(`Error processing file ${file.name}:`, error);
          return res.status(400).json({ errors: `Error processing ${file.name}: ${error.message}` });
        }
      }
    }

    const courseData = {
      title,
      description,
      price,
      image: {
        public_id: imageResponse.public_id,
        url: imageResponse.url,
      },
      content,
      creatorId: adminId,
    };

    const course = await Course.create(courseData);
    res.json({
      message: "Course created successfully",
      course,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error creating course" });
  }
};

export const updateCourse = async (req, res) => {
  const adminId = req.adminId;
  const { courseId } = req.params;
  const { title, description, price } = req.body;

  try {
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ errors: "Course not found" });
    }

    if (course.creatorId.toString() !== adminId.toString()) {
      return res.status(403).json({ errors: "You don't have permission to update this course" });
    }

    const updateData = { title, description, price };

    // Handle image update if provided
    if (req.files?.image) {
      const allowedImageFormats = ["image/png", "image/jpeg"];
      if (!allowedImageFormats.includes(req.files.image.mimetype)) {
        return res.status(400).json({ errors: "Invalid image format. Only PNG and JPG are allowed" });
      }

      const imageResponse = await uploadToCloudinary(req.files.image);
      updateData.image = {
        public_id: imageResponse.public_id,
        url: imageResponse.url,
      };
    }

    // Handle content updates if provided
    if (req.files?.content) {
      const contentFiles = Array.isArray(req.files.content) ? req.files.content : [req.files.content];
      const newContent = [];

      for (const file of contentFiles) {
        const resourceType = file.mimetype.startsWith('video/') ? 'video' : 'raw';
        const fileResponse = await uploadToCloudinary(file, resourceType);
        
        newContent.push({
          type: resourceType === 'video' ? 'video' : 'pdf',
          title: file.name,
          file: {
            public_id: fileResponse.public_id,
            url: fileResponse.url,
            size: fileResponse.bytes,
            format: fileResponse.format
          }
        });
      }

      updateData.content = [...course.content, ...newContent];
    }

    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      updateData,
      { new: true }
    );

    res.status(200).json({
      message: "Course updated successfully",
      course: updatedCourse,
    });
  } catch (error) {
    console.error("Error in course updating:", error);
    res.status(500).json({ errors: "Error updating course" });
  }
};

export const deleteCourse = async (req, res) => {
  const adminId = req.adminId;
  const { courseId } = req.params;
  try {
    const course = await Course.findOneAndDelete({
      _id: courseId,
      creatorId: adminId,
    });
    if (!course) {
      return res
        .status(404)
        .json({ errors: "can't delete, created by other admin" });
    }
    res.status(200).json({ message: "Course deleted successfully" });
  } catch (error) {
    res.status(500).json({ errors: "Error in course deleting" });
    console.log("Error in course deleting", error);
  }
};

export const getCourses = async (req, res) => {
  try {
    const courses = await Course.find()
      .populate({
        path: 'creatorId',
        select: 'name username',
        model: 'User'
      });
    res.status(200).json({ courses });
  } catch (error) {
    console.log("Error in getCourses ", error);
    res.status(500).json({ errors: "Error in fetching courses" });
  }
};

export const courseDetails = async (req, res) => {
  const { courseId } = req.params;
  try {
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }
    res.status(200).json({ course });
  } catch (error) {
    res.status(500).json({ errors: "Error in getting course details" });
    console.log("Error in course details", error);
  }
};

import Stripe from "stripe";
import config from "../config.js";
const stripe = new Stripe(config.STRIPE_SECRET_KEY);
console.log(config.STRIPE_SECRET_KEY);
export const buyCourses = async (req, res) => {
  const { userId } = req;
  const { courseId } = req.params;

  try {
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ errors: "Course not found" });
    }
    const existingPurchase = await Purchase.findOne({ userId, courseId });
    if (existingPurchase) {
      return res
        .status(400)
        .json({ errors: "User has already purchased this course" });
    }

    // stripe payment code goes here!!
    const amount = course.price;
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: "usd",
      payment_method_types: ["card"],
    });

    res.status(201).json({
      message: "Course purchased successfully",
      course,
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    res.status(500).json({ errors: "Error in course buying" });
    console.log("error in course buying ", error);
  }
};
