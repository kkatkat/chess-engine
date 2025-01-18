from chess import Board
from tree_node import TreeNode
from operations import select, expand, simulate, backpropagate

def run_mcts(fen, iterations=1600, with_network=False):
    board = Board(fen)
    root = TreeNode(board)

    our_color = board.turn

    print(f"Solving for {'white' if our_color else 'black'}")

    for i in range(iterations):
        node = select(root)

        if not node.is_terminal_node():
            node = expand(node)

        payout = simulate(node, our_color, with_network)
        backpropagate(node, payout)

    # sort the children of the root node by the number of visits
    root.visited_moves_and_nodes.sort(key=lambda x: x[1].V, reverse=True)

    # print the top 5 children of the root node
    for move, child in root.visited_moves_and_nodes[:5]:
        print(f"Move: {move.uci()}, Visits: {child.V}, Wins: {child.M}")

    return root.visited_moves_and_nodes[:5]