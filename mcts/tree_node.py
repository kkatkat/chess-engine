from chess import Board
from typing import Type

class TreeNode():
    def __init__(self, board):
        self.M = 0
        self.V = 0

        self.visited_moves_and_nodes = []
        self.non_visited_legal_moves = list(board.legal_moves)

        self.board: Type[Board] = board
        self.parent = None

    def is_leaf_node(self):
        return len(self.non_visited_legal_moves) != 0
    
    def is_terminal_node(self):
        return len(self.non_visited_legal_moves) == 0 and len(self.visited_moves_and_nodes) == 0