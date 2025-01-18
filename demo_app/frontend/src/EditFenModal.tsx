import { Alert, Button, Flex, Modal, Stack, TextInput } from "@mantine/core";
import { validateFen } from "chess.js";
import { useEffect, useState } from "react";

type EditFenModalProps = {
    open: boolean;
    onClose: () => void;
    initialFen: string;
    onFenChange: (fen: string) => void;
};

export default function EditFenModal({ open, onClose, initialFen, onFenChange }: EditFenModalProps) {
    const [newFen, setNewFen] = useState(initialFen);
    const [error, setError] = useState<string>();

    const handleCancel = () => {
        setNewFen(initialFen);
        onClose();
    }

    const handleSave = () => {
        const fenValid = validateFen(newFen);

        if (!fenValid.ok) {
            setError(fenValid.error || 'Invalid FEN');
            return;
        }

        onFenChange(newFen);
        onClose();
    }

    const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setError(undefined);
        setNewFen(event.target.value);
    }

    useEffect(() => {
        setError(undefined);
    }, [open])

    return (
        <Modal opened={open} onClose={handleCancel} title="Edit FEN" centered>
            <Stack>
                <TextInput size="md" value={newFen} onChange={handleTextChange} width={'100%'} placeholder="Place FEN here" />
                {
                    !!error &&
                    <Alert color="red">
                        {error}
                    </Alert>
                }
                <Flex justify='end'>
                    <Button variant="light" onClick={handleSave}>Save</Button>
                </Flex>
            </Stack>
        </Modal>
    )
}
