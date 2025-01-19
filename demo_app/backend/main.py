from flask import Flask, jsonify, request
from flask_cors import CORS

import sys
import os

from chess import Board

parent_dir = os.path.abspath(os.path.join(os.getcwd(), "../../supervised"))
sys.path.insert(0, parent_dir)

from predict import predict_move

app = Flask(__name__)
CORS(app)

@app.route('/predict/fen', methods=['POST'])
def get_data():
    body = request.get_json()
    fen = body['fen']

    board = Board(fen)

    move, probabilities, sorted_classes = predict_move(board)

    response = {
        'move': move
    }
    
    return jsonify(response)

if __name__ == '__main__':
    app.run(debug=True)