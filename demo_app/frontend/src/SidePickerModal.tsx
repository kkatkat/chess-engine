import { Button, Modal, SegmentedControl, Stack } from "@mantine/core";
import { useState } from "react";

type SidePickerProps = {
    open: boolean;
    setOurSide: (side: 'w' | 'b') => void;
    onClose: () => void;
}

export default function SidePickerModal({ open, setOurSide, onClose }: SidePickerProps) {
    const [side, setSide] = useState<'w' | 'b'>('w');

    const handleSave = () => {
        setOurSide(side);
        onClose();
    }

    const handleCancel = () => {
        setOurSide('w');
        onClose();
    }

    return (
        <Modal opened={open} onClose={handleCancel} title="Choose a side" centered>
            <Stack>
                <SegmentedControl
                    value={side}
                    onChange={(value) => setSide(value as 'w' | 'b')}
                    size="md"
                    data={[
                        { value: 'w', label: 'White' },
                        { value: 'b', label: 'Black' }
                    ]}
                />
                <Button variant="light" onClick={handleSave}>Play</Button>
            </Stack>
        </Modal>
    )
}