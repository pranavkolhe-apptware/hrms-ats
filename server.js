const express = require('express');
const pool = require('./db');

const app = express();
app.use(express.json());

// Add a new resource request
app.post('/resource-requests', async (req, res) => {
    const { job_role, no_of_positions, primary_tech_stack, secondary_tech_stack, additional_details,experience } = req.body;

    try {
        const result = await pool.query(
            `INSERT INTO resource_requests 
            (job_role,no_of_positions, primary_tech_stack, secondary_tech_stack, additional_details,experience) 
            VALUES ($1, $2, $3, $4, $5, $6) 
            RETURNING *`,
            [job_role, no_of_positions, primary_tech_stack, secondary_tech_stack, additional_details,experience]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error("PostgreSQL Error :---", error);
        console.error("PostgreSQL Error Code : ---", error.code);
        if (error.code === '23505') {
            res.status(400).json({ error: "Duplicate job request exists!" });
        } else {
            console.error(error);
            res.status(500).json({ error: "Server error" });
        }
    }
});

// Fetch all requests
app.get('/resource-requests', async (req, res) => {
    const { id } = req.query; // Get ID from query parameter

    try {
        if (id) {
            // Fetch a specific resource request
            const result = await pool.query(`SELECT * FROM resource_requests WHERE id = $1`, [id]);

            if (result.rowCount === 0) {
                return res.status(404).json({ error: "Resource request not found" });
            }

            return res.json(result.rows[0]);
        } else {
            // Fetch all resource requests if no ID is provided
            const result = await pool.query(`SELECT * FROM resource_requests`);
            return res.json(result.rows);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
});



// delete a resource request
app.delete('/resource-requests', async (req, res) => {

    const { id } = req.query;

    try {
        const result = await pool.query(
            `DELETE FROM resource_requests WHERE id = $1 RETURNING *`,
            [id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Resource request not found" });
        }

        res.json({ message: "Resource request deleted sucessfully" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }

});




// update the resource Request .........


app.put('/resource-requests',async (req, res)=>{
    const { id } = req.query;
    const {job_role,no_of_positions,primary_tech_stack,secondary_tech_stack,additional_details,experience} = req.body;

    if(!id){
        return res.status(400).json({error : "ID is required"});
    }

    try{
        const result = await pool.query(
            `UPDATE resource_requests SET job_role = $1, no_of_positions = $2,
            primary_tech_stack = $3, secondary_tech_stack = $4, additional_details = $5, experience= $6 WHERE id = $7 
            RETURNING *`,
            [job_role,no_of_positions,primary_tech_stack,secondary_tech_stack,additional_details,experience,id]
        );

        if(result.rowCount === 0){
            return res.status(404).json({error : "Resource request not found"})
        }

        res.json({message : "Resource request updated sucessfully",updated : result.rows[0]});
    }catch(error){
        console.error(error);
        res.status(500).json({error : "Server error"});
    }

});

















// Server listening
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
