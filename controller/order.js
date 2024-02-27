const { pool } = require("../database");

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

const order = async (req, res) => {
  const {
    creditor_name,
    product_id,
    size,
    returned,
    amount_sold,
    amount_condition,
    paid_by,
    bank_payment,
    city,
  } = req.body;

  console.log("Order received on the server:", req.body);

  pool.getConnection((err, connection) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "Error getting database connection" });
    }

    connection.beginTransaction(async (beginErr) => {
      if (beginErr) {
        connection.release();
        return res.status(500).json({ error: "Error starting transaction" });
      }

      try {
        const sizeColumn = size ? size.toLowerCase() : null;
        const sizeQuantity = 1;
        console.log("Order received:", req.body);
        await connection.query(
          `
          INSERT INTO order_items (
            creditor_name, product_id, ${sizeColumn},Total_items, returned, amount_sold, amount_condition,bank_payment, city, paid_by,created_at
          ) VALUES (?, ?, ?, ?,?, ?,?,?,?, ?,Now());
          `,
          [
            creditor_name,
            product_id,
            sizeQuantity,
            sizeColumn,
            returned,
            amount_sold,
            amount_condition,
            bank_payment,
            city,
            paid_by,
          ],
          (insertErr) => {
            if (insertErr) {
              console.error("Error inserting order_items:", insertErr);
              return connection.rollback(() => {
                connection.release();
                res.status(500).json({ error: "Error inserting order_items" });
              });
            }

            const sizeColumn = size ? size.toLowerCase() : null;

            connection.query(
              `
                 UPDATE products
                    SET ${sizeColumn} = ${sizeColumn} - 1,
                    stock = stock - 1
                    WHERE product_id = ?;
               `,
              [product_id],
              (updateErr) => {
                if (updateErr) {
                  return connection.rollback(() => {
                    connection.release();
                    return res
                      .status(500)
                      .json({ error: "Error updating product quantities" });
                  });
                }

                connection.commit((commitErr) => {
                  if (commitErr) {
                    return connection.rollback(() => {
                      connection.release();
                      return res
                        .status(500)
                        .json({ error: "Error committing transaction" });
                    });
                  }

                  connection.release();
                  res.status(200).json({
                    success: true,
                    message: "Order placed successfully",
                  });
                });
              }
            );
          }
        );
      } catch (error) {
        console.error("Error processing order:", error);
        connection.rollback(() => {
          connection.release();
          res.status(500).json({ error: "Error processing order" });
        });
      }
    });
  });
};

