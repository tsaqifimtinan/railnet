from flask import Flask, jsonify

app = Flask(__name__)

@app.route('/')
def hello():
    return jsonify({"message": "Hello from Vercel!"})

@app.route('/api/test')
def test():
    return jsonify({"status": "working", "platform": "vercel"})

if __name__ == '__main__':
    app.run(debug=True)
