from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector

app = Flask(__name__)
CORS(app)  # Allow React to communicate with Flask

# Connect to MySQL database
db = mysql.connector.connect(
    host="localhost",
    user="root",  # Change to your MySQL username
    password="password",  # Change to your MySQL password
    database="user_data"
)
cursor = db.cursor()

# Create preferences table if it doesn't exist
cursor.execute("""
CREATE TABLE IF NOT EXISTS genre_preferences (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_email VARCHAR(255) NOT NULL,
    genres TEXT NOT NULL
)
""")
db.commit()

# ✅ Save User Preferences
@app.route('/save_preferences', methods=['POST'])
def save_preferences():
    data = request.json
    user_email = data.get("email")
    genres = ",".join(data.get("genres", []))  # Convert list to comma-separated string

    cursor.execute("DELETE FROM genre_preferences WHERE user_email = %s", (user_email,))  # Remove old preferences
    cursor.execute("INSERT INTO genre_preferences (user_email, genres) VALUES (%s, %s)", (user_email, genres))
    db.commit()
    
    return jsonify({"message": "Preferences saved successfully"}), 201

# ✅ Get User Preferences
@app.route('/get_preferences/<email>', methods=['GET'])
def get_preferences(email):
    cursor.execute("SELECT genres FROM genre_preferences WHERE user_email = %s", (email,))
    result = cursor.fetchone()

    if result:
        preferences = result[0].split(",")  # Convert back to list
    else:
        preferences = []

    return jsonify({"preferences": preferences})

if __name__ == '__main__':
    app.run(debug=True)