const updateOrder1 = async (req, res) => {
  try {
    const {
      creditor_name,
      size,
      returned,
      amount_sold,
      amount_condition,
      bank_payment,
      city,
      paid_by,
      product_id,
    } = req.body;

    const { order_id } = req.params;
    console.log(req.params);

    pool.getConnection((err, connection) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "Error getting database connection" });
      }

      connection.beginTransaction(async (beginErr) => {
        if (beginErr) {
          connection.release();
          return res.status(500).json({ error: "Error starting transaction" });
        }

        try {
          const sizeColumn = size ? size.toLowerCase() : null;
          const sizeQuantity = 1;

          console.log("Executing UPDATE query with the following values:");
          console.log("creditor_name:", creditor_name);
          console.log("sizeColumn:", sizeColumn);
          console.log("returned:", returned);
          console.log("amount_sold:", amount_sold);
          console.log("amount_condition:", amount_condition);
          console.log("paid_by:", paid_by);
          console.log("Order_id:", order_id);

          await connection.query(
            `
    UPDATE order_items 
    SET creditor_name = ?, ${sizeColumn} = ?,
    returned = ?, amount_sold = ?, amount_condition = ?, bank_payment = ?, city = ?, paid_by = ?, update_at = NOW()
    WHERE order_id = ?;
    `,
            [
              creditor_name,
              sizeQuantity,
              returned,
              amount_sold,
              amount_condition,
              bank_payment,
              city,
              paid_by,
              order_id,
            ],
            async (insertErr) => {
              if (insertErr) {
                console.error("Error updating order_items:", insertErr);
                connection.rollback();
                connection.release();
                return res
                  .status(500)
                  .json({ error: "Error updating order_items" });
              }

              if (returned === "Yes") {
                try {
                  await connection.query(
                    `
                    UPDATE products
                    SET ${sizeColumn} = ${sizeColumn} + 1, stock = stock + 1
                    WHERE product_id = ?;
                    `,
                    [product_id]
                  );

                  connection.commit((commitErr) => {
                    if (commitErr) {
                      console.error("Error committing transaction:", commitErr);
                      connection.rollback();
                      connection.release();
                      return res
                        .status(500)
                        .json({ error: "Error committing transaction" });
                    }
                    connection.release();
                    return res.status(200).json({
                      success: true,
                      message: "Order placed successfully",
                    });
                  });
                } catch (updateErr) {
                  console.error(
                    "Error updating product quantities:",
                    updateErr
                  );
                  connection.rollback();
                  connection.release();
                  return res
                    .status(500)
                    .json({ error: "Error updating product quantities" });
                }
              } else if (returned === "No") {
                try {
                  await connection.query(
                    `
                    UPDATE products
                    SET ${sizeColumn} = ${sizeColumn} - 1, stock = stock - 1
                    WHERE product_id = ?;
                    `,
                    [product_id]
                  );

                  connection.commit((commitErr) => {
                    if (commitErr) {
                      console.error("Error committing transaction:", commitErr);
                      connection.rollback();
                      connection.release();
                      return res
                        .status(500)
                        .json({ error: "Error committing transaction" });
                    }
                    connection.release();
                    return res.status(200).json({
                      success: true,
                      message: "Order placed successfully",
                    });
                  });
                } catch (updateErr) {
                  console.error(
                    "Error updating product quantities:",
                    updateErr
                  );
                  connection.rollback();
                  connection.release();
                  return res
                    .status(500)
                    .json({ error: "Error updating product quantities" });
                }
              } else {
                connection.commit((commitErr) => {
                  if (commitErr) {
                    console.error("Error committing transaction:", commitErr);
                    connection.rollback();
                    connection.release();
                    return res
                      .status(500)
                      .json({ error: "Error committing transaction" });
                  }

                  connection.release();
                  return res.status(200).json({
                    success: true,
                    message: "Order placed successfully",
                  });
                });
              }
            }
          );
        } catch (error) {
          console.error("Error processing order:", error);
          connection.rollback();
          connection.release();
          return res.status(500).json({ error: "Error processing order" });
        }
      });
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return res.status(500).json({ error: "Unexpected error" });
  }
};

const updateOrder = async (req, res) => {
  const { creditor_name, size, returned, amount_sold, amount_condition } =
    req.body;

  const { product_id } = req.params;

  pool.getConnection((err, connection) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "Error getting database connection" });
    }

    connection.beginTransaction(async (beginErr) => {
      if (beginErr) {
        connection.release();
        return res.status(500).json({ error: "Error starting transaction" });
      }

      try {
        const sizeColumn = size ? size.toLowerCase() : null;
        const sizeQuantity = 1;

        await connection.query(
          `
          UPDATE order_items 
          SET creditor_name = ?, ${sizeColumn} = ?,
          returned = ?, amount_sold = ?, amount_condition = ?, update_at = NOW()
          WHERE product_id = ?;
          `,
          [
            creditor_name,
            sizeQuantity,
            returned,
            amount_sold,
            amount_condition,
            product_id,
          ],
          async (insertErr) => {
            if (insertErr) {
              connection.rollback(() => {
                connection.release();
                return res
                  .status(500)
                  .json({ error: "Error updating order_items" });
              });
            }

            if (returned === "Yes") {
              connection.query(
                `
                UPDATE products
                SET ${sizeColumn} = ${sizeColumn} + 1, stock = stock + 1
                WHERE product_id = ?;
                `,
                [product_id],
                (updateErr) => {
                  if (updateErr) {
                    connection.rollback(() => {
                      connection.release();
                      return res
                        .status(500)
                        .json({ error: "Error updating product quantities" });
                    });
                  }
                  connection.commit((commitErr) => {
                    if (commitErr) {
                      connection.rollback(() => {
                        connection.release();
                        return res
                          .status(500)
                          .json({ error: "Error committing transaction" });
                      });
                    }
                    connection.release();
                    return res.status(200).json({
                      success: true,
                      message: "Order placed successfully",
                    });
                  });
                }
              );
            } else {
              connection.commit((commitErr) => {
                if (commitErr) {
                  connection.rollback(() => {
                    connection.release();
                    return res
                      .status(500)
                      .json({ error: "Error committing transaction" });
                  });
                }

                connection.release();
                return res.status(200).json({
                  success: true,
                  message: "Order placed successfully",
                });
              });
            }
          }
        );
      } catch (error) {
        connection.rollback(() => {
          connection.release();
          return res.status(500).json({ error: "Error processing order" });
        });
      }
    });
  });
};

