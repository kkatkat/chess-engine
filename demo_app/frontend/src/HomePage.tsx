import { ActionIcon, Button, Container, Group, Modal, Paper, Stack, TextInput, Title, useMantineTheme } from "@mantine/core";
import { IconArrowBackUp, IconBrandGithub, IconChess, IconPencil, IconRefresh, IconRepeat } from "@tabler/icons-react";
import { useMemo, useState } from "react";
import { Chessboard } from "react-chessboard";
import { Chess, Square } from "chess.js";
import { Move } from "./types";
import EditFenModal from "./EditFenModal";

export default function HomePage() {
    const theme = useMantineTheme();

    const [boardOrientation, setBoardOrientation] = useState<'white' | 'black'>('white');
    const [game, setGame] = useState(new Chess());
    const [editFenOpen, setEditFenOpen] = useState(false);

    const positionFen = useMemo(() => game.fen(), [game]);

    const handleResetBoard = () => {
        setGame(new Chess());
    }

    const handleFlipBoard = () => {
        setBoardOrientation(boardOrientation === 'white' ? 'black' : 'white');
    }

    const makeMove = (move: Move) => {
        const gameCopy = new Chess(game.fen());
        const result = gameCopy.move(move, { strict: false });

        setGame(gameCopy);
        return result
    }

    const onDrop = (sourceSquare: Square, targetSquare: Square): boolean => {
        const move = makeMove({
            from: sourceSquare,
            to: targetSquare,
            promotion: 'q'
        })

        if (move === null) {
            return false
        }

        return true
    }

    const handleChangeFen = (fen: string) => {
        const gameCopy = new Chess(fen);
        setGame(gameCopy);
    }

    console.log(game.fen())

    return (
        <Container size='sm' pt={theme.spacing.lg}>
            <Group justify="space-between" align="center" mb={theme.spacing.md} wrap="nowrap">
                <Title order={3} c={theme.primaryColor}>Chess Engine</Title>
                <Group gap={theme.spacing.xs} wrap="nowrap">
                    <ActionIcon variant="light" size='lg' component='a' href="https://github.com/kkatkat/chess-engine" target="_blank">
                        <IconBrandGithub />
                    </ActionIcon>
                </Group>
            </Group>
            <Paper p={theme.spacing.md} shadow="xs" withBorder mb={theme.spacing.lg}>
                <Stack>
                    <Paper shadow="xs" withBorder radius={theme.radius.xs}>
                        <Chessboard boardOrientation={boardOrientation} position={positionFen} onPieceDrop={onDrop} />
                    </Paper>
                    <Group gap={theme.spacing.xs}>
                        <Button size="md" leftSection={<IconRefresh />} variant='light' onClick={handleResetBoard}>Reset board</Button>
                        <ActionIcon size='input-md' onClick={handleFlipBoard} variant="light">
                            <IconRepeat />
                        </ActionIcon>
                        <TextInput size="md" flex={1} value={positionFen} rightSection={
                            <ActionIcon variant='subtle' onClick={() => setEditFenOpen(true)}>
                                <IconPencil size='24'/>
                            </ActionIcon>
                        }/>
                        {/* <ActionIcon size='input-md' variant="light" color="red">
                            <IconArrowBackUp/>
                        </ActionIcon> */}
                    </Group>
                </Stack>
            </Paper>
            <EditFenModal open={editFenOpen} onClose={() => setEditFenOpen(false)} initialFen={positionFen} onFenChange={handleChangeFen}/>
        </Container>
    )
}