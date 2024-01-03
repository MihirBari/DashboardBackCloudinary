const { pool } = require("../database");

const showExpense = (req,res) => {

    const dealer = `SELECT 
    id,	name,	date,	amount,	paid_status,	paid_by, remarks, created_at,	updated_at	    
    FROM expense`;

    pool.query(dealer, (error, results) => {
      if (error) {
        console.error('Error executing query:', error);
        return;
      }
    
      console.log('All users:', results);
      res.status(200).json(results)
    });

}

const showOneExpense = (req, res) => {
  const dealerQuery = `
    SELECT id,	name,	date,	amount,	paid_status,	paid_by, remarks
    FROM expense
    WHERE id = ?
  `;
  pool.query(dealerQuery, [req.params.id], (error, results) => {
    if (error) {
      console.error('Error executing query:', error);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
    console.log('Dealer details:', results);
    res.status(200).json(results);
  });
};

const addExpense = (req,res) => {
    const addDealer = `Insert into expense
     (name,	date,	amount,	paid_status,	paid_by, remarks, created_at)
     values (?,?,?,?,?,?, NOW())
     `
    const value = [ 
        req.body.name,
        req.body.date,
        req.body.amount,
        req.body.paid_status, 
        req.body.paid_by,
        req.body.remarks,
      ]

    pool.query(addDealer, value ,(error, results) => {
        if (error) {
          console.error('Error executing query:', error);
          return;
        }
      
        console.log('All users:', results);
        res.json(results)
      });
}

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


const deleteExpense = (req, res) => {
  const query = 'DELETE FROM expense WHERE id = ?';
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

module.exports = {showExpense,showOneExpense,addExpense,editExpense,deleteExpense};