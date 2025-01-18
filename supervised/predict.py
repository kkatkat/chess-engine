import os

from chess import Board
import torch
import numpy as np

from data_loading import board_to_tensor
from moves_encoder import MovesEncoder
from Model import Model

encoder = MovesEncoder()

model_path = os.path.join(os.path.dirname(__file__), 'model_epoch_12.pth')

# load the model
model = Model(num_actions=encoder.num_actions)
model.load_state_dict(torch.load(model_path))
model.eval()

def predict_move(board: Board):
    X = board_to_tensor(board)

    X = torch.tensor(X, dtype=torch.float32)
    X = X.unsqueeze(0)

    with torch.no_grad():
        output = model(X)
        output = output.squeeze(0)

    probabilities = torch.softmax(output, dim=0).cpu().numpy()

    legal_moves = list(board.legal_moves)
    legal_moves_uci = [move.uci() for move in legal_moves]
    
    # all moves (indices) sorted by probability
    sorted_classes = np.argsort(probabilities)[::-1]

    for move_index in sorted_classes:
        move = encoder.decode(move_index)
        if move in legal_moves_uci:
            return move, probabilities, sorted_classes
    
    return None