const filterNullValues = (obj) => {
  const filteredObj = {};
  for (const key in obj) {
    if (obj[key] !== null) {
      filteredObj[key] = obj[key];
    }
  }
  return filteredObj;
};

const viewOrder = async (req, res) => {
  const {
    productName,
    orderId,
    soldBy,
    amountCredited,
    returned,
    city,
    size,
    costPriceMin,
    costPriceMax,
    dateFilterType,
    selectedDate,
    startDate,
    endDate,
  } = req.query;

  console.log(soldBy);

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting connection from pool:", err);
      return res
        .status(500)
        .json({ error: "Error getting connection from pool" });
    }

    connection.beginTransaction((err) => {
      if (err) {
        console.error("Error beginning transaction:", err);
        connection.release();
        return res.status(500).json({ error: "Error beginning transaction" });
      }

      let query = `
      SELECT
      oi.order_id,
      oi.creditor_name,
      oi.product_id,
      p.product_name,
      oi.Total_items,
      oi.s,
      oi.m,
      oi.l,
      oi.xl,
      oi.xxl,
      oi.xxxl,
      oi.xxxxl,
      oi.xxxxxl,
      oi.returned,
      oi.amount_sold,
      oi.amount_condition,
      oi.paid_by,
      oi.created_at,
      oi.update_at,
      oi.bank_payment, 
      oi.city,
      p.Final_cost
    FROM
      order_items oi
    JOIN
      products p ON p.product_id = oi.product_id
      `;

      let query1 = `
      SELECT 
  COUNT(oi.order_id) AS order_count,
  COUNT(oi.Total_items) AS total_items,
  SUM(oi.amount_sold) AS total_amount_sold,
  COUNT(oi.amount_condition) AS amount_condition_count,
  COUNT(oi.paid_by) AS paid_by_count,
  COUNT(oi.bank_payment) AS bank_payment_count,
  COUNT(oi.city) AS city_count,
  SUM(p.Final_cost - oi.amount_sold) AS total_profit
FROM
  order_items oi
JOIN
  products p ON p.product_id = oi.product_id
      `; // Your second query

      let inventoryQuery = [];

      // Add filters to the query based on the provided values
      if (productName) {
        inventoryQuery.push += `p.product_name = '${productName}' AND `;
      }

      if (orderId && Array.isArray(orderId)) {
        const orderIdConditions = soldBy.map(
          (type) => `oi.order_id LIKE '%${type}%'`
        );
        if (orderIdConditions.length > 0) {
          inventoryQuery.push(`(${orderIdConditions.join(" OR ")})`);
        }
      } else if (orderId) {
        inventoryQuery.push(`	oi.order_id LIKE '%${orderId}%'`);
      }

      if (soldBy && Array.isArray(soldBy)) {
        const soldByConditions = soldBy.map(
          (type) => `oi.paid_by LIKE '%${type}%'`
        );
        if (soldByConditions.length > 0) {
          inventoryQuery.push(`(${soldByConditions.join(" OR ")})`);
        }
      } else if (soldBy) {
        inventoryQuery.push(`	oi.paid_by LIKE '%${soldBy}%'`);
      }

      if (amountCredited) {
        inventoryQuery.push += `oi.amount_condition = '${amountCredited}' AND `;
      }

      if (returned) {
        inventoryQuery.push += `oi.returned = '${returned}' AND `;
      }

      if (city && Array.isArray(city)) {
        const cityConditions = city.map((type) => `oi.city LIKE '%${type}%'`);
        if (cityConditions.length > 0) {
          inventoryQuery.push(`(${cityConditions.join(" OR ")})`);
        }
      } else if (city) {
        inventoryQuery.push(`	oi.city LIKE '%${city}%'`);
      }

      if (size) {
        inventoryQuery.push += `oi.Total_items = '${size}' AND `;
      }

      if (size && Array.isArray(size)) {
        const sizeConditions = soldBy.map(
          (type) => `oi.Total_items LIKE '%${type}%'`
        );
        if (sizeConditions.length > 0) {
          inventoryQuery.push(`(${sizeConditions.join(" OR ")})`);
        }
      } else if (size) {
        inventoryQuery.push(`	oi.Total_items LIKE '%${size}%'`);
      }

      if (costPriceMin && costPriceMax) {
        inventoryQuery.push += `p.Final_cost BETWEEN ${costPriceMin} AND ${costPriceMax} AND `;
      }

      if (dateFilterType) {
        if (dateFilterType === "equal") {
          inventoryQuery.push += `DATE(oi.created_at) = '${selectedDate}' AND `;
        } else if (dateFilterType === "before") {
          inventoryQuery.push += `DATE(oi.created_at) < '${selectedDate}' AND `;
        } else if (dateFilterType === "after") {
          inventoryQuery.push += `DATE(oi.created_at) > '${selectedDate}' AND `;
        } else if (dateFilterType === "between" && startDate && endDate) {
          inventoryQuery.push += `DATE(oi.created_at) BETWEEN '${startDate}' AND '${endDate}' AND `;
        }
      }


      const whereClause = inventoryQuery.join(" AND ");

      if (whereClause) {
        query += ` WHERE ${whereClause}`;
        query1 += ` WHERE ${whereClause}`;
      }

      query += " ORDER BY created_at DESC";

      connection.query(query, (error, results) => {
        if (error) {
          console.error("Error executing first query:", error);
          return connection.rollback(() => {
            connection.release();
            res.status(500).json({ error: "Error executing first query" });
          });
        }

        // Execute second query
        connection.query(query1, (error, results1) => {
          if (error) {
            console.error("Error executing second query:", error);
            return connection.rollback(() => {
              connection.release();
              res.status(500).json({ error: "Error executing second query" });
            });
          }
          ``;
          connection.commit((err) => {
            if (err) {
              console.error("Error committing transaction:", err);
              return connection.rollback(() => {
                connection.release();
                res.status(500).json({ error: "Error committing transaction" });
              });
            }

            connection.release();
            console.log(results1);
            res.json({ products: results, total: results1 });
          });
        });
      });
    });
  });
};

