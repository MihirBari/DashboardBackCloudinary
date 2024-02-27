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

cloudinaryUrl = 'cloudinary://239697659531164:iV6w3B6G1cbFzAh-lSWWsxSbZHI@dgcxd0kkk';
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

const showDealer = (req, res) => {
  const {
    paidStatus,
    paymentmode,
    clearanceStatus,
    costPriceMin,
    paidBy,
    costPriceMax,
    dateFilterType,
    selectedDate,
    startDate,
    endDate
  } = req.query;

  let query = `
      SELECT id, debitor_name, debitor_Date, paid_status, product_type, 
      debitor_Amount, debitor_paid_by, total_product, other_cost, remark, 
      company_paid, payment_mode, created_at, updated_at 
      FROM debitors`;

  let query1 = `
      SELECT 
      count(id) as id ,
      SUM(debitor_Amount) as total_amount, 
      COUNT(total_product) as total_product, 
      COUNT(paid_status) as total_paid_status, 
      count (product_type) as product_type,
      COUNT(company_paid) as company_paid, 
      COUNT(payment_mode) as total_payment_mode 
      FROM debitors`;

  let filterConditions = [];

  if (paidStatus && Array.isArray(paidStatus)) {
    const paidStatuseConditions = paidStatus.map(type => `paid_status LIKE '%${type}%'`);
    if (paidStatuseConditions.length > 0) {
      filterConditions.push(`(${paidStatuseConditions.join(" OR ")})`);
    }
  } else if (paidStatus) {
    filterConditions.push(`	paid_status LIKE '%${paidStatus}%'`);
  }

  if (paymentmode && Array.isArray(paymentmode)) {
    const paymentmodeConditions = paymentmode.map(type => `payment_mode LIKE '%${type}%'`);
    if (paymentmodeConditions.length > 0) {
      filterConditions.push(`(${paymentmodeConditions.join(" OR ")})`);
    }
  } else if (paymentmode) {
    filterConditions.push(`	payment_mode LIKE '%${paymentmode}%'`);
  }

  if (paidBy && Array.isArray(paidBy)) {
    const paidByConditions = paidBy.map(type => `debitor_paid_by LIKE '%${type}%'`);
    if (paidByConditions.length > 0) {
      filterConditions.push(`(${paidByConditions.join(" OR ")})`);
    }
  } else if (paidBy) {
    filterConditions.push(`	debitor_paid_by LIKE '%${paidBy}%'`);
  }

  if (clearanceStatus && Array.isArray(clearanceStatus)) {
    const clearanceStatusConditions = clearanceStatus.map(type => `company_paid LIKE '%${type}%'`);
    if (clearanceStatusConditions.length > 0) {
      filterConditions.push(`(${clearanceStatusConditions.join(" OR ")})`);
    }
  } else if (clearanceStatus) {
    filterConditions.push(`	company_paid LIKE '%${clearanceStatus}%'`);
  }

  if (costPriceMin) {
      filterConditions.push(`debitor_Amount >= ${costPriceMin}`);
  }

  if (costPriceMax) {
      filterConditions.push(`debitor_Amount <= ${costPriceMax}`);
  }

  if (dateFilterType && selectedDate) {
      if (dateFilterType === 'equal') {
          filterConditions.push(`debitor_Date = '${selectedDate}'`);
      } else if (dateFilterType === 'before') {
          filterConditions.push(`debitor_Date < '${selectedDate}'`);
      } else if (dateFilterType === 'after') {
          filterConditions.push(`debitor_Date > '${selectedDate}'`);
      }
  }

  if (dateFilterType === 'between' && startDate && endDate) {
      filterConditions.push(`debitor_Date BETWEEN '${startDate}' AND '${endDate}'`);
  }

  if (filterConditions.length > 0) {
    query += ` WHERE ${filterConditions.join(' AND ')}`;
    query1 += ` WHERE ${filterConditions.join(' AND ')}`;
  }

  // Start a transaction
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error getting connection from pool:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    connection.beginTransaction(err => {
      if (err) {
        console.error('Error starting transaction:', err);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }

      // Run both queries within the transaction
      connection.query(query, (error1, results1) => {
        if (error1) {
          return connection.rollback(() => {
            console.error('Error executing query 1:', error1);
            res.status(500).json({ error: 'Internal Server Error' });
            connection.release();
          });
        }

        connection.query(query1, (error2, results2) => {
          if (error2) {
            return connection.rollback(() => {
              console.error('Error executing query 2:', error2);
              res.status(500).json({ error: 'Internal Server Error' });
              connection.release();
            });
          }

          // Commit the transaction if both queries are successful
          connection.commit(err => {
            if (err) {
              return connection.rollback(() => {
                console.error('Error committing transaction:', err);
                res.status(500).json({ error: 'Internal Server Error' });
                connection.release();
              });
            }
              console.log(results2)
            // Send response with both query results
            res.status(200).json({ dealers: results1, total: results2 });

            // Release connection back to the pool
            connection.release();
          });
        });
      });
    });
  });
};

