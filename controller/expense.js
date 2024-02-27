const { pool } = require("../database");
const multer = require("multer");
const path = require("path");
const Jimp = require("jimp");
const { query } = require("express");
const cloudinary = require("cloudinary").v2;
const { promisify } = require("util");
const fs = require("fs");
const unlinkAsync = promisify(fs.unlink);

cloudinary.config({
  cloud_name: "dgcxd0kkk",
  api_key: "239697659531164",
  api_secret: "iV6w3B6G1cbFzAh-lSWWsxSbZHI",
});

cloudinaryUrl =
  "cloudinary://239697659531164:iV6w3B6G1cbFzAh-lSWWsxSbZHI@dgcxd0kkk";
cloudinary.config(cloudinaryUrl);

const poolQuery = (query, values) => {
  return new Promise((resolve, reject) => {
    pool.query(query, values, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
};

const upload = multer({
  storage: multer.diskStorage({
    destination: "./Images",
    filename: (req, file, cb) => {
      cb(
        null,
        file.fieldname + "-" + Date.now() + path.extname(file.originalname)
      );
    },
  }),
}).array("images", 10);

const uploadAsync = async (req, res) => {
  return new Promise(async (resolve, reject) => {
    upload(req, res, async (err) => {
      if (err) {
        console.error("Error uploading images:", err);
        reject(err);
      } else {
        try {
          const imageIds = [];
          for (const file of req.files) {
            const result = await cloudinary.uploader.upload(file.path);
            imageIds.push(result.public_id);

            // Remove the local file after uploading to Cloudinary
            await unlinkAsync(file.path);
          }
          resolve(imageIds);
        } catch (error) {
          console.error("Error processing images:", error);
          reject(error);
        }
      }
    });
  });
};

const addImage = async (req, res) => {
  try {
    const imagePaths = await uploadAsync(req, res);
    if (imagePaths.length > 0) {
      res.status(200).send({
        imagePaths,
        message: "Images paths stored successfully",
      });
    } else {
      res.status(400).send("No images uploaded");
    }
  } catch (error) {
    console.error("Error in image upload:", error);
    res.status(500).send("Internal Server Error");
  }
};

const addExpense = (req, res) => {
  const addDealer = `INSERT INTO expense
    (name, date, amount, paid_status, paid_by, remarks, clearance_status, payment_mode, reciept, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
  `;

  let recieptValue = req.body.reciept || null; // Set reciept to null if it's not provided

  const values = [
    req.body.name,
    req.body.date,
    req.body.amount,
    req.body.paid_status,
    req.body.paid_by,
    req.body.remarks,
    req.body.clearance_status,
    req.body.payment_mode,
    JSON.stringify(recieptValue),
  ];

  pool.query(addDealer, values, (error, results) => {
    if (error) {
      console.error("Error executing query:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    console.log("Expense added successfully:", results);

    // Log the uploaded image public IDs
    console.log("Uploaded Image Public IDs:", req.body.reciept);

    res.json(results);
  });
};

const showExpense = (req, res) => {
  const {
    paidStatus,
    paymentmode,
    clearanceStatus,
    costPriceMin,
    costPriceMax,
    dateFilterType,
    selectedDate,
    startDate,
    endDate,
    paidBy,
  } = req.query;

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting database connection:", err);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }

    // Begin transaction
    connection.beginTransaction((err) => {
      if (err) {
        console.error("Error beginning transaction:", err);
        res.status(500).json({ error: "Internal Server Error" });
        return connection.release();
      }

      let query = `SELECT 
          id, name, date, amount, paid_status, paid_by, remarks, created_at, clearance_status, payment_mode, updated_at
          FROM expense`;

      let query1 = `SELECT 
      count(id) as id ,
          SUM(amount) as total_amount, 
          COUNT(paid_status) as total_paid_status, 
          COUNT(clearance_status) as total_clearance_status, 
          COUNT(payment_mode) as total_payment_mode 
          FROM expense`;

      let filterConditions = [];

      if (paidStatus) {
        filterConditions.push(`paid_status = '${paidStatus}'`);
      }

      if (paymentmode && Array.isArray(paymentmode)) {
        const paymentmodeConditions = paymentmode.map(
          (type) => `payment_mode LIKE '%${type}%'`
        );
        if (paymentmodeConditions.length > 0) {
          filterConditions.push(`(${paymentmodeConditions.join(" OR ")})`);
        }
      } else if (paymentmode) {
        filterConditions.push(`payment_mode LIKE '%${paymentmode}%'`);
      }

      if (paidBy && Array.isArray(paidBy)) {
        const paidByConditions = paidBy.map(
          (type) => `paid_by LIKE '%${type}%'`
        );
        if (paidByConditions.length > 0) {
          filterConditions.push(`(${paidByConditions.join(" OR ")})`);
        }
      } else if (paidBy) {
        filterConditions.push(`	paid_by LIKE '%${paidBy}%'`);
      }

      if (clearanceStatus) {
        filterConditions.push(`clearance_status = '${clearanceStatus}'`);
      }

      if (costPriceMin) {
        filterConditions.push(`amount >= ${costPriceMin}`);
      }

      if (costPriceMax) {
        filterConditions.push(`amount <= ${costPriceMax}`);
      }

      if (dateFilterType && selectedDate) {
        if (dateFilterType === "equal") {
          filterConditions.push(`date = '${selectedDate}'`);
        } else if (dateFilterType === "before") {
          filterConditions.push(`date < '${selectedDate}'`);
        } else if (dateFilterType === "after") {
          filterConditions.push(`date > '${selectedDate}'`);
        }
      }

      if (dateFilterType === "between" && startDate && endDate) {
        filterConditions.push(`date BETWEEN '${startDate}' AND '${endDate}'`);
      }

      if (filterConditions.length > 0) {
        query += ` WHERE ${filterConditions.join(" AND ")}`;
        query1 += ` WHERE ${filterConditions.join(" AND ")}`;
      }

      connection.query(query, (error, results) => {
        if (error) {
          console.error("Error executing first query:", error);
          return connection.rollback(() => {
            res.status(500).json({ error: "Internal Server Error" });
            connection.release();
          });
        }

        connection.query(query1, (error, results1) => {
          if (error) {
            console.error("Error executing second query:", error);
            return connection.rollback(() => {
              res.status(500).json({ error: "Internal Server Error" });
              connection.release();
            });
          }

          // Commit transaction
          connection.commit((err) => {
            if (err) {
              console.error("Error committing transaction:", err);
              return connection.rollback(() => {
                res.status(500).json({ error: "Internal Server Error" });
                connection.release();
              });
            }

            // Release connection and send response
            connection.release();
            console.log(results1);
            res.status(200).json({ products: results, total: results1 });
          });
        });
      });
    });
  });
};

const showOneExpense = async (req, res) => {
  const dealerQuery = `
    SELECT id, name, date, amount, paid_status, paid_by, remarks, clearance_status, payment_mode, reciept
    FROM expense
    WHERE id = ?
  `;

  try {
    const results = await poolQuery(dealerQuery, [req.params.id]);

    if (results.length === 1) {
      const productDetails = results[0];

      // Handle null or undefined reciept value
      if (
        productDetails.reciept === null ||
        productDetails.reciept === undefined
      ) {
        res.status(200).json({
          ...productDetails,
          reciept: null,
        });
      } else {
        try {
          // Parse the reciept back to an array
          const recieptArray = JSON.parse(productDetails.reciept);

          // Construct Cloudinary URLs for images using the public IDs
          const cloudinaryUrls = recieptArray.map((publicId) => {
            return `https://res.cloudinary.com/dgcxd0kkk/image/upload/${publicId}`;
          });

          // Send product details with image URLs to the frontend
          res.status(200).json({
            ...productDetails,
            reciept: cloudinaryUrls,
          });
        } catch (jsonParseError) {
          console.error("Error parsing reciept:", jsonParseError.message);
          // Handle the case where parsing fails
          res.status(200).json({
            ...productDetails,
            reciept: ["path/to/default/image.jpg"],
          });
        }
      }
    } else {
      return res.status(404).json({ error: "Expense not found" });
    }
  } catch (error) {
    console.error("Error executing query:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const editExpense = (req, res) => {
  const updateDealer = `
    UPDATE expense
    SET
    name = ?,
    date = ?,
    amount = ?,
    paid_status = ?,
    paid_by = ?, 
    remarks = ?,
    clearance_status = ?,
    payment_mode	= ?,
    ${req.body.reciept ? "reciept = ?," : ""}
    updated_at = NOW()
    WHERE
      id = ?;`;

  const values = [
    req.body.name,
    req.body.date,
    req.body.amount,
    req.body.paid_status,
    req.body.paid_by,
    req.body.remarks,
    req.body.clearance_status,
    req.body.payment_mode,
    ...(req.body.reciept ? [JSON.stringify(req.body.reciept)] : []),
    req.params.id,
  ];

  pool.query(updateDealer, values, (error, results) => {
    if (error) {
      console.error("Error executing query:", error);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }

    console.log("Updated dealer:", results);
    res.json(results);
  });
};

const deleteExpense = (req, res) => {
  const query = "DELETE FROM expense WHERE id = ?";
  const debitorName = req.body.id;

  pool.query(query, [debitorName], (error, results) => {
    if (error) {
      console.error("Error executing query:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({
        error: "Not Found: No matching debitor_name found for deletion",
      });
    }

    console.log("Deleted", results);
    res.json({ message: "Debitor deleted successfully" });
  });
};

const recieptImage = async (req, res) => {
  const id = req.body.id;
  console.log(id);
  const query = "SELECT	reciept FROM 	expense WHERE id = ?";

  pool.query(query, [id], (err, results) => {
    if (err) {
      console.error("Error executing the SQL query:", err);
      return res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    }

    const productData = results.map((result) => {
      if (result.reciept) {
        const parsedIds = JSON.parse(result.reciept);
        const publicId = parsedIds[0];
        const productId = req.body.id;
        return { publicId, productId };
      }
      return null;
    });

    res.json(productData.filter(Boolean));
  });
};

const paidBy = async (req, res) => {
  try {
    // Use the promisified pool.query function
    const result = await poolQuery("SELECT DISTINCT paid_by FROM expense");

    // Check if the result is an array and has at least one row
    if (Array.isArray(result) && result.length > 0) {
      const paidBy = result.map((row) => row.paid_by);
      res.json(paidBy);
    } else {
      console.error("No rows found");
      res.status(404).json({ error: "No product types found" });
    }
  } catch (error) {
    console.error("Error fetching productType:", error.message);
    console.error("Stack trace:", error.stack);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  showExpense,
  showOneExpense,
  addExpense,
  editExpense,
  deleteExpense,
  addImage,
  recieptImage,
  paidBy,
};