const viewOneOrder = async (req, res) => {
  const inventoryQuery = `
    SELECT
      oi.creditor_name,
      p.product_name,
      oi.s,
      oi.m,
      oi.l,
      oi.xl,
      oi.xxl,
      oi.xxxl,
      oi.xxxxl,
      oi.xxxxxl,
      oi.returned,
      oi.amount_sold,
      oi.amount_condition,
      oi.Total_items,
      oi.paid_by,
      oi.product_id,
      oi.created_at,
      oi.update_at,
      oi.bank_payment, 
      oi.city,
      p.Final_cost
    FROM
      order_items oi
    JOIN
      products p ON p.product_id = oi.product_id
    WHERE
      oi.order_id = ?;
  `;

  pool.query(inventoryQuery, [req.params.order_id], (error, results) => {
    if (error) {
      console.error("Error executing query:", error);
      return res.status(500).json({ error: "Error executing query" });
    }

    const filteredResults = results.map((result) => filterNullValues(result));

    res.json(filteredResults);
  });
};

const OrderImage = async (req, res) => {
  const query = "SELECT product_image FROM products WHERE product_id = ?";

  pool.query(query, [req.body.product_id], (err, results) => {
    if (err) {
      console.error("Error executing the SQL query:", err);
      return res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    }

    const productData = results.map((result) => {
      if (result.product_image) {
        const parsedIds = JSON.parse(result.product_image);
        const publicId = parsedIds[0];
        const productId = req.body.product_id;
        return { publicId, productId };
      }
      return null;
    });

    res.json(productData.filter(Boolean));
  });
};

const deleteOrder = (req, res) => {
  const { order_id, product_id, size } = req.body;

  if (!product_id || size === undefined) {
    return res.status(400).json({ error: "Invalid request body" });
  }

  const deleteQuery = "DELETE FROM order_items WHERE order_id = ?";
  const deleteValues = [order_id];

  const updateQuery = `
    UPDATE products
    SET 
      ${size} = ${size} + 1,
      stock = stock + 1
    WHERE product_id = ?
  `;

  const updateValues = [product_id];

  pool.getConnection((error, connection) => {
    if (error) {
      console.error("Error getting database connection:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    connection.beginTransaction((beginErr) => {
      if (beginErr) {
        console.error("Error beginning transaction:", beginErr);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      connection.query(
        deleteQuery,
        deleteValues,
        (deleteError, deleteResults) => {
          if (deleteError) {
            return connection.rollback(() => {
              console.error("Error deleting order:", deleteError);
              res.status(500).json({ error: "Internal Server Error" });
            });
          }

          connection.query(
            updateQuery,
            updateValues,
            (updateError, updateResults) => {
              if (updateError) {
                return connection.rollback(() => {
                  console.error("Error updating products:", updateError);
                  res.status(500).json({ error: "Internal Server Error" });
                });
              }

              connection.commit((commitError) => {
                if (commitError) {
                  return connection.rollback(() => {
                    console.error("Error committing transaction:", commitError);
                    res.status(500).json({ error: "Internal Server Error" });
                  });
                }

                console.log("Order deleted and products updated successfully");
                res.json({
                  success: true,
                  message: "Order deleted and products updated successfully",
                  order_id: order_id,
                });

                connection.release();
              });
            }
          );
        }
      );
    });
  });
};

const creditorName = async (req, res) => {
  try {
    // Use the promisified pool.query function
    const result = await poolQuery(
      "SELECT DISTINCT creditor_name  FROM order_items"
    );

    // Check if the result is an array and has at least one row
    if (Array.isArray(result) && result.length > 0) {
      const creditorName = result.map((row) => row.creditor_name);
      res.json(creditorName);
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

const paidBy = async (req, res) => {
  try {
    // Use the promisified pool.query function
    const result = await poolQuery("SELECT DISTINCT paid_by  FROM order_items");

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

const city = async (req, res) => {
  try {
    // Use the promisified pool.query function
    const result = await poolQuery("SELECT DISTINCT city  FROM order_items");

    // Check if the result is an array and has at least one row
    if (Array.isArray(result) && result.length > 0) {
      const city = result.map((row) => row.city);
      res.json(city);
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

const orderID = async (req, res) => {
  try {
    // Use the promisified pool.query function
    const result = await poolQuery("SELECT  order_id  FROM order_items");

    // Check if the result is an array and has at least one row
    if (Array.isArray(result) && result.length > 0) {
      const orderID = result.map((row) => row.order_id);
      res.json(orderID);
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
  order,
  updateOrder,
  updateOrder1,
  viewOrder,
  deleteOrder,
  viewOneOrder,
  OrderImage,
  creditorName,
  paidBy,
  city,
  orderID,
};
