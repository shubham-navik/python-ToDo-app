from flask import Flask, jsonify, request
from flask_cors import CORS
from datetime import datetime

app = Flask(__name__)
CORS(app)

# Initialize an empty list for items
items = []

@app.route('/api/items', methods=['GET'])
def get_items():
    return jsonify(items)

@app.route('/api/items', methods=['POST'])
def add_item():
    item = request.json
    if not items:  # If items list is empty
        item_id = 1
    else:
        item_id = max([item['id'] for item in items]) + 1
    item['id'] = item_id
    item['timestamp'] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")  # Add current timestamp
    items.append(item)
    return jsonify(item), 201

@app.route('/api/items/<int:item_id>', methods=['DELETE'])
def delete_item(item_id):
    global items
    items = [item for item in items if item['id'] != item_id]
    return jsonify({'message': 'Item deleted'}), 200

if __name__ == '__main__':
    app.run(debug=True)
