import chess

def is_legal_move(board: chess.Board, move_uci):
    move = chess.Move.from_uci(move_uci)
    return move in board.legal_moves