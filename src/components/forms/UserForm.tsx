import {
    Box,
    Paper,
    Typography,
    Button,
    Stack,
    Divider,
} from "@mui/material";
import FormFields from "../forms/FormFields";
import { useUserForm } from "../../../hooks/useUserForm";
import type { User } from "../../../types";

interface Props {
    initialData: User;
    readOnly: boolean;
    loading?: boolean;
    onEdit: () => void;
    onCancel: () => void;
    onSave: (data: User) => void;
}

export default function UserForm({
    initialData,
    readOnly,
    loading,
    onEdit,
    onCancel,
    onSave,
}: Props) {

    const { data, errors, onChange, validate } = useUserForm(initialData, false);

    return (
        <Box display="flex" justifyContent="center" py={4}>
            <Paper sx={{ p: 5, maxWidth: 600, width: "100%" }}>
                <Typography variant="h4" textAlign="center" mb={3}>
                    פרטי פרופיל
                </Typography>

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        if (!validate()) return;
                        onSave(data);
                    }}
                >
                    <FormFields
                        data={data}
                        errors={errors}
                        onChange={onChange}
                        readOnly={readOnly}
                        showBankFields={true}
                    />

                    <Divider sx={{ my: 4 }} />

                    {readOnly ? (
                        <Button variant="contained" fullWidth onClick={onEdit}>
                            ערוך פרטים
                        </Button>
                    ) : (
                        <Stack direction="row" justifyContent="space-between">
                            <Button type="submit" variant="contained" disabled={loading}>
                                שמור
                            </Button>

                            <Button variant="text" color="secondary" onClick={onCancel}>
                                ביטול
                            </Button>
                        </Stack>
                    )}
                </form>
            </Paper>
        </Box>
    );
}
