import numpy as np

class MovesEncoder():
    def __init__(self):
        self.move_indices = self.encode_moves()
        self.moves_at_indices = {index: move for move, index in self.move_indices.items()}
        self.num_actions = len(self.move_indices)
        self.max_entropy = np.log2(self.num_actions)
    
    def encode(self, move: str) -> int:
        return self.move_indices[move]
    
    def decode(self, index: int) -> str:
        return self.moves_at_indices[index]

    def encode_moves(self):
        moves = {}
        index = 0

        files = 'abcdefgh'
        ranks = '12345678'
        promotions = 'nbrq'  # knight, bishop, rook, queen

        for start_file in files:
            for start_rank in ranks:
                for end_file in files:
                    for end_rank in ranks:
                        move = f"{start_file}{start_rank}{end_file}{end_rank}"
                        moves[move] = index
                        index += 1

                        if start_rank == '7' and end_rank == '8':
                            for promotion in promotions:
                                promo_move = f"{start_file}{start_rank}{end_file}{end_rank}{promotion}"
                                moves[promo_move] = index
                                index += 1
                        elif start_rank == '2' and end_rank == '1':
                            for promotion in promotions:
                                promo_move = f"{start_file}{start_rank}{end_file}{end_rank}{promotion}"
                                moves[promo_move] = index
                                index += 1

        return moves