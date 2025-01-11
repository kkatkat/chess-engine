import chess
import numpy as np

def is_legal_move(board: chess.Board, move_uci: str):
    move = chess.Move.from_uci(move_uci)
    return move in board.legal_moves

def calculate_entropy(probabilities: np.ndarray):
    # Ensure no probabilities are zero (add a small value if necessary)
    probabilities = probabilities + 1e-12

    return -np.sum(probabilities * np.log2(probabilities))