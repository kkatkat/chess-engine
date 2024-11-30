from chess import Board, pgn
from chess.pgn import Game
from typing import List
from moves_encoder import MovesEncoder
import numpy as np

WHITE = 1
BLACK = 0

def board_to_tensor(board: Board):
    """
    0 to 5: white pieces  (0 - pawn, 1 - knight, 2 - bishop, 3  - rook, 4  - queen, 5  - king)\n
    6 to 11: black pieces (6 - pawn, 7 - knight, 8 - bishop, 9 - rook, 10 - queen, 11 - king)\n
    12: turn (all 1s for white, all 0s for black)\n
    13: white king side castling rights\n
    14: white queen side castling rights\n
    15: black king side castling rights\n
    16: black queen side castling rights\n
    17: legal squares to move to\n
    18: all 1s for CNN to detect board edge\n
    """

    tensor = np.zeros((19, 8, 8))

    piece_map = board.piece_map()

    for square, piece in piece_map.items():
        row, col = divmod(square, 8)

        # pawn 0, knight 1, bishop 2, rook 3, queen 4, king 5
        piece_type = piece.piece_type - 1

        # white 0, black 6
        piece_color = 0 if piece.color == WHITE else 6
        
        # fill in 0 to 11 (piece positions)
        tensor[piece_color + piece_type, row, col] = 1

    # fill in 12 (turn) to 1s if white's turn, else do nothing
    if (board.turn):
        tensor[12, :, :] = 1

    # fill in 13 to 16 (castling rights)
    if board.has_kingside_castling_rights(WHITE):
        tensor[13, :, :] = 1
    
    if board.has_queenside_castling_rights(WHITE):
        tensor[14, :, :] = 1
    
    if board.has_kingside_castling_rights(BLACK):
        tensor[15, :, :] = 1

    if board.has_queenside_castling_rights(BLACK):
        tensor[16, :, :] = 1

    # fill in 17 (legal squares)
    for move in board.legal_moves:
        row, col = divmod(move.to_square, 8)
        tensor[17, row, col] = 1

    # fill in 18 (board edge)
    tensor[18, :, :] = 1
    
    return tensor


def load_games(path: str):
    games = []

    with open(path, 'r') as file:
        while True:
            game = pgn.read_game(file)

            if game is None:
                break

            games.append(game)

    return games

def load_data(games: List[Game], encoder: MovesEncoder, batch_size: int = 32):
    X = []
    y = []

    for game in games:
        board = game.board()

        for move in game.mainline_moves():
            X.append(board_to_tensor(board))
            y.append(encoder.encode(move.uci()))
            board.push(move)

    return np.array(X), np.array(y)