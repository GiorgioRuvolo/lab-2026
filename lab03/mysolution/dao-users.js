import db from "./db.js";

// NOTE: all functions return error messages as json object { error: <string> }
export default function UserDao() { 
    // This function retrieves one user by id
    this.getUser = (id) => {
        return new Promise((resolve, reject) => {
            db.get("SELECT * FROM users WHERE id = ?", [id], (err, row) => {
                if (err) {
                    reject({ error: "Error retrieving user" });
                } else {
                    resolve(row);
                }
            });
        });
    };
}
