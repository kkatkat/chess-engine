import math
from tree_node import TreeNode
import random
from chess import Board, Outcome

def uct_value(node, parent):
    val = node.M + 1.4142 * math.sqrt(math.log(parent.V) / node.V)

    return val

def select(node: TreeNode):
    if node.is_leaf_node() or node.is_terminal_node():
        return node
    else:
        max_uct_child = None
        max_uct_value = float("-inf")

        for move, child in node.visited_moves_and_nodes:
            child_uct = uct_value(child, node)

            if child_uct > max_uct_value:
                max_uct_value = child_uct
                max_uct_child = child
            
        if max_uct_child is None:
            raise ValueError("No child found with max UCT value")
        else:
            return select(max_uct_child)

def expand(node: TreeNode):
    move_to_expand = node.non_visited_legal_moves.pop(random.randint(0, len(node.non_visited_legal_moves) - 1))
    board = node.board.copy()

    board.push(move_to_expand)

    new_child = TreeNode(board)
    new_child.parent = node

    node.visited_moves_and_nodes.append((move_to_expand, new_child))
    return new_child

def simulate(node: TreeNode, player_color):
    board: Board = node.board.copy()
    our_color = player_color
    opponent_color = not our_color

    while board.outcome(claim_draw = True) == None:
        legal_moves = list(board.legal_moves)
        
        move = random.choice(legal_moves)
        board.push(move)

    payout = 0

    outcome: Outcome = board.outcome(claim_draw = True)

    if outcome.winner == our_color:
        payout = 1
    elif outcome.winner == opponent_color:
        payout = -1
    elif outcome.winner is None:
        payout = 0

    return payout
    
def backpropagate(node: TreeNode, payout):
    node.M = ((node.M * node.V) + payout) / (node.V + 1)
    node.V += 1

    if node.parent != None:
        backpropagate(node.parent, payout)
