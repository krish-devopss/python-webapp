from flask import Flask, render_template, request, redirect, url_for, flash
from datetime import datetime
import json
import os

app = Flask(__name__)
app.secret_key = 'secret-key-123'

# Simple JSON database
BOOKINGS_FILE = 'bookings.json'

def load_bookings():
    if os.path.exists(BOOKINGS_FILE):
        with open(BOOKINGS_FILE, 'r') as f:
            return json.load(f)
    return []

def save_bookings(bookings):
    with open(BOOKINGS_FILE, 'w') as f:
        json.dump(bookings, f, indent=2)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/book', methods=['GET', 'POST'])
def book():
    if request.method == 'POST':
        name = request.form.get('name')
        email = request.form.get('email')
        date = request.form.get('date')
        time = request.form.get('time')
        guests = request.form.get('guests')
        
        bookings = load_bookings()
        
        # Create new booking
        booking = {
            'id': len(bookings) + 1,
            'name': name,
            'email': email,
            'date': date,
            'time': time,
            'guests': guests
        }
        
        bookings.append(booking)
        save_bookings(bookings)
        
        flash('Table booked successfully!', 'success')
        return redirect(url_for('home'))
    
    return render_template('book.html')

@app.route('/view')
def view():
    email = request.args.get('email')
    bookings = load_bookings()
    
    if email:
        user_bookings = [b for b in bookings if b['email'] == email]
    else:
        user_bookings = []
    
    return render_template('view.html', bookings=user_bookings, email=email)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
