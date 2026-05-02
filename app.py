from flask import Flask, render_template, jsonify, request
import datetime
import random

app = Flask(__name__)

# Sample data
quotes = [
    "The only limit is your imagination. 🚀",
    "Code is poetry in motion. 💻",
    "Dream big, start small, act now. ⭐",
    "Every expert was once a beginner. 🌱",
    "Innovation distinguishes leaders. 💡"
]

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/api/health')
def health_check():
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.datetime.now().isoformat(),
        'server': 'Python Flask App'
    })

@app.route('/api/quote')
def get_quote():
    return jsonify({
        'quote': random.choice(quotes),
        'time': datetime.datetime.now().strftime("%H:%M:%S")
    })

@app.route('/api/message', methods=['POST'])
def receive_message():
    data = request.json
    message = data.get('message', '')
    return jsonify({
        'received': message,
        'reply': f"Thanks for your message! We'll get back to you soon. 📧",
        'status': 'success'
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
