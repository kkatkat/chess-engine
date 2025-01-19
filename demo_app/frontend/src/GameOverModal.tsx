import { Center, Modal, Stack, Text } from "@mantine/core";
import { Chess } from "chess.js";
import { useMemo } from "react";

type GameOverModalProps = {
    open: boolean;
    onClose: () => void;
    game: Chess;
}

export default function GameOverModal({ open, onClose, game }: GameOverModalProps) {

    const winnerSide = useMemo(() => {
        if (game.isCheckmate()) {
            return game.turn() === 'w' ? 'Black' : 'White';
        }
    }, [game]);

    const isDraw = useMemo(() => {
        return game.isDraw()
    }, [game]);

    return (
        <Modal opened={open} onClose={onClose} centered withCloseButton={false}>
            <Center>
                <Stack style={{ textAlign: 'center' }}>
                    <Text size='xl' fw={700}>
                        Game over!
                    </Text>
                    <Text>
                        {
                            isDraw ? 'Draw.' : `${winnerSide} is victorious.`
                        }
                    </Text>
                </Stack>
            </Center>
        </Modal >
    )
}