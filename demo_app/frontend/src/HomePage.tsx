import { ActionIcon, Button, Collapse, Container, Divider, Flex, Group, Paper, Stack, TextInput, Title, useMantineTheme } from "@mantine/core";
import { IconBrandGithub, IconCheck, IconFlag, IconPencil, IconPlayerSkipBack, IconRepeat, IconSparkles, IconX } from "@tabler/icons-react";
import { useEffect, useMemo, useState } from "react";
import { Chessboard } from "react-chessboard";
import { Chess, Square } from "chess.js";
import { Move } from "./types";
import EditFenModal from "./EditFenModal";
import SidePickerModal from "./SidePickerModal";
import axios, { AxiosResponse } from "axios";
import GameOverModal from "./GameOverModal";

const BASE_URL = 'http://localhost:5000';

export default function HomePage() {
    const theme = useMantineTheme();

    const [boardOrientation, setBoardOrientation] = useState<'w' | 'b'>('w');
    const [ourSide, setOurSide] = useState<'w' | 'b' | null>(null);

    const [game, setGame] = useState(new Chess());
    const [editFenOpen, setEditFenOpen] = useState(false);
    const [sidePickerOpen, setSidePickerOpen] = useState(false);
    const [gameOverOpen, setGameOverOpen] = useState(false);
    const [thinking, setThinking] = useState(false);

    const [autoplay, setAutoplay] = useState(true);

    const positionFen = useMemo(() => game.fen(), [game]);

    const handleResetBoard = () => {
        setGame(new Chess());
        setOurSide(null);
    }

    const handleFlipBoard = () => {
        setBoardOrientation(boardOrientation === 'w' ? 'b' : 'w');
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

    const predictMove = async () => {
        setThinking(true);

        await axios.post(`${BASE_URL}/predict/fen`, {
            fen: game.fen()
        }).then((response: AxiosResponse<{ move: Move }>) => {
            const move = response.data.move

            makeMove(move)
        }).catch((error) => {
            console.error(error);
        }).finally(() => {
            setThinking(false);
        })
    }

    useEffect(() => {
        if (ourSide === null && autoplay) {
            setSidePickerOpen(true);
        }

        setBoardOrientation(ourSide ?? 'w');

    }, [ourSide, autoplay])

    // Autoplay logic
    useEffect(() => {
        if (autoplay && !!ourSide && ourSide !== game.turn()) {
            predictMove();
        }
    }, [game, autoplay, ourSide])

    useEffect(() => {
        if (game.isGameOver()) {
            setGameOverOpen(true);
        }
    }, [game])

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
                        <Chessboard
                            boardOrientation={boardOrientation === 'w' ? 'white' : 'black'}
                            position={positionFen}
                            onPieceDrop={onDrop}
                            customDarkSquareStyle={{
                                backgroundColor: "#8ca2ad"
                            }}
                            customLightSquareStyle={{
                                backgroundColor: "#dee3e6"
                            }}
                        />
                    </Paper>
                    <Flex justify='space-between'>
                        <Group gap={theme.spacing.xs}>
                            <Button size="md" variant={autoplay ? 'light' : 'outline'} leftSection={autoplay ? <IconCheck /> : <IconX />} onClick={() => setAutoplay(!autoplay)} color={autoplay ? undefined : 'gray'}>
                                Autoplay
                            </Button>
                        </Group>
                        <Group gap={theme.spacing.xs}>
                            <ActionIcon size="input-md" variant='light' onClick={handleResetBoard}><IconPlayerSkipBack /></ActionIcon>
                            <ActionIcon size='input-md' onClick={handleFlipBoard} variant="light">
                                <IconRepeat />
                            </ActionIcon>
                        </Group>
                    </Flex>
                    <Collapse in={!autoplay}>
                        <Divider mb={theme.spacing.md} />
                        <Group gap={theme.spacing.xs}>
                            <Button size="md" variant='light' leftSection={<IconSparkles />} disabled={thinking || game.isGameOver()} onClick={predictMove}>
                                Predict
                            </Button>
                            <TextInput size="md" flex={1} value={positionFen} rightSection={
                                <ActionIcon variant='subtle' onClick={() => setEditFenOpen(true)}>
                                    <IconPencil size='24' />
                                </ActionIcon>
                            }
                            />
                        </Group>
                    </Collapse>
                </Stack>
            </Paper>
            <EditFenModal open={editFenOpen} onClose={() => setEditFenOpen(false)} initialFen={positionFen} onFenChange={handleChangeFen} />
            <SidePickerModal open={sidePickerOpen} setOurSide={setOurSide} onClose={() => setSidePickerOpen(false)} />
            <GameOverModal open={gameOverOpen} onClose={() => setGameOverOpen(false)} game={game} />
        </Container>
    )
}