const { pool } = require("../database");

const showMarket = (req, res) => {
  const dealer = `SELECT 
    id,	place,	percent, created_at, update_at	    
    FROM marketplace`;

  pool.query(dealer, (error, results) => {
    if (error) {
      console.error("Error executing query:", error);
      return;
    }

    res.status(200).json(results);
  });
};

const showOneMarket = (req, res) => {
  const dealerQuery = `
    SELECT id,	place,	percent
    FROM marketplace
    WHERE id = ?
  `;
  pool.query(dealerQuery, [req.params.id], (error, results) => {
    if (error) {
      console.error("Error executing query:", error);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }
    console.log("Dealer details:", results);
    res.status(200).json(results);
  });
};

const addMarket = (req, res) => {
  const id = req.body.id;
  const place = req.body.place;
  const percent = req.body.percent;

  const addDealerQuery = `INSERT INTO marketplace (id, place, percent, created_at) VALUES (?, ?, ?, NOW())`;
  const addMarkethistoryQuery = `INSERT INTO markethistory (id, place, percent, created_at) VALUES (?, ?, ?, NOW())`;

  const addDealerValues = [id, place, percent];
  const addMarkethistoryValues = [id, place, percent];

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting connection from pool:", err);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }

    connection.beginTransaction((beginTransactionError) => {
      if (beginTransactionError) {
        console.error("Error beginning transaction:", beginTransactionError);
        connection.release();
        res.status(500).json({ error: "Internal Server Error" });
        return;
      }

      // Execute the first query
      connection.query(
        addDealerQuery,
        addDealerValues,
        (addDealerError, addDealerResults) => {
          if (addDealerError) {
            console.error("Error executing addDealer query:", addDealerError);
            // Rollback the transaction in case of an error
            connection.rollback(() => {
              connection.release();
              res.status(500).json({ error: "Internal Server Error" });
            });
            return;
          }

          // Execute the second query
          connection.query(
            addMarkethistoryQuery,
            addMarkethistoryValues,
            (addMarkethistoryError, addMarkethistoryResults) => {
              if (addMarkethistoryError) {
                console.error(
                  "Error executing addMarkethistory query:",
                  addMarkethistoryError
                );
                // Rollback the transaction in case of an error
                connection.rollback(() => {
                  connection.release();
                  res.status(500).json({ error: "Internal Server Error" });
                });
                return;
              }

              // Commit the transaction if both queries are successful
              connection.commit((commitError) => {
                if (commitError) {
                  console.error("Error committing transaction:", commitError);
                  // Rollback the transaction in case of an error during commit
                  connection.rollback(() => {
                    connection.release();
                    res.status(500).json({ error: "Internal Server Error" });
                  });
                  return;
                }

                // Release the connection after successful commit
                connection.release();
                console.log("Transaction committed successfully");
                res.json({ success: true });
              });
            }
          );
        }
      );
    });
  });
};

const editMarket = (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting connection:", err);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }

    connection.beginTransaction((beginTransactionError) => {
      if (beginTransactionError) {
        console.error("Error beginning transaction:", beginTransactionError);
        res.status(500).json({ error: "Internal Server Error" });
        return;
      }

      const updateDealer = `
        UPDATE marketplace
        SET
        place = ?,
        percent = ?,
        update_at = NOW()
        WHERE
          id = ?;`;

      const values = [req.body.place, req.body.percent, req.params.id];

      const updateDealer1 = `
        INSERT INTO markethistory
        (id, place, percent, created_at)
        VALUES (?, ?, ?, NOW());`;

      const values1 = [req.params.id, req.body.place, req.body.percent];

      // Execute the first query
      connection.query(updateDealer, values, (updateDealerError, results) => {
        if (updateDealerError) {
          console.error(
            "Error executing updateDealer query:",
            updateDealerError
          );
          connection.rollback(() => {
            console.error("Transaction rolled back.");
            res.status(500).json({ error: "Internal Server Error" });
          });
          return;
        }

        // Execute the second query
        connection.query(
          updateDealer1,
          values1,
          (updateDealer1Error, results1) => {
            if (updateDealer1Error) {
              console.error(
                "Error executing updateDealer1 query:",
                updateDealer1Error
              );
              connection.rollback(() => {
                console.error("Transaction rolled back.");
                res.status(500).json({ error: "Internal Server Error" });
              });
              return;
            }

            // Commit the transaction if both queries were successful
            connection.commit((commitError) => {
              if (commitError) {
                console.error("Error committing transaction:", commitError);
                connection.rollback(() => {
                  console.error("Transaction rolled back.");
                  res.status(500).json({ error: "Internal Server Error" });
                });
                return;
              }

              console.log("Transaction committed.");
              res.json({ success: true });
            });
          }
        );
      });

      // Release the connection back to the pool
      connection.release();
    });
  });
};

const deleteMarket = (req, res) => {
  const query = "DELETE FROM marketplace WHERE id = ?";
  const debitorName = req.body.id;

  pool.query(query, [debitorName], (error, results) => {
    if (error) {
      console.error("Error executing query:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (results.affectedRows === 0) {
      return res
        .status(404)
        .json({
          error: "Not Found: No matching debitor_name found for deletion",
        });
    }

    console.log("Deleted", results);
    res.json({ message: "Debitor deleted successfully" });
  });
};

module.exports = {
  showMarket,
  showOneMarket,
  addMarket,
  editMarket,
  deleteMarket,
};
