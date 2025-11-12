import {
    TextField,
    Stack,
    Divider,
    Typography,
    InputAdornment,
} from "@mui/material";

import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";
import BadgeIcon from "@mui/icons-material/Badge";
import LockIcon from "@mui/icons-material/Lock";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";

interface Props {
    data: any;
    errors: any;
    onChange: (e: any) => void;
    readOnly?: boolean;
    showBankFields?: boolean;
}

export default function FormFields({
    data,
    errors,
    onChange,
    readOnly = false,
    showBankFields = false,
}: Props) {

    const baseProps = (name: string, label: string, icon: any, extra: any = {}, autocomplete?: string) => ({
        label,
        name,
        value: data[name],
        onChange,
        fullWidth: true,
        disabled: readOnly,
        error: !!errors[name],
        helperText: errors[name] || "",
        inputProps: {
            autocomplete: autocomplete || 'off',
        },
        InputProps: {
            startAdornment: (
                <InputAdornment position="start">
                    {icon}
                </InputAdornment>
            ),
            readOnly,
        },
        ...extra,
    });

    return (
        <Stack spacing={2.5}>
            <Typography variant="h6">פרטים אישיים</Typography>
            <Divider />

            <TextField {...baseProps("name", "שם מלא", <PersonIcon />, {}, "name")} />
            <TextField {...baseProps("phone", "טלפון", <PhoneIcon />, {}, "tel-national")} />
            <TextField {...baseProps("idNum", "תעודת זהות", <BadgeIcon />, {}, "tel-national")} />
            <TextField {...baseProps("secret", "קוד סודי", <LockIcon />, { type: "password" }, "new-password")} />

            {showBankFields && (
                <>
                    <Typography variant="h6" mt={3}>
                        פרטי חשבון בנק
                    </Typography>
                    <Divider />

                    <Stack direction="row" spacing={1} width={"100%"}>
                        <TextField
                            label="מספר בנק"
                            name="bankNumber"
                            value={data.bankAccount.bankNumber}
                            onChange={onChange}
                            disabled={readOnly}
                            error={!!errors.bankNumber}
                            helperText={errors.bankNumber}
                            inputProps={{ autocomplete: 'off' }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <VpnKeyIcon />
                                    </InputAdornment>
                                ),
                                readOnly,
                            }}
                        />
                        <TextField
                            label="מספר סניף"
                            name="branchNumber"
                            value={data.bankAccount.branchNumber}
                            onChange={onChange}
                            disabled={readOnly}
                            error={!!errors.branchNumber}
                            helperText={errors.branchNumber}
                            inputProps={{ autocomplete: 'off' }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <VpnKeyIcon />
                                    </InputAdornment>
                                ),
                                readOnly,
                            }}
                        />
                    </Stack>

                    <TextField
                        label="מספר חשבון"
                        name="accountNumber"
                        value={data.bankAccount.accountNumber}
                        onChange={onChange}
                        disabled={readOnly}
                        error={!!errors.accountNumber}
                        helperText={errors.accountNumber}
                        fullWidth
                        inputProps={{ autocomplete: 'off' }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <CreditCardIcon />
                                </InputAdornment>
                            ),
                            readOnly,
                        }}
                    />

                    <TextField
                        label="שם בעל החשבון"
                        name="accountOwner"
                        value={data.bankAccount.accountOwner}
                        onChange={onChange}
                        disabled={readOnly}
                        error={!!errors.accountOwner}
                        helperText={errors.accountOwner}
                        fullWidth
                        inputProps={{ autocomplete: 'off' }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <AccountBalanceIcon />
                                </InputAdornment>
                            ),
                            readOnly,
                        }}
                    />
                </>
            )}
        </Stack>
    );
}