const showOneDealer = async(req, res) => {
  const dealerQuery = `
    SELECT id, debitor_name, debitor_Date, debitor_Amount, debitor_paid_by, 
           total_product, other_cost, created_at, updated_at,paid_status, product_type,remark,
           	company_paid,	payment_mode,reciept
    FROM debitors
    WHERE id = ?
  `;
  try {
    const results = await poolQuery(dealerQuery, [req.params.id]);

    if (results.length === 1) {
      const productDetails = results[0];

      // Handle null or undefined reciept value
      if (productDetails.reciept === null || productDetails.reciept === undefined) {
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

const addDealer = (req,res) => {
    const addDealer = `Insert into debitors
     (debitor_name, debitor_Date, debitor_Amount, debitor_paid_by,paid_status,remark, product_type, total_product,
       other_cost,	company_paid,	payment_mode,reciept,created_at)
     values (?,?,?,?,?,?,?,?,?,?,?,?, NOW())
     `
     let recieptValue = req.body.reciept || null;

    const value = [ 
        req.body.debitor_name,
        req.body.debitor_Date,
        req.body.debitor_Amount,
        req.body.debitor_paid_by,
        req.body.paid_status, 
        req.body.remark,
        req.body.product_type,
        req.body.total_product,
        req.body.other_cost,
        req.body.company_paid,
        req.body.payment_mode, 
        JSON.stringify(recieptValue),
      ]

    pool.query(addDealer, value ,(error, results) => {
      if (error) {
        console.error('Error executing query:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
  
      console.log('Expense added successfully:', results);
  
      // Log the uploaded image public IDs
      console.log('Uploaded Image Public IDs:', req.body.reciept);
  
      res.json(results);
    });
}

const editDealer = (req, res) => {
  const updateDealer = `
    UPDATE debitors
    SET
      debitor_name = ?,
      debitor_Date = ?,
      debitor_Amount = ?,
      debitor_paid_by = ?,
      paid_status = ?, 
      product_type = ?,
      total_product = ?,
      other_cost = ?,
      remark= ?,
      company_paid =?,	
      payment_mode =?,
      ${req.body.reciept ? "reciept = ?," : ""}
      updated_at = NOW()
    WHERE
      id = ?;`;

  const values = [
    req.body.debitor_name,
    req.body.debitor_Date,
    req.body.debitor_Amount,
    req.body.debitor_paid_by,
    req.body.paid_status, 
    req.body.product_type,
    req.body.total_product,
    req.body.other_cost,
    req.body.remark,
    req.body.company_paid,
    req.body.payment_mode,
    ...( req.body.reciept
      ? [JSON.stringify(req.body.reciept)]
      : []),
    req.params.id 
  ];

  pool.query(updateDealer, values, (error, results) => {
    if (error) {
      console.error('Error executing query:', error);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    console.log('Updated dealer:', results);
    res.json(results);
  });
};

const deleteSeller = (req, res) => {
  const query = 'DELETE FROM debitors WHERE id = ?';
  const debitorName = req.body.id;

  pool.query(query, [debitorName], (error, results) => {
    if (error) {
      console.error('Error executing query:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Not Found: No matching debitor_name found for deletion' });
    }

    console.log('Deleted', results);
    res.json({ message: 'Debitor deleted successfully' });
  });
};

const recieptImage = async (req, res) => {
  
  const id = req.body.id
   console.log(id)
    const query = "SELECT	reciept FROM 	debitors WHERE id = ?";
  
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
  
  const paidBy =  async (req,res) => {
    try {
      // Use the promisified pool.query function
      const result = await poolQuery(
        "SELECT DISTINCT 	debitor_paid_by FROM debitors"
      );
  
      // Check if the result is an array and has at least one row
      if (Array.isArray(result) && result.length > 0) {
        const paidBy = result.map((row) => row.	debitor_paid_by);
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
  }

module.exports = {showDealer,addDealer,deleteSeller,editDealer,showOneDealer,addImage,recieptImage,paidBy